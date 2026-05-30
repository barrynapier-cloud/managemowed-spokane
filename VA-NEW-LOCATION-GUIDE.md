# ManageMowed — VA Training Guide: Adding a New Location

**Purpose:** This document teaches you, step by step, how to launch a new ManageMowed city landing page. Each new city gets its own domain, its own contact details, its own email system, and its own localized copy — all running from the same shared codebase. You do not need to write any code. You only need to edit one file inside Replit and complete a few tasks in outside tools.

**Time estimate:** 45–90 minutes for your first location. 30–45 minutes once you've done it before.

**What you'll touch:**
- Resend (email platform) — create API key, verify domain
- Domain registrar (GoDaddy, Namecheap, etc.) — configure DNS
- Replit — add secret, edit one config file, add domain to deployment
- Google Images / Unsplash / provided assets — source 5 images

---

## Before You Start: Gather This Information

Get all of this from the client or account manager before opening any tool. Do not begin until you have every item.

| Item | Example |
|---|---|
| City name | Seattle |
| State abbreviation | WA |
| Domain for this location | managemowedseattle.com |
| Account Manager name | Sarah Kim |
| Account Manager title | Account Manager |
| Account Manager phone | (206) 555-0187 |
| Account Manager phone (digits only, no formatting) | 2065550187 |
| Account Manager email | Sarah.k@managemowed.com |
| Who should receive lead notification emails | Sarah.k@managemowed.com |
| Primary service areas (6 groups, ~5 cities each) | See Section 2 |
| Local weather angle | Rain / wind / heat / drought / snow |

---

## Phase 1: Resend Setup (Email Platform)

Resend is the tool that sends lead notification emails and auto-reply confirmation emails to prospects.

### Step 1.1 — Log in to Resend

1. Go to **https://resend.com** and log in with the ManageMowed account credentials.

### Step 1.2 — Add and verify the new domain

1. In the left sidebar, click **Domains**.
2. Click **Add Domain**.
3. Enter the new location's domain (e.g. `managemowedseattle.com`). Click **Add**.
4. Resend will show you a list of DNS records to add. **Copy these — you will need them in Phase 2.**
   - Typically: 1 MX record, 2 TXT records (SPF + DKIM), sometimes a CNAME.
5. Leave this tab open. The domain will show as **Pending** until you add the DNS records.

### Step 1.3 — Create an API key for this location

1. In the left sidebar, click **API Keys**.
2. Click **Add API Key**.
3. Name it exactly: `ManageMowed [City]` (e.g. `ManageMowed Seattle`).
4. Set permission to **Full Access**.
5. Click **Add**. The key appears **once only** — copy it immediately and paste it into a secure note (e.g. a private 1Password entry or encrypted note). You will add it to Replit in Phase 3.

> ⚠️ If you close the key before copying it, you must delete it and create a new one.

---

## Phase 2: DNS Configuration

You need to point the domain to both the ManageMowed server (so the website loads) and Resend (so email sending works).

### Step 2.1 — Log in to the domain registrar

Go to wherever the domain is registered (GoDaddy, Namecheap, Cloudflare, etc.) and navigate to the **DNS settings** for the new domain.

### Step 2.2 — Add the website DNS records

Add these two records so the domain loads the ManageMowed site:

| Type | Name / Host | Value | TTL |
|---|---|---|---|
| A | `@` | `34.111.179.208` | 3600 (or Auto) |
| CNAME | `www` | `managemowedseattle.com` | 3600 (or Auto) |

> Replace `managemowedseattle.com` with the actual domain.

### Step 2.3 — Add the Resend email DNS records

Add the DNS records Resend gave you in Step 1.2. They typically look like this (exact values come from Resend — use those, not these placeholders):

