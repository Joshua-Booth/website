import { ProjectsPage } from "@/pages/projects/ui/projects-page";

import { gatePage } from "@/shared/api/gate-page";
import { pageMetadata } from "@/shared/lib/page-metadata";

export const metadata = pageMetadata("/projects");

export default async function Page() {
  await gatePage("/projects");

  return <ProjectsPage />;
}
