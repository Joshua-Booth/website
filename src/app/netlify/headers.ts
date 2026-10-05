import type { SiteFlags } from "@/shared/config/flags";
import { livePages, mdPath, pageUrl } from "@/shared/config/pages";
import { MARKDOWN_TYPE } from "@/shared/lib/markdown";

import { exportPath } from "./paths";

const DESCRIBED_BY = '</llms.txt>; rel="describedby"';
const PLAIN_TYPE = "text/plain; charset=utf-8";
const LLMS_FILES = ["/llms.txt", "/llms-full.txt"] as const;

export function netlifyHeaders(flags: SiteFlags): string {
  return [
    ...livePages(flags).flatMap((path) => [
      `${path}\n  Link: ${DESCRIBED_BY}\n`,
      `${exportPath(path, "html")}\n  Link: ${DESCRIBED_BY}\n`,
      `${mdPath(path)}\n  Content-Type: ${MARKDOWN_TYPE}\n  Link: <${pageUrl(path)}>; rel="canonical", ${DESCRIBED_BY}\n`,
    ]),
    ...LLMS_FILES.map((path) => `${path}\n  Content-Type: ${PLAIN_TYPE}\n`),
  ].join("\n");
}
