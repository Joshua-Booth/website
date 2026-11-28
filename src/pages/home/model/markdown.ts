import { JOBS, jobLine } from "@/entities/job/model/jobs";
import { BIG_PROJECTS, showcaseLine } from "@/entities/project/model/showcase";

import type { SiteFlags } from "@/shared/config/flags";
import type { Study } from "@/shared/config/pages";
import { liveStudy, mdUrl } from "@/shared/config/pages";
import { EMAIL, INTRO, LINKS } from "@/shared/config/site";

export function homeMarkdown(flags: SiteFlags): string {
  const study = (s: Study | undefined) => {
    const live = liveStudy(s, flags);

    return live ? ` ([${live.go}](${mdUrl(live.href)}))` : "";
  };

  const projects = [
    ...BIG_PROJECTS.map((p) => `- ${showcaseLine(p)}`),
    "",
    `[All projects](${mdUrl("/projects")})`,
  ];

  return [
    `**${INTRO.role}.** ${INTRO.line}`,
    "",
    "## Work",
    "",
    ...JOBS.map((job) => `- ${jobLine(job)}${study(job.study)}`),
    "",
    "## Projects",
    "",
    ...projects,
    "",
    "## Contact",
    "",
    `- Email: [${EMAIL}](mailto:${EMAIL})`,
    `- [LinkedIn](${LINKS.linkedin})`,
    `- [GitHub](${LINKS.github})`,
  ].join("\n");
}
