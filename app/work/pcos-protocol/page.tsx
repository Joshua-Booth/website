import { notFound } from "next/navigation";

import { PcosProtocolPage } from "@/pages/pcos-protocol/ui/pcos-protocol-page";

import { getSiteFlags } from "@/shared/api/site-flags";
import { pageMetadata } from "@/shared/lib/page-metadata";

export const metadata = pageMetadata({
  title: "PCOS Protocol",
  description:
    "A course app for a nutrition business, designed and built by Joshua Booth as its only developer.",
  path: "/work/pcos-protocol",
});

export default async function Page() {
  if (!(await getSiteFlags()).pcosCaseStudy) notFound();

  return <PcosProtocolPage />;
}
