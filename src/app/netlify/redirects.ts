import type { SiteFlags } from "@/shared/config/flags";
import { isLive, PAGE_PATHS } from "@/shared/config/pages";

import { exportedPaths } from "./paths";

export function netlifyRedirects(flags: SiteFlags): string {
  return PAGE_PATHS.flatMap((path) =>
    isLive(path, flags) ? [] : exportedPaths(path)
  )
    .map((from) => `${from}  /404.html  404!\n`)
    .join("");
}
