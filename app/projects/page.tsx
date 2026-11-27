import type { Metadata } from "next";

import { ProjectsPage } from "@/pages/projects/ui/projects-page";

import { gatePage } from "@/shared/api/gate-page";
import { getSiteFlags } from "@/shared/api/site-flags";
import { inLook, pageMetadata } from "@/shared/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { redesign } = await getSiteFlags();

  return inLook(pageMetadata("/projects"), redesign);
}

export default async function Page() {
  await gatePage("/projects");

  return <ProjectsPage />;
}
