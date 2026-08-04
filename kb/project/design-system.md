# Design System

No company-wide brand doc exists yet in
`../../../korit-meta/kb/global/00-company/` — these tokens are currently
authoritative only here, carried over from the original marketing mockup.
If a global brand doc is ever created, this file should link to it instead
of restating values (see
[context-routing](../../../korit-meta/kb/global/01-conventions/context-routing.md)).

## Tokens (`src/styles/global.css`)

| Token | Value | Use |
|---|---|---|
| `--navy` | `#13223D` | Primary dark background (hero, about) |
| `--navy-deep` | `#0C1729` | Dark background hover state |
| `--paper` | `#ECE7D8` | Light background |
| `--amber` | `#E2A33B` | Primary accent / CTA |
| `--amber-bright` | `#F0B85C` | Accent on dark backgrounds |
| `--cyan` | `#6FCFC0` | Secondary/data accent only |
| `--ink` | `#10151C` | Text on light bg / product section bg |
| `--fog` / `--fog-dark` | `#8890A0` / `#5C6478` | Muted secondary text |

Fonts: `Space Grotesk` (display/headings), `Inter` (body), `JetBrains Mono`
(technical/data labels — telemetry text, eyebrows, form labels), loaded via
Google Fonts in `BaseLayout.astro`.

## Wordmark

Reza supplied `korit-ai-wordmark-rgb.svg` (2026-08-05) — a per-letter-colored
"korit.ai" wordmark (Space Grotesk), the first real logo asset (previously
the header/footer just rendered plain CSS-styled text). Three files now
live in `public/logo/`:

- `korit-wordmark-original.svg` — the file exactly as supplied, kept
  unmodified for provenance/reference. **Its `k`/`o`/`r` colors
  (`#EF4444`/`#22C55E`/`#3B82F6` — generic red/green/blue) don't match this
  site's palette** and are not used anywhere on the site as-is.
- `korit-wordmark-on-light.svg` — recolored to this design system's own
  tokens: `k`=`--amber`, `o`=`--amber-bright`, `r`=`--cyan` (preserves the
  original's "first three letters each get their own color" concept, but
  using hues that already have a home in this palette rather than
  off-palette primaries), `i`/`t`=`--ink`, `.ai`=`--fog-dark`. Used in
  `Header.astro` (paper/light background).
- `korit-wordmark-on-dark.svg` — same `k`/`o`/`r` accents (amber and cyan
  both already read fine on navy — see contrast notes below), `i`/`t`=`--paper`,
  `.ai`=`--fog`. Used in `Footer.astro` (navy/dark background).

Recoloring decision confirmed by Reza 2026-08-05 (asked directly given the
mismatch, rather than assuming either "use as-is" or "silently recolor").
No `currentColor`/single-adaptive-file approach was used — two static,
context-specific files are simpler to reason about than one file relying on
CSS inheritance through an `<img>` tag (which doesn't work for `currentColor`
anyway — `<img>`-referenced SVGs don't inherit page text color).

## Components (`src/components/`)

- `Header.astro`, `Footer.astro` — site chrome, locale-aware links.
- `Hero.astro` + `ScanGraphic.astro` — the animated "point-cloud resolves
  into a building" signature visual. Respects `prefers-reduced-motion`.
- `FocusCard.astro`, `FormFactorCard.astro` — repeated card grids (Focus
  Areas, Product form-factors).
- `ContactForm.astro` — the "General Inquiry" panel (name, email, message).
  `DemoRequestForm.astro` — the "Request a Demo" panel (adds company,
  industry, use-case). Both POST through `src/lib/leadForm.ts`'s shared
  `submitLead()` — see `stack.md`.
- `LanguageSwitcher.astro` — built 2026-08-05 (see `implementation-plan.md`).
  Swaps the leading `/en/`/`/tr/` path segment, keeps the rest of the path
  (e.g. `/portal`), so switching locale mid-page stays on the equivalent
  page rather than bouncing to the locale root.

## Contact section anchors

`#contact` is the whole section; `#demo` is the "Request a Demo" panel
specifically (`.panel-demo` in `src/pages/en/index.astro`), given
`scroll-margin-top` so it lands cleanly below the sticky header when the
Hero and Product CTAs deep-link to it. If you add more anchor targets that
sit below the fold, give them the same `scroll-margin-top` treatment rather
than relying on the browser's default (which the sticky header would partly
cover).

All page-section layout (grid, spacing per section) lives scoped inside
`src/pages/en/index.astro`'s own `<style>` block, since those sections are
each used exactly once.
