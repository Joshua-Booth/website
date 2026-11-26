import { HomePage } from "@/pages/home/ui/home-page";
import { RedesignHome } from "@/pages/home/ui/redesign-home";

import { gatePage } from "@/shared/api/gate-page";
import { pageMetadata } from "@/shared/lib/page-metadata";

export const metadata = pageMetadata("/");

export default async function Page() {
  const flags = await gatePage("/");

  return flags.redesign ? (
    <RedesignHome flags={flags} />
  ) : (
    <HomePage flags={flags} />
  );
}
