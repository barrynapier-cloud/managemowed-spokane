const express     = require('express');
const path        = require('path');
const helmet      = require('helmet');
const compression = require('compression');
const rateLimit   = require('express-rate-limit');
const { Pool }    = require('pg');
const { Resend }  = require('resend');
const {
  resolveLocation,
  resolveLocationStrict,
  allLocations
} = require('./lib/locations');

const app  = express();
const PORT = process.env.PORT || 5000;

// Replit deployment is behind a proxy; trust the first hop so req.ip is the
// real client IP (otherwise everyone shares the proxy IP and rate limits break)
app.set('trust proxy', 1);

// Templating
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ───── Middleware ─────

// Security headers. CSP is left off by default because the page uses inline
// styles and 3rd-party CDN scripts (GSAP, fonts) — turning it on requires
// a tuned policy. Frameguard, HSTS, nosniff, referrer-policy still apply.
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  // Allow images from external sources for OG previews etc
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// gzip/brotli compression
app.use(compression());

// JSON body parser with strict size limit
app.use(express.json({ limit: '10kb' }));

// Long-lived cache headers for versioned static assets (cache-bust via ?v=)
const STATIC_CACHE = 'public, max-age=31536000, immutable';
function setStaticCache(res, filePath) {
  if (/\.(css|js|png|jpe?g|webp|svg|ico|woff2?)$/i.test(filePath)) {
    res.setHeader('Cache-Control', STATIC_CACHE);
  }
}

app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  setHeaders: setStaticCache,
  maxAge:     '1y',
  immutable:  true
}));
app.use(express.static(path.join(__dirname), {
  index: false, // never auto-serve index.html — render through EJS
  setHeaders: setStaticCache
}));

// Public lead-form rate limit — uses real client IP (trust proxy is set)
const leadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max:      5,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Too many requests. Please try again in a minute.' }
});

// ───── DB ─────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
  max: 10
});
pool.on('error', (err) => {
  console.error('[pg] unexpected pool error:', err);
});

const ADMIN_KEY = process.env.ADMIN_API_KEY || '';

// ───── Helpers ─────
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}
function truncate(str, max) { return str ? String(str).substring(0, max) : ''; }

// Per-location Resend client
function getResendForLocation(loc) {
  const envName = loc.resend?.apiKeyEnv;
  if (!envName) {
    throw new Error(`Location "${loc.key}" missing resend.apiKeyEnv in locations.json`);
  }
  const apiKey = process.env[envName];
  if (!apiKey) {
    throw new Error(`Missing Resend API key. Set the "${envName}" secret for location "${loc.key}".`);
  }
  return {
    client:    new Resend(apiKey),
    fromEmail: loc.resend.fromEmail,
    toEmails:  loc.resend.notificationEmails || []
  };
}

// ───── Routes ─────

// Health check — used by Replit deploy + uptime monitors
app.get('/healthz', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', locations: Object.keys(allLocations()).length });
  } catch (err) {
    res.status(503).json({ status: 'degraded', error: 'database unreachable' });
  }
});

// robots.txt — allow all, point at sitemap (per-host)
app.get('/robots.txt', (req, res) => {
  const host = (req.headers.host || '').split(':')[0];
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\n\nSitemap: https://${host}/sitemap.xml\n`
  );
});

