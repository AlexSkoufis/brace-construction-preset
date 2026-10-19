# Brace Construction Group — Construction Preset

A light, modern homepage for a **fictional** general contractor. Warm white, soft white cards and a single amber accent used as a detail; Archivo (variable weight **and width**) + JetBrains Mono.

Next.js 15 (static export) · GSAP 3 (ScrollTrigger, Flip) · Lenis · plain CSS. No UI libraries.

```bash
npm install
npm run dev       # dev output goes to .next-dev, so builds never disturb a running dev server
npm run build     # static site in ./out
npm run images    # rebuild responsive AVIF/WebP after changing photos in assets-src/
```

## Signature pieces

| Section | What it does |
|---|---|
| Hero | “Built to last.” set in a variable-width face: letters near the cursor swell to full width while the rest compress, like a bellows (a slow wave on touch). Key figures roll up on mechanical odometers. |
| Services | Five trades as a large accordion (real `<button aria-expanded>`); the photo beside it wipes to match. |
| Drawing → built | One photo shown twice: as a blueprint (SVG edge-detection filter screened onto blueprint blue, with grid, levels and dimensions) and as built. A native range input drives the divider — drag, touch or arrow keys. |
| Projects | Sector filters animated with GSAP Flip: cards glide to their new cells, leavers fade, newcomers scale in. |
| Process | A pinned Gantt programme (64 weeks, 8 phases). Scrolling moves the “today” line; bars fill, live phases turn hazard-striped, and a readout shows week, % complete and what’s on site. |
| Safety | Live days-without-incident odometer (counted from a date in the config), text ticker, certifications, carbon figures, client quote, client marquee. |
| Estimator | Four steps — type, size (m², floors), spec, contact — with a live ballpark cost range and build time. Demo only; nothing is sent. |
| Footer | A rounded card with offices, careers, and a wordmark that widens from condensed to expanded as you arrive. |

Pointer: iPadOS-style — a soft dot that morphs into a highlight around buttons and links (fine pointers only).

## Re-skin

- **Copy & data** — `lib/content.ts`: company, offices, stats, services, blueprint project, projects & sectors, programme phases, safety (incl. `lastIncident` date), testimonial, clients, estimator rates.
- **Photos** — drop `<key>.jpg` into `assets-src/`, add the key to `ImageKey`, run `npm run images`. Credits in `assets-src/CREDITS.md`.
- **Colour** — tokens at the top of `app/globals.css` (`--bg`, `--surface`, `--ink`, `--hi`, `--blue`, radii `--r` / `--r-lg`).
- **Estimator maths** — `estimator.types[].rate` (€/m²) and `weeksPer1k`, `finishes[].factor`.

## Accessibility & motion

`prefers-reduced-motion` stops the kinetic type, pinning, marquees and odometer rolls (final values shown). The accordion, filters, comparison slider and estimator are all keyboard-operable with visible focus.

## Demo content

Brace, its projects, figures, certifications, clients and quotes are fictional; photographs are Unsplash (free licence) placeholders.
