import { llmsFull } from "@/app/markdown/llms-full";

import { getSiteFlags } from "@/shared/api/site-flags";

export const dynamic = "force-static";

export async function GET() {
  return new Response(await llmsFull(await getSiteFlags()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
