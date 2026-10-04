import { netlifyRedirects } from "@/app/netlify/redirects";

import { getSiteFlags } from "@/shared/api/site-flags";

export const dynamic = "force-static";

export async function GET() {
  return new Response(netlifyRedirects(await getSiteFlags()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
