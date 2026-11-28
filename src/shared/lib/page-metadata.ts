import type { PagePath } from "../config/pages";

import type { Metadata } from "next";

import { exportPath, pageInfo } from "../config/pages";
import { LOCALE, NAME } from "../config/site";

// From scripts/og/og.html
const CARD = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Joshua Booth in large black type on white, with Design engineer, Auckland below and the jb mark above.",
};

/**
 * Next.js replaces the layout's openGraph as a whole rather than merging it,
 * so every page sets all of its own.
 */
export function pageMetadata(path: PagePath): Metadata {
  const { title, description } = pageInfo(path);

  return {
    ...(title && { title }),
    description,
    alternates: {
      canonical: path,
      types: { "text/markdown": exportPath(path, "md") },
    },
    openGraph: {
      type: "website",
      siteName: NAME,
      locale: LOCALE.og,
      url: path,
      title: title ? `${title} · ${NAME}` : NAME,
      description,
      images: [CARD],
    },
  };
}
