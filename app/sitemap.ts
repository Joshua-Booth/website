import type { MetadataRoute } from "next";

import { getSiteFlags } from "@/shared/api/site-flags";
import { FLAGGED_PAGES } from "@/shared/config/flags";
import { SITE_URL } from "@/shared/config/site";

// A static export only builds route handlers that are marked static
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const flags = await getSiteFlags();

  const paths = [
    "",
    ...FLAGGED_PAGES.filter(({ flag }) => flags[flag]).map(({ path }) => path),
  ];

  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
