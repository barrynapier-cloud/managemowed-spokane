# Handoff — going local

Everything you need to pick this project up on your own machine and continue
with the full impeccable skill loop.

## What's in this project

```
bmb-website/
├── PRODUCT.md           # Strategic context — locked, approved
├── DIRECTIONS.md        # Three competing visual directions (briefs)
├── README.md            # Project overview
├── HANDOFF.md           # This file
├── index.html           # Picker page — links to all three mocks
└── mocks/
    ├── 1-practice/      # ✅ Light · Committed oxblood · Still
    ├── 2-protocol/      # ✅ Dark · Drenched copper + chartreuse · Kinetic GSAP
    └── 3-press/         # ✅ Duotone · Full palette cinnabar · Hybrid motion
```

All three directions are coded, openable, and complete. The picker
(`index.html`) lets you flip between them.

`PRODUCT.md` is the strategic source of truth — every impeccable command reads
it. Don't edit ad-hoc; if strategy changes, re-run `/impeccable teach`.

## Step 1 — Install impeccable on your machine

```bash
git clone https://github.com/pbakaus/impeccable.git /tmp/impeccable
mkdir -p ~/.claude/skills
cp -r /tmp/impeccable/.claude/skills/impeccable ~/.claude/skills/
```

That's a global install — every project on your machine sees the skill.
The 23 commands are exposed via `/impeccable <command>`.

Verify by running Claude Code from any directory and typing `/impeccable` —
you should see the command menu.

## Step 2 — Get this project to your machine

The tarball lives at `/tmp/bmb-website.tar.gz` (~50KB). Download and extract
anywhere convenient (e.g. `~/code/bmb-website`).

If you'll push to GitHub:

```bash
cd ~/code/bmb-website
gh repo create bmb-website --private --source=. --push
# or manually:
gh repo create bmb-website --private
git remote add origin git@github.com:<you>/bmb-website.git
git push -u origin main
```

## Step 3 — Open the mocks locally

```bash
cd ~/code/bmb-website
npx serve . -l 3000
# open http://localhost:3000
```

You'll land on the picker page. Open each direction in turn:

- `/mocks/1-practice/` — Practice (light, oxblood, still)
- `/mocks/2-protocol/` — Protocol (dark drenched, kinetic GSAP)
- `/mocks/3-press/` — Press (duotone editorial, hybrid motion)

This is your "see them all" moment — the original ask. React, then pick.

## Step 4 — Pin shortcuts (recommended)

Once you're working in `~/code/bmb-website` with Claude Code:

```bash
node ~/.claude/skills/impeccable/scripts/pin.mjs pin live document critique audit polish
```

`/live`, `/document`, `/critique`, `/audit`, `/polish` now invoke directly
without the `/impeccable` prefix. The pin script writes slash command files
into `.claude/commands/`.

## Step 5 — Pick a direction, lock the system

Once you've decided (Practice, Protocol, Press, or a remix), tell Claude:

```
/document mocks/<chosen-direction>
```

This extracts the chosen system into `DESIGN.md` (Google Stitch format) and
`DESIGN.json` (sidecar with tonal ramps, shadow tokens, motion tokens, full
component snippets). From this point on, every command stays on-brand to the
locked system automatically.

## Step 6 — The iteration loop

```
/critique mocks/<direction>     # Nielsen 0-4 per heuristic, AI-slop verdict, P0-P3 issue list
/audit mocks/<direction>        # a11y, perf, responsive, theming, anti-patterns — 0-4 each
/live                           # the killer command — pick element → 3 variants → accept
```

`/live` requires Claude Code and your browser on the same machine — which is
the whole point of going local. Click an element on the live page, click "Go",
get three genuinely different alternatives, accept the one you want. Source
updates in place. Loop on element after element.

For batched changes without `/live`:

```
/typeset  /layout  /colorize  /animate  /bolder  /quieter  /distill
/clarify  /adapt   /harden    /optimize /delight /overdrive /extract
```

Each generates 2–3 distinct variants along the dimension named, you pick one,
it's applied. Reload the dev server to see.

End meaningful rounds with `/critique` (rescore) and `/polish` (sweat-the-
details final pass).

## What's already locked in PRODUCT.md

- Register: brand
- Voice tagline (from *Optimize & Thrive*): *"powerful optimism, raw honesty,
  compassionate science, actionable insights"*
- Two-pillar team: Barry Napier (brand/marketing) · Dr. Angila Jaeggli, ND
  (Medical Director, 22 years clinical practice)
- Lead-magnet hook: *"7 Days to Launch a Clinical Peptide Program in Your
  Practice"*
- Primary CTA: download the playbook · Secondary CTA: book a 30-min call
- Five strategic principles: *Two voices · Show the work · Practitioner peers
  · Modern medical alive · Lead magnet earns the click*

## What's still open

- **Final direction** — Practice, Protocol, Press, or a remix (the entire
  point of this build)
- **Real photography** — every mock uses Unsplash placeholders labeled *PHOTO
  · PLACEHOLDER*. Replace before any external review.
- **Final headlines** — current copy is strong but voice-tunes per direction;
  the chosen direction may want a final pass via `/clarify`
- **Logo / wordmark** — each direction sets it in its own display face;
  commission a real wordmark when the direction locks
- **The 22-year credential** — verify with Dr. Angila that the phrasing is
  accurate and how she prefers to be credited

## TL;DR

1. Install impeccable globally on your machine
2. Extract `bmb-website.tar.gz` somewhere local
3. `npx serve` and look at all three mocks in your browser
4. Pick a direction
5. `/document` it → `/live` it → `/critique` it → `/polish` it → ship

Welcome home.
