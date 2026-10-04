export interface SiteFlags {
  lab: boolean;
  pcosCaseStudy: boolean;
  thisSiteCaseStudy: boolean;
}

/**
 * The flag keys in PostHog. Each is a plain on/off flag released to everyone,
 * since every visitor gets the same page.
 */
export const FLAG_KEYS = {
  lab: "lab",
  pcosCaseStudy: "pcos-case-study",
  thisSiteCaseStudy: "this-site-case-study",
} as const satisfies Record<keyof SiteFlags, string>;

/**
 * Pages that only exist while their flag is on. While it's off, a page is left
 * out of the sitemap and answers with a 404.
 */
export const FLAGGED_PAGES: readonly {
  flag: keyof SiteFlags;
  path: string;
}[] = [
  { flag: "pcosCaseStudy", path: "/work/pcos-protocol" },
  { flag: "lab", path: "/lab" },
  { flag: "thisSiteCaseStudy", path: "/writing/this-site" },
];

export function flagsWhere(isOn: (key: string) => boolean): SiteFlags {
  return {
    lab: isOn(FLAG_KEYS.lab),
    pcosCaseStudy: isOn(FLAG_KEYS.pcosCaseStudy),
    thisSiteCaseStudy: isOn(FLAG_KEYS.thisSiteCaseStudy),
  };
}

export const ALL_ON = flagsWhere(() => true);
export const ALL_OFF = flagsWhere(() => false);
