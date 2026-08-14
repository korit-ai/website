# Implementation Plan

Status: Phase 1 (marketing site) in progress. Written 2026-08-02, prepared
against the original mockup (`index.html`, not committed to this repo —
superseded by the component build).

This is the working plan for the `website` repo, kept here rather than in
`korit-meta` because it's a fact specific to this project, not a company-wide
convention — see
[context-routing](../../../kb/global/01-conventions/context-routing.md).

## Decisions (locked)

| Decision | Choice | Why |
|---|---|---|
| Site generator | Astro | Native i18n routing, near-zero JS by default, deploys cleanly to GitHub Pages |
| Styling | Plain CSS, custom properties | Design tokens carried over from the mockup; no framework needed at this scale |
| Lead capture | Google Form (existing Workspace) + custom-styled UI, `no-cors` POST | Replaces the earlier `mailto:` approach — see [specs/lead-capture-demo-analytics.md](specs/lead-capture-demo-analytics.md) |
| Demo vs. general contact | Split into two distinct CTAs/forms, same backend | Qualifying demo CTA reads as more credible pre-M3-campaign, gives free segmentation data |
| Analytics | GoatCounter, added before demo-campaign traffic | Cookieless, no consent banner, supports custom events (demo/contact submissions) |
| Languages | `en` + `tr`, both live; **`tr` is the default locale** | Original "English only, Turkish deferred until reviewed" plan superseded 2026-08-05 — see Deviations below |
| Domain | `korit.ai` (`public/CNAME`) | Confirmed |
| Portal | External link to `https://portal.korit.ai` from nav/footer, no stub page in this repo | `korit-portal` shipped 2026-08-06 — the stub existed only until the real thing did, see Deviations below |
| Repo split | `website` (this repo) + `korit-portal` | Different hosting targets and lifecycles |
| Hosting | GitHub Pages via GitHub Actions on push to `main` | Already decided |

## Deviations from the original draft plan

