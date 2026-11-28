import type { Metadata } from "next";

import { ThisSitePage } from "@/pages/this-site/ui/this-site-page";

import { gatePage } from "@/shared/api/gate-page";
import { pageMetadata } from "@/shared/lib/page-metadata";

export const metadata: Metadata = pageMetadata("/writing/this-site");

export default async function Page() {
  await gatePage("/writing/this-site");

  return <ThisSitePage />;
}
