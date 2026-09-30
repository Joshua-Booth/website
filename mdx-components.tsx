import type { MDXComponents } from "mdx/types";

import { proseComponents } from "@/shared/ui/prose";

/** @public Loaded by name by @next/mdx. */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...proseComponents, ...components };
}
