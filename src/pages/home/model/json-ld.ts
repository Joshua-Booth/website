import { JOB_TITLE, LINKS, NAME, SITE_URL } from "@/shared/config/site";

const PERSON_ID = `${SITE_URL}/#person`;
const HOME_URL = `${SITE_URL}/`;

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: NAME,
        url: HOME_URL,
        jobTitle: JOB_TITLE,
        sameAs: [LINKS.linkedin, LINKS.github],
      },
      {
        "@type": "WebSite",
        name: NAME,
        url: HOME_URL,
        author: { "@id": PERSON_ID },
        inLanguage: "en-NZ",
      },
    ],
  };
}
