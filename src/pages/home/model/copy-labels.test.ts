import { describe, expect, it } from "vitest";

import { COPY_LABELS, copyLabels } from "./copy-labels";

describe("copyLabels", () => {
  it.each(COPY_LABELS)("keeps every label but shows only %s", (current) => {
    const labels = copyLabels(current);

    expect(labels.map(({ text }) => text)).toEqual([...COPY_LABELS]);

    expect(labels.filter(({ hidden }) => !hidden)).toEqual([
      { text: current, hidden: false },
    ]);
  });
});
