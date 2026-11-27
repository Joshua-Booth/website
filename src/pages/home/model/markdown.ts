import { JOBS, jobLine } from "@/entities/job/model/jobs";
import { PROJECTS, projectLine } from "@/entities/project/model/projects";
import { BIG_PROJECTS, showcaseLine } from "@/entities/project/model/showcase";

import type { SiteFlags } from "@/shared/config/flags";
import type { Study } from "@/shared/config/pages";
import { isLive, liveStudy, mdUrl } from "@/shared/config/pages";
import { DESIGN_ENGINEER, EMAIL, INTRO, LINKS } from "@/shared/config/site";
import { pageLine } from "@/shared/lib/markdown";

export function homeMarkdown(flags: SiteFlags): string {
  const study = (s: Study | undefined) => {
    const live = liveStudy(s, flags);

    return live ? ` ([${live.go}](${mdUrl(live.href)}))` : "";
  };

  const projects = flags.redesign
    ? [
        ...BIG_PROJECTS.map((p) => `- ${showcaseLine(p)}`),
        "",
        `[All projects](${mdUrl("/projects")})`,
      ]
    : PROJECTS.map((p) => `- ${projectLine(p)}${study(p.study)}`);

  return [
    flags.redesign
      ? `**${DESIGN_ENGINEER.role}.** ${DESIGN_ENGINEER.line}`
      : `**${INTRO.lead}** ${INTRO.rest}`,
    "",
    "## Work",
    "",
    ...JOBS.map((job) => `- ${jobLine(job)}${study(job.study)}`),
    "",
    "## Projects",
    "",
    ...projects,
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
