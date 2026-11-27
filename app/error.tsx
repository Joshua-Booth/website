"use client";

import { useEffect } from "react";

import { ErrorPage } from "@/pages/error/ui/error-page";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorPage retry={retry} />;
}
