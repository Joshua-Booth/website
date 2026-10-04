import { llmsTxt } from "@/app/markdown/llms-txt";

import { getSiteFlags } from "@/shared/api/site-flags";

export const dynamic = "force-static";

export async function GET() {
  return new Response(llmsTxt(await getSiteFlags()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
