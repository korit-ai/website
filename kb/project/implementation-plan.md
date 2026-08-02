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
| Contact form | `mailto:` link composed client-side | Zero account setup, works immediately; no lead persistence or spam filtering — see Open Items to upgrade later |
| Languages at launch | English only | Turkish deferred to its own pass so unreviewed machine translation never ships; i18n routing is built now so `tr/` is a low-effort add later |
| Domain | `korit.ai` (`public/CNAME`) | Confirmed |
| Portal | `/en/portal` stub only, this repo | Full customer portal is a future, separate repo (`korit-portal`) — see Phase 2 below |
| Repo split | `website` (this repo) + future `korit-portal` | Different hosting targets and lifecycles |
| Hosting | GitHub Pages via GitHub Actions on push to `main` | Already decided |

## Deviations from the original draft plan

- **`LanguageSwitcher.astro` not built yet.** With only one locale live,
  a switcher has nothing to switch to — it'd be dead UI. Build it when the
  `tr` locale milestone starts.
- **i18n routing exists, `tr/` content doesn't.** `astro.config.mjs` declares
  only `en` as a locale for now. Adding `tr` later is: add `src/data/tr.json`,
  add `tr` to the `locales` array, add `src/pages/tr/*.astro` mirroring
  `en/*.astro`. No component changes needed — every component reads copy from
  the locale JSON, none hardcode English strings.
- **Contact form and portal "notify me" form compose a `mailto:` link on
  submit** instead of posting to Formspree — no form-backend account needed,
  works the moment the site is live. Trade-off: relies on the visitor having
  a configured email client, and there's no captured lead list or spam
  filtering. Swap for Formspree (or a Google Form, given the existing
  Workspace) later if that becomes a problem — see Open Items.
- **Inline `onclick` handlers from the mockup were replaced** with a small
  script in `Header.astro` (mobile nav toggle) and the reveal-on-scroll
  `IntersectionObserver` in `BaseLayout.astro`. Same behavior, but avoids
  inline event handlers (cleaner CSP posture, easier to maintain).
- **Mojibake in the original mockup's copy** (`â€"`, `Â°`, `Ã‚`-type artifacts
  from an encoding mismatch) was corrected when moving text into `en.json` —
  proper em dashes, `°`, `×`, etc.
- **Added `@astrojs/sitemap`** for a generated sitemap at build time, and a
  `public/robots.txt`. Cheap, standard, wasn't in the original plan.
- **OG image is a placeholder SVG** (`public/og-image-placeholder.svg`), not
  wired into meta tags yet — most social platforms need a real raster image
  (PNG/JPG, 1200×630). See Open Items.

## Tech stack

- **Framework:** Astro, static output, `astro:i18n` routing.
- **Styling:** `src/styles/global.css` — design tokens as CSS custom properties.
- **Content:** `src/data/{locale}.json`, flat key-value copy strings —
  never hardcode text inside `.astro` components.
- **Forms:** client-side `mailto:` composition, no backend (see Decisions above).
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
│   │   └── ContactForm.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   └── en/
│   │       ├── index.astro
│   │       └── portal.astro       # "/" -> "/en/" is a static redirect,
│   │                               # see `redirects` in astro.config.mjs
│   ├── data/
│   │   └── en.json
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
6. Contact — email + `mailto:`-composing form
7. Nav/Footer — includes a "Customer Portal" link → `/en/portal`

## Portal entry point (this repo, stub only)

`src/pages/en/portal.astro`:
- Explains the future capability in plain terms.
- Email-capture "notify me" form (`mailto:` composition, same as the contact
  form), no working login.
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
3. ~~Contact form~~ — `mailto:`-composing forms, no backend needed.
4. Deploy — GitHub Actions pipeline live, custom domain verified over HTTPS.
   DNS/domain provider: Namecheap (registrar) + Google Workspace (mail).
   GitHub Pages needs 4 `A` records (and optionally `AAAA`) added at
   Namecheap for `@`, without touching the existing Workspace MX/TXT/DKIM
   records — see the DNS walkthrough shared with the team.
5. i18n — Turkish locale added (`tr.json`, `LanguageSwitcher`, `tr/` pages),
   native-speaker review before it's public.
6. Assets — real favicon/OG image, replacing placeholders.
7. (Optional, later) Real lead capture — swap the `mailto:` forms for
   Formspree or a Google Form if losing submissions to unconfigured email
   clients, or needing a captured list/spam filtering, becomes a problem.
   Spec ready for implementation:
   [specs/lead-capture-demo-analytics.md](specs/lead-capture-demo-analytics.md).

## Open items

- [ ] Point `korit.ai` DNS (Namecheap) at GitHub Pages — 4 `A` records for
      `@`, optionally 4 `AAAA` records, leave existing Google Workspace
      MX/TXT/DKIM records untouched.
- [ ] Enable GitHub Pages (Settings → Pages → Source: GitHub Actions, Custom
      domain: `korit.ai`, then "Enforce HTTPS" once the cert provisions) on
      the `korit-ai/website` repo.
- [ ] Decide who does the Turkish translation (Claude Code first pass +
      native-speaker review, or fully human-written) when that milestone starts.
- [ ] Replace `public/og-image-placeholder.svg` with a real 1200×630 PNG/JPG,
      and `public/favicon.svg` with a designed mark if the placeholder isn't
      good enough.
- [ ] Revisit the `mailto:` contact/portal forms once there's appetite for a
      real backend — see milestone 7 and
      [specs/lead-capture-demo-analytics.md](specs/lead-capture-demo-analytics.md).
