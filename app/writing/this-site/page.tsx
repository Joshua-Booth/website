import { notFound } from "next/navigation";

import { ThisSitePage } from "@/pages/this-site/ui/this-site-page";

import { getSiteFlags } from "@/shared/api/site-flags";
import { pageMetadata } from "@/shared/lib/page-metadata";

export const metadata = pageMetadata({
  title: "How this site is built",
  description:
    "How joshuabooth.nz is built in Next.js, and how its pages build themselves.",
  path: "/writing/this-site",
});

export default async function Page() {
  const flags = await getSiteFlags();

  if (!flags.thisSiteCaseStudy) notFound();

  return <ThisSitePage lab={flags.lab} />;
}
