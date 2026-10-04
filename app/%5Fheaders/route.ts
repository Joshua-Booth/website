import { netlifyHeaders } from "@/app/netlify/headers";

import { getSiteFlags } from "@/shared/api/site-flags";

// Exported as _headers, which Netlify reads for each page's Link headers.
// Next.js treats a folder that starts with an underscore as private, so this
// one starts with %5F, an encoded underscore
export const dynamic = "force-static";

export async function GET() {
  return new Response(netlifyHeaders(await getSiteFlags()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
