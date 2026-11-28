import { existsSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BIG_PROJECTS } from "@/entities/project/model/showcase";

import { ALL_OFF, ALL_ON } from "@/shared/config/flags";
import { livePages } from "@/shared/config/pages";
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

> Joshua Booth is a design engineer in Auckland. He designs and builds interfaces.

Work:

- Frontend Lead at Solve Data, 2024 to 2026; UI Engineer at Solve Data, 2021 to 2023
- Frontend Engineer at stuff.co.nz, 2021
- Full Stack Developer at The PCOS Nutritionist, 2020 to 2021

Email: [contact@joshuabooth.nz](mailto:contact@joshuabooth.nz)

## Pages

- [Home](https://joshuabooth.nz/index.md): Work, projects and contact details
- [Projects](https://joshuabooth.nz/projects.md): Apps, app designs, games and tools by Joshua Booth

## Projects

- **creact**: A React app template, and a CLI that starts a new app from it with linting, tests, git hooks and the coding-agent setup already in place. [View on npm](https://www.npmjs.com/package/create-creact), [View the code](https://github.com/Joshua-Booth/creact).
- **Recipes**: A recipe app for browsing by course, searching, and adding your own recipes. [Visit the site](https://jb-recipes.netlify.app), [Try the demo](https://jb-recipes-app.netlify.app).
- **Tax Calculator**: Works out your New Zealand take-home pay after tax, ACC, KiwiSaver and student loan. [Open the app](https://calculatetax.netlify.app), [View the code](https://github.com/Joshua-Booth/calculate-tax).
- **PCOS Protocol**: A nutrition course app, with daily lessons, a knowledge base and recipes. I built it at The PCOS Nutritionist. Shown with made-up content.
- **Audio Devotions**: A daily audio devotional for people with reduced vision, with big controls and a high contrast mode. [Open the app](https://audiodevotions.netlify.app), [View the code](https://github.com/Joshua-Booth/audio-devotions).
- **Equipped Youth Manual**: An app for Realive Youth members to share and deepen their faith. I led the team of five that built it in 2019. [Open the app](https://realiveyouth.netlify.app), [View the code](https://github.com/Joshua-Booth/realiveyouth).
- **Two Ticks**: A visual explainer of how split votes created overhang seats in New Zealand's 2026 election. [Open the app](https://twoticks.netlify.app).

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
        "- [Projects](https://joshuabooth.nz/projects.md): Apps, app designs, games and tools by Joshua Booth",
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
    const text = llmsTxt(ALL_ON);
    const notes = text.match(/^- \[.*?\]\(.*?\): .*$/gm) ?? [];
    const projects = section(text, "Projects")?.split("\n") ?? [];

    expect(notes.length).toBe(livePages(ALL_ON).length + 3);
    expect(projects).toHaveLength(BIG_PROJECTS.length);
    expect(projects.every((line) => line.endsWith("."))).toBe(true);

    expect(
      notes.filter((line) => !projects.includes(line) && line.endsWith("."))
    ).toEqual([]);
  });
});
