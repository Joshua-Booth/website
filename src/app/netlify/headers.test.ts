import { describe, expect, it } from "vitest";

import { ALL_OFF, ALL_ON } from "@/shared/config/flags";

import { netlifyHeaders } from "./headers";

describe("netlifyHeaders", () => {
  it("links the homepage to llms.txt, and its Markdown back to it, with every flag off", () => {
    expect(netlifyHeaders(ALL_OFF)).toBe(`/
  Link: </llms.txt>; rel="describedby"

/index.html
  Link: </llms.txt>; rel="describedby"

/index.md
  Content-Type: text/markdown; charset=utf-8
  Link: <https://joshuabooth.nz>; rel="canonical", </llms.txt>; rel="describedby"
`);
  });

  it("covers every live page and its Markdown with every flag on", () => {
    expect(netlifyHeaders(ALL_ON).match(/^\S+$/gm)).toEqual([
      "/",
      "/index.html",
      "/index.md",
      "/work/pcos-protocol",
      "/work/pcos-protocol.html",
      "/work/pcos-protocol.md",
      "/writing/this-site",
      "/writing/this-site.html",
      "/writing/this-site.md",
      "/lab",
      "/lab.html",
      "/lab.md",
    ]);
  });
});
