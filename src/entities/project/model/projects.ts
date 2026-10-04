import type { Study } from "@/shared/config/pages";
import { LINKS } from "@/shared/config/site";
import { dropFullStop } from "@/shared/lib/markdown";

export interface Project {
  name: string;
  meta: string;
  sub: string;
  plain?: string;
  code: `https://${string}`;
  app?: `https://${string}`;
  study?: Study;
}

export const PROJECTS: readonly Project[] = [
  {
    name: "This site",
    meta: "open source",
    sub: "The page you're on. Move your pointer over anything to see its x-ray.",
    plain: "Source code for joshuabooth.nz",
    code: LINKS.repo,
    study: {
      path: "/writing/this-site",
      id: "this-site",
      go: "How it's built",
    },
  },
  {
    name: "Tax Calculator",
    meta: "web app",
    sub: "Works out your New Zealand take-home pay after tax, ACC, KiwiSaver and student loan.",
    code: LINKS.taxCalculatorRepo,
    app: LINKS.taxCalculator,
  },
  {
    name: "creact",
    meta: "open source",
    sub: "A project template for React web apps, with the testing and coding agent setup already done.",
    code: LINKS.creact,
  },
  {
    name: "Audio Devotions",
    meta: "web app",
    sub: "Daily audio devotional web app designed for people with reduced vision.",
    code: LINKS.audioDevotions,
  },
];

export function projectLine({ name, sub, plain, code, app }: Project): string {
  const note = dropFullStop(plain ?? sub);

  return app
    ? `[${name}](${app}): ${note} ([Code](${code}))`
    : `[${name}](${code}): ${note}`;
}
