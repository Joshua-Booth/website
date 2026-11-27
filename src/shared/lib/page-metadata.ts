import type { PagePath } from "../config/pages";

import type { Metadata } from "next";

import { exportPath, pageInfo } from "../config/pages";
import { LOCALE, NAME } from "../config/site";

const BLUE_CARD = {
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
      types: { "text/markdown": exportPath(path, "md") },
    },
    openGraph: {
      type: "website",
      siteName: NAME,
      locale: LOCALE.og,
      url: path,
      title: title ? `${title} · ${NAME}` : NAME,
      description,
      images: [BLUE_CARD],
    },
  };
}

// The redesign's card, from scripts/og/og-white.html
const WHITE_CARD = {
  url: "/og-white.png",
  width: 1200,
  height: 630,
  alt: "Joshua Booth, design engineer in Auckland, above pictures of three of his projects: creact in a terminal, the Recipes app and the Tax Calculator.",
};

/** The same metadata with the white look's share card, with the redesign on. */
export function inLook(metadata: Metadata, redesign: boolean): Metadata {
  return redesign
    ? {
        ...metadata,
        openGraph: { ...metadata.openGraph, images: [WHITE_CARD] },
      }
    : metadata;
}

/** The same metadata with another description, in the share card too. */
export function withDescription(
  metadata: Metadata,
  description: string
): Metadata {
  return {
    ...metadata,
    description,
    openGraph: { ...metadata.openGraph, description },
  };
}
