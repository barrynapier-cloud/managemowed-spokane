# BMB — Body Mind Business

Practice growth consultancy for clinics building clinical peptide programs.
Hosts of *Optimize & Thrive* — Barry Napier and Dr. Angila Jaeggli, ND.

## Project state

Pre-build phase. We are evaluating three visual directions before committing
to a final design system.

- `PRODUCT.md` — locked strategic context (register, users, principles)
- `DIRECTIONS.md` — three competing visual directions
- `mocks/` — coded homepage prototypes for each direction
- `index.html` — the picker page that links to all three

## Run locally

```bash
npx serve . -l 3000
```

Then open <http://localhost:3000>.

## Stack (mocks)

- Plain HTML, CSS, JS — no build step
- Google Fonts via CDN
- GSAP via CDN (Direction 2 + 3 only, for scroll choreography)
- Unsplash CDN for photographic placeholders (curated keywords)

## Next step

Pick a direction (or remix two), then `DESIGN.md` gets written with the
chosen system's exact tokens. From there: `/impeccable shape` the homepage,
then build production code.
