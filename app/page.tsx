import type { Metadata } from "next";

import { HomePage } from "@/pages/home/ui/home-page";
import { RedesignHome } from "@/pages/home/ui/redesign-home";

import { gatePage } from "@/shared/api/gate-page";
import { getSiteFlags } from "@/shared/api/site-flags";
import { siteDescription } from "@/shared/config/site";
import { pageMetadata, withDescription } from "@/shared/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { redesign } = await getSiteFlags();

  return withDescription(pageMetadata("/"), siteDescription(redesign));
}

export default async function Page() {
  const flags = await gatePage("/");

  return flags.redesign ? (
    <RedesignHome flags={flags} />
  ) : (
    <HomePage flags={flags} />
  );
}
