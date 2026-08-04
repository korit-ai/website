# Implementation Plan

Status: Phase 1 (marketing site) in progress. Written 2026-08-02, prepared
against the original mockup (`index.html`, not committed to this repo —
superseded by the component build).

This is the working plan for the `website` repo, kept here rather than in
`korit-meta` because it's a fact specific to this project, not a company-wide
convention — see
[context-routing](../../../korit-meta/kb/global/01-conventions/context-routing.md).

## Decisions (locked)

| Decision | Choice | Why |
|---|---|---|
| Site generator | Astro | Native i18n routing, near-zero JS by default, deploys cleanly to GitHub Pages |
| Styling | Plain CSS, custom properties | Design tokens carried over from the mockup; no framework needed at this scale |
| Lead capture | Google Form (existing Workspace) + custom-styled UI, `no-cors` POST | Replaces the earlier `mailto:` approach — see [specs/lead-capture-demo-analytics.md](specs/lead-capture-demo-analytics.md) |
| Demo vs. general contact | Split into two distinct CTAs/forms, same backend | Qualifying demo CTA reads as more credible pre-M3-campaign, gives free segmentation data |
| Analytics | GoatCounter, added before demo-campaign traffic | Cookieless, no consent banner, supports custom events (demo/contact/portal submissions) |
| Languages at launch | English only | Turkish deferred to its own pass so unreviewed machine translation never ships; i18n routing is built now so `tr/` is a low-effort add later |
| Domain | `korit.ai` (`public/CNAME`) | Confirmed |
| Portal | `/en/portal` stub only, this repo | Full customer portal is a future, separate repo (`korit-portal`) — see Phase 2 below |
| Repo split | `website` (this repo) + future `korit-portal` | Different hosting targets and lifecycles |
| Hosting | GitHub Pages via GitHub Actions on push to `main` | Already decided |

## Deviations from the original draft plan

- **Turkish locale published without pre-publish native-speaker review,
  2026-08-05** — the original plan (see Milestones §5 history and
  `content-inventory.md`) was machine-translate-then-review-before-public.
  Reza explicitly changed this: translation should be automatic and human
  supervision reactive (fix anything that's flagged as wrong after the fact)
  rather than a gate before shipping. `src/data/tr.json` is a full
  machine-translation pass (by Claude Code, not a translation API) of every
  string in `en.json`, covering the mono "telemetry" readout strings too
  (e.g. `LAT`/`LON` → `ENLEM`/`BOYLAM`, `N`/`E` → `K`/`D`) for a fully
  localized reading, not just the prose copy. If a Turkish speaker later
  flags something as wrong, fix it directly in `tr.json` — no process change
  needed, this isn't a draft state.
- **`LanguageSwitcher.astro`** (`src/components/LanguageSwitcher.astro`) —
  built alongside the `tr` locale rather than ahead of it, since a switcher
  with only one locale live would've been dead UI. Wired into `Header.astro`'s
  `.navcta`. Swaps the leading `/en/`/`/tr/` path segment via
  `Astro.url.pathname`, preserving the rest of the path (so switching locale
  on `/en/portal` lands on `/tr/portal`, not `/tr/`).
- **`hreflang` alternate links added to `BaseLayout.astro`** — not in the
  original plan, but cheap and correct once two locales exist for the same
  page structure; loops over `locales` from `i18n/content.ts` plus an
  `x-default` pointing at `en`.
- **Contact, demo-request, and portal forms originally composed a `mailto:`
  link on submit** (zero backend). Superseded once the M3 demo-campaign
  requirement landed — see
  [specs/lead-capture-demo-analytics.md](specs/lead-capture-demo-analytics.md).
  They now POST to a Google Form (`src/lib/leadForm.ts`), which requires a
  real form + entry-ID mapping before submissions actually land anywhere —
  see Open Items.
- **Inline `onclick` handlers from the mockup were replaced** with a small
  script in `Header.astro` (mobile nav toggle) and the reveal-on-scroll
  `IntersectionObserver` in `BaseLayout.astro`. Same behavior, but avoids
  inline event handlers (cleaner CSP posture, easier to maintain).
- **Mojibake in the original mockup's copy** (`â€"`, `Â°`, `Ã‚`-type artifacts
  from an encoding mismatch) was corrected when moving text into `en.json` —
  proper em dashes, `°`, `×`, etc.
