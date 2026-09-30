import { afterEach, describe, expect, it, vi } from "vitest";

import { ALL_OFF, ALL_ON } from "@/shared/config/flags";

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

  it.each([{}, [], { flags: "lab" }, { flags: { lab: true } }])(
    "treats an answer it can't read (%j) as everything off",
    async (body) => {
      postHogReturns(body);

      await expect(getSiteFlags()).resolves.toEqual(ALL_OFF);
    }
  );

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
