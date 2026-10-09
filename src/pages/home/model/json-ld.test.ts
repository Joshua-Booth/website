import { expect, it } from "vitest";

import { CURRENT_JOB } from "@/entities/job/model/jobs";

import { LINKS, NAME, SITE_URL } from "@/shared/config/site";

import { homeJsonLd } from "./json-ld";

it("builds a Person + WebSite @graph from site config", () => {
  expect(homeJsonLd()).toEqual({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: NAME,
        url: `${SITE_URL}/`,
        jobTitle: CURRENT_JOB.role,
        sameAs: [LINKS.linkedin, LINKS.github],
      },
      {
        "@type": "WebSite",
        name: NAME,
        url: `${SITE_URL}/`,
        author: { "@id": `${SITE_URL}/#person` },
        inLanguage: "en-NZ",
      },
    ],
  });
});

it("stays minimal: no image, email, or address", () => {
  const payload = JSON.stringify(homeJsonLd());

  expect(payload).not.toMatch(/image|email|address/i);
});
