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

export function flagsWhere(isOn: (key: string) => boolean): SiteFlags {
  return {
    lab: isOn(FLAG_KEYS.lab),
    pcosCaseStudy: isOn(FLAG_KEYS.pcosCaseStudy),
    thisSiteCaseStudy: isOn(FLAG_KEYS.thisSiteCaseStudy),
  };
}

const isFlag = (key: string): key is keyof SiteFlags => key in FLAG_KEYS;

/**
 * The `SITE_FLAGS` value that turns on exactly these flags.
 */
export function siteFlagsValue(flags: SiteFlags) {
  const on = Object.entries(FLAG_KEYS).flatMap(([key, name]) =>
    isFlag(key) && flags[key] ? [name] : []
  );

  return on.length > 0 ? on.join(",") : "none";
}

export const ALL_ON = flagsWhere(() => true);
export const ALL_OFF = flagsWhere(() => false);
