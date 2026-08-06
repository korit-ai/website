// Google Form lead-capture backend — see kb/project/specs/lead-capture-demo-analytics.md
// Form: "korit.ai — Website Leads", responses linked to a Google Sheet.

export const GOOGLE_FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSePk-mXw1wd2ntwau1p6LhXHl_ZsmtANPSnhtfg1KPbWZR77A/formResponse';

export const FIELD_ENTRIES = {
  inquiryType: 'entry.1021872387',
  name: 'entry.1462807722',
  email: 'entry.897592785',
  company: 'entry.1586722240',
  industry: 'entry.237054301',
  useCase: 'entry.2134887144',
  message: 'entry.725415955',
} as const;

export type LeadField = keyof typeof FIELD_ENTRIES;

export type InquiryType = 'Demo Request' | 'General Contact';

// mode: 'no-cors' means the response is opaque — a resolved promise is the only
// success signal available client-side. Treat "fetch didn't throw" as success and
// let the caller show an optimistic confirmation state, per the spec's tradeoff note.
export async function submitLead(fields: Partial<Record<Exclude<LeadField, 'inquiryType'>, string>>, inquiryType: InquiryType): Promise<void> {
  const body = new URLSearchParams();
  body.set(FIELD_ENTRIES.inquiryType, inquiryType);

  for (const [key, value] of Object.entries(fields)) {
    if (!value) continue;
    body.set(FIELD_ENTRIES[key as Exclude<LeadField, 'inquiryType'>], value);
  }

  await fetch(GOOGLE_FORM_ACTION, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
}
