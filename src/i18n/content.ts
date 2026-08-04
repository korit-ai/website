import en from '../data/en.json';
import tr from '../data/tr.json';

// tr first: it's the default locale (see astro.config.mjs) — order here
// drives display order in LanguageSwitcher and the hreflang link list.
const content = { tr, en } as const;

export type Locale = keyof typeof content;

export const locales = Object.keys(content) as Locale[];

export function getContent(locale: Locale) {
  return content[locale];
}
