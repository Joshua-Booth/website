import { afterEach, describe, expect, it, vi } from "vitest";

import { ALL_OFF, ALL_ON, siteFlagsValue } from "@/shared/config/flags";

import { flagsOverride, getSiteFlags } from "./site-flags";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function postHogReturns(body: unknown, status = 200) {
  vi.stubEnv("SITE_FLAGS", "");

  vi.stubGlobal(
    "fetch",
    vi.fn<typeof fetch>(async () => Response.json(body, { status }))
  );
}

describe("flagsOverride", () => {
  it("asks PostHog when unset or empty", () => {
    // eslint-disable-next-line unicorn/no-useless-undefined -- undefined removes it
    vi.stubEnv("SITE_FLAGS", undefined);

    expect(flagsOverride()).toBeNull();
    expect(flagsOverride("")).toBeNull();
    expect(flagsOverride("  ")).toBeNull();
  });

  it("turns everything on or off", () => {
    expect(flagsOverride("all")).toEqual(ALL_ON);
    expect(flagsOverride("none")).toEqual(ALL_OFF);
  });

  it("turns on only the parts listed", () => {
    expect(flagsOverride("lab")).toEqual({ ...ALL_OFF, lab: true });

    expect(flagsOverride("pcos-case-study, lab")).toEqual({
      ...ALL_OFF,
      lab: true,
      pcosCaseStudy: true,
    });

    expect(flagsOverride("this-site-case-study")).toEqual({
      ...ALL_OFF,
      thisSiteCaseStudy: true,
    });
  });

  it("throws on a flag it doesn't know, naming it", () => {
    expect(() => flagsOverride("labs, pcos-case-study")).toThrow(
      "SITE_FLAGS names unknown flags: labs."
    );
  });

  it("ignores empty entries", () => {
    expect(flagsOverride("lab, ")).toEqual({ ...ALL_OFF, lab: true });
  });
});

describe("siteFlagsValue", () => {
  it("names the PostHog keys that are on", () => {
    expect(siteFlagsValue({ ...ALL_OFF, lab: true, pcosCaseStudy: true })).toBe(
      "lab,pcos-case-study"
    );

    expect(siteFlagsValue(ALL_OFF)).toBe("none");
  });

  it.each([ALL_ON, ALL_OFF, { ...ALL_OFF, thisSiteCaseStudy: true }])(
    "passes %j through SITE_FLAGS unchanged",
    (flags) => {
      expect(flagsOverride(siteFlagsValue(flags))).toEqual(flags);
    }
  );
});

describe("getSiteFlags", () => {
  it("turns on the flags PostHog has on, and leaves the rest off", async () => {
    postHogReturns({
      flags: {
        lab: { enabled: true },
        "pcos-case-study": { enabled: false },
      },
    });

    await expect(getSiteFlags()).resolves.toEqual({ ...ALL_OFF, lab: true });
  });

  it("treats a flag PostHog leaves out as off, as it leaves out flags that are off", async () => {
    postHogReturns({ errorsWhileComputingFlags: false, flags: {} });

    await expect(getSiteFlags()).resolves.toEqual(ALL_OFF);
  });

  it.each([
    [{}, "no answer"],
    [[], "no answer"],
    [{ flags: "lab" }, "no answer"],
    [{ flags: [] }, "no answer"],
    [{ flags: { lab: true } }, "lab flag can't be read"],
    [{ flags: { lab: { enabled: "true" } } }, "lab flag can't be read"],
    [{ flags: {}, errorsWhileComputingFlags: true }, "had errors"],
    [{ flags: {}, quotaLimited: ["feature_flags"] }, "quota is used up"],
  ])("throws on an answer it can't trust (%j)", async (body, message) => {
    postHogReturns(body);

    await expect(getSiteFlags()).rejects.toThrow(message);
  });

  it("throws when PostHog fails, so the last good page stays up", async () => {
    postHogReturns({ error: "down" }, 500);

    await expect(getSiteFlags()).rejects.toThrow("500");

    postHogReturns(null);

    await expect(getSiteFlags()).rejects.toThrow("no answer");
  });

  it("uses SITE_FLAGS without asking PostHog", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>();

    vi.stubEnv("SITE_FLAGS", "all");
    vi.stubGlobal("fetch", fetch);

    await expect(getSiteFlags()).resolves.toEqual(ALL_ON);
    expect(fetch).not.toHaveBeenCalled();
  });
});
