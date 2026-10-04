import type { SiteFlags } from "@/shared/config/flags";
import { PAGE_PATHS } from "@/shared/config/pages";
import { SITE_URL } from "@/shared/config/site";

import { livePage } from "./pages";

export async function llmsFull(flags: SiteFlags): Promise<string> {
  const sections = await Promise.all(
    PAGE_PATHS.map(async (path) => {
      const page = await livePage(path, flags);

      return (
        page && `# ${page.heading}\nSource: ${SITE_URL}${path}\n\n${page.body}`
      );
    })
  );

  return `${sections.filter((section) => section !== null).join("\n\n")}\n`;
}
