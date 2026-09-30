import { describe, expect, it } from "vitest";

import { recordHotkey } from "./hotkey";

const press = (
  key: string,
  mods: Partial<
    Record<"metaKey" | "ctrlKey" | "altKey" | "shiftKey", boolean>
  > = {}
) => ({
  key,
  metaKey: false,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  ...mods,
});

describe("recordHotkey", () => {
  it("shows modifiers in Mac order, then the key in capitals", () => {
    expect(recordHotkey(press("k", { shiftKey: true, metaKey: true }))).toEqual(
      ["⌘", "⇧", "K"]
    );

    expect(recordHotkey(press("p", { altKey: true, ctrlKey: true }))).toEqual([
      "⌃",
      "⌥",
      "P",
    ]);
  });

  it("names arrow keys without the word Arrow", () => {
    expect(recordHotkey(press("ArrowLeft", { metaKey: true }))).toEqual([
      "⌘",
      "Left",
    ]);
  });

  it("keeps other named keys as they are", () => {
    expect(recordHotkey(press("Enter"))).toEqual(["Enter"]);
  });

  it("waits while only a modifier is held", () => {
    expect(recordHotkey(press("Shift", { shiftKey: true }))).toBe("wait");
    expect(recordHotkey(press("Meta", { metaKey: true }))).toBe("wait");
  });

  it("lets Tab and Shift+Tab move focus on", () => {
    expect(recordHotkey(press("Tab"))).toBe("pass");
    expect(recordHotkey(press("Tab", { shiftKey: true }))).toBe("pass");
  });

  it("clears on Escape", () => {
    expect(recordHotkey(press("Escape"))).toBe("clear");
  });
});
