# ManageMowed — Multi-Tenant Landing Site

One Node.js/Express app that serves multiple ManageMowed location landing pages from a single codebase and single deployment. Each location has its own custom domain, contact info, hero imagery, Resend account, and lead-recipient list.

## Architecture

- **Express + EJS** templating — `views/index.ejs` renders the landing page
- **PostgreSQL** — single `leads` table; each row tagged with a `location` column
- **Resend** — per-location API keys (one secret per location), per-location From address and recipient list
- **Routing by hostname** — incoming `Host` header is matched against `locations[*].domains` in `locations.json`

## Files

- `locations.json` — per-location config (domains, copy, contact, Resend mapping). **This is where you edit content.**
- `lib/locations.js` — loads config, resolves a request's `Host` to a location
- `server.js` — Express server, EJS renderer, `/api/leads` endpoint, per-location email sending
- `views/index.ejs` — single-page template with `<%= loc.* %>` substitutions
- `app.js` — navbar, mobile menu, GSAP, form handler. Reads `data-contact-phone` from `<body>` so the error message shows the right phone number.
- `style.css` — light theme. Shared across all locations.
- `assets/` — shared default imagery; locations can point to their own files via `heroImage`, `aboutImage`, etc.

## Adding a new location (≈ 10 minutes)

1. **In Resend:** verify the new domain (e.g. `managemowedseattle.com`), generate an API key.
2. **In Replit Secrets:** add the API key as `RESEND_API_KEY_SEATTLE` (or whatever name you choose).
3. **Edit `locations.json`:** copy the `spokane` block, change the key to `seattle`, then update:
   - `domains` — array of hostnames that should render this location
   - All city/region/copy fields
   - `contact.*` — name, phone, email, website
   - `resend.apiKeyEnv` — must match the secret name from step 2
   - `resend.fromEmail` — `ManageMowed Seattle <leads@managemowedseattle.com>`
   - `resend.notificationEmails` — who gets new lead notifications
   - Any per-location image overrides (`heroImage`, `weatherImage`, etc.) — drop new files in `assets/` if needed
4. **In Replit Deployments:** add the new custom domain (`managemowedseattle.com` and `www.managemowedseattle.com`) — pointing to the same deployment.
5. Restart the workflow. Visit the new domain.

## Environment / Secrets

- `DATABASE_URL` — Postgres (provided by Replit)
- `RESEND_API_KEY` — Spokane Resend account
- `RESEND_API_KEY_<LOCATION>` — per-location keys for additional locations
- `DEFAULT_LOCATION` *(optional)* — which location to render when the host doesn't match (e.g. on the `.replit.app` preview URL). Defaults to `defaultLocation` in `locations.json`, currently `spokane`.
- `ADMIN_API_KEY` *(optional)* — required to call `GET /api/leads`

## API

- `POST /api/leads` — public lead submission. Tagged with the location resolved from the request `Host`. Rate-limited to 5 / IP / minute.
- `GET /api/leads` — admin-only (Bearer `ADMIN_API_KEY`). Optional `?location=spokane` filter.

## Database

```sql
leads (
  id, full_name, email, phone, company,
  property_type, service_interest, details,
  location, created_at
)
```
Indexed on `location`.

## Workflow

`Start application` runs `node server.js` on port 5000.

## Theming

Light palette tokens live in `:root` of `style.css`. Brand accent `#6b9a00`, surface `#fff`, page bg `#f6f8f1`, border `rgba(15,26,20,0.10)`, highlight box `#eef3e3`. Email templates in `server.js` use the same palette.
