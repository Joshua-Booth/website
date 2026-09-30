import { describe, expect, it } from "vitest";

import { FILTERS, isShown } from "./filter";
import { GRID, TILES } from "./tiles";

describe("isShown", () => {
  it("shows every tile under All", () => {
    expect(GRID.every((id) => isShown(TILES[id].kind, "all"))).toBe(true);
  });

  it("shows only the tiles of the chosen kind", () => {
    const shown = GRID.filter((id) => isShown(TILES[id].kind, "experiment"));

    expect(shown.every((id) => TILES[id].kind === "experiment")).toBe(true);
  });

  it("leaves no filter empty", () => {
    for (const { value } of FILTERS) {
      expect(GRID.some((id) => isShown(TILES[id].kind, value))).toBe(true);
    }
  });
});
