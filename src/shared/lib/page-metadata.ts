import type { Metadata, Route } from "next";

import { NAME } from "../config/site";

const IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Joshua Booth in large white capitals on blue. A pool of light over the right-hand letters shows them in outline on lined paper. Below: I'm a UI engineer in Auckland. I design and build interfaces.",
};

/**
 * Next.js replaces the layout's openGraph as a whole rather than merging it,
 * so every page sets all of its own.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: Route;
}): Metadata {
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
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
