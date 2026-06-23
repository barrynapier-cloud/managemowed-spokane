# AGENTS.md — managemowed-spokane (LIGHT theme)

Guidance for AI coding agents (Codex, Claude) working in this repo. A VA drives most
tasks here; keep changes small, safe, and verified. For deep detail see
`VA-NEW-LOCATION-GUIDE.md`.

## What this repo is
Multi-tenant Node/Express site. ONE deployment serves many city sites, chosen by the
incoming domain. All per-city content lives in **`locations.json`**. The EJS template
(`views/index.ejs`) is fully data-driven — never hardcode a city name in it.

- Light theme. Template block to COPY for new cities: **`spokane`**.
- Live keys: spokane (default), lajolla, spartanburg, + the new cities.

## The file you edit: `locations.json`
Shape: `{ defaultLocation, globalBccEmails, locations: { <key>: {...} } }`. Each city block
has the same ~45 fields as `spokane`. Match that block's keys exactly — no missing, no extra.

Escaping rules (important):
- Most fields are HTML-escaped on render — write plain `&`, plain apostrophes.
- **`seasonalServiceItems`** renders UNescaped — write `&amp;` not `&` in that array only.
- Keep values ASCII; no em dashes inside JSON strings.

Per-city conventions:
- `domains`: `["managemowed<key>.com", "www.managemowed<key>.com"]`
- `contact`: real AM name/phone/email; `phoneRaw` = digits only.
- `resend.fromEmail`: `"ManageMowed <City> <leads@managemowed<key>.com>"`;
  `resend.apiKeyEnv`: `"RESEND_API_KEY"`; `notificationEmails`: [AM email, james.j@managemowed.com, barrynapier@gmail.com].
- Images live in `assets/`, named `hero-<key>.jpg`, `action-<key>.jpg`, `about-<key>.jpg`,
  `areas-bg-<key>.jpg`, `cta-bg-<key>.jpg`. `attached_assets/` is NOT served — don't point at it.

## Verify before committing
```
npm install
PORT=5101 node server.js          # then, in another shell:
curl -s "http://localhost:5101/?preview=<key>" | grep -o "<title>[^<]*"
```
Confirm the title/copy is the right city, and grep for leftover template words:
`curl -s "http://localhost:5101/?preview=<key>" | grep -ci "spokane\|spartanburg\|la jolla"`
(should only match where genuinely correct). Restart the server after editing
`locations.json` — it's cached per process.

## Commit / hand-off
- One city per commit. Push to `master`. After push, the human runs `git pull` + Redeploy
  in Replit (Replit owns the live domains + secrets).
- Never commit API keys/passwords. Secrets live in Replit, not in git.
- Touch only `locations.json` and `assets/` unless explicitly asked to change site code.
- Generating real photos is NOT part of a config edit — if a new city needs images, say so.
