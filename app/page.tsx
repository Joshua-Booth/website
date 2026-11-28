import type { Metadata } from "next";

import { HomePage } from "@/pages/home/ui/home-page";

import { gatePage } from "@/shared/api/gate-page";
import { pageMetadata } from "@/shared/lib/page-metadata";

export const metadata: Metadata = pageMetadata("/");

export default async function Page() {
  const flags = await gatePage("/");

  return <HomePage flags={flags} />;
}
