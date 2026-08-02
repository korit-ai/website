// Google Form lead-capture backend — see kb/project/specs/lead-capture-demo-analytics.md
//
// TODO: GOOGLE_FORM_ACTION and FIELD_ENTRIES are placeholders. Replace once the human
// prerequisite in that spec is done: create the Google Form + linked Sheet, open its
// pre-fill link, and pull the real `entry.XXXXXXXXX` field IDs out of the URL.

export const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';

export const FIELD_ENTRIES = {
  inquiryType: 'entry.100000001',
  name: 'entry.100000002',
  email: 'entry.100000003',
  company: 'entry.100000004',
  industry: 'entry.100000005',
  useCase: 'entry.100000006',
  message: 'entry.100000007',
} as const;

export type LeadField = keyof typeof FIELD_ENTRIES;

export type InquiryType = 'Demo Request' | 'General Contact' | 'Portal Interest';

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
