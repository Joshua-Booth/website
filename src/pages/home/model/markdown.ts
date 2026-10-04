import { JOBS, jobLine } from "@/entities/job/model/jobs";
import { PROJECTS, projectLine } from "@/entities/project/model/projects";

import type { SiteFlags } from "@/shared/config/flags";
import type { Study } from "@/shared/config/pages";
import { isLive } from "@/shared/config/pages";
import { EMAIL, INTRO, LINKS } from "@/shared/config/site";
import { mdUrl, pageLine } from "@/shared/lib/markdown";

export function homeMarkdown(flags: SiteFlags): string {
  const study = (s: Study | undefined) =>
    s && isLive(s.path, flags) ? ` ([${s.go}](${mdUrl(s.path)}))` : "";

  return [
    `**${INTRO.lead}** ${INTRO.rest}`,
    "",
    "## Work",
    "",
    ...JOBS.map((job) => `- ${jobLine(job)}${study(job.study)}`),
    "",
    "## Projects",
    "",
    ...PROJECTS.map((p) => `- ${projectLine(p)}${study(p.study)}`),
    "",
    ...(isLive("/lab", flags)
      ? ["## Lab", "", `- ${pageLine("/lab")}`, ""]
      : []),
    "## Contact",
    "",
    `- Email: [${EMAIL}](mailto:${EMAIL})`,
    `- [LinkedIn](${LINKS.linkedin})`,
    `- [GitHub](${LINKS.github})`,
  ].join("\n");
}
