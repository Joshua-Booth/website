import type { Metadata } from "next";

import { PcosProtocolPage } from "@/pages/pcos-protocol/ui/pcos-protocol-page";

import { gatePage } from "@/shared/api/gate-page";
import { getSiteFlags } from "@/shared/api/site-flags";
import { inLook, pageMetadata } from "@/shared/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { redesign } = await getSiteFlags();

  return inLook(pageMetadata("/work/pcos-protocol"), redesign);
}

export default async function Page() {
  await gatePage("/work/pcos-protocol");

  return <PcosProtocolPage />;
}
