import { expect, it } from "vitest";

import { copyLabels, nextCopyAnnouncement } from "./copy-labels";

it("keeps every label but shows only the current one", () => {
  expect(copyLabels("Copied")).toEqual([
    { text: "Copy address", hidden: true },
    { text: "Copied", hidden: false },
    { text: "Selected", hidden: true },
  ]);
});

it("announces a new copy status once, not again on the same status", () => {
  expect(nextCopyAnnouncement("", "Copied")).toBe("Copied");
  expect(nextCopyAnnouncement("Copied", "Copied")).toBe("Copied");
  expect(nextCopyAnnouncement("Copied", "Selected")).toBe("Selected");
  expect(nextCopyAnnouncement("", "Selected")).toBe("Selected");
});
