import { describe, expect, it } from "vitest";

import { ALL_OFF, ALL_ON } from "@/shared/config/flags";

import { netlifyRedirects } from "./redirects";

describe("netlifyRedirects", () => {
  it("answers 404 for every file a hidden page exports", () => {
    expect(netlifyRedirects({ ...ALL_ON, pcosCaseStudy: false }))
      .toBe(`/work/pcos-protocol  /404.html  404!
/work/pcos-protocol.html  /404.html  404!
/work/pcos-protocol.txt  /404.html  404!
/work/pcos-protocol.md  /404.html  404!
/work/pcos-protocol/*  /404.html  404!
`);
  });

  it("hides every flagged page with every flag off", () => {
    expect(netlifyRedirects(ALL_OFF).match(/^\S+(?=  )/gm)).toEqual([
      "/work/pcos-protocol",
      "/work/pcos-protocol.html",
      "/work/pcos-protocol.txt",
      "/work/pcos-protocol.md",
      "/work/pcos-protocol/*",
      "/writing/this-site",
      "/writing/this-site.html",
      "/writing/this-site.txt",
      "/writing/this-site.md",
      "/writing/this-site/*",
    ]);
  });

  it("hides nothing with every flag on", () => {
    expect(netlifyRedirects(ALL_ON)).toBe("");
  });
});
