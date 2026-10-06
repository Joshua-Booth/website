export const SITE_URL = "https://joshuabooth.nz";
export const NAME = "Joshua Booth";
export const JOB_TITLE = "UI Engineer";
export const EMAIL = "contact@joshuabooth.nz";
export const DESCRIPTION =
  "Joshua Booth is an AI-native frontend engineer in Auckland. He designs and builds products from first concept to live in production.";

export const INTRO = {
  lead: "I'm an AI-native frontend engineer in Auckland.",
  rest: "I design and build products from first concept to live in production.",
} as const;

export const LINKS = {
  linkedin: "https://www.linkedin.com/in/joshua-booth",
  github: "https://github.com/Joshua-Booth",
  repo: "https://github.com/Joshua-Booth/website",
  creact: "https://github.com/Joshua-Booth/creact",
  audioDevotions: "https://github.com/Joshua-Booth/audio-devotions",
  taxCalculator: "https://calculatetax.netlify.app",
  taxCalculatorRepo: "https://github.com/Joshua-Booth/calculate-tax",
} as const;

/** PostHog's project key is public: it only lets a browser send events. */
export const POSTHOG = {
  key: "phc_rHURG59RJETTftYDGQlsIrGmBvASqL1tyAd3onai1Of",
  host: "https://us.i.posthog.com",
  /** Browser events go through this proxy so ad blockers don't drop them. */
  proxyHost: "https://r.joshuabooth.nz",
  uiHost: "https://us.posthog.com",
} as const;
