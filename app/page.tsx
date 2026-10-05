import { HomePage } from "@/pages/home/ui/home-page";

import { gatePage } from "@/shared/api/gate-page";
import { pageMetadata } from "@/shared/lib/page-metadata";

export const metadata = pageMetadata("/");

export default async function Page() {
  return <HomePage flags={await gatePage("/")} />;
}
