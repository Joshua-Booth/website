import { existsSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PROJECTS } from "@/entities/project/model/projects";

import { ALL_OFF, ALL_ON } from "@/shared/config/flags";
import { PAGE_PATHS } from "@/shared/config/pages";
import { SITE_URL } from "@/shared/config/site";

import { llmsTxt } from "./llms-txt";

afterEach(() => {
  vi.unstubAllEnvs();
});

interface RouteModule {
  GET: () => Response | Promise<Response>;
}

async function serves(url: string): Promise<boolean> {
  const route = new URL(
    `../../../app${url.slice(SITE_URL.length)}/route.ts`,
    import.meta.url
  );

  if (!existsSync(route)) return false;

  const { GET }: RouteModule = await import(/* @vite-ignore */ route.href);
  const res = await GET();

  return res.ok && (await res.text()).length > 0;
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

- [This site](https://github.com/Joshua-Booth/website): Source code for joshuabooth.nz. Open source.
- [Tax Calculator](https://calculatetax.netlify.app): Works out New Zealand take-home pay after tax, ACC, KiwiSaver and student loan. Open source ([Code](https://github.com/Joshua-Booth/calculate-tax)).
- [creact](https://github.com/Joshua-Booth/creact): React web app template with testing and coding agent setup done. Open source.
- [Audio Devotions](https://github.com/Joshua-Booth/audio-devotions): Daily audio devotional web app for people with reduced vision. Open source.

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
    ["none", ALL_OFF],
    ["all", ALL_ON],
  ])(
    "links only to joshuabooth.nz URLs whose route serves them, with SITE_FLAGS=%s",
    async (siteFlags, flags) => {
      vi.stubEnv("SITE_FLAGS", siteFlags);

      const urls =
        llmsTxt(flags).match(/https:\/\/joshuabooth\.nz[^\s)]*/g) ?? [];

      const served = await Promise.all(
        urls.map(async (url) => ({ url, serves: await serves(url) }))
      );

      expect(urls.length).toBeGreaterThan(0);
      expect(served.filter((link) => !link.serves)).toEqual([]);
    }
  );

  it("ends only project lines with a full stop", () => {
    const notes = llmsTxt(ALL_ON).match(/^- \[.*?\]\(.*?\): .*$/gm) ?? [];
    const projects = section(llmsTxt(ALL_ON), "Projects")?.split("\n") ?? [];

    expect(notes.length).toBe(PAGE_PATHS.length + PROJECTS.length + 3);
    expect(projects.every((line) => line.endsWith("."))).toBe(true);

    expect(
      notes.filter((line) => !projects.includes(line) && line.endsWith("."))
    ).toEqual([]);
  });
});
