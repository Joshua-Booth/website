import { LINKS } from "@/shared/config/site";

/** What a project is, for the Projects page's filter. */
export type ProjectKind = "apps" | "designs" | "games" | "tools";

export interface ShowcaseLink {
  label: string;
  href: string;
}

interface Picture {
  /** A capture of the project on its mat, from the Figma Projects page. */
  src: `/projects/${string}.webp`;
  width: number;
  height: number;
  alt: string;
}

/** A project with room to say what it is and where to see it. */
export interface BigProject {
  name: string;
  kind: ProjectKind;
  /** A word or two beside the name, such as "Open source". */
  tag?: string;
  about: string;
  links: readonly ShowcaseLink[];
  picture: Picture;
  wide?: boolean;
}

/** Earlier work, shown as a picture and a line. */
export interface SmallProject {
  name: string;
  kind: ProjectKind;
  when: string;
  what: string;
  /** Its code on GitHub, until small tiles get their own write-ups. */
  code?: string;
  picture: Picture;
}

const big = (slug: string, alt: string, wide = false): Picture => ({
  src: `/projects/${slug}.webp`,
  width: wide ? 1578 : 756,
  height: 568,
  alt,
});

const small = (slug: string, alt: string): Picture => ({
  src: `/projects/${slug}.webp`,
  width: 570,
  height: 460,
  alt,
});

const OPEN_SOURCE = "Open source";

export const BIG_PROJECTS: readonly BigProject[] = [
  {
    name: "creact",
    kind: "tools",
    tag: OPEN_SOURCE,
    about:
      "A React app template, and a CLI that starts a new app from it with linting, tests, git hooks and the coding-agent setup already in place.",
    links: [
      { label: "View on npm", href: LINKS.creactNpm },
      { label: "View the code", href: LINKS.creact },
    ],
    picture: big(
      "creact",
      "A terminal running pnpm create creact my-app, which sets up the app, installs it and restores the agent skills."
    ),
  },
  {
    name: "Recipes",
    kind: "apps",
    about:
      "A recipe app for browsing by course, searching, and adding your own recipes.",
    links: [
      { label: "Visit the site", href: LINKS.recipesSite },
      { label: "Try the demo", href: LINKS.recipesApp },
    ],
    picture: big("recipes", "The Recipes app on a phone, showing desserts."),
  },
  {
    name: "Tax Calculator",
    kind: "apps",
    tag: OPEN_SOURCE,
    about:
      "Works out your New Zealand take-home pay after tax, ACC, KiwiSaver and student loan.",
    links: [
      { label: "Open the app", href: LINKS.taxCalculator },
      { label: "View the code", href: LINKS.taxCalculatorRepo },
    ],
    picture: big(
      "tax-calculator",
      "The Tax Calculator on a laptop and a phone, showing a take-home pay of $65,585."
    ),
  },
  {
    name: "PCOS Protocol",
    kind: "apps",
    tag: "2020 to 2021",
    about:
      "A nutrition course app, with daily lessons, a knowledge base and recipes. I built it at The PCOS Nutritionist. Shown with made-up content.",
    links: [],
    picture: big(
      "pcos-protocol",
      "PCOS Protocol's daily lesson on a laptop, and its recipes on a phone."
    ),
  },
  {
    name: "Audio Devotions",
    kind: "apps",
    tag: OPEN_SOURCE,
    about:
      "A daily audio devotional for people with reduced vision, with big controls and a high contrast mode.",
    links: [
      { label: "Open the app", href: LINKS.audioDevotionsApp },
      { label: "View the code", href: LINKS.audioDevotions },
    ],
    picture: big(
      "audio-devotions",
      "Audio Devotions on two tablets, in its dark and light high contrast modes, with large Stop, Pause and Next buttons."
    ),
  },
  {
    name: "Equipped Youth Manual",
    kind: "apps",
    tag: OPEN_SOURCE,
    about:
      "An app for Realive Youth members to share and deepen their faith. I led the team of five that built it in 2019.",
    links: [
      { label: "Open the app", href: LINKS.equippedYouth },
      { label: "View the code", href: LINKS.equippedYouthRepo },
    ],
    picture: big(
      "equipped-youth",
      "The Equipped Youth Manual on a phone, showing a featured video."
    ),
  },
  {
    name: "Two Ticks",
    kind: "apps",
    about:
      "A visual explainer of how split votes created overhang seats in New Zealand's 2026 election.",
    links: [{ label: "Open the app", href: LINKS.twoTicks }],
    picture: big(
      "two-ticks",
      "Two Ticks' chart of the House after the 2026 election: 130 seats, 66 to govern."
    ),
  },
];

