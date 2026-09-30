import { describe, expect, it } from "vitest";

import { describeRecurrence, START_DAYS, toggleDay } from "./recurrence";

const days = (...on: number[]) =>
  Array.from({ length: 7 }, (_, i) => on.includes(i));

describe("describeRecurrence", () => {
  it("reads the starting rule", () => {
    expect(describeRecurrence(START_DAYS)).toBe(
      "Every 2 weeks on Monday and Wednesday"
    );
  });

  it("names a single day on its own", () => {
    expect(describeRecurrence(days(6))).toBe("Every 2 weeks on Sunday");
  });

  it("joins three or more days with commas and a final and", () => {
    expect(describeRecurrence(days(0, 2, 4))).toBe(
      "Every 2 weeks on Monday, Wednesday and Friday"
    );
  });

  it("asks for a day when none are picked", () => {
    expect(describeRecurrence(days())).toBe("Pick at least one day");
  });

  it("keeps the week order whatever order days were picked in", () => {
    expect(describeRecurrence(toggleDay(toggleDay(days(), 4), 1))).toBe(
      "Every 2 weeks on Tuesday and Friday"
    );
  });
});

describe("toggleDay", () => {
  it("turns one day on or off and leaves the rest", () => {
    expect(toggleDay(START_DAYS, 0)).toEqual(days(2));
    expect(toggleDay(START_DAYS, 1)).toEqual(days(0, 1, 2));
  });
});
