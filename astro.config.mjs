import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://korit.ai',
  integrations: [sitemap()],
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
