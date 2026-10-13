import type { PagePath } from "../config/pages";

import type { Metadata } from "next";

import { mdPath, pageInfo } from "../config/pages";
import { NAME } from "../config/site";

const IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Joshua Booth in large white capitals on blue, half built. Left of a glowing vertical line the letters are solid. To its right they're outlines on a grid, with a type spec label and a pink measurement. Guide lines run along both lines of the name. Below: Frontend Engineer.",
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
