import type { PagePath } from "../config/pages";

import { mdUrl, pageListing } from "../config/pages";

export const MARKDOWN_TYPE = "text/markdown; charset=utf-8";

export function dropFullStop(sentence: string): string {
  return sentence.endsWith(".") ? sentence.slice(0, -1) : sentence;
}

export function pageLine(path: PagePath): string {
  const { label, note } = pageListing(path);

  return `[${label}](${mdUrl(path)}): ${dropFullStop(note)}`;
}
