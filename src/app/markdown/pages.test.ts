import { describe, expect, it } from "vitest";

import { ALL_OFF, ALL_ON } from "@/shared/config/flags";

import { pageMarkdown } from "./pages";

const INDEX_OFF = `# Joshua Booth

**I'm an AI-native frontend engineer in Auckland.** I design and build products from first concept to live in production.

## Work

- UI Engineer at Solve Data, 2021 to now
- Frontend Engineer at stuff.co.nz, 2021
- Full Stack Developer at The PCOS Nutritionist, 2020 to 2021

## Projects

- [This site](https://github.com/Joshua-Booth/website): Source code for joshuabooth.nz
- [Tax Calculator](https://calculatetax.netlify.app): Works out your New Zealand take-home pay after tax, ACC, KiwiSaver and student loan ([Code](https://github.com/Joshua-Booth/calculate-tax))
- [creact](https://github.com/Joshua-Booth/creact): A project template for React web apps, with the testing and coding agent setup already done
- [Audio Devotions](https://github.com/Joshua-Booth/audio-devotions): Daily audio devotional web app designed for people with reduced vision

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

- [This site](https://github.com/Joshua-Booth/website): Source code for joshuabooth.nz ([How it's built](https://joshuabooth.nz/writing/this-site.md))
- [Tax Calculator](https://calculatetax.netlify.app): Works out your New Zealand take-home pay after tax, ACC, KiwiSaver and student loan ([Code](https://github.com/Joshua-Booth/calculate-tax))
- [creact](https://github.com/Joshua-Booth/creact): A project template for React web apps, with the testing and coding agent setup already done
- [Audio Devotions](https://github.com/Joshua-Booth/audio-devotions): Daily audio devotional web app designed for people with reduced vision

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