// sitemap.xml — minimal single-page sitemap per host
app.get('/sitemap.xml', (req, res) => {
  const host = (req.headers.host || '').split(':')[0];
  const url  = `https://${host}/`;
  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${url}</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
</urlset>`
  );
});

// Render the landing page
// ?preview=lajolla overrides location on the dev URL (ignored if host already matches a domain)
function renderLanding(req, res) {
  let loc = resolveLocation(req.headers.host);
  const previewKey = req.query.preview;
  if (previewKey && loc && loc.key !== previewKey) {
    const all = allLocations();
    if (all[previewKey]) loc = { ...all[previewKey], key: previewKey };
  }
  if (!loc) return res.status(500).send('No location configured');
  const host = (req.headers.host || '').split(':')[0];
  res.render('index', { loc, host });
}
app.get('/', renderLanding);

// POST /api/leads — strict host match, rate-limited
app.post('/api/leads', leadLimiter, async (req, res) => {
  try {
    const loc = resolveLocationStrict(req.headers.host);
    if (!loc) {
      console.warn(`Lead submission rejected — unknown host: "${req.headers.host}"`);
      return res.status(421).json({ error: 'This domain is not configured for lead submissions.' });
    }

    const { fullName, email, phone, company, propertyType, service, details } = req.body;
    if (!fullName || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const cleanName         = truncate(fullName, 200);
    const cleanEmail        = truncate(email, 254);
    const cleanPhone        = truncate(phone, 30);
    const cleanCompany      = truncate(company, 200);
    const cleanPropertyType = truncate(propertyType, 50);
    const cleanService      = truncate(service, 50);
    const cleanDetails      = truncate(details, 2000);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const result = await pool.query(
      `INSERT INTO leads (full_name, email, phone, company, property_type, service_interest, details, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, created_at`,
      [cleanName, cleanEmail, cleanPhone || null, cleanCompany || null,
       cleanPropertyType || null, cleanService || null, cleanDetails || null, loc.key]
    );
    const lead = result.rows[0];

    // Fire emails — failures don't fail the request
    try {
      const { client: resend, fromEmail, toEmails } = getResendForLocation(loc);
      const safeName         = escapeHtml(cleanName);
      const safeEmail        = escapeHtml(cleanEmail);
      const safePhone        = escapeHtml(cleanPhone);
      const safeCompany      = escapeHtml(cleanCompany);
      const safePropertyType = escapeHtml(cleanPropertyType);
      const safeService      = escapeHtml(cleanService);
      const safeDetails      = escapeHtml(cleanDetails);
      const safeLocationName = escapeHtml(loc.city);

      // 1) Sales notification
      if (toEmails.length) {
        const salesText = [
          `New Lead Submission — ManageMowed ${loc.city}`,
          ``,
          `Name:            ${cleanName}`,
          `Email:           ${cleanEmail}`,
          `Phone:           ${cleanPhone || 'Not provided'}`,
          `Company:         ${cleanCompany || 'Not provided'}`,
          `Property Type:   ${cleanPropertyType || 'Not selected'}`,
          `Service:         ${cleanService || 'Not selected'}`,
          ``,
          cleanDetails ? `Details:\n${cleanDetails}\n` : '',
          `Lead #${lead.id} — ${new Date(lead.created_at).toLocaleString('en-US')}`
        ].join('\n');

        const salesResp = await resend.emails.send({
          from:     fromEmail,
          to:       toEmails,
          reply_to: cleanEmail,
          subject:  `New Lead (${loc.city}): ${cleanName} — ${cleanCompany || 'No Company'}`,
          text:     salesText,
          html: `
            <div style="font-family:Arial,sans-serif;background:#f6f8f1;padding:32px 16px;">
              <div style="max-width:600px;margin:0 auto;background:#ffffff;color:#0f1a14;padding:32px;border-radius:12px;border:1px solid #e0e6dc;">
                <div style="border-bottom:2px solid #6b9a00;padding-bottom:16px;margin-bottom:24px;">
                  <h1 style="color:#0f1a14;margin:0;font-size:24px;">New Lead Submission</h1>
                  <p style="color:#6b7a70;margin:4px 0 0;">ManageMowed ${safeLocationName}</p>
                </div>
                <table style="width:100%;border-collapse:collapse;">
                  <tr><td style="padding:12px 0;border-bottom:1px solid #e0e6dc;color:#6b7a70;width:140px;">Name</td><td style="padding:12px 0;border-bottom:1px solid #e0e6dc;color:#0f1a14;font-weight:600;">${safeName}</td></tr>
                  <tr><td style="padding:12px 0;border-bottom:1px solid #e0e6dc;color:#6b7a70;">Email</td><td style="padding:12px 0;border-bottom:1px solid #e0e6dc;"><a href="mailto:${safeEmail}" style="color:#6b9a00;text-decoration:none;">${safeEmail}</a></td></tr>
                  <tr><td style="padding:12px 0;border-bottom:1px solid #e0e6dc;color:#6b7a70;">Phone</td><td style="padding:12px 0;border-bottom:1px solid #e0e6dc;color:#0f1a14;">${safePhone || 'Not provided'}</td></tr>
                  <tr><td style="padding:12px 0;border-bottom:1px solid #e0e6dc;color:#6b7a70;">Company</td><td style="padding:12px 0;border-bottom:1px solid #e0e6dc;color:#0f1a14;">${safeCompany || 'Not provided'}</td></tr>
                  <tr><td style="padding:12px 0;border-bottom:1px solid #e0e6dc;color:#6b7a70;">Property Type</td><td style="padding:12px 0;border-bottom:1px solid #e0e6dc;color:#0f1a14;">${safePropertyType || 'Not selected'}</td></tr>
                  <tr><td style="padding:12px 0;border-bottom:1px solid #e0e6dc;color:#6b7a70;">Service Interest</td><td style="padding:12px 0;border-bottom:1px solid #e0e6dc;color:#0f1a14;">${safeService || 'Not selected'}</td></tr>
                </table>
                ${safeDetails ? `
                <div style="margin-top:24px;padding:16px;background:#eef3e3;border-radius:8px;border-left:3px solid #6b9a00;">
                  <p style="color:#3a4a40;margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">Property Details</p>
                  <p style="color:#0f1a14;margin:0;line-height:1.6;">${safeDetails}</p>
                </div>` : ''}
                <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e0e6dc;text-align:center;">
                  <p style="color:#6b7a70;font-size:12px;margin:0;">Lead #${lead.id} | ${loc.city} | ${new Date(lead.created_at).toLocaleString('en-US')}</p>
                </div>
              </div>
            </div>`
        });
        if (salesResp.error) {
          console.error(`[${loc.key}] Sales notification FAILED for lead #${lead.id}:`, salesResp.error);
        } else {
          console.log(`[${loc.key}] Sales notification sent for lead #${lead.id} (id: ${salesResp.data?.id})`);
        }
      }

      // 2) Prospect confirmation
      const firstName     = cleanName.split(' ')[0] || 'there';
      const safeFirstName = escapeHtml(firstName);
      const confirmText = [
        `Hi ${firstName},`,
        ``,
        `Thank you for reaching out to ManageMowed. We've received your request and a member of our team will be in touch within 24 hours to discuss your property and put together a tailored plan.`,
        ``,
        `If you have any questions in the meantime, just reply to this email.`,
        ``,
        `— ManageMowed ${loc.city}`
      ].join('\n');
      const confirmResp = await resend.emails.send({
        from:     fromEmail,
        to:       [cleanEmail],
        reply_to: toEmails[0] || undefined,
        subject:  'Thanks for reaching out to ManageMowed',
        text:     confirmText,
        html: `
          <div style="font-family:Arial,sans-serif;background:#f6f8f1;padding:32px 16px;">
            <div style="max-width:600px;margin:0 auto;background:#ffffff;color:#0f1a14;padding:32px;border-radius:12px;border:1px solid #e0e6dc;">
              <div style="border-bottom:2px solid #6b9a00;padding-bottom:16px;margin-bottom:24px;">
                <h1 style="color:#0f1a14;margin:0;font-size:26px;">Request Received</h1>
                <p style="color:#6b7a70;margin:4px 0 0;">ManageMowed ${safeLocationName}</p>
              </div>
              <p style="color:#0f1a14;font-size:16px;line-height:1.6;margin:0 0 16px;">Hi ${safeFirstName},</p>
              <p style="color:#3a4a40;font-size:16px;line-height:1.6;margin:0 0 16px;">
                Thank you for reaching out to <strong style="color:#6b9a00;">ManageMowed</strong>. We've received your request and a member of our team will be in touch within <strong style="color:#0f1a14;">24 hours</strong> to discuss your property and put together a tailored plan.
              </p>
              <p style="color:#3a4a40;font-size:16px;line-height:1.6;margin:0 0 24px;">
                In the meantime, if you have any questions or want to share more details about your property, just reply to this email.
              </p>
              <div style="margin-top:24px;padding:20px;background:#eef3e3;border-radius:8px;border-left:3px solid #6b9a00;">
                <p style="color:#3a4a40;margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">What's Next</p>
                <p style="color:#0f1a14;margin:0;line-height:1.6;font-size:15px;">A ManageMowed representative will reach out to schedule a complimentary walkthrough of your property.</p>
              </div>
              <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e0e6dc;text-align:center;">
                <p style="color:#3a4a40;font-size:13px;margin:0;font-weight:600;">ManageMowed — Commercial Landscape Management</p>
                <p style="color:#6b7a70;font-size:12px;margin:4px 0 0;">${safeLocationName}</p>
              </div>
            </div>
          </div>`
      });
      if (confirmResp.error) {
        console.error(`[${loc.key}] Confirmation email FAILED for lead #${lead.id}:`, confirmResp.error);
      } else {
        console.log(`[${loc.key}] Confirmation email sent to ${cleanEmail} for lead #${lead.id} (id: ${confirmResp.data?.id})`);
      }
    } catch (emailErr) {
      console.error(`[${loc.key}] Email error:`, emailErr.message);
    }

    res.json({ success: true, message: 'Lead submitted successfully', leadId: lead.id, location: loc.key });
  } catch (err) {
    console.error('Lead submission error:', err);
    res.status(500).json({ error: 'Failed to submit lead' });
  }
});

