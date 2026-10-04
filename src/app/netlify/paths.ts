import type { PagePath } from "@/shared/config/pages";

export function htmlPath(path: PagePath): string {
  return path === "/" ? "/index.html" : `${path}.html`;
}
