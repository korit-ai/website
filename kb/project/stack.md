# Stack

- **Framework:** [Astro](https://astro.build), static output (`output: 'static'`
  is the default — no adapter configured).
- **i18n:** `astro:i18n`, `defaultLocale: 'en'`, `prefixDefaultLocale: true`.
  Only `en` is registered in `astro.config.mjs` today; `/` static-redirects
  to `/en/` via the `redirects` config key.
- **Styling:** plain CSS. Cross-cutting tokens/reset/typography in
  `src/styles/global.css`; everything else is scoped `<style>` blocks inside
  each `.astro` component.
- **Content:** `src/data/{locale}.json` (deliberately not `src/content/` —
  that name is reserved for Astro's Content Collections API and triggers a
  build warning if reused for plain data) + `src/i18n/content.ts`
  (`getContent(locale)`). Components never hardcode copy — see
  `content-inventory.md`.
- **Forms:** Google Form backend, POSTed to with `fetch(..., {mode:'no-cors'})`.
  Config (`formResponse` URL, `entry.*` field IDs) lives in one place,
  `src/lib/leadForm.ts`, currently placeholder values — see Open Items in
  `implementation-plan.md`. Three forms share it: `DemoRequestForm.astro`
  ("Request a Demo"), `ContactForm.astro` ("General Inquiry"), and the
  `/en/portal` notify-me form — each tags its submission with a distinct
  `Inquiry Type` value.
- **Analytics:** GoatCounter, cookieless/no consent banner. Script tag in
  `BaseLayout.astro`, custom events fired per form via `src/lib/analytics.ts`'s
  `trackEvent()`. Site code is a placeholder — see Open Items.
- **Sitemap:** `@astrojs/sitemap`, generated at build time from `site:` in
  `astro.config.mjs`.
- **Hosting:** GitHub Pages, custom domain `korit.ai` via `public/CNAME`.
- **CI/CD:** `.github/workflows/deploy.yml` — push to `main` → `npm ci` →
  `npm run build` → `actions/deploy-pages`. Requires GitHub Pages source set
  to "GitHub Actions" in repo settings (not yet done — see Open Items in
  `implementation-plan.md`).

Full rationale and the phased rollout are in
[implementation-plan.md](implementation-plan.md).
