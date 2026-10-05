import { PcosProtocolPage } from "@/pages/pcos-protocol/ui/pcos-protocol-page";

import { gatePage } from "@/shared/api/gate-page";
import { pageMetadata } from "@/shared/lib/page-metadata";

export const metadata = pageMetadata("/work/pcos-protocol");

export default async function Page() {
  await gatePage("/work/pcos-protocol");

  return <PcosProtocolPage />;
}
