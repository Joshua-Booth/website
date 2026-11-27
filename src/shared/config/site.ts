export const SITE_URL = "https://joshuabooth.nz";
export const NAME = "Joshua Booth";
export const EMAIL = "contact@joshuabooth.nz";
export const DESCRIPTION =
  "Joshua Booth is an AI-native frontend lead in Auckland. He designs and builds products from first concept to live in production.";

/**
 * How the redesign introduces Josh. The live site keeps DESCRIPTION and
 * INTRO until the redesign flag is on.
 */
export const DESIGN_ENGINEER = {
  role: "Design engineer, Auckland",
  line: "I design and build interfaces.",
  jobTitle: "Design engineer",
  description:
    "Joshua Booth is a design engineer in Auckland. He designs and builds interfaces.",
} as const;

export function siteDescription(redesign: boolean): string {
  return redesign ? DESIGN_ENGINEER.description : DESCRIPTION;
}

export const LOCALE = { lang: "en-NZ", og: "en_NZ" } as const;

export const INTRO = {
  lead: "I'm an AI-native frontend lead in Auckland.",
  rest: "I design and build products from first concept to live in production.",
} as const;

export const LINKS = {
  linkedin: "https://www.linkedin.com/in/joshua-booth",
  github: "https://github.com/Joshua-Booth",
  repo: "https://github.com/Joshua-Booth/website",
  creact: "https://github.com/Joshua-Booth/creact",
  creactNpm: "https://www.npmjs.com/package/create-creact",
  recipesSite: "https://jb-recipes.netlify.app",
  recipesApp: "https://jb-recipes-app.netlify.app",
  equippedYouth: "https://realiveyouth.netlify.app",
  equippedYouthRepo: "https://github.com/Joshua-Booth/realiveyouth",
  audioDevotions: "https://github.com/Joshua-Booth/audio-devotions",
  audioDevotionsApp: "https://audiodevotions.netlify.app",
  taxCalculator: "https://calculatetax.netlify.app",
  taxCalculatorRepo: "https://github.com/Joshua-Booth/calculate-tax",
  twoTicks: "https://twoticks.netlify.app",
} as const;

/** PostHog's project key is public: it only lets a browser send events. */
export const POSTHOG = {
  key: "phc_rHURG59RJETTftYDGQlsIrGmBvASqL1tyAd3onai1Of",
  host: "https://us.i.posthog.com",
  /** Browser events go through this proxy so ad blockers don't drop them. */
  proxyHost: "https://r.joshuabooth.nz",
  uiHost: "https://us.posthog.com",
} as const;
