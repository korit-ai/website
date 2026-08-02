# Lead Capture, Demo CTA, Analytics

**Status:** Ready for implementation
**Target repo:** `korit-ai/website`
**Written:** 2026-08-02
**Supersedes/extends:** `kb/project/implementation-plan.md` milestone 7 (lead capture),
adds two new scoped items not previously in that plan (demo CTA split, analytics).

## Why this pass, and why now

The site is currently Phase 1 (marketing, English-only, `mailto:`-composed forms).
The company's next real milestone is M3 — a demo campaign whose own success metric is
logging every lead through the funnel (lead → demo → verbal interest → signed), and
which budgets $3,000–5,000+ for paid LinkedIn traffic once a demo exists. Two things
about the current site work against that: `mailto:` forms silently fail for anyone
without a configured email client (no captured list), and there's no way to tell a
demo-intent visitor from a general inquiry, or to measure which channel produced either.
This spec closes those three gaps before demo-campaign traffic starts. It does **not**
touch pricing, the customer portal, or the Turkish locale — those stay out of scope,
see Non-goals below.

## Decisions locked

| Decision | Choice |
|---|---|
| Lead capture backend | Google Form (existing Workspace, zero new billing) |
| Demo request vs. general contact | Split into two distinct CTAs / forms, same backend |
| Analytics | Add now, before demo-campaign traffic, not after |

---

## 1. Lead capture backend — Google Form

### Human prerequisite (must happen before Claude Code touches code)

Someone with Workspace access needs to:
1. Create a Google Form ("korit.ai — Website Leads") with the fields listed below.
2. Turn on **response collection into a linked Google Sheet** — this Sheet becomes
   the M3 lead log (leads → demos → verbal interest → signed can be tracked as
   additional columns/status directly in it).
3. Open the form's pre-fill link (⋮ menu → "Get pre-filled link"), fill dummy values
   into every field, generate the link, and pull the `entry.XXXXXXXXX` field IDs out
   of the resulting URL.
4. Hand Claude Code: the form's `formResponse` submission URL
   (`https://docs.google.com/forms/d/e/FORM_ID/formResponse`) and the entry ID for
   each field.

This is a 5-minute manual step — flag it back to the person if it hasn't happened yet
rather than guessing at entry IDs.

### Form fields (single form, both inquiry types)

| Field | Type | Notes |
|---|---|---|
| Inquiry Type | Hidden, fixed value per form instance | `"Demo Request"` or `"General Contact"` — this is what makes one Sheet work as the funnel log |
| Name | Short text | Required |
| Email | Short text | Required |
| Company | Short text | Required for demo requests, optional for general contact |
| Industry / vertical | Dropdown — demo request only | Surveying/Geomatics, Construction, Facility Management, Architecture/Engineering, Other |
| Use case (indoor/outdoor/both) | Dropdown — demo request only | Indoor, Outdoor, Both / not sure |
| Message | Paragraph text | Required for general contact, optional for demo request |

### Technical implementation