const APP_DESIGN = "App design";
const PYTHON_CLI = "Python CLI";

export const SMALL_PROJECTS: readonly SmallProject[] = [
  {
    name: "joshuabooth.nz",
    kind: "designs",
    when: "Since 2018",
    what: "Website",
    code: LINKS.repo,
    picture: small(
      "this-site",
      "Seven versions of this site stacked, oldest at the back."
    ),
  },
  {
    name: "VPN subscription",
    kind: "designs",
    when: "2022",
    what: APP_DESIGN,
    picture: small("vpn", "A VPN app's plan and payment screen."),
  },
  {
    name: "Workout tracker",
    kind: "designs",
    when: "2021",
    what: APP_DESIGN,
    picture: small("workout", "Two screens of a workout tracking app."),
  },
  {
    name: "News Brief",
    kind: "designs",
    when: "2021",
    what: APP_DESIGN,
    picture: small("news-brief", "A news app's home screen."),
  },
  {
    name: "Notes",
    kind: "designs",
    when: "2021",
    what: APP_DESIGN,
    picture: small("notes", "A notes app's list of notes."),
  },
  {
    name: "Music app",
    kind: "designs",
    when: "2020",
    what: APP_DESIGN,
    picture: small("music", "A music player screen."),
  },
  {
    name: "Coffee shop",
    kind: "designs",
    when: "2020",
    what: APP_DESIGN,
    picture: small("coffee", "A coffee shop app's home screen."),
  },
  {
    name: "Chat app",
    kind: "designs",
    when: "2020",
    what: APP_DESIGN,
    picture: small("chat", "A chat app's list of chats and a conversation."),
  },
  {
    name: "Checkout",
    kind: "designs",
    when: "2020",
    what: APP_DESIGN,
    picture: small("checkout", "A card checkout screen with a $24.99 total."),
  },
  {
    name: "Social profile",
    kind: "designs",
    when: "2020",
    what: APP_DESIGN,
    picture: small("social", "A social app's profile and settings screens."),
  },
  {
    name: "Timer",
    kind: "designs",
    when: "2020",
    what: APP_DESIGN,
    picture: small("timer", "A timer app counting down."),
  },
  {
    name: "Just Drive",
    kind: "games",
    when: "2019",
    what: "Unity game",
    code: LINKS.justDriveRepo,
    picture: small("just-drive", "A sports car driving down a city street."),
  },
  {
    name: "Tech shop",
    kind: "designs",
    when: "2019",
    what: APP_DESIGN,
    picture: small("tech-shop", "A shop app's headphones page and cart."),
  },
  {
    name: "Extreme Pong",
    kind: "games",
    when: "2019",
    what: "Unity game, team project",
    code: LINKS.extremePongRepo,
    picture: small("extreme-pong", "A game of Pong with a high score."),
  },
  {
    name: "price-finder",
    kind: "tools",
    when: "2019",
    what: PYTHON_CLI,
    code: LINKS.priceFinderRepo,
    picture: small(
      "price-finder",
      "A terminal listing the three best prices found for AirPods."
    ),
  },
  {
    name: "docx-diary",
    kind: "tools",
    when: "2018",
    what: PYTHON_CLI,
    code: LINKS.docxDiaryRepo,
    picture: small(
      "docx-diary",
      "A terminal writing a diary entry and listing the diary's Word files."
    ),
  },
  {
    name: "text-cryptography",
    kind: "tools",
    when: "2018",
    what: PYTHON_CLI,
    code: LINKS.textCryptographyRepo,
    picture: small(
      "text-cryptography",
      "A terminal encrypting a file with a Caesar cipher."
    ),
  },
  {
    name: "Virtual World",
    kind: "apps",
    when: "2017",
    what: "Python app",
    picture: small(
      "virtual-world",
      "Virtual World's login window and its coffee shop menu."
    ),
  },
];

export const KIND_LABELS: Record<"all" | ProjectKind, string> = {
  all: "All",
  apps: "Apps",
  designs: "Designs",
  games: "Games",
  tools: "Tools",
};

export function showcaseLine(project: BigProject | SmallProject): string {
  if ("links" in project) {
    const links = project.links
      .map(({ label, href }) => `[${label}](${href})`)
      .join(", ");

    return `**${project.name}**: ${project.about}${links ? ` ${links}.` : ""}`;
  }

  const code =
    project.code === undefined ? "" : ` [View the code](${project.code}).`;

  return `**${project.name}** (${project.when}): ${project.what}.${code}`;
}
