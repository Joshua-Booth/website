import type { Metadata } from "next";

import { ThisSitePage } from "@/pages/this-site/ui/this-site-page";

import { gatePage } from "@/shared/api/gate-page";
import { getSiteFlags } from "@/shared/api/site-flags";
import { isLive } from "@/shared/config/pages";
import { inLook, pageMetadata } from "@/shared/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { redesign } = await getSiteFlags();

  return inLook(pageMetadata("/writing/this-site"), redesign);
}

export default async function Page() {
  const flags = await gatePage("/writing/this-site");

  return <ThisSitePage lab={isLive("/lab", flags)} />;
}
