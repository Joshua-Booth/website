import type { SiteFlags } from "@/shared/config/flags";
import { exportPath, isLive, PAGE_PATHS } from "@/shared/config/pages";

export function netlifyRedirects(flags: SiteFlags): string {
  return PAGE_PATHS.flatMap((path) =>
    isLive(path, flags)
      ? []
      : [
          path,
          exportPath(path, "html"),
          exportPath(path, "txt"),
          exportPath(path, "md"),
          `${path}/*`,
        ]
  )
    .map((from) => `${from}  /404.html  404!\n`)
    .join("");
}
