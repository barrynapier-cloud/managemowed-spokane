const express = require('express');
const path    = require('path');
const { Resend } = require('resend');

const TO_RECIPIENTS = [
  'Cort.f@managemowed.com',
  'james.j@managemowed.com',
  'peter.r@managemowed.com'
];

async function getResendClient() {
  const hostname    = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const replitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!replitToken) throw new Error('Replit token not available');

  const json = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    { headers: { Accept: 'application/json', 'X-Replit-Token': replitToken } }
  ).then(r => r.json());

  const settings = json.items?.[0]?.settings;
  if (!settings?.api_key) throw new Error('Resend not connected — check Replit integrations');

  return { client: new Resend(settings.api_key), fromEmail: settings.from_email };
}

function buildHtml(fields) {
  const rows = Object.entries(fields)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:600;white-space:nowrap;color:#555">${k}</td><td style="padding:6px 12px;color:#222">${v || '—'}</td></tr>`)
    .join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#f4f4f4">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background:#1a1a1a;padding:24px 32px">
          <h1 style="margin:0;color:#c8ee3a;font-size:1.4rem;letter-spacing:-0.02em">ManageMowed Spokane</h1>
          <p style="margin:4px 0 0;color:#aaa;font-size:0.875rem">New Quote Request</p>
        </td></tr>
        <tr><td style="padding:32px">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
            ${rows}
          </table>
        </td></tr>
        <tr><td style="background:#f9f9f9;padding:16px 32px;border-top:1px solid #eee">
          <p style="margin:0;font-size:0.8rem;color:#999">Submitted via www.managemowedspokane.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/quote', async (req, res) => {
  try {
    const { fullName, email, phone, company, propertyType, service, details } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const fields = {
      'Name':           fullName,
      'Email':          email,
      'Phone':          phone,
      'Company / Property': company,
      'Property Type':  propertyType,
      'Service Interest': service,
      'Details':        details
    };

    const subject = `New Quote Request — ${company || fullName}`;
    const { client, fromEmail } = await getResendClient();

    const result = await client.emails.send({
      from:     fromEmail || 'quotes@managemowedspokane.com',
      to:       TO_RECIPIENTS,
      reply_to: email,
      subject,
      html:     buildHtml(fields)
    });

    console.log('Email sent:', result);
    res.json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`ManageMowed Spokane server running on port ${PORT}`);
});
