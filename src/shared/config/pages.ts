import type { SiteFlags } from "./flags";

import type { Route } from "next";

import { DESCRIPTION, NAME, SITE_URL } from "./site";

export type PageInfo = {
  description: string;
  note?: string;
  flag?: keyof SiteFlags;
} & (
  | { title: string; label?: undefined }
  | { title?: undefined; label: string }
);

export const PAGES = {
  "/": {
    label: "Home",
    description: DESCRIPTION,
    note: "Work, projects and contact details.",
  },
  "/work/pcos-protocol": {
    title: "PCOS Protocol",
    description:
      "A course app for a nutrition business, designed and built by Joshua Booth as its only developer.",
    flag: "pcosCaseStudy",
  },
  "/writing/this-site": {
    title: "How this site is built",
    description:
      "How joshuabooth.nz is built in Next.js, and how its pages build themselves.",
    flag: "thisSiteCaseStudy",
  },
  "/lab": {
    title: "Lab",
    description:
      "Small interfaces and components Joshua Booth builds to get the details right.",
    flag: "lab",
  },
} as const satisfies Partial<Record<Route, PageInfo>>;

export type PagePath = keyof typeof PAGES;

const isPagePath = (key: string): key is PagePath => key in PAGES;

export const PAGE_PATHS = Object.keys(PAGES).filter(isPagePath);

export interface Study {
  path: PagePath;
  id: string;
  go: string;
}

export function isLive(path: PagePath, flags: SiteFlags): boolean {
  const { flag }: PageInfo = PAGES[path];

  return flag === undefined || flags[flag];
}

export function livePages(flags: SiteFlags): PagePath[] {
  return PAGE_PATHS.filter((path) => isLive(path, flags));
}

export function exportPath(path: PagePath, extension: string): string {
  return path === "/" ? `/index.${extension}` : `${path}.${extension}`;
}

export function mdPath(path: PagePath): string {
  return exportPath(path, "md");
}

export function pageUrl(path: PagePath): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

export function pageHeading(path: PagePath): string {
  const page: PageInfo = PAGES[path];

  return page.title ?? NAME;
}

export function pageListing(path: PagePath): { label: string; note: string } {
  const page: PageInfo = PAGES[path];

  return {
    label: page.title ?? page.label,
    note: page.note ?? page.description,
  };
}
