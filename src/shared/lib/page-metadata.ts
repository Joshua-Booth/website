import type { PagePath } from "../config/pages";

import type { Metadata } from "next";

import { mdPath, pageInfo } from "../config/pages";
import { NAME } from "../config/site";

const IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Joshua Booth in large white capitals on blue. A pool of light over the right-hand letters shows them in outline on lined paper. Below: AI-Native Frontend Engineer.",
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
      types: { "text/markdown": mdPath(path) },
    },
    openGraph: {
      type: "website",
      siteName: NAME,
      locale: "en_NZ",
      url: path,
      title: title ? `${title} · ${NAME}` : NAME,
      description,
      images: [IMAGE],
    },
  };
}
