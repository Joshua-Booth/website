import type { Metadata } from "next";

import { NotFoundPage } from "@/pages/not-found/ui/not-found-page";
import { WhiteNotFound } from "@/pages/not-found/ui/white-not-found";

import { getSiteFlags } from "@/shared/api/site-flags";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false },
};

export default async function NotFound() {
  const { redesign } = await getSiteFlags();

  return redesign ? <WhiteNotFound /> : <NotFoundPage />;
}
