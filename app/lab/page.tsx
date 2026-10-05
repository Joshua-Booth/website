import { LabPage } from "@/pages/lab/ui/lab-page";

import { gatePage } from "@/shared/api/gate-page";
import { pageMetadata } from "@/shared/lib/page-metadata";

export const metadata = pageMetadata("/lab");

export default async function Page() {
  await gatePage("/lab");

  return <LabPage />;
}
