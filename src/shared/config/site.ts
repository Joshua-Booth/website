export const SITE_URL = "https://joshuabooth.nz";
export const NAME = "Joshua Booth";
export const EMAIL = "contact@joshuabooth.nz";
export const DESCRIPTION =
  "Joshua Booth is a design engineer in Auckland. He designs and builds interfaces.";

/** How the home page introduces Josh. */
export const INTRO = {
  role: "Design engineer, Auckland",
  line: "I design and build interfaces.",
  jobTitle: "Design engineer",
} as const;

export const LOCALE = { lang: "en-NZ", og: "en_NZ" } as const;

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
  priceFinderRepo: "https://github.com/Joshua-Booth/price-finder",
  docxDiaryRepo: "https://github.com/Joshua-Booth/docx-diary",
  textCryptographyRepo: "https://github.com/Joshua-Booth/text-cryptography",
  justDriveRepo: "https://github.com/Joshua-Booth/just-drive",
  extremePongRepo: "https://github.com/Joshua-Booth/extreme-pong",
} as const;

/** PostHog's project key is public: it only lets a browser send events. */
export const POSTHOG = {
  key: "phc_rHURG59RJETTftYDGQlsIrGmBvASqL1tyAd3onai1Of",
  host: "https://us.i.posthog.com",
  /** Browser events go through this proxy so ad blockers don't drop them. */
  proxyHost: "https://r.joshuabooth.nz",
  uiHost: "https://us.posthog.com",
} as const;
