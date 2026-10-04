import type { PagePath } from "../config/pages";

import { mdPath, pageListing } from "../config/pages";
import { SITE_URL } from "../config/site";

export function dropFullStop(sentence: string): string {
  return sentence.endsWith(".") ? sentence.slice(0, -1) : sentence;
}

export function mdUrl(path: PagePath): string {
  return `${SITE_URL}${mdPath(path)}`;
}

export function pageLine(path: PagePath): string {
  const { label, note } = pageListing(path);

  return `[${label}](${mdUrl(path)}): ${dropFullStop(note)}`;
}
