export interface KeyPress {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}

const MODIFIERS = [
  { key: "Meta", held: "metaKey", symbol: "⌘" },
  { key: "Control", held: "ctrlKey", symbol: "⌃" },
  { key: "Alt", held: "altKey", symbol: "⌥" },
  { key: "Shift", held: "shiftKey", symbol: "⇧" },
] as const;

export const START_KEYS: readonly string[] = ["⌘", "⇧", "K"];

export function recordHotkey(
  e: KeyPress
): readonly string[] | "clear" | "pass" | "wait" {
  if (e.key === "Tab") return "pass";
  if (e.key === "Escape") return "clear";
  if (MODIFIERS.some((modifier) => modifier.key === e.key)) return "wait";

  const held = MODIFIERS.filter((modifier) => e[modifier.held]).map(
    (modifier) => modifier.symbol
  );

  const key =
    e.key.length === 1 ? e.key.toUpperCase() : e.key.replace("Arrow", "");

  return [...held, key];
}
