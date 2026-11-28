import { INTRO, LINKS, LOCALE, NAME, SITE_URL } from "@/shared/config/site";

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
        jobTitle: INTRO.jobTitle,
        sameAs: [LINKS.linkedin, LINKS.github],
      },
      {
        "@type": "WebSite",
        name: NAME,
        url: HOME_URL,
        author: { "@id": PERSON_ID },
        inLanguage: LOCALE.lang,
      },
    ],
  };
}