// GET /api/leads — admin only
app.get('/api/leads', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!ADMIN_KEY || authHeader !== `Bearer ${ADMIN_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { location } = req.query;
    const result = location
      ? await pool.query('SELECT * FROM leads WHERE location = $1 ORDER BY created_at DESC LIMIT 50', [location])
      : await pool.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 50');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Catch-all → render landing page
app.get('*', renderLanding);

const server = app.listen(PORT, '0.0.0.0', () => {
  const locs = Object.keys(allLocations());
  console.log(`ManageMowed multi-tenant server running on port ${PORT}`);
  console.log(`Loaded ${locs.length} location(s): ${locs.join(', ')}`);
});

// Graceful shutdown — drain in-flight requests, close DB pool
function shutdown(signal) {
  console.log(`Received ${signal}, shutting down gracefully...`);
  server.close((err) => {
    if (err) { console.error('Error closing server:', err); process.exit(1); }
    pool.end().then(() => {
      console.log('Server + DB pool closed cleanly. Exiting.');
      process.exit(0);
    }).catch((e) => {
      console.error('Error closing pool:', e);
      process.exit(1);
    });
  });
  // Force-exit if shutdown takes too long
  setTimeout(() => {
    console.warn('Forced shutdown after 10s timeout');
    process.exit(1);
  }, 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