- **Real favicon + OG image, 2026-08-05** — `public/favicon.svg` (the navy
  square in an amber ring, matching `Header.astro`'s `.logo .mark`) was kept
  as the source design rather than redrawn, since it already matched the
  live header mark; raster exports (`favicon-32x32.png`, `favicon-16x16.png`,
  `apple-touch-icon.png` at 180×180 full-bleed, `favicon.ico`) were generated
  from it and wired into `BaseLayout.astro`'s `<head>` alongside the SVG, for
  browsers/contexts that don't support SVG favicons. `og-image-placeholder.svg`
  was replaced with a real `og-image.png` (1200×630) — navy background, the
  `ScanGraphic` building-wireframe motif rendered statically (no animation,
  since OG images are static), hero headline/tagline copy pulled from
  `en.json` rather than re-authored — wired into `og:image`/`twitter:image`
  meta tags (previously absent entirely, not just pointed at the placeholder).
  No new build-time dependency added for this — generated once via headless
  Chrome screenshots of local HTML/SVG at exact target pixel dimensions, not
  part of the ongoing build.
- **Added `@astrojs/sitemap`** for a generated sitemap at build time, and a
  `public/robots.txt`. Cheap, standard, wasn't in the original plan.
- **OG image is a placeholder SVG** (`public/og-image-placeholder.svg`), not
  wired into meta tags yet — most social platforms need a real raster image
  (PNG/JPG, 1200×630). See Open Items.
- **`src/lib/leadForm.ts` is wired to the real "korit.ai — Website Leads"
  Google Form** (2026-08-02) — `GOOGLE_FORM_ACTION` and `FIELD_ENTRIES` hold
  real values, verified with a live end-to-end test submission (confirmed
  landing in the linked Sheet). One gotcha hit along the way: the form
  silently 401'd on submissions until it was explicitly **Published** — newly
  created Google Forms aren't live until you click Publish, separate from
  "responses are being collected." If a form ever stops accepting
  submissions, check that first.
- **`src/lib/analytics.ts` is wired to the real GoatCounter site**
  (2026-08-02) — `GOATCOUNTER_SITE = 'korit'`
  (`https://korit.goatcounter.com`), verified the count endpoint responds.

## Tech stack

- **Framework:** Astro, static output, `astro:i18n` routing.
- **Styling:** `src/styles/global.css` — design tokens as CSS custom properties.
- **Content:** `src/data/{locale}.json`, flat key-value copy strings —
  never hardcode text inside `.astro` components.
- **Forms:** Google Form backend via `src/lib/leadForm.ts` (placeholder config —
  see Deviations and Open Items).
- **Analytics:** GoatCounter via `src/lib/analytics.ts`, script tag in
  `BaseLayout.astro` (placeholder site code).
- **CI/CD:** GitHub Actions → GitHub Pages (`actions/deploy-pages`).
- **Fonts:** Space Grotesk (display), Inter (body), JetBrains Mono (data/labels),
  via Google Fonts.

## Repository structure

```
website/
├── astro.config.mjs
├── package.json
├── public/
│   ├── favicon.svg
│   ├── og-image-placeholder.svg   # TODO: replace with real 1200×630 PNG
│   ├── robots.txt
│   └── CNAME
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── ScanGraphic.astro
│   │   ├── FocusCard.astro
│   │   ├── FormFactorCard.astro
│   │   ├── ContactForm.astro      # "General Inquiry" panel
│   │   ├── DemoRequestForm.astro  # "Request a Demo" panel
│   │   └── LanguageSwitcher.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   ├── leadForm.ts            # Google Form config + submitLead()
│   │   └── analytics.ts           # GoatCounter config + trackEvent()
│   ├── pages/
│   │   ├── en/
│   │   │   ├── index.astro
│   │   │   └── portal.astro       # "/" -> "/en/" is a static redirect,
│   │   │                          # see `redirects` in astro.config.mjs
│   │   └── tr/
│   │       ├── index.astro
│   │       └── portal.astro
│   ├── data/
│   │   ├── en.json
│   │   └── tr.json
│   └── styles/
│       └── global.css
├── .github/workflows/deploy.yml
└── README.md
```

## Page structure & sections (single page per locale)

1. Hero — thesis statement, CTA to Contact, secondary CTA to Product
2. Problem — the "GNSS cliff" concept, accuracy diagram
3. Product — sensor platform concept, four form-factor cards, "in development" note
4. Focus Areas — exploratory use-case areas
5. About — Founder / Partner background cards
6. Contact — email, plus two panels: "Request a Demo" (qualifying form —
   name, email, company, industry, use case, optional message) and "General
   Inquiry" (name, email, message). Both post to the same Google Form; the
   Hero primary CTA and a Product-section CTA both deep-link to `#demo`.
7. Nav/Footer — includes a "Customer Portal" link → `/en/portal`

## Portal entry point (this repo, stub only)

`src/pages/en/portal.astro`:
- Explains the future capability in plain terms.
- Email-capture "notify me" form, same Google Form backend as the contact/demo
  forms (`Inquiry Type: "Portal Interest"`), no working login.
- Linked from header nav and footer.

## Phase 2 (future, separate repo): Customer Portal

Not built in this pass. Documented so the website's IA anticipates it correctly.

- **Repo:** `korit-portal`, hosted separately from `website`.
- **Auth:** Firebase Authentication, Google Sign-In, allowlisted accounts
  (manual approval, no open signup).
- **Upload flow:** customer logs in → uploads via web form → Firebase Cloud
  Function → authenticates as a service account with access to a **Shared
  Drive** → file lands in `Customers/{customer-id}/`.
- **Why service account + Shared Drive, not the customer's own Drive:** keeps
  customer data centralized in the company Workspace, avoids per-customer
  Drive permission management, avoids ever handling customer Google
  credentials beyond identity/login.
- **Dashboard v1:** list of the customer's own past uploads via the Drive
  API, scoped to their subfolder. No processing status / SLAM pipeline
  integration yet.
- **Open question:** Drive has practical limits for large sensor datasets
  (point clouds); Google Cloud Storage may fit better once volumes grow.
  Fine to start with Drive since this is a draft and Workspace storage is
  already paid for — revisit before real customer data flows through it.
- **Security note:** explicitly a draft/MVP. Before real customer data
  touches it, add upload size limits, file-type validation, per-customer
  storage quotas, and audit logging.

## CI/CD

`.github/workflows/deploy.yml`: push to `main` → `npm ci` → `npm run build`
→ deploy `dist/` via `actions/deploy-pages`. `public/CNAME` holds the custom
domain. DNS (`A`/`ALIAS` or `CNAME` records pointed at GitHub Pages) is a
one-time manual step outside the repo.

## Secrets / environment variables

None required for Phase 1 — no form backend, no API keys.
Phase 2 (portal) will need: Firebase project config, Google service account
JSON (GitHub/Firebase secret, never in-repo), OAuth client ID.

## Milestones

1. ~~Scaffold~~ — Astro project, folder structure, design tokens, fonts.
2. ~~Port content~~ — mockup sections rebuilt as Astro components, English
   copy in `en.json`.
3. ~~Contact form~~ — originally `mailto:`-composing forms, no backend needed.
4. ~~Deploy~~ — GitHub Actions pipeline live, custom domain verified over
   HTTPS as of 2026-08-04 (`korit.ai` resolving to GitHub Pages, serving
   200 over HTTPS). DNS/domain provider: Namecheap (registrar) + Google
   Workspace (mail).
5. ~~i18n~~ — Turkish locale added (`tr.json`, `LanguageSwitcher`, `tr/`
   pages). Done 2026-08-05, published directly per Reza's decision — see
   Deviations below (this supersedes the original "native-speaker review
   before public" plan).
6. ~~Assets~~ — real favicon/OG image, replacing placeholders. Done
   2026-08-05, see Deviations below.
7. ~~Real lead capture, demo CTA, analytics~~ — implemented per
   [specs/lead-capture-demo-analytics.md](specs/lead-capture-demo-analytics.md):
   Google-Form-backed `DemoRequestForm` + reworked `ContactForm`, Hero/Product
   CTAs deep-linking to `#demo`, GoatCounter analytics with per-form custom
   events. Fully live and complete: real Google Form and GoatCounter site
   both verified, demo-CTA copy reviewed and approved 2026-08-02.

## Open items

- [x] ~~Point `korit.ai` DNS (Namecheap) at GitHub Pages~~ — done, verified
      2026-08-04: `korit.ai` `A` records resolve to GitHub Pages'
      `185.199.108/109/110/111.153`, `https://korit.ai` serves 200. See
      domain-setup notes for the two gotchas hit along the way (private-repo
      Pages restriction, Namecheap URL-redirect-record conflict).
- [x] ~~Enable GitHub Pages~~ — done, verified 2026-08-04 (live and serving
      over HTTPS, see above).
- [x] ~~Decide who does the Turkish translation~~ — resolved 2026-08-05:
      automatic (Claude Code), published without a pre-publish review gate,
      supervised reactively. See Deviations above.
- [x] ~~Replace `public/og-image-placeholder.svg` with a real 1200×630
      PNG/JPG, and `public/favicon.svg` with a designed mark~~ — done
      2026-08-05, see Deviations above.
- [x] ~~Create the Google Form + linked Sheet, pull `entry.*` field IDs, hand
      off the `formResponse` URL~~ — done 2026-08-02, `src/lib/leadForm.ts`
      has real values, verified live. See
      [specs/lead-capture-demo-analytics.md](specs/lead-capture-demo-analytics.md) §1.
- [x] ~~Sign up for GoatCounter, hand off the site code~~ — done 2026-08-02,
      `src/lib/analytics.ts` has `GOATCOUNTER_SITE = 'korit'`, verified live.
      See [specs/lead-capture-demo-analytics.md](specs/lead-capture-demo-analytics.md) §3.
- [x] ~~Approve or edit the demo-CTA copy in `src/data/en.json`~~ — reviewed
      and approved as-is 2026-08-02 (`hero.cta_primary`, `product.demo_cta`,
      `contact.demo.*`, `contact.general.title`). No longer a "first draft."
