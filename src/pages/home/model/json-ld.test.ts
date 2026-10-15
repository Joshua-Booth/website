import { expect, it } from "vitest";

import { homeJsonLd } from "./json-ld";

it("builds a Person + WebSite @graph from site config", () => {
  expect(homeJsonLd()).toEqual({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://joshuabooth.nz/#person",
        name: "Joshua Booth",
        url: "https://joshuabooth.nz/",
        jobTitle: "UI Engineer",
        sameAs: [
          "https://www.linkedin.com/in/joshua-booth",
          "https://github.com/Joshua-Booth",
        ],
      },
      {
        "@type": "WebSite",
        name: "Joshua Booth",
        url: "https://joshuabooth.nz/",
        author: { "@id": "https://joshuabooth.nz/#person" },
        inLanguage: "en-NZ",
      },
    ],
  });
});

it("stays minimal: no image, email, or address", () => {
  const payload = JSON.stringify(homeJsonLd());

  expect(payload).not.toMatch(/image|email|address/i);
});
