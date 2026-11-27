import { JOBS, jobLine } from "@/entities/job/model/jobs";
import { PROJECTS, projectLine } from "@/entities/project/model/projects";
import { BIG_PROJECTS, showcaseLine } from "@/entities/project/model/showcase";

import type { SiteFlags } from "@/shared/config/flags";
import { livePages } from "@/shared/config/pages";
import {
  EMAIL,
  LINKS,
  NAME,
  SITE_URL,
  siteDescription,
} from "@/shared/config/site";
import { pageLine } from "@/shared/lib/markdown";

export function llmsTxt(flags: SiteFlags): string {
  return [
    `# ${NAME}`,
    "",
    `> ${siteDescription(flags.redesign)}`,
    "",
    "Work:",
    "",
    ...JOBS.map((job) => `- ${jobLine(job)}`),
    "",
    `Email: [${EMAIL}](mailto:${EMAIL})`,
    "",
    "## Pages",
    "",
    ...livePages(flags).map((path) => `- ${pageLine(path)}`),
    "",
    "## Projects",
    "",
    ...(flags.redesign
      ? BIG_PROJECTS.map((project) => `- ${showcaseLine(project)}`)
      : PROJECTS.map((project) => `- ${projectLine(project)}`)),
    "",
    "## Optional",
    "",
    `- [GitHub](${LINKS.github}): Open-source work`,
    `- [LinkedIn](${LINKS.linkedin}): Professional profile`,
    `- [Full site](${SITE_URL}/llms-full.txt): Every page in one file`,
    "",
  ].join("\n");
}
