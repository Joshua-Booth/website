import { afterEach, describe, expect, it, vi } from "vitest";

import { ALL_OFF, ALL_ON } from "@/shared/config/flags";
import { exportPath, isLive, PAGE_PATHS } from "@/shared/config/pages";

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
      `../../../app${exportPath(path, "md")}/route.ts`,
      import.meta.url
    ).href
  );
}

const INDEX_OFF = `# Joshua Booth

**Design engineer, Auckland.** I design and build interfaces.

## Work

- Frontend Lead at Solve Data, 2024 to 2026; UI Engineer at Solve Data, 2021 to 2023
- Frontend Engineer at stuff.co.nz, 2021
- Full Stack Developer at The PCOS Nutritionist, 2020 to 2021

## Projects

- **creact**: A React app template, and a CLI that starts a new app from it with linting, tests, git hooks and the coding-agent setup already in place. [View on npm](https://www.npmjs.com/package/create-creact), [View the code](https://github.com/Joshua-Booth/creact).
- **Recipes**: A recipe app for browsing by course, searching, and adding your own recipes. [Visit the site](https://jb-recipes.netlify.app), [Try the demo](https://jb-recipes-app.netlify.app).
- **Tax Calculator**: Works out your New Zealand take-home pay after tax, ACC, KiwiSaver and student loan. [Open the app](https://calculatetax.netlify.app), [View the code](https://github.com/Joshua-Booth/calculate-tax).
- **PCOS Protocol**: A nutrition course app, with daily lessons, a knowledge base and recipes. I built it at The PCOS Nutritionist. Shown with made-up content.
- **Audio Devotions**: A daily audio devotional for people with reduced vision, with big controls and a high contrast mode. [Open the app](https://audiodevotions.netlify.app), [View the code](https://github.com/Joshua-Booth/audio-devotions).
- **Equipped Youth Manual**: An app for Realive Youth members to share and deepen their faith. I led the team of five that built it in 2019. [Open the app](https://realiveyouth.netlify.app), [View the code](https://github.com/Joshua-Booth/realiveyouth).
- **Two Ticks**: A visual explainer of how split votes created overhang seats in New Zealand's 2026 election. [Open the app](https://twoticks.netlify.app).

[All projects](https://joshuabooth.nz/projects.md)

## Contact

- Email: [contact@joshuabooth.nz](mailto:contact@joshuabooth.nz)
- [LinkedIn](https://www.linkedin.com/in/joshua-booth)
- [GitHub](https://github.com/Joshua-Booth)
`;

const INDEX_ON = `# Joshua Booth

**Design engineer, Auckland.** I design and build interfaces.

## Work

- Frontend Lead at Solve Data, 2024 to 2026; UI Engineer at Solve Data, 2021 to 2023
- Frontend Engineer at stuff.co.nz, 2021
- Full Stack Developer at The PCOS Nutritionist, 2020 to 2021 ([Case study](https://joshuabooth.nz/work/pcos-protocol.md))

## Projects

- **creact**: A React app template, and a CLI that starts a new app from it with linting, tests, git hooks and the coding-agent setup already in place. [View on npm](https://www.npmjs.com/package/create-creact), [View the code](https://github.com/Joshua-Booth/creact).
- **Recipes**: A recipe app for browsing by course, searching, and adding your own recipes. [Visit the site](https://jb-recipes.netlify.app), [Try the demo](https://jb-recipes-app.netlify.app).
- **Tax Calculator**: Works out your New Zealand take-home pay after tax, ACC, KiwiSaver and student loan. [Open the app](https://calculatetax.netlify.app), [View the code](https://github.com/Joshua-Booth/calculate-tax).
- **PCOS Protocol**: A nutrition course app, with daily lessons, a knowledge base and recipes. I built it at The PCOS Nutritionist. Shown with made-up content.
- **Audio Devotions**: A daily audio devotional for people with reduced vision, with big controls and a high contrast mode. [Open the app](https://audiodevotions.netlify.app), [View the code](https://github.com/Joshua-Booth/audio-devotions).
- **Equipped Youth Manual**: An app for Realive Youth members to share and deepen their faith. I led the team of five that built it in 2019. [Open the app](https://realiveyouth.netlify.app), [View the code](https://github.com/Joshua-Booth/realiveyouth).
- **Two Ticks**: A visual explainer of how split votes created overhang seats in New Zealand's 2026 election. [Open the app](https://twoticks.netlify.app).

[All projects](https://joshuabooth.nz/projects.md)

## Contact

- Email: [contact@joshuabooth.nz](mailto:contact@joshuabooth.nz)
- [LinkedIn](https://www.linkedin.com/in/joshua-booth)
- [GitHub](https://github.com/Joshua-Booth)
`;

describe("pageMarkdown", () => {
  it.each(["/work/pcos-protocol", "/writing/this-site"] as const)(
    "has no Markdown for %s while its flag is off",
    async (path) => {
      await expect(pageMarkdown(path, ALL_OFF)).resolves.toBeNull();
      await expect(pageMarkdown(path, ALL_ON)).resolves.toMatch(/^# .+\n\n.+/);
    }
  );

  it("gives /index.md the homepage's sections with every flag off", async () => {
    await expect(pageMarkdown("/", ALL_OFF)).resolves.toBe(INDEX_OFF);
  });

  it("links the PCOS case study with every flag on", async () => {
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
