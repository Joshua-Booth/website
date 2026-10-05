import { JOBS, jobLine } from "@/entities/job/model/jobs";
import { PROJECTS, projectLine } from "@/entities/project/model/projects";

import type { SiteFlags } from "@/shared/config/flags";
import { livePages } from "@/shared/config/pages";
import {
  DESCRIPTION,
  EMAIL,
  LINKS,
  NAME,
  SITE_URL,
} from "@/shared/config/site";
import { pageLine } from "@/shared/lib/markdown";

export function llmsTxt(flags: SiteFlags): string {
  return [
    `# ${NAME}`,
    "",
    `> ${DESCRIPTION}`,
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
    ...PROJECTS.map((project) => `- ${projectLine(project)}`),
    "",
    "## Optional",
    "",
    `- [GitHub](${LINKS.github}): Open-source work`,
    `- [LinkedIn](${LINKS.linkedin}): Professional profile`,
    `- [Full site](${SITE_URL}/llms-full.txt): Every page in one file`,
    "",
  ].join("\n");
}
