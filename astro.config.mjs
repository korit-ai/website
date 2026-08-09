import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://korit.ai',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'tr',
        locales: { tr: 'tr', en: 'en' },
      },
      // The /demo/ pages are ad-campaign landing pages, not organic content —
      // keep them out of the sitemap (paired with a noindex meta tag on the
      // pages themselves) so they don't compete with the main page for search.
      filter: (page) => !page.includes('/demo'),
    }),
  ],
  redirects: {
    '/': '/tr/',
  },
  i18n: {
    defaultLocale: 'tr',
    locales: ['en', 'tr'],
    routing: {
      prefixDefaultLocale: true,
      // We handle "/" -> "/tr/" ourselves via the `redirects` key above,
      // so Astro's own automatic index redirect is turned off to avoid
      // both mechanisms fighting over the same route.
      redirectToDefaultLocale: false,
    },
  },
});