| Type | Name / Host | Value |
|---|---|---|
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` |
| TXT | `resend._domainkey` | `p=MIGf...` (long key from Resend) |
| TXT | `@` | `v=spf1 include:amazonses.com ~all` |

### Step 2.4 — Wait for DNS propagation

DNS changes can take anywhere from 5 minutes to 48 hours. In practice, most registrars propagate within 15–30 minutes.

- Check propagation at **https://dnschecker.org** — search for your domain's A record.
- Once the A record shows green globally, move to Phase 3.
- In Resend, the domain status will change from **Pending** to **Verified** once the email records are live. You can keep checking — verification is required before emails will send.

---

## Phase 3: Add the API Key to Replit

Replit stores secrets (API keys, passwords) separately from the code so they're never visible in files.

### Step 3.1 — Open the project in Replit

1. Go to **https://replit.com** and log in.
2. Open the ManageMowed project.

### Step 3.2 — Add the secret

1. In the left sidebar, click the **padlock icon** (Secrets).
2. Click **New Secret**.
3. For the **Key**, use this exact format: `RESEND_API_KEY_` followed by the city name in ALL CAPS with no spaces.
   - Seattle → `RESEND_API_KEY_SEATTLE`
   - Fort Worth → `RESEND_API_KEY_FORTWORTH`
   - St. Louis → `RESEND_API_KEY_STLOUIS`
4. For the **Value**, paste the Resend API key you copied in Step 1.3.
5. Click **Add Secret**.

> The key name you choose here must match exactly what you enter in the config file in Phase 4.

---

## Phase 4: Source the 5 Images

Each location needs 5 images. These should feel local — ideally featuring the actual city, region, or landscape type.

| Image slot | What it shows | Filename to use | Size guidance |
|---|---|---|---|
| **Hero** | Aerial or wide shot of a commercial property or the city | `hero-[city].jpg` | 1600×900px min |
| **Weather / Action** | Crew working outdoors, or a landscape challenge (rain, wind, drought) | `action-[city].jpg` | 1200×800px min |
| **About** | Crew at work, close-up of maintained landscape, or team photo | `about-[city].jpg` | 1200×900px min |
| **CTA Background** | Clean, well-maintained commercial property — inspiring feel | `cta-bg-[city].jpg` | 1600×600px min |
| **Areas Background** | Aerial of the city, skyline, or landmark the region recognizes | `areas-bg-[city].jpg` | 1600×600px min |

**Where to find images:**
- **Provided by client** — always preferred. Ask first.
- **Unsplash** (https://unsplash.com) — free, high quality, no attribution required for commercial use. Search the city name + "commercial building" or "aerial".
- **Google Images** → Tools → Usage Rights → "Creative Commons licenses".
- **Pexels** (https://pexels.com) — also free for commercial use.

**How to upload images to Replit:**
1. In the Replit file tree (left sidebar), click on the `assets/` folder.
2. Click the three-dot menu next to the folder → **Upload file**.
3. Upload all 5 images. Confirm each filename matches the table above exactly.

> Filenames are case-sensitive. Use lowercase letters and hyphens only — no spaces.

---

## Phase 5: Edit the Config File

This is the main editing task. One file — `locations.json` — controls everything about each location. You do not touch any other file.

### Step 5.1 — Open locations.json

1. In the Replit file tree, click **locations.json** to open it.
2. Click the **pencil / edit** icon if needed to enter edit mode.

### Step 5.2 — Copy the template block

Below is a complete template for a new location. Copy everything from `"seattle": {` through the matching closing `}` and paste it inside the `"locations": { }` block in the file, after the last existing location entry. Add a comma after the previous location's closing `}` before pasting.

```json
,
"seattle": {
  "domains": ["managemowedseattle.com", "www.managemowedseattle.com"],
  "city": "Seattle",
  "cityPossessive": "Seattle's",
  "state": "WA",
  "regionLong": "greater Seattle area",
  "regionShort": "Seattle area",
  "areaAdjective": "Seattle-area",
  "pageTitle": "ManageMowed Seattle | Commercial Landscape Management for the Seattle Area",
  "metaDescription": "Professional commercial landscape management for Seattle, Bellevue, Redmond, Kirkland, and the greater Seattle area. Free site assessments for businesses and property managers.",
  "ogTitle": "ManageMowed Seattle | Commercial Landscape Management",
  "ogDescription": "Premium grounds management for businesses across the greater Seattle area. Get your free site assessment today.",
  "heroImage": "/assets/hero-seattle.jpg",
  "heroImageAlt": "Aerial view of a beautifully maintained commercial property in the Seattle area",
  "heroHeadlinePrefix": "Seattle's Premier",
  "heroSubtitle": "Full-service grounds management for businesses, property management companies, apartments, and commercial properties across the greater Seattle area. Responsive, reliable, and easy to work with.",
  "weatherImage": "/assets/action-seattle.jpg",
  "weatherImageAlt": "ManageMowed crew maintaining a Seattle commercial property in wet weather",
  "weatherHeadline": "Seattle Rain Doesn't Take Days Off.",
  "weatherSubhead": "Neither Do We.",
  "weatherBody": "Pacific Northwest rain and overcast skies are facts of life — not excuses. ManageMowed crews show up on schedule year-round. Proactive communication, a local Account Manager, and crews built for wet-weather work mean your property stays maintained no matter what Seattle throws at it.",
  "aboutImage": "/assets/about-seattle.jpg",
  "aboutImageAlt": "ManageMowed crew maintaining a commercial property in the Seattle area",
  "aboutImageObjectPosition": "center center",
  "aboutDescription": "From spring green-up and consistent summer mowing to fall leaf programs and winter prep, ManageMowed handles the full year across the greater Seattle area. One Account Manager. One team. Consistent results — so your property always makes the right first impression.",
  "aboutBootsLine": "24 locations strong with boots on the ground in Seattle",
  "seasonalServicesBody": "Year-round readiness for whatever Seattle weather brings — from fall leaf removal and winter prep to spring renovation and summer turf programs.",
  "deservesCtaImage": "/assets/cta-bg-seattle.jpg",
  "deservesCtaImageAlt": "Pristine commercial landscape maintained by ManageMowed in the Seattle area",
  "deservesCtaBody": "Join the Seattle-area commercial property managers who've switched to ManageMowed's structured, accountable landscape management.",
  "areasBgImage": "/assets/areas-bg-seattle.jpg",
  "areasBgImageAlt": "Aerial view of the Seattle skyline and greater Puget Sound at dusk",
  "areasHeadline": "Greater Seattle Service Area",
  "areasSubtitle": "From Downtown Seattle to the Eastside, South King County to the Snohomish border — ManageMowed has the greater Seattle region covered.",
  "areaGroups": [
    { "icon": "location_city", "name": "Seattle Core",        "items": ["Downtown Seattle", "Capitol Hill", "South Lake Union", "Belltown", "First Hill"] },
    { "icon": "business",      "name": "Eastside",            "items": ["Bellevue", "Redmond", "Kirkland", "Issaquah", "Sammamish"] },
    { "icon": "forest",        "name": "North Seattle",       "items": ["Northgate", "Shoreline", "Kenmore", "Bothell", "Mountlake Terrace"] },
    { "icon": "west",          "name": "South King County",   "items": ["Renton", "Kent", "Auburn", "Federal Way", "Des Moines"] },
    { "icon": "storefront",    "name": "Airport Corridor",    "items": ["SeaTac", "Tukwila", "Burien", "White Center", "Normandy Park"] },
    { "icon": "north",         "name": "Snohomish County",   "items": ["Lynnwood", "Everett", "Mukilteo", "Edmonds", "Marysville"] }
  ],
  "faqWeatherQuestion": "How do you handle Seattle's rainy season?",
  "faqWeatherAnswer": "We're built for it. Pacific Northwest rain is not an obstacle — it's just the operating environment. Our crews work through wet conditions, and your Account Manager keeps you informed of any schedule adjustments before they happen. No surprises.",
  "footerDescription": "Professional commercial landscape management for the greater Seattle area. Member of the National Association of Landscape Professionals.",
  "footerCity": "Seattle, WA",
  "trustItemAccountManagers": "Local Seattle Account Managers",
  "phonePlaceholder": "(206) 555-0123",
  "seasonalServiceItems": [
    "Fall leaf removal programs",
    "Winter prep &amp; storm response",
    "Spring renovation &amp; aeration",
    "Summer turf &amp; irrigation programs"
  ],
  "ogImage": "/assets/hero-seattle.jpg",
  "areaServed": ["Seattle", "Bellevue", "Redmond", "Kirkland", "Renton", "Kent", "Bothell", "Everett", "Shoreline", "Federal Way"],
  "contact": {
    "name": "Sarah Kim",
    "title": "Account Manager",
    "phone": "(206) 555-0187",
    "phoneRaw": "2065550187",
    "email": "Sarah.k@managemowed.com",
    "website": "www.managemowedseattle.com",
    "websiteUrl": "https://www.managemowedseattle.com"
  },
  "resend": {
    "apiKeyEnv": "RESEND_API_KEY_SEATTLE",
    "fromEmail": "ManageMowed Seattle <leads@managemowedseattle.com>",
    "notificationEmails": [
      "Sarah.k@managemowed.com"
    ]
  }
}
```

### Step 5.3 — Fill in every field for your city

Go through the pasted block and replace every Seattle-specific value with the correct value for your city. Use this checklist:

**Location key (the word before the `{`):**
- [ ] Change `"seattle"` to your city in lowercase, no spaces (e.g. `"fortworth"`, `"stlouis"`)

**`domains`:**
- [ ] Both entries updated to the new domain

**City / region fields:**
- [ ] `city` — display name (e.g. `"Fort Worth"`)
- [ ] `cityPossessive` — possessive (e.g. `"Fort Worth's"`)
- [ ] `state` — two-letter state code
- [ ] `regionLong`, `regionShort`, `areaAdjective` — updated to match the city

**SEO fields:**
- [ ] `pageTitle`, `metaDescription`, `ogTitle`, `ogDescription` — replace all references to Seattle

**Images (all 5):**
- [ ] `heroImage`, `heroImageAlt`
- [ ] `weatherImage`, `weatherImageAlt`
- [ ] `aboutImage`, `aboutImageAlt`, `aboutImageObjectPosition` (use `"center center"` unless the subject is off to one side)
- [ ] `deservesCtaImage`, `deservesCtaImageAlt`
- [ ] `areasBgImage`, `areasBgImageAlt`
- [ ] `ogImage` (same path as `heroImage`)

**Hero / weather copy:**
- [ ] `heroHeadlinePrefix` — e.g. `"Fort Worth's Premier"`
- [ ] `heroSubtitle`
- [ ] `weatherHeadline`, `weatherSubhead`, `weatherBody` — localize to the weather story for this region

**About section:**
- [ ] `aboutDescription` — 2–3 sentences mentioning the city and its landscape characteristics
- [ ] `aboutBootsLine` — e.g. `"24 locations strong with boots on the ground in Fort Worth"`

**Service areas (`areaGroups`):**
- [ ] 6 groups, each with a `name` and 5 `items` (real neighborhood/suburb names)
- [ ] `icon` values must be valid Google Material icon names — use the ones in the examples (`location_city`, `business`, `forest`, `west`, `south`, `north`, `storefront`, `waves`, `science`)
- [ ] `areasHeadline`, `areasSubtitle`

**Seasonal services:**
- [ ] `seasonalServicesBody` — one sentence describing the local seasonal story
- [ ] `seasonalServiceItems` — 4 bullet points. Use `&amp;` instead of `&` in the text

**CTA and footer:**
- [ ] `deservesCtaBody`
- [ ] `footerDescription`, `footerCity`
- [ ] `trustItemAccountManagers` — e.g. `"Local Fort Worth Account Managers"`

**FAQ:**
- [ ] `faqWeatherQuestion`, `faqWeatherAnswer` — localize to the climate challenge for this city

**Contact block:**
- [ ] `name`, `title`, `phone`, `phoneRaw` (digits only), `email`, `website`, `websiteUrl`

**`areaServed`:**
- [ ] Array of 8–12 city/neighborhood names for SEO structured data

**`phonePlaceholder`:**
- [ ] Local area code format (e.g. `"(206) 555-0123"`)

**Resend block:**
- [ ] `apiKeyEnv` — must match the secret name from Phase 3 exactly (e.g. `"RESEND_API_KEY_SEATTLE"`)
- [ ] `fromEmail` — format: `"ManageMowed [City] <leads@managemowed[city].com>"`
- [ ] `notificationEmails` — array of who gets lead alerts for this location

### Step 5.4 — Save and verify the file is valid JSON

After editing, click **Save** (or Ctrl+S). Then in the Replit Shell (bottom panel), run:

```
node -e "JSON.parse(require('fs').readFileSync('locations.json','utf8')); console.log('JSON is valid')"
```

If it prints `JSON is valid`, you're good. If it shows an error, there's a typo in the JSON — most likely a missing comma, unclosed quote, or unclosed bracket. Fix it and re-run.

---

## Phase 6: Preview the New Location

Before going live, preview the page inside Replit to catch any copy or image mistakes.

### Step 6.1 — Restart the server

1. In Replit, click the **Stop** button (square icon) at the top, then **Run** (play icon). Or click **Restart** if visible.
2. Wait for the console to show: `ManageMowed multi-tenant server running on port 5000`

### Step 6.2 — Preview in browser

In the Replit preview panel (or open the preview URL in a new tab), add `?preview=[locationkey]` to the URL:

```
https://[your-replit-preview-url]/?preview=seattle
```

Replace `seattle` with your location key.

### Step 6.3 — Check every section

Scroll through the entire page and verify:

- [ ] Page title (browser tab) shows the correct city
- [ ] Hero headline and subtitle show the correct city
- [ ] Hero image loads and looks good (not stretched or cut off awkwardly)
- [ ] Weather section: correct headline, body, and image
- [ ] About section: correct city copy and image
- [ ] Service areas: all 6 groups with correct neighborhood names
- [ ] Seasonal services card: correct 4 bullet points
- [ ] CTA section: correct city name and image
- [ ] Contact block: correct name, phone number, and email
- [ ] Footer: correct city and state
- [ ] Phone number in the top-right nav shows the correct number

If anything looks wrong, go back to `locations.json`, fix the field, save, restart the server, and preview again.

---

## Phase 7: Add the Domain to Replit Deployments

This connects the live domain to the production app so real visitors can reach the site.

### Step 7.1 — Open Deployments settings

1. In Replit, click the **Deploy** button (rocket icon in the top-right).
2. Click **Custom Domains** or **Manage Deployment** → **Domains**.

### Step 7.2 — Add both domain variants

Add both of these:
- `managemowedseattle.com` (replace with actual domain)
- `www.managemowedseattle.com`

Click **Add Domain** for each. Replit will verify that the DNS is pointing correctly — if DNS hasn't propagated yet, wait and try again.

### Step 7.3 — Redeploy

After adding the domains, click **Redeploy** (or **Publish** if it's the first deploy). This pushes the updated `locations.json` to production.

---

## Phase 8: Test the Live Site

Once the domain is verified and the deployment is live:

### Step 8.1 — Visit the live URL

Open `https://www.managemowedseattle.com` in a browser. Verify the page loads with the correct city content (not the default Spokane page).

### Step 8.2 — Submit a test lead

1. Fill in the contact form with test data:
   - Name: `Test Lead`
   - Email: your own email address
   - Phone: any 10-digit number
   - Company: `Test Co`
   - Property Type: any selection
   - Service: any selection
2. Click **Get Your Free Assessment**.
3. You should see a green success message on screen.

### Step 8.3 — Confirm both emails arrived

Check two inboxes:
- **Your email** (the one you submitted) should have a confirmation email from the new location's address (e.g. `leads@managemowedseattle.com`)
- **The Account Manager's email** should have a lead notification email showing your test submission

If either email is missing, check the Resend domain verification status (Phase 1 / Step 1.2) and confirm the secret name matches the `apiKeyEnv` in `locations.json`.

### Step 8.4 — Delete the test record

Send a note to the developer or project owner to delete the test lead from the database, or if you have access to the Replit shell, run:

```
psql $DATABASE_URL -c "DELETE FROM leads WHERE full_name = 'Test Lead' AND location = 'seattle';"
```

(Replace `seattle` with the actual location key.)

---

## Summary Checklist

Use this as your final sign-off checklist before marking the location complete:

### Outside Replit
- [ ] Resend domain added and **verified** (status = Verified, not Pending)
- [ ] Resend API key created and copied to a secure note
- [ ] DNS: A record pointing to `34.111.179.208`
- [ ] DNS: CNAME `www` pointing to root domain
- [ ] DNS: Resend email records added (MX, TXT records from Resend)
- [ ] DNS propagated (confirmed via dnschecker.org)

### Inside Replit
- [ ] Secret added (e.g. `RESEND_API_KEY_SEATTLE`)
- [ ] 5 images uploaded to `assets/`
- [ ] `locations.json` block fully filled in, all Seattle placeholders replaced
- [ ] JSON validated with no errors
- [ ] Server restarted and preview checked (`?preview=[key]`)
- [ ] Domain added to Replit Deployments (both `example.com` and `www.example.com`)
- [ ] Redeployed

### Live verification
- [ ] Site loads at the correct domain with correct city content
- [ ] Test lead submitted successfully
- [ ] Notification email received by Account Manager
- [ ] Confirmation email received at test address
- [ ] Test lead deleted from database

---

## Reference: Weather Angles by Climate Type

Use these as a starting point for the `weatherHeadline`, `weatherSubhead`, and `weatherBody` fields:

| Climate | Headline idea | Body angle |
|---|---|---|
| Pacific Northwest (rain) | "Seattle Rain Doesn't Take Days Off. Neither Do We." | Wet-weather crews, consistent schedule |
| Desert SW (heat/drought) | "Phoenix Heat Never Stops. Neither Do Our Crews." | Heat-tolerant programs, irrigation efficiency |
| Midwest (snow + heat) | "Chicago Weather Doesn't Care About Your Schedule. We Do." | 24/7 winter, hot summer recovery |
| Southeast (humidity + storms) | "Houston Humidity Is a Landscaping Problem. We've Solved It." | Fungal management, storm cleanup |
| Sun Belt (mild + drought) | "San Diego Landscapes Never Stop Growing. Your Landscaper Shouldn't Either." | Year-round growing, drought compliance |
| Mountain West (snow + UV) | "Denver Snow Happens Fast. We Happen Faster." | Snow response speed, high-altitude turf |

---

## Reference: Valid Icon Names for areaGroups

Use only these values in the `"icon"` field. They are Google Material icons:

`location_city` `business` `forest` `west` `south` `north` `storefront` `waves` `science` `park` `landscape` `terrain` `apartment` `factory` `local_shipping` `hub`

---

## Common Mistakes to Avoid

| Mistake | How to avoid |
|---|---|
| Secret name doesn't match `apiKeyEnv` | Copy the exact text from the Secrets panel into `apiKeyEnv` |
| Resend domain not verified | Don't test email until Resend shows "Verified" — check resend.com/domains |
| `&` instead of `&amp;` in seasonal items | Always write `&amp;` in `seasonalServiceItems` |
| Spaces or uppercase in image filenames | Use lowercase and hyphens only: `hero-seattle.jpg` not `Hero Seattle.jpg` |
| JSON syntax error after editing | Run the `node -e "JSON.parse..."` command to check before restarting |
| Forgot to redeploy after adding domain | After adding domain in Replit Deployments, always click Redeploy |
| Location key has uppercase or spaces | Use only lowercase letters, no spaces: `"fortworth"` not `"Fort Worth"` |
| Domain added but not both variants | Add both `example.com` AND `www.example.com` to Replit Deployments |
