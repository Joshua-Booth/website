import type { PagePath } from "@/shared/config/pages";

export function exportPath(path: PagePath, extension: "html" | "txt"): string {
  return path === "/" ? `/index.${extension}` : `${path}.${extension}`;
}
