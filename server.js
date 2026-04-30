const express = require('express');
const path    = require('path');
const { Pool }  = require('pg');
const { Resend } = require('resend');

const app          = express();
const PORT         = process.env.PORT || 5000;
const LOCATION_NAME = process.env.LOCATION_NAME || 'Spokane Area';

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

// Resend client — uses Replit connector, with env var fallback
async function getResendClient() {
  // 1. Try RESEND_API_KEY env var first (works in all environments)
  if (process.env.RESEND_API_KEY) {
    return {
      client: new Resend(process.env.RESEND_API_KEY),
      fromEmail: process.env.RESEND_FROM_EMAIL || 'ManageMowed Spokane <leads@managemowedspokane.com>'
    };
  }

  // 2. Fall back to Replit connector
  const hostname    = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const replitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!hostname || !replitToken) throw new Error('No Resend credentials found. Set RESEND_API_KEY or connect via Replit integrations.');

  const json = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    { headers: { Accept: 'application/json', 'X-Replit-Token': replitToken } }
  ).then(r => r.json());

  const settings = json.items?.[0]?.settings;
  if (!settings?.api_key) throw new Error('Resend not connected — check Replit integrations or set RESEND_API_KEY');

  return {
    client: new Resend(settings.api_key),
    fromEmail: process.env.RESEND_FROM_EMAIL || settings.from_email || 'ManageMowed Spokane <leads@managemowedspokane.com>'
  };
}

const NOTIFICATION_EMAILS = (process.env.LEAD_NOTIFICATION_EMAIL || '')
  .split(',').map(e => e.trim()).filter(Boolean);

const ADMIN_KEY = process.env.ADMIN_API_KEY || '';

// Simple in-memory rate limit: 5 submissions per IP per minute
const rateLimit = {};
function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 5;
  if (!rateLimit[ip]) rateLimit[ip] = [];
  rateLimit[ip] = rateLimit[ip].filter(t => now - t < windowMs);
  if (rateLimit[ip].length >= maxRequests) return false;
  rateLimit[ip].push(now);
  return true;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

function truncate(str, max) { return str ? String(str).substring(0, max) : ''; }

// POST /api/leads — main lead capture endpoint
app.post('/api/leads', async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ error: 'Too many requests. Please try again in a minute.' });
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

    // Save lead to DB
    const result = await pool.query(
      `INSERT INTO leads (full_name, email, phone, company, property_type, service_interest, details)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [cleanName, cleanEmail, cleanPhone || null, cleanCompany || null,
       cleanPropertyType || null, cleanService || null, cleanDetails || null]
    );
    const lead = result.rows[0];

    // Fire emails — don't fail the request if this errors
    try {
      const { client: resend, fromEmail } = await getResendClient();
      const safeName         = escapeHtml(cleanName);
      const safeEmail        = escapeHtml(cleanEmail);
      const safePhone        = escapeHtml(cleanPhone);
      const safeCompany      = escapeHtml(cleanCompany);
      const safePropertyType = escapeHtml(cleanPropertyType);
      const safeService      = escapeHtml(cleanService);
      const safeDetails      = escapeHtml(cleanDetails);
      const safeLocation     = escapeHtml(LOCATION_NAME);

      // 1) SALES NOTIFICATION to the team
      if (NOTIFICATION_EMAILS.length) {
        const salesResp = await resend.emails.send({
          from:     fromEmail,
          to:       NOTIFICATION_EMAILS,
          reply_to: cleanEmail,
          subject:  `New Lead: ${safeName} — ${safeCompany || 'No Company'}`,
          html: `
            <div style="font-family:Arial,sans-serif;background:#f6f8f1;padding:32px 16px;">
              <div style="max-width:600px;margin:0 auto;background:#ffffff;color:#0f1a14;padding:32px;border-radius:12px;border:1px solid #e0e6dc;">
                <div style="border-bottom:2px solid #6b9a00;padding-bottom:16px;margin-bottom:24px;">
                  <h1 style="color:#0f1a14;margin:0;font-size:24px;">New Lead Submission</h1>
                  <p style="color:#6b7a70;margin:4px 0 0;">ManageMowed ${safeLocation}</p>
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
                  <p style="color:#6b7a70;font-size:12px;margin:0;">Lead #${lead.id} | ${new Date(lead.created_at).toLocaleString('en-US')}</p>
                </div>
              </div>
            </div>`
        });
        if (salesResp.error) {
          console.error(`Sales notification FAILED for lead #${lead.id}:`, salesResp.error);
        } else {
          console.log(`Sales notification sent for lead #${lead.id} (id: ${salesResp.data?.id})`);
        }
      }

      // 2) PROSPECT CONFIRMATION
      const firstName     = cleanName.split(' ')[0] || 'there';
      const safeFirstName = escapeHtml(firstName);
      const confirmResp = await resend.emails.send({
        from:     fromEmail,
        to:       [cleanEmail],
        reply_to: NOTIFICATION_EMAILS[0] || undefined,
        subject:  'Thanks for reaching out to ManageMowed',
        html: `
          <div style="font-family:Arial,sans-serif;background:#f6f8f1;padding:32px 16px;">
            <div style="max-width:600px;margin:0 auto;background:#ffffff;color:#0f1a14;padding:32px;border-radius:12px;border:1px solid #e0e6dc;">
              <div style="border-bottom:2px solid #6b9a00;padding-bottom:16px;margin-bottom:24px;">
                <h1 style="color:#0f1a14;margin:0;font-size:26px;">Request Received</h1>
                <p style="color:#6b7a70;margin:4px 0 0;">ManageMowed ${safeLocation}</p>
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
                <p style="color:#6b7a70;font-size:12px;margin:4px 0 0;">${safeLocation}</p>
              </div>
            </div>
          </div>`
      });
      if (confirmResp.error) {
        console.error(`Confirmation email FAILED for lead #${lead.id}:`, confirmResp.error);
      } else {
        console.log(`Confirmation email sent to ${cleanEmail} for lead #${lead.id} (id: ${confirmResp.data?.id})`);
      }
    } catch (emailErr) {
      // Lead is already saved — don't fail the response over an email error
      console.error('Email error:', emailErr.message);
    }

    res.json({ success: true, message: 'Lead submitted successfully', leadId: lead.id });
  } catch (err) {
    console.error('Lead submission error:', err);
    res.status(500).json({ error: 'Failed to submit lead' });
  }
});

// GET /api/leads — optional admin endpoint (requires ADMIN_API_KEY)
app.get('/api/leads', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!ADMIN_KEY || authHeader !== `Bearer ${ADMIN_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 50');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Serve index.html for all other routes (Express 4)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ManageMowed Spokane server running on port ${PORT}`);
});
