# ManageMowed — Greater Seattle Landing Page

Dark-themed, high-impact landing page for ManageMowed's commercial landscaping services in the Greater Seattle area.

## Stack

- **HTML/CSS/JS** — Static site, no build step
- **GSAP + ScrollTrigger** — Scroll-driven animations
- **Fonts** — Clash Display (display) + General Sans (body) via Fontshare CDN

## Running Locally

Any static file server works:

```bash
# Using npx serve
npx serve . -l 3000

# Using Python
python -m http.server 3000
```

Then open [http://localhost:3000](http://localhost:3000).

## Structure

```
├── index.html       # Full single-page site
├── style.css        # All styles (CSS custom properties, responsive)
├── app.js           # GSAP animations, scroll triggers, interactivity
└── assets/          # Images (hero, about, action shots, logos, backgrounds)
```

## Brand

- **Primary accent:** `#ccff00` (lime/chartreuse)
- **Background:** `#0e1117` (dark)
- **Phone:** (866) 531-4448
- **Email:** info@managemowed.com
