import type { SiteFlags } from "@/shared/config/flags";
import { isLive, mdPath, PAGE_PATHS } from "@/shared/config/pages";

import { exportPath } from "./paths";

export function netlifyRedirects(flags: SiteFlags): string {
  return PAGE_PATHS.flatMap((path) =>
    isLive(path, flags)
      ? []
      : [
          path,
          exportPath(path, "html"),
          exportPath(path, "txt"),
          mdPath(path),
          `${path}/*`,
        ]
  )
    .map((from) => `${from}  /404.html  404!\n`)
    .join("");
}
