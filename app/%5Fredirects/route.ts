import { netlifyRedirects } from "@/app/netlify/redirects";

import { getSiteFlags } from "@/shared/api/site-flags";

// Exported as _redirects, which Netlify reads to answer 404 for the pages whose
// flags are off. Next.js treats a folder that starts with an underscore as
// private, so this one starts with %5F, an encoded underscore
export const dynamic = "force-static";

export async function GET() {
  return new Response(netlifyRedirects(await getSiteFlags()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
