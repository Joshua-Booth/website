import { ThisSitePage } from "@/pages/this-site/ui/this-site-page";

import { gatePage } from "@/shared/api/gate-page";
import { isLive } from "@/shared/config/pages";
import { pageMetadata } from "@/shared/lib/page-metadata";

export const metadata = pageMetadata("/writing/this-site");

export default async function Page() {
  const flags = await gatePage("/writing/this-site");

  return <ThisSitePage lab={isLive("/lab", flags)} />;
}
