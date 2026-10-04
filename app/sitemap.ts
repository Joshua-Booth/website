import type { MetadataRoute } from "next";

import { getSiteFlags } from "@/shared/api/site-flags";
import { livePages, pageUrl } from "@/shared/config/pages";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return livePages(await getSiteFlags()).map((path) => ({
    url: pageUrl(path),
  }));
}
