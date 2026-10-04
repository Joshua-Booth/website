import type { SiteFlags } from "@/shared/config/flags";
import { livePages, mdPath } from "@/shared/config/pages";
import { SITE_URL } from "@/shared/config/site";

import { htmlPath } from "./paths";

const DESCRIBED_BY = '</llms.txt>; rel="describedby"';

export function netlifyHeaders(flags: SiteFlags): string {
  return livePages(flags)
    .flatMap((path) => [
      `${path}\n  Link: ${DESCRIBED_BY}\n`,
      `${htmlPath(path)}\n  Link: ${DESCRIBED_BY}\n`,
      `${mdPath(path)}\n  Link: <${SITE_URL}${path}>; rel="canonical", ${DESCRIBED_BY}\n`,
    ])
    .join("\n");
}
