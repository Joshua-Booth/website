import { describe, expect, it } from "vitest";

import { formatDuration, stepMinutes } from "./duration";

describe("formatDuration", () => {
  it.each([
    [85, "1 h 25 min"],
    [60, "1 h"],
    [45, "45 min"],
    [5, "5 min"],
    [600, "10 h"],
    [125, "2 h 5 min"],
  ])("formats %i minutes as %s", (minutes, text) => {
    expect(formatDuration(minutes)).toBe(text);
  });
});

describe("stepMinutes", () => {
  it("steps by five minutes", () => {
    expect(stepMinutes(85, 5)).toBe(90);
    expect(stepMinutes(85, -5)).toBe(80);
  });

  it("stops at five minutes and at ten hours", () => {
    expect(stepMinutes(5, -5)).toBe(5);
    expect(stepMinutes(600, 5)).toBe(600);
  });
});
