# Content Inventory

## Pages, live

| Path | Purpose | Content source |
|---|---|---|
| `/` | Static redirect to `/tr/` (default locale) | `astro.config.mjs` `redirects` |
| `/tr/`, `/en/` | Single-page marketing site: Hero, Problem, Product, Focus Areas, About, Contact (Request a Demo + General Inquiry panels) | `src/data/{locale}.json` |
| `/404` | Bilingual 404, not locale-prefixed | `src/pages/404.astro` |

**No `/en/portal` or `/tr/portal` stub anymore** — removed 2026-08-06 once
`korit-portal` actually shipped. The header/footer "Customer Portal" nav
link now points straight at `https://portal.korit.ai` (external), per the
portal spec's own Handoff Notes, which flagged this swap as a follow-up PR
here once the real app existed. Also removed as dead code alongside the
stub: the `portal` content block in `en.json`/`tr.json` (headline/body/
notify-form copy) and the `'Portal Interest'` inquiry type in
`src/lib/leadForm.ts` — both existed only to serve that stub.

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
