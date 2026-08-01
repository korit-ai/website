# Stack

- **Framework:** [Astro](https://astro.build), static output (`output: 'static'`
  is the default — no adapter configured).
- **i18n:** `astro:i18n`, `defaultLocale: 'en'`, `prefixDefaultLocale: true`.
  Only `en` is registered in `astro.config.mjs` today; `/` static-redirects
  to `/en/` via the `redirects` config key.
- **Styling:** plain CSS. Cross-cutting tokens/reset/typography in
  `src/styles/global.css`; everything else is scoped `<style>` blocks inside
  each `.astro` component.
- **Content:** `src/content/{locale}.json` + `src/i18n/content.ts`
  (`getContent(locale)`). Components never hardcode copy — see
  `content-inventory.md`.
- **Forms:** no backend. Contact and portal notify-me forms compose a
  `mailto:` link client-side on submit (`ContactForm.astro`, `en/portal.astro`)
  — see the Decisions table in `implementation-plan.md` for the trade-off and
  when to revisit it.
- **Sitemap:** `@astrojs/sitemap`, generated at build time from `site:` in
  `astro.config.mjs`.
- **Hosting:** GitHub Pages, custom domain `korit.ai` via `public/CNAME`.
- **CI/CD:** `.github/workflows/deploy.yml` — push to `main` → `npm ci` →
  `npm run build` → `actions/deploy-pages`. Requires GitHub Pages source set
  to "GitHub Actions" in repo settings (not yet done — see Open Items in
  `implementation-plan.md`).

Full rationale and the phased rollout are in
[implementation-plan.md](implementation-plan.md).
