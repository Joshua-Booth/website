/* eslint-disable check-file/folder-naming-convention -- %5F is how Next.js names a route that starts with an underscore */
import { getSiteFlags } from "@/shared/api/site-flags";
import { FLAGGED_PAGES } from "@/shared/config/flags";

// A static export only builds route handlers that are marked static
export const dynamic = "force-static";

/**
 * Netlify's redirect rules, built into the export as `_redirects`. A flagged
 * page that's off is still exported, showing the not-found page, so each rule
 * has Netlify answer it with a 404 instead of a 200.
 */
export async function GET(): Promise<Response> {
  const flags = await getSiteFlags();

  const rules = FLAGGED_PAGES.filter(({ flag }) => !flags[flag]).map(
    ({ path }) => `${path} /404.html 404!\n`
  );

  return new Response(rules.join(""), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
