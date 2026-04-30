# Design Directions

Three distinct visual directions for the BMB website, each combining a different
color strategy, theme, and motion posture. The goal is one chosen direction
(or a deliberate remix) that becomes the basis for `DESIGN.md`.

All three honor the same `PRODUCT.md`: clinical authority + marketing energy,
Hims / Forward / Function lane, never sterile, never bro, never wellness-cliché.

## At a glance

| | Direction 1 — *Practice* | Direction 2 — *Protocol* | Direction 3 — *Press* |
|---|---|---|---|
| **Concept** | Modern medical brand, confidence at rest | Clinical performance, alive in the dark | Medical journal, redesigned for now |
| **Color strategy** | Committed (one saturated color, 30–60% surface) | Drenched (the surface IS the color) | Full palette (3–4 named roles, duotone) |
| **Theme** | Light | Dark | Duotone (warm-paper light + deep-ink dark sections) |
| **Motion** | Still | Alive · kinetic | Hybrid — still by default, kinetic where it counts |
| **Voice it projects** | "We're serious clinicians with marketing fluency." | "Peptides are the modern frontier — we operate it." | "We have something to teach you, beautifully made." |
| **DNA** | Forward · Function Health · Linear · Stripe | Hims (night) · Eight Sleep · Whoop · Stripe Press | Modern Animal · NYT longform · Hims editorial · Ramp blog |
| **Risk** | Could read too quiet for the marketing pillar | Dark drenched drifts toward "bro" if photography is weak | Most demanding to execute — asymmetry and type rhythm have to be right |

---

## Direction 1 — *Practice*

**Concept.** Modern medical brand at rest. Confident, quiet, intentionally
unhurried. The site doesn't perform; it lets specificity do the work.

**Scene.** A practice owner reading on a laptop in a sunlit office between
patients. They don't have time to be wowed; they want substance fast.

**Color strategy — Committed.** A tinted off-white surface (paper warmth, never
`#fff`), deep ink type, and ONE saturated brand color carrying 30–60% of the
surface — used in CTA blocks, full-bleed feature sections, and the lead-magnet
modules. Candidate hues: a deep clinical-amber (warmth + medical), a saturated
oxblood/cinnabar (authority + editorial), or a confident jade-emerald (medical
without the teal default). Single accent — no rainbow.

**Type direction.** Editorial-grotesque pairing. A confident but warm
display sans (e.g. Söhne Breit, Reckless Neue, GT Sectra) for headlines paired
with a calm humanist sans (Inter Display alternatives — Söhne, GT America) for
body. Optional editorial serif for one signature surface (the manifesto / "About
the team" section). Modular scale ≥1.25 between steps.

**Motion.** Still. Subtle reveals only. No scroll choreography; no kinetic
type. Confidence comes from composition, not movement. Reduced motion respected
by default.

**Verdict.** Most credible-by-default of the three. Best at making the MD's
22 years feel earned. Lowest execution risk. Lowest energy ceiling.

---

## Direction 2 — *Protocol*

**Concept.** A modern clinical performance brand. Surface is drenched in a
single saturated color; type is big and confident; real photography of clinics,
hands, vials, dosing — never stock. Energy-forward.

**Scene.** A med spa owner scrolling on their phone at 9pm after a packed day.
They want to feel that this is the next thing — that the practitioners running
it actually do this work.

**Color strategy — Drenched.** The surface IS the brand color. Candidate
floods: a tinted near-black with a deep-cyan or copper identity (Function
Health darker, but warmer); a deep saturated emerald or oxblood floor with
clinical-bright type; OR (boldest) a saturated chromatic field — think Stripe
Press dust-jacket — that the entire fold lives inside.

**Type direction.** Big confident display sans paired with a precise mono for
"protocol" callouts (dosage tables, week-by-week structure). The mono is the
clinical signal — it's how the design says "we know the science." Editorial
weight contrast.

**Motion.** Alive + kinetic. GSAP scroll-triggered hero reveals. Numbers count
up. Marquee of clinic logos. Sticky scroll case studies. Section transitions
have weight. Motion is purposeful — every animated element points to a fact,
not decoration. `prefers-reduced-motion` respected; static fallback exists.

**Verdict.** Highest energy ceiling, strongest "modern medical alive" signal.
Demands real photography (not stock). Demands tight motion engineering — bad
motion here looks worse than no motion.

---

## Direction 3 — *Press*

**Concept.** A medical journal redesigned for 2026 — but read by busy practice
owners, not academics. Editorial layouts, asymmetry, generous type rhythm,
deliberate use of full-bleed dark feature sections inside a warm light shell.

**Scene.** An MD reading the long-form "compliance pathway" piece on an iPad
on the couch, the way they used to read NEJM. The site rewards depth without
demanding it.

**Color strategy — Full palette (duotone).** Four named roles, used
deliberately:
- **Paper** — warm tinted cream for the default light surface
- **Ink** — deep tinted near-black for type and feature dark sections
- **Mark** — the singular brand accent (a saturated oxblood / cinnabar / clinical
  amber — chosen at DESIGN.md time)
- **Quiet** — a low-chroma neutral for borders, dividers, secondary surfaces

Light by default; dark sections appear as feature blocks (the manifesto, the
case studies, the "what's inside the guide" reveal). The page rhythm itself
becomes part of the storytelling.

**Type direction.** Editorial serif lead (e.g. Tiempos, Fraunces, GT Sectra) for
headlines, paired with a calm humanist sans for body, plus an editorial mono
for figures and pull-quotes. Optical sizing matters. Line length disciplined to
65–75ch.

**Motion.** Hybrid. Still by default — pages feel composed, not animated. Then
specific moments come alive: the scroll-pinned case-study count-up, the
"7 Days" reveal where each day animates in as you scroll, the lead-magnet
download flourish. Reduced motion gives a perfectly good static reading
experience.

**Verdict.** Most distinctive of the three. Hardest to execute well — type
rhythm and asymmetry have to be earned. Most likely to be remembered if it
lands; most likely to look amateurish if it doesn't.

---

## How to choose

- Pick **Practice** if the brand should *feel like a respected clinical group
  that happens to be excellent at marketing*.
- Pick **Protocol** if the brand should *feel like a modern performance
  health company* — the "future of medicine" energy, alive at every scroll.
- Pick **Press** if the brand should *feel like the publication of record*
  for clinical peptide programs — depth as differentiator.

Or remix: e.g. "Press structure with Protocol's drenched feature sections,"
"Practice palette with Press's editorial type." Call it out and we lock the
hybrid in `DESIGN.md`.
