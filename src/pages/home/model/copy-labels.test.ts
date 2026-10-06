import { expect, it } from "vitest";

import { copyLabels } from "./copy-labels";

it("keeps every label but shows only the current one", () => {
  expect(copyLabels("Copied")).toEqual([
    { text: "Copy address", hidden: true },
    { text: "Copied", hidden: false },
    { text: "Selected", hidden: true },
  ]);
});
