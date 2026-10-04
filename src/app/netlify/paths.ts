import type { PagePath } from "@/shared/config/pages";
import { exportPath, mdPath } from "@/shared/config/pages";

export function exportedPaths(path: PagePath): string[] {
  return [
    path,
    exportPath(path, "html"),
    exportPath(path, "txt"),
    mdPath(path),
    ...(path === "/" ? [] : [`${path}/*`]),
  ];
}
