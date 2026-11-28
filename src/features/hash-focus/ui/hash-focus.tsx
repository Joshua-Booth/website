"use client";

import { usePathname } from "next/navigation";

import { useHashFocus, useSectionFocus } from "./use-hash-focus";

/**
 * A link to a button or link on the page moves focus to it, and a link to a
 * section moves focus there.
 */
export function HashFocus() {
  return <HashFocusRun key={usePathname()} />;
}

function HashFocusRun() {
  useHashFocus();
  useSectionFocus();

  return null;
}
