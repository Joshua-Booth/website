import type { SiteFlags } from "@/shared/config/flags";
import { livePages, mdPath, pageUrl } from "@/shared/config/pages";

import { exportPath } from "./paths";

const DESCRIBED_BY = '</llms.txt>; rel="describedby"';

export function netlifyHeaders(flags: SiteFlags): string {
  return livePages(flags)
    .flatMap((path) => [
      `${path}\n  Link: ${DESCRIBED_BY}\n`,
      `${exportPath(path, "html")}\n  Link: ${DESCRIBED_BY}\n`,
      `${mdPath(path)}\n  Content-Type: text/markdown; charset=utf-8\n  Link: <${pageUrl(path)}>; rel="canonical", ${DESCRIBED_BY}\n`,
    ])
    .join("\n");
}
