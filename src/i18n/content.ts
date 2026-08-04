import en from '../data/en.json';
import tr from '../data/tr.json';

const content = { en, tr } as const;

export type Locale = keyof typeof content;

export const locales = Object.keys(content) as Locale[];

export function getContent(locale: Locale) {
  return content[locale];
}