- **Portal stub removed, 2026-08-06** — `korit-portal` shipped and is live
  at `portal.korit.ai`, so the placeholder this repo carried since Phase 1
  (`/en/portal`, `/tr/portal` — "coming soon" + email-capture notify-me
  form) is no longer needed. Removed: both page files, the `portal` content
  block from `en.json`/`tr.json` (headline/body/form copy — `nav.portal`,
  the nav *label*, stays since it's still a real link), and the now-unused
  `'Portal Interest'` inquiry type from `src/lib/leadForm.ts`'s
  `InquiryType` union. Header/Footer's "Customer Portal" link now points
  directly at `https://portal.korit.ai` (external). This was flagged as a
  planned follow-up in the portal spec's own Handoff Notes from the start
  — not a surprise change, just executed once the real app existed.
- **Polish pass from a self-directed audit, 2026-08-05** (Reza asked for
  investigation + suggestions, then "fix them all"):
  - **Chart axis-label contrast fix** — the Problem-section SVG chart's axis
    labels (`en/index.astro` and `tr/index.astro`, both copies) used
    `fill="#8890A0"` (the lighter `--fog` token) at 9.5px on a white card:
    3.21:1 contrast, fails WCAG AA (needs 4.5:1 for text this small).
    Switched to `var(--fog-dark)` (5.92:1), matching every other muted-text
    use on the site. The dashed divider *line* in the same chart keeps
    `#8890A0` — that's a non-text graphical element, held to the lower 3:1
    bar, which it already clears.
  - **`src/pages/404.astro` added** — GitHub Pages was serving its own
    generic 404 for any bad/typo'd URL. New page is deliberately bilingual
    (not locale-JSON-driven like every other page) since a 404 can be hit
    from either locale or a URL with no locale segment at all — reuses
    `BaseLayout` with `locale="tr"` so header/footer/language-switcher still
    work, shows Turkish then English "not found" copy stacked, hardcoded
    inline rather than added to `en.json`/`tr.json` since it's not really
    page content, it's a utility page.
  - **Sitemap `hreflang` alternates** — `@astrojs/sitemap`'s `i18n` config
    (`defaultLocale: 'tr'`, `locales: { tr: 'tr', en: 'en' }`) added in
    `astro.config.mjs`. Previously the sitemap declared the `xhtml`
    namespace but never emitted `<xhtml:link>` entries — the locale-alternate
    signal only existed in each page's own `<head>`, not in the file crawlers
    read first.
  - **`og:locale` / `og:locale:alternate` / `og:site_name`** added to
    `BaseLayout.astro` — region-qualified (`tr_TR`, `en_US`) since that's
    what Open Graph expects, not the bare `tr`/`en` used for `hreflang`.
  - **`theme-color` meta** (`#13223D`, the brand navy) — mobile browser
    chrome now tints to match instead of defaulting to white/gray.
  - **JSON-LD structured data** — an `Organization` + `WebSite` `@graph` in
    `BaseLayout.astro`'s `<head>`, using the page's own `description` prop
    (no new content invented) and `hello@korit.ai`. `logo` points at
    `apple-touch-icon.png` (the mark) rather than `og-image.png` (a banner,
    not a logo).
  - **Astro 4.16 → 7.1.6 upgrade, done 2026-08-05 on `chore/astro-v7-upgrade`,
    merged to `main` after manual verification** — resolves the `sharp`/esbuild
    `npm audit` findings above (`npm audit` now reports 0 vulnerabilities).
    Also bumped `@astrojs/sitemap` (3.2.1→3.7.3), `@astrojs/check` (0.9.4→0.9.10),
    and `typescript` — pinned at `6.0.3`, **not** the `7.0.2` that `npm outdated`
    calls "latest", since `@astrojs/check`'s peer range is `^5.0.0 || ^6.0.0`
    and doesn't support TS 7 yet. `.github/workflows/deploy.yml`'s
    `node-version` bumped `20 → 22` — Astro 7 requires Node ≥22.12, so the
    version bump alone would have broken CI deploys without this.
    `astro.config.mjs` needed zero changes (i18n routing was already explicit
    about `prefixDefaultLocale`/`redirectToDefaultLocale` rather than relying
    on version-specific defaults that shifted in v6). Verified via
    `astro check && astro build` (0 errors) plus manual screenshots across
    both locales, the portal stub, and the 404 page at multiple viewport
    widths post-upgrade — no visual or functional regressions found.
  - **Chrome-headless testing gotcha hit along the way, worth remembering**:
    `chrome --headless=new --window-size=W,H --screenshot=...` does not
    reliably constrain the actual CSS viewport when `W` is small (observed:
    requests for width 390 rendered internally at ~500px width regardless,
    while the output PNG was still cropped to the requested 390×H canvas).
    This produced a false "mobile header overflow" reading — the button/
    hamburger were fully on-screen at the real ~500px render, just cropped
    out of the smaller screenshot canvas. Confirmed via a temporary on-page
    debug overlay reading `getBoundingClientRect()`/`innerWidth` directly
    (removed before commit) and by re-testing at 800px+, which renders
    correctly and matches the requested size. **If a headless-Chrome
    screenshot at a narrow width shows clipped content again, verify with an
    on-page measurement before trusting it as a real layout bug** — this
    tool doesn't reliably prove narrow-viewport behavior on its own.
  - **`LanguageSwitcher` moved from `.navcta` into `.navlinks`** — not a bug
    fix (the investigation above found no real overflow), just a minor,
    harmless simplification: it now collapses into the mobile dropdown menu
    with the rest of nav instead of always occupying space in the persistent
    mobile header row.
  - **Also not done**: `content-inventory.md`'s "content owner: not yet
    assigned" note — that's Reza's call to make, not something to resolve
    by picking someone.
- **`tr` made the default locale, 2026-08-05** — Reza's explicit call.
  `astro.config.mjs`: `i18n.defaultLocale` is `tr`, and `redirects['/']` now
  points at `/tr/` instead of `/en/`. `BaseLayout.astro`'s `hreflang="x-default"`
  now points at the `tr` URL to match. `src/i18n/content.ts`'s `content`
  object is ordered `{ tr, en }` (not just `{ en, tr }`) since its key order
  drives `LanguageSwitcher`'s display order and the `hreflang` link order —
  cosmetic, but worth keeping consistent with which locale is actually
  default. `/en/` is unaffected and still fully live at its own prefix; this
  only changes what a bare `https://korit.ai/` visit resolves to.
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
  mid-page stays on the equivalent page rather than bouncing to the locale
  root — relevant if a second real page is ever added; currently `/en/` and
  `/tr/` are the only pages besides the locale-agnostic 404).
- **`hreflang` alternate links added to `BaseLayout.astro`** — not in the
  original plan, but cheap and correct once two locales exist for the same
  page structure; loops over `locales` from `i18n/content.ts` plus an
  `x-default`, which points at `tr` since the default-locale switch above
  (was `en` between the two 2026-08-05 changes, briefly).
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
│   ├── favicon-32x32.png
│   ├── favicon-16x16.png
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── og-image.png
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
│   │   ├── 404.astro               # bilingual, not locale-prefixed
│   │   ├── en/
│   │   │   └── index.astro         # "/" -> "/tr/" is a static redirect,
│   │   │                           # see `redirects` in astro.config.mjs
│   │   └── tr/
│   │       └── index.astro
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
7. Nav/Footer — includes a "Customer Portal" link → `https://portal.korit.ai`
   (external, both locales — no stub page in this repo since 2026-08-06)

## Phase 2 (shipped, separate repo): Customer Portal

**Superseded/historical** — this section is the original draft vision from
before `korit-portal` was actually scoped and built. The real spec is
[korit-meta/kb/global/04-product/portal-spec-v1-delivery.md](../../../kb/global/04-product/portal-spec-v1-delivery.md),
and the shipped app's own stack notes are in
`korit-portal/kb/project/stack.md`. Kept below for historical context, not
as current fact — e.g. it describes a Google Drive upload flow, but what
actually shipped uses Firebase Storage with no v1 upload at all.

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
