// GoatCounter analytics — see kb/project/specs/lead-capture-demo-analytics.md
// Cookieless, no consent banner needed (confirm GoatCounter's current privacy
// posture at go-live time — the spec flags vendor policy as worth re-checking).
//
// TODO: GOATCOUNTER_SITE is a placeholder. Replace once the human prerequisite in
// that spec is done: sign up at goatcounter.com, create a site, use its site code.

export const GOATCOUNTER_SITE = 'YOUR_SITE_CODE';

export const GOATCOUNTER_ENDPOINT = `https://${GOATCOUNTER_SITE}.goatcounter.com/count`;

interface GoatCounterGlobal {
  count: (opts: { path: string; event?: boolean }) => void;
}

// Fires a custom event (e.g. "demo_request_submitted") distinct from pageviews,
// so the lead funnel is visible in the GoatCounter dashboard. No-op if the
// tracking script hasn't loaded (ad blockers, or the placeholder site code above).
export function trackEvent(name: string): void {
  const goatcounter = (window as typeof window & { goatcounter?: GoatCounterGlobal }).goatcounter;
  goatcounter?.count({ path: name, event: true });
}
