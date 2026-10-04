import { homeMarkdown } from "@/pages/home/model/markdown";
import { labMarkdown } from "@/pages/lab/model/markdown";
import { pcosProtocolMarkdown } from "@/pages/pcos-protocol/model/markdown";
import { thisSiteMarkdown } from "@/pages/this-site/model/markdown";

import { getSiteFlags } from "@/shared/api/site-flags";
import type { SiteFlags } from "@/shared/config/flags";
import type { PagePath } from "@/shared/config/pages";
import { isLive } from "@/shared/config/pages";
import { pageHeading } from "@/shared/lib/page-metadata";

type PageBody = (flags: SiteFlags) => string | Promise<string>;

const BODIES: Record<PagePath, PageBody> = {
  "/": homeMarkdown,
  "/work/pcos-protocol": pcosProtocolMarkdown,
  "/writing/this-site": thisSiteMarkdown,
  "/lab": labMarkdown,
};

export async function livePage(
  path: PagePath,
  flags: SiteFlags
): Promise<{ heading: string; body: string } | null> {
  if (!isLive(path, flags)) return null;

  return { heading: pageHeading(path), body: await BODIES[path](flags) };
}

export async function pageMarkdown(
  path: PagePath,
  flags: SiteFlags
): Promise<string | null> {
  const page = await livePage(path, flags);

  return page && `# ${page.heading}\n\n${page.body}\n`;
}

const NOT_FOUND = `# Not found

Sorry, I can't find that page. The link may be out of date, or there might be a typo in the address.
`;

export async function markdownResponse(path: PagePath): Promise<Response> {
  const markdown = await pageMarkdown(path, await getSiteFlags());

  return new Response(markdown ?? NOT_FOUND, {
    status: markdown ? 200 : 404,
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
