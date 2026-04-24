# ManageMowed Spokane

Static single-page marketing site for ManageMowed's Spokane-area market. This is the **light-theme** counterpart to the existing dark-theme Seattle landing page; markup, structure, and copy were adapted for the Spokane region.

## Tech

- Plain HTML / CSS / JS — no build step
- GSAP + ScrollTrigger via CDN
- Fontshare CDN (Clash Display, General Sans)
- Material Symbols icon font

## Files

- `index.html` — single-page site
- `style.css` — light theme. Palette tokens live in `:root`
- `app.js` — navbar scroll behavior, mobile menu, GSAP scroll reveals, form handler
- `assets/` — photos and logos shared with the Seattle build

## Theming notes

The original Seattle build is dark. This project flips surfaces/text to a light palette while preserving the lime brand accent (darkened to `#6b9a00` so it remains legible on white surfaces; the bright chartreuse is retained for fills via gradients). Hero, snow-break, and visual-break sections still use dark photo overlays with white text — that's intentional for legibility on imagery.

If you change the palette, update these tokens in `style.css :root`:
`--bg`, `--surface`, `--surface-2`, `--surface-3`, `--text`, `--text-muted`, `--text-faint`, `--accent`, `--accent-hover`, `--accent-dim`, `--accent-glow`, `--on-accent`.

## Workflow

`Start application` runs `python3 -m http.server 5000` on port 5000 — that's what the preview pane connects to.

## Deployment

Configured for static deployment via `.replit` using `npx serve . -l 3000`. Local dev uses Python on 5000 because `.replit` is locked from agent edits; production deployment serves on port 3000 mapped to external port 80.
