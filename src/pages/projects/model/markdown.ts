import {
  BIG_PROJECTS,
  SMALL_PROJECTS,
  showcaseLine,
} from "@/entities/project/model/showcase";

export function projectsMarkdown(): string {
  return [
    ...BIG_PROJECTS.map((p) => `- ${showcaseLine(p)}`),
    "",
    "## Designs, games and tools",
    "",
    ...SMALL_PROJECTS.map((p) => `- ${showcaseLine(p)}`),
  ].join("\n");
}
