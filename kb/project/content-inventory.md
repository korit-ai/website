# Content Inventory

## Pages (English, live)

| Path | Purpose | Content source |
|---|---|---|
| `/` | Static redirect to `/en/` | `astro.config.mjs` `redirects` |
| `/en/` | Single-page marketing site: Hero, Problem, Product, Focus Areas, About, Contact (Request a Demo + General Inquiry panels) | `src/data/en.json` |
| `/en/portal` | Customer portal stub — explains the future capability, email-capture "notify me" | `src/data/en.json` (`portal` key) |

Content owner: not yet assigned — flag for whoever owns marketing copy once
the site is live.

## Locales

- `en` — live, source of truth for all copy.
- `tr` — live as of 2026-08-05, machine-translated (`src/data/tr.json`),
  published without a pre-publish native-speaker review — Reza's explicit
  call, supervision is reactive (fix what's flagged as wrong) rather than a
  gate before shipping. See `implementation-plan.md` Deviations for why this
  overrides the earlier "review before public" plan, and flag anything that
  reads wrong if you spot it.

## Known placeholders (must resolve before public launch)

None remaining. Lead capture, analytics, and demo-CTA copy (per
`specs/lead-capture-demo-analytics.md`) were done as of 2026-08-02. Favicon
and OG image were done 2026-08-05 (see `implementation-plan.md` Deviations):
`public/favicon.svg` (+ `favicon-32x32.png`, `favicon-16x16.png`,
`apple-touch-icon.png`, `favicon.ico`) reuses the header logo mark — navy
square in an amber ring, on paper — across all icon contexts; `og-image.png`
(1200×630 raster) is wired into `og:image`/`twitter:image` in
`BaseLayout.astro`, generated from the same design tokens and a static
render of the `ScanGraphic` building-wireframe motif.
