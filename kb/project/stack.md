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
- **Forms:** Google Form backend ("korit.ai — Website Leads", linked to a
  Sheet), POSTed to with `fetch(..., {mode:'no-cors'})`. Config
  (`formResponse` URL, `entry.*` field IDs) lives in one place,
  `src/lib/leadForm.ts` — real values, live and verified 2026-08-02. Three
  forms share it: `DemoRequestForm.astro` ("Request a Demo"),
  `ContactForm.astro` ("General Inquiry"), and the `/en/portal` notify-me
  form — each tags its submission with a distinct `Inquiry Type` value. Note:
  a newly created Google Form isn't live until explicitly **Published**
  (separate from turning on response collection) — an unpublished form 401s
  on submission.
- **Analytics:** GoatCounter (`korit.goatcounter.com`), cookieless/no consent
  banner. Script tag in `BaseLayout.astro`, custom events fired per form via
  `src/lib/analytics.ts`'s `trackEvent()`. Live and verified.
- **Sitemap:** `@astrojs/sitemap`, generated at build time from `site:` in
  `astro.config.mjs`.
- **Hosting:** GitHub Pages, custom domain `korit.ai` via `public/CNAME`.
- **CI/CD:** `.github/workflows/deploy.yml` — push to `main` → `npm ci` →
  `npm run build` → `actions/deploy-pages`. Pages source is set to "GitHub
  Actions" in repo settings, confirmed via `GET /repos/korit-ai/website/pages`
  (`build_type: "workflow"`) — verified 2026-08-14. Note: the automatic
  push-triggered `deploy` job has twice (2026-08-07, 2026-08-09) hung
  indefinitely in `queued` with no runner ever assigned and no deployment
  status emitted, despite the `build` job in the same run completing fine —
  no environment protection rule, pending-review gate, or Actions
  permission issue was found in either case. A manual re-run via
  `workflow_dispatch` (Actions tab → "Run workflow", or Actions →
  cancel the stuck run first) has resolved it both times. If a push to
  `main` doesn't go live within a few minutes, check the Actions tab for a
  `deploy` job stuck in `queued` before assuming the build itself failed.

Full rationale and the phased rollout are in
[implementation-plan.md](implementation-plan.md).
