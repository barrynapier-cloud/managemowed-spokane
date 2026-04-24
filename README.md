# ManageMowed — Spokane Landing Page

Light-themed, high-contrast landing page for ManageMowed's commercial landscaping services in the greater Spokane area.

## Stack

- **HTML/CSS/JS** — Static site, no build step
- **GSAP + ScrollTrigger** — Scroll-driven animations
- **Fonts** — Clash Display (display) + General Sans (body) via Fontshare CDN

## Running Locally

The configured workflow serves the site on port 5000:

```bash
python3 -m http.server 5000
```

Then open the preview.

## Structure

```
├── index.html       # Full single-page site
├── style.css        # All styles (CSS custom properties, light theme, responsive)
├── app.js           # GSAP animations, scroll triggers, interactivity
└── assets/          # Images (hero, about, action shots, logos, backgrounds)
```

## Brand

- **Primary accent:** `#6b9a00` (deep lime — accessible on light surfaces, paired with the brand chartreuse for fills)
- **Background:** `#f6f8f1` (warm off-white)
- **Phone:** (866) 531-4448
- **Email:** info@managemowed.com
- **Market:** Spokane, Spokane Valley, Coeur d'Alene, Liberty Lake, Cheney, Pullman, and the surrounding Spokane region
