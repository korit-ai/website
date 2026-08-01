import en from '../content/en.json';

// Add `tr` here once src/content/tr.json exists — see kb/project/implementation-plan.md
const content = { en } as const;

export type Locale = keyof typeof content;

export function getContent(locale: Locale) {
  return content[locale];
}
