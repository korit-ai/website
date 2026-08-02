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
- `LanguageSwitcher.astro` — **not built yet**, deferred to the `tr` locale
  milestone (see `implementation-plan.md`).

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
