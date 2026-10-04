import { netlifyHeaders } from "@/app/netlify/headers";

import { getSiteFlags } from "@/shared/api/site-flags";

export const dynamic = "force-static";

export async function GET() {
  return new Response(netlifyHeaders(await getSiteFlags()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
