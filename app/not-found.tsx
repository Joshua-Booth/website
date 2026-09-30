import type { Metadata } from "next";

import { NotFoundPage } from "@/pages/not-found/ui/not-found-page";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false },
};

export default function NotFound() {
  return <NotFoundPage />;
}
