import { notFound } from "next/navigation";

import { LabPage } from "@/pages/lab/ui/lab-page";

import { getSiteFlags } from "@/shared/api/site-flags";
import { pageMetadata } from "@/shared/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Lab",
  description:
    "Small interfaces and components Joshua Booth builds to get the details right.",
  path: "/lab",
});

export default async function Page() {
  if (!(await getSiteFlags()).lab) notFound();

  return <LabPage />;
}
