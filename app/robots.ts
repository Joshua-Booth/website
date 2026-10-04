import type { MetadataRoute } from "next";

import { SITE_URL } from "@/shared/config/site";

// A static export only builds route handlers that are marked static
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
