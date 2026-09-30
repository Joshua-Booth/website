import type { MetadataRoute } from "next";

import { getSiteFlags } from "@/shared/api/site-flags";
import { SITE_URL } from "@/shared/config/site";

// Route handlers don't inherit the layout's revalidate, so it's set again here
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const flags = await getSiteFlags();

  const paths = [
    "",
    ...(flags.pcosCaseStudy ? ["/work/pcos-protocol"] : []),
    ...(flags.lab ? ["/lab"] : []),
    ...(flags.thisSiteCaseStudy ? ["/writing/this-site"] : []),
  ];

  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
