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
- `tr` — not started. When it starts: add `src/data/tr.json` mirroring
  `en.json`'s keys, add `'tr'` to `astro.config.mjs`'s `i18n.locales`, add
  `src/pages/tr/index.astro` + `portal.astro`, build `LanguageSwitcher.astro`.
  Machine-translate first pass is fine but needs native-speaker review before
  it's public — see `implementation-plan.md`.

## Known placeholders (must resolve before public launch)

- `public/og-image-placeholder.svg` is not wired into any `og:image` meta tag
  — needs a real 1200×630 raster image first (most platforms don't render
  SVG for link previews).
- `public/favicon.svg` is a simple placeholder derived from the header logo
  mark, not a designed asset.
- Lead capture (`src/lib/leadForm.ts`) and analytics (`src/lib/analytics.ts`)
  are both done — real Google Form and GoatCounter site, live and verified.
  See `specs/lead-capture-demo-analytics.md`.
- Demo-CTA copy (`hero.cta_primary`, `product.demo_cta`, `contact.demo.*` in
  `en.json`) is a first draft per the spec's own request for team review, not
  yet approved.
