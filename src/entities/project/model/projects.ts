import type { Study } from "@/shared/config/pages";
import { LINKS } from "@/shared/config/site";
import { dropFullStop } from "@/shared/lib/markdown";

export type Project = {
  name: string;
  meta: string;
  sub: string;
  note?: string;
  code: `https://${string}`;
} & (
  | { app: `https://${string}`; study?: undefined }
  | { app?: undefined; study?: Study }
);

export const PROJECTS: readonly Project[] = [
  {
    name: "This site",
    meta: "open source",
    sub: "The page you're on. Move your pointer over anything to see its x-ray.",
    note: "Source code for joshuabooth.nz",
    code: LINKS.repo,
    study: {
      href: "/writing/this-site",
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

export function projectLine({ name, sub, note, code, app }: Project): string {
  const summary = dropFullStop(note ?? sub);

  return app
    ? `[${name}](${app}): ${summary} ([Code](${code}))`
    : `[${name}](${code}): ${summary}`;
}