Keep the existing custom-styled form UI (don't redirect to Google's own form page —
it breaks the site's visual identity). Submit via `fetch` with `mode: 'no-cors'`
directly to the `formResponse` URL, form-encoding each `entry.XXXXXXXXX` key.
`no-cors` means the response body is unreadable — treat the fetch call itself
(no thrown error) as success and show an optimistic "Thanks, we'll be in touch"
state; there is no way to confirm server-side receipt client-side, which is a known
limitation of this approach and acceptable at this scale.

Extend the existing form component(s) rather than duplicating markup — check current
structure first (a `ContactForm` component and locale-driven copy in `en.json` exist
as of the last KB pass), and mirror that pattern for whatever new demo-request
component is added.

Store the `formResponse` URL and entry-ID mapping in a single config object (e.g.
`src/lib/leadForm.ts` or similar), not scattered across components — both forms
share the same backend and most of the same fields.

Apply this to **both** the main Contact section and the `/en/portal` "notify me"
stub — same backend, `Inquiry Type` distinguishes them (add a third value,
`"Portal Interest"`, for the portal form).

---

## 2. Demo Request CTA — split from general contact

### Rationale

M3's model is specifically *free demos, map-as-deliverable* — not a general "get in
touch." A qualifying demo CTA reads as more credible to an AEC/surveying buyer and
gives free segmentation data (industry, indoor/outdoor) the company doesn't currently
have.

### Where it goes

- **Hero primary CTA**: change (or add a second button) so "Request a Demo" is the
  primary action, not a generic "Contact us." This is the highest-visibility change —
  most visitors won't scroll past the hero.
- **Product section**: add a secondary "Request a Demo" CTA anchor at the end of the
  form-factor / spec content, where purchase-intent visitors are most likely to convert.
- **Contact section**: becomes two clearly separated paths — "Request a Demo"
  (the qualifying form above) as the primary card/panel, "General Inquiry" (name,
  email, message only) as a lighter secondary option below or beside it. Don't bury
  the demo path inside a generic contact form with an "inquiry type" checkbox the
  visitor has to notice — make it two visibly distinct calls to action.

### Copy

Keep it concrete and outcome-focused, not feature-focused — e.g. "See your site
mapped" rather than "Request a demo" alone, if a stronger headline is wanted. Final
copy call is the team's; Claude Code should implement whatever copy is provided in
`en.json`, keeping every string locale-file-driven (no hardcoded English in
components) per the existing i18n convention.

---

## 3. Analytics — lightweight, privacy-respecting

### Recommendation

Use a cookieless, no-consent-banner-required analytics tool, since target markets
include the EU-adjacent region (Turkey/MENA) where cookie-consent overhead is worth
avoiding at this stage. Two reasonable options:

- **GoatCounter** — free, open-source, supports custom event tracking (needed to
  count demo-request submissions as a goal, not just pageviews).
- **Cloudflare Web Analytics** — free, simplest setup (single script tag, no DNS
  proxying required despite the name), but pageview-only on the free tier — no
  custom event tracking for "demo request submitted."

Given the goal is measuring demo-campaign ROI (which channel produces demo requests,
not just traffic), **GoatCounter is the better fit** — default to it unless the team
prefers Cloudflare's simplicity and is fine losing event-level data.

### Human prerequisite

Sign up (free), create a site, get the tracking script snippet / site code. Hand the
snippet to Claude Code.

### Technical implementation

- Add the tracking script to `BaseLayout.astro` (loads site-wide, one place).
- Fire a custom event on successful demo-request submission and on successful
  general-contact submission (two distinct events, not one generic "form submitted"),
  so the funnel is visible in the analytics dashboard alongside the Google Sheet lead
  log.
- No cookie banner needed for either recommended tool, but note this in the spec
  hand-off rather than assuming — confirm current GoatCounter/Cloudflare privacy
  posture at implementation time since vendor policies can change.

---

## Non-goals (explicitly out of scope this pass)

- Pricing or purchase flow — business model (hardware sale vs. SaaS vs. hybrid) isn't
  decided; don't let the site imply one.
- Turkish locale (`tr.json`, `LanguageSwitcher`) — deferred until the regional wedge
  becomes a commercial focus; current M3 lead list is personal-network-driven, not
  organic Turkish search.
- Customer portal build-out — `/en/portal` stays a stub; full `korit-portal` repo is
  future work.
- Favicon / OG image replacement — cosmetic, do this in the same pass as the first
  paid-traffic push, not this one, unless it's trivial to bundle.

## Handoff notes for Claude Code

- This repo's `CLAUDE.md` and `.claude/agents/website-engineer.md` already scope the
  engineering persona for this work — use it.
- Update `kb/project/implementation-plan.md`'s milestone/open-items list once this
  ships (mark milestone 7 done, remove the now-resolved `mailto:` open item, add the
  analytics addition to the decision log) and `kb/project/content-inventory.md` to
  reflect the new demo-request section/component.
- Normal branch → commit → PR flow per `korit-meta`'s git-and-pr-conventions.

## Open items requiring a human action before implementation starts

- [ ] Create the Google Form + linked Sheet, pull entry IDs, hand off the
      `formResponse` URL and field mapping.
- [ ] Sign up for GoatCounter (or confirm Cloudflare Web Analytics is preferred
      instead), hand off the tracking snippet.
- [ ] Approve or edit the demo-CTA copy direction above before it goes into `en.json`.
