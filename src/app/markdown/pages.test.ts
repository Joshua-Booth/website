import { afterEach, describe, expect, it, vi } from "vitest";

import { ALL_OFF, ALL_ON } from "@/shared/config/flags";
import { isLive, mdPath, PAGE_PATHS } from "@/shared/config/pages";

import { pageMarkdown } from "./pages";

afterEach(() => {
  vi.unstubAllEnvs();
});

interface MarkdownRoute {
  dynamic: string;
  GET: () => Promise<Response>;
}

async function markdownRoute(
  path: (typeof PAGE_PATHS)[number]
): Promise<MarkdownRoute> {
  return import(
    /* @vite-ignore */ new URL(
      `../../../app${mdPath(path)}/route.ts`,
      import.meta.url
    ).href
  );
}

const INDEX_OFF = `# Joshua Booth

**I'm an AI-native frontend engineer in Auckland.** I design and build products from first concept to live in production.

## Work

- UI Engineer at Solve Data, 2021 to now
- Frontend Engineer at stuff.co.nz, 2021
- Full Stack Developer at The PCOS Nutritionist, 2020 to 2021

## Projects

- [This site](https://github.com/Joshua-Booth/website): Source code for joshuabooth.nz. Open source.
- [Tax Calculator](https://calculatetax.netlify.app): Works out New Zealand take-home pay after tax, ACC, KiwiSaver and student loan. Open source ([Code](https://github.com/Joshua-Booth/calculate-tax)).
- [creact](https://github.com/Joshua-Booth/creact): React web app template with testing and coding agent setup done. Open source.
- [Audio Devotions](https://github.com/Joshua-Booth/audio-devotions): Daily audio devotional web app for people with reduced vision. Open source.

## Contact

- Email: [contact@joshuabooth.nz](mailto:contact@joshuabooth.nz)
- [LinkedIn](https://www.linkedin.com/in/joshua-booth)
- [GitHub](https://github.com/Joshua-Booth)
`;

const INDEX_ON = `# Joshua Booth

**I'm an AI-native frontend engineer in Auckland.** I design and build products from first concept to live in production.

## Work

- UI Engineer at Solve Data, 2021 to now
- Frontend Engineer at stuff.co.nz, 2021
- Full Stack Developer at The PCOS Nutritionist, 2020 to 2021 ([Case study](https://joshuabooth.nz/work/pcos-protocol.md))

## Projects

- [This site](https://github.com/Joshua-Booth/website): Source code for joshuabooth.nz. Open source. ([How it's built](https://joshuabooth.nz/writing/this-site.md))
- [Tax Calculator](https://calculatetax.netlify.app): Works out New Zealand take-home pay after tax, ACC, KiwiSaver and student loan. Open source ([Code](https://github.com/Joshua-Booth/calculate-tax)).
- [creact](https://github.com/Joshua-Booth/creact): React web app template with testing and coding agent setup done. Open source.
- [Audio Devotions](https://github.com/Joshua-Booth/audio-devotions): Daily audio devotional web app for people with reduced vision. Open source.

## Lab

- [Lab](https://joshuabooth.nz/lab.md): Small interfaces and components Joshua Booth builds to get the details right

## Contact

- Email: [contact@joshuabooth.nz](mailto:contact@joshuabooth.nz)
- [LinkedIn](https://www.linkedin.com/in/joshua-booth)
- [GitHub](https://github.com/Joshua-Booth)
`;

describe("pageMarkdown", () => {
  it.each(["/work/pcos-protocol", "/writing/this-site", "/lab"] as const)(
    "has no Markdown for %s while its flag is off",
    async (path) => {
      await expect(pageMarkdown(path, ALL_OFF)).resolves.toBeNull();
      await expect(pageMarkdown(path, ALL_ON)).resolves.toMatch(/^# .+\n\n.+/);
    }
  );

  it("gives /index.md the homepage's sections with every flag off", async () => {
    await expect(pageMarkdown("/", ALL_OFF)).resolves.toBe(INDEX_OFF);
  });

  it("adds the case studies and the Lab with every flag on", async () => {
    await expect(pageMarkdown("/", ALL_ON)).resolves.toBe(INDEX_ON);
  });
});

describe("each page's Markdown route", () => {
  it.each(PAGE_PATHS)(
    "serves %s's Markdown with every flag on",
    async (path) => {
      vi.stubEnv("SITE_FLAGS", "all");

      const route = await markdownRoute(path);
      const res = await route.GET();

      expect(route.dynamic).toBe("force-static");
      expect(res.status).toBe(200);

      expect(res.headers.get("Content-Type")).toBe(
        "text/markdown; charset=utf-8"
      );

      expect(await res.text()).toBe(await pageMarkdown(path, ALL_ON));
    }
  );

  it.each(PAGE_PATHS)(
    "answers 404 for %s only while its flag is off",
    async (path) => {
      vi.stubEnv("SITE_FLAGS", "none");

      expect((await (await markdownRoute(path)).GET()).status).toBe(
        isLive(path, ALL_OFF) ? 200 : 404
      );
    }
  );
});
