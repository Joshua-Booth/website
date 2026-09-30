import { HomePage } from "@/pages/home/ui/home-page";

import { getSiteFlags } from "@/shared/api/site-flags";
import { DESCRIPTION } from "@/shared/config/site";
import { pageMetadata } from "@/shared/lib/page-metadata";

export const metadata = pageMetadata({ description: DESCRIPTION, path: "/" });

export default async function Page() {
  return <HomePage flags={await getSiteFlags()} />;
}
