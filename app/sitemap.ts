import type { MetadataRoute } from "next";

import { getSiteFlags } from "@/shared/api/site-flags";
import { livePages } from "@/shared/config/pages";
import { SITE_URL } from "@/shared/config/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return livePages(await getSiteFlags()).map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
  }));
}
