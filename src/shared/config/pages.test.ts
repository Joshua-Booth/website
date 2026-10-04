import { readdirSync, readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ALL_OFF, ALL_ON } from "./flags";
import {
  livePages,
  mdPath,
  PAGE_PATHS,
  pageInfo,
  PAGES,
  pageUrl,
} from "./pages";

afterEach(() => {
  vi.unstubAllEnvs();
});

const APP = new URL("../../../app/", import.meta.url);

const pageFiles = readdirSync(APP, { recursive: true, encoding: "utf8" })
  .filter((file) => /(^|\/)page\.(tsx|ts|mdx)$/.test(file))
  .map((file) => ({
    file,
    route: `/${file.split("/").slice(0, -1).join("/")}`,
  }));

describe("the page list", () => {
  it("has an entry for every page under app/, and no other", () => {
    expect(pageFiles.map(({ route }) => route).toSorted()).toEqual(
      PAGE_PATHS.toSorted()
    );
  });

  it("names its own route in its metadata and its gate, and no other", () => {
    for (const { file, route } of pageFiles) {
      const source = readFileSync(new URL(file, APP), "utf8");
      const calls = source.match(/\b(?:pageMetadata|gatePage)\([^)]*\)/g);

      expect({ file, calls: calls?.toSorted() }).toEqual({
        file,
        calls: [`gatePage("${route}")`, `pageMetadata("${route}")`],
      });
    }
  });

  it("never hides the homepage", () => {
    expect(PAGES["/"]).not.toHaveProperty("flag");
  });

  it("puts no page under another unless both share a flag", () => {
    const nested = PAGE_PATHS.flatMap((parent) =>
      PAGE_PATHS.filter(
        (child) =>
          parent !== "/" &&
          child.startsWith(`${parent}/`) &&
          pageInfo(child).flag !== pageInfo(parent).flag
      ).map((child) => `${child} under ${parent}`)
    );

    expect(nested).toEqual([]);
  });

  it.each([
    ["none", ["https://joshuabooth.nz"]],
    ["all", PAGE_PATHS.map(pageUrl)],
  ])("is the sitemap, with SITE_FLAGS=%s", async (siteFlags, urls) => {
    vi.stubEnv("SITE_FLAGS", siteFlags);

    const { default: sitemap }: { default: () => Promise<{ url: string }[]> } =
      await import(
        /* @vite-ignore */ new URL("../../../app/sitemap.ts", import.meta.url)
          .href
      );

    expect((await sitemap()).map(({ url }) => url)).toEqual(urls);
  });

  it("lists only the pages whose flags are on", () => {
    expect(livePages(ALL_OFF)).toEqual(["/"]);

    expect(livePages(ALL_ON)).toEqual([
      "/",
      "/work/pcos-protocol",
      "/writing/this-site",
      "/lab",
    ]);
  });
});

describe("each page's Markdown route", () => {
  const mdRoutes = readdirSync(APP, { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith(".md/route.ts"))
    .map((file) => ({
      file,
      mdPath: `/${file.slice(0, -"/route.ts".length)}`,
    }));

  it("is at the page's Markdown path, for every page and no other", () => {
    expect(mdRoutes.map((route) => route.mdPath).toSorted()).toEqual(
      PAGE_PATHS.map(mdPath).toSorted()
    );
  });
});

describe("mdPath", () => {
  it("is index.md for the homepage, and the path plus .md for the rest", () => {
    expect(mdPath("/")).toBe("/index.md");
    expect(mdPath("/lab")).toBe("/lab.md");
    expect(mdPath("/work/pcos-protocol")).toBe("/work/pcos-protocol.md");
  });
});
