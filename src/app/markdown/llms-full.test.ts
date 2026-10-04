import { describe, expect, it } from "vitest";

import { ALL_OFF, ALL_ON } from "@/shared/config/flags";
import { livePages, pageUrl } from "@/shared/config/pages";

import { llmsFull } from "./llms-full";
import { pageMarkdown } from "./pages";

const starts = (text: string) =>
  [...text.matchAll(/^# (.+)\nSource: (.+)$/gm)].map(([, title, url]) => [
    title,
    url,
  ]);

describe("llmsFull", () => {
  it("has only the homepage with every flag off", async () => {
    expect(starts(await llmsFull(ALL_OFF))).toEqual([
      ["Joshua Booth", "https://joshuabooth.nz"],
    ]);
  });

  it("has every page in list order with every flag on", async () => {
    expect(starts(await llmsFull(ALL_ON))).toEqual([
      ["Joshua Booth", "https://joshuabooth.nz"],
      ["PCOS Protocol", "https://joshuabooth.nz/work/pcos-protocol"],
      ["How this site is built", "https://joshuabooth.nz/writing/this-site"],
      ["Lab", "https://joshuabooth.nz/lab"],
    ]);
  });

  it("is each page's Markdown with its URL under the heading", async () => {
    const full = await llmsFull(ALL_ON);

    const documents = await Promise.all(
      livePages(ALL_ON).map(async (path) => {
        const markdown = await pageMarkdown(path, ALL_ON);

        if (markdown === null) throw new Error(`${path} has no Markdown`);

        return markdown.replace("\n\n", `\nSource: ${pageUrl(path)}\n\n`);
      })
    );

    for (const document of documents) expect(full).toContain(document);
  });
});
