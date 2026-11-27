"use client";

import Link from "next/link";
import { useEffect } from "react";

import { EMAIL } from "@/shared/config/site";

// Replaces the root layout, so it gets none of the site's styles: plain and
// self-contained on purpose
const page = {
  margin: 0,
  padding: "96px 20px",
  fontFamily: "system-ui, sans-serif",
  color: "#0e0e10",
  background: "#fff",
  maxWidth: "620px",
} as const;

export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en-NZ">
      <body style={page}>
        <title>Something went wrong</title>
        <h1 style={{ fontSize: "40px", fontWeight: 500, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: "18px", color: "#55575d" }}>
          This page hit an error while loading. It&apos;s most likely a one-off,
          so try again.
        </p>
        <p>
          <button type="button" onClick={retry}>
            Try again
          </button>{" "}
          <Link href="/">Go to the home page</Link>
        </p>
        <p style={{ fontSize: "16px", color: "#55575d" }}>
          If it keeps happening, email me at{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      </body>
    </html>
  );
}
