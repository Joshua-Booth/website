import { describe, expect, it } from "vitest";

import { ALL_OFF, ALL_ON } from "@/shared/config/flags";

import { netlifyRedirects } from "./redirects";

describe("netlifyRedirects", () => {
  it("answers 404 for every file a hidden page exports", () => {
    expect(netlifyRedirects({ ...ALL_ON, lab: false }))
      .toBe(`/lab  /404.html  404!
/lab.html  /404.html  404!
/lab.txt  /404.html  404!
/lab.md  /404.html  404!
/lab/*  /404.html  404!
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
      "/lab",
      "/lab.html",
      "/lab.txt",
      "/lab.md",
      "/lab/*",
    ]);
  });

  it("hides nothing with every flag on", () => {
    expect(netlifyRedirects(ALL_ON)).toBe("");
  });
});
