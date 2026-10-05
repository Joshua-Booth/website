import { notFound } from "next/navigation";

import type { SiteFlags } from "@/shared/config/flags";
import type { PagePath } from "@/shared/config/pages";
import { isLive } from "@/shared/config/pages";

import { getSiteFlags } from "./site-flags";

export async function gatePage(path: PagePath): Promise<SiteFlags> {
  const flags = await getSiteFlags();

  if (!isLive(path, flags)) notFound();

  return flags;
}
