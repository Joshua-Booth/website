import { describe, expect, it } from "vitest";

import type { SiteFlags } from "@/shared/config/flags";
import { ALL_OFF, ALL_ON } from "@/shared/config/flags";
import { mdPath, PAGE_PATHS } from "@/shared/config/pages";
import { SITE_URL } from "@/shared/config/site";

import { llmsTxt } from "./llms-txt";
import { pageMarkdown } from "./pages";

async function serves(url: string, flags: SiteFlags): Promise<boolean> {
  const path = url.slice(SITE_URL.length);

  if (path === "/llms-full.txt") {
    const route = await import("../../../app/llms-full.txt/route");

    return typeof route.GET === "function";
  }

  const page = PAGE_PATHS.find((p) => mdPath(p) === path);

  return page !== undefined && Boolean(await pageMarkdown(page, flags));
}

const section = (text: string, heading: string) =>
  text.split(`\n## ${heading}\n\n`)[1]?.split("\n\n")[0];

describe("llmsTxt", () => {
  it("is the exact text with every flag off", () => {
    expect(llmsTxt(ALL_OFF)).toBe(`# Joshua Booth

> Joshua Booth is an AI-native frontend engineer in Auckland. He designs and builds products from first concept to live in production.

Work:

- UI Engineer at Solve Data, 2021 to now
- Frontend Engineer at stuff.co.nz, 2021
- Full Stack Developer at The PCOS Nutritionist, 2020 to 2021

Email: [contact@joshuabooth.nz](mailto:contact@joshuabooth.nz)

## Pages

- [Home](https://joshuabooth.nz/index.md): Work, projects and contact details

## Projects

- [This site](https://github.com/Joshua-Booth/website): Source code for joshuabooth.nz
- [Tax Calculator](https://calculatetax.netlify.app): Works out your New Zealand take-home pay after tax, ACC, KiwiSaver and student loan ([Code](https://github.com/Joshua-Booth/calculate-tax))
- [creact](https://github.com/Joshua-Booth/creact): A project template for React web apps, with the testing and coding agent setup already done
- [Audio Devotions](https://github.com/Joshua-Booth/audio-devotions): Daily audio devotional web app designed for people with reduced vision

## Optional

- [GitHub](https://github.com/Joshua-Booth): Open-source work
- [LinkedIn](https://www.linkedin.com/in/joshua-booth): Professional profile
- [Full site](https://joshuabooth.nz/llms-full.txt): Every page in one file
`);
  });

  it("lists every page in list order with every flag on", () => {
    expect(section(llmsTxt(ALL_ON), "Pages")).toBe(
      [
        "- [Home](https://joshuabooth.nz/index.md): Work, projects and contact details",
        "- [PCOS Protocol](https://joshuabooth.nz/work/pcos-protocol.md): A course app for a nutrition business, designed and built by Joshua Booth as its only developer",
        "- [How this site is built](https://joshuabooth.nz/writing/this-site.md): How joshuabooth.nz is built in Next.js, and how its pages build themselves",
        "- [Lab](https://joshuabooth.nz/lab.md): Small interfaces and components Joshua Booth builds to get the details right",
      ].join("\n")
    );
  });

  it.each([
    ["off", ALL_OFF],
    ["on", ALL_ON],
  ])(
    "links only to joshuabooth.nz URLs that serve something, with flags %s",
    async (_, flags) => {
      const urls =
        llmsTxt(flags).match(/https:\/\/joshuabooth\.nz[^\s)]*/g) ?? [];

      const served = await Promise.all(
        urls.map(async (url) => ({ url, serves: await serves(url, flags) }))
      );

      expect(urls.length).toBeGreaterThan(0);
      expect(served.filter((link) => !link.serves)).toEqual([]);
    }
  );

  it("ends no note with a full stop", () => {
    const notes = llmsTxt(ALL_ON).match(/^- \[.*?\]\(.*?\): .*$/gm);

    expect(notes?.length).toBe(11);
    expect(notes?.filter((line) => line.endsWith("."))).toEqual([]);
  });
});
