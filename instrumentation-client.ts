import { POSTHOG, SITE_URL } from "@/shared/config/site";

// Started once the browser is idle, so PostHog's script stays off the critical
// path. Only the live site starts it, so local builds, audits and deploy
// previews send no events.
// Page views on client-side navigation come from the history tracking in
// PostHog's `defaults`

async function startPostHog() {
  const { default: posthog } = await import("posthog-js");

  posthog.init(POSTHOG.key, {
    api_host: POSTHOG.proxyHost,
    ui_host: POSTHOG.uiHost,
    defaults: "2026-01-30",
    person_profiles: "always",
    // Flags are decided on the server when a page renders, so the browser
    // doesn't ask for them again on every view
    advanced_disable_feature_flags: true,
  });
}

if (location.hostname === new URL(SITE_URL).hostname) {
  const start = () => void startPostHog();

  if ("requestIdleCallback" in window) requestIdleCallback(start);
  else setTimeout(start, 1500);
}
