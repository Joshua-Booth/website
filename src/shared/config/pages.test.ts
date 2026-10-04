import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { ALL_OFF, ALL_ON } from "./flags";
import { livePages, mdPath, PAGE_PATHS } from "./pages";

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

  it("serves its own page's Markdown", () => {
    for (const path of PAGE_PATHS) {
      const route = mdRoutes.find((r) => r.mdPath === mdPath(path));
      const source = route && readFileSync(new URL(route.file, APP), "utf8");

      expect(source).toContain(`markdownResponse("${path}")`);
    }
  });
});

describe("mdPath", () => {
  it("is index.md for the homepage, and the path plus .md for the rest", () => {
    expect(mdPath("/")).toBe("/index.md");
    expect(mdPath("/lab")).toBe("/lab.md");
    expect(mdPath("/work/pcos-protocol")).toBe("/work/pcos-protocol.md");
  });
});
