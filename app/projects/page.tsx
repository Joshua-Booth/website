import type { Metadata } from "next";

import { ProjectsPage } from "@/pages/projects/ui/projects-page";

import { gatePage } from "@/shared/api/gate-page";
import { pageMetadata } from "@/shared/lib/page-metadata";

export const metadata: Metadata = pageMetadata("/projects");

export default async function Page() {
  await gatePage("/projects");

  return <ProjectsPage />;
}
