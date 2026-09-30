import * as stylex from "@stylexjs/stylex";

import { xrayMarker } from "./markers.stylex";
import { colors } from "./tokens.stylex";

export const interactive = stylex.create({
  /**
   * Whatever you point at or tab to shows its own hover and focus above the
   * x-ray and the build covers.
   */
  raise: {
    position: "relative",
    zIndex: { default: "auto", ":hover": 22, ":focus-visible": 22 },
  },
  link: {
    color: "inherit",
    textUnderlineOffset: "5px",
    textDecorationThickness: "2px",
    textDecorationColor: { default: colors.rule, ":hover": colors.ink },
  },
  pill: {
    borderRadius: "99px",
    fontWeight: 600,
  },
  // In the x-ray, a pill's outline is drawn inside, so the copy keeps the same
  // box
  pillOutline: {
    boxShadow: {
      default: null,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]:
        `inset 0 0 0 1.5px ${colors.faint}`,
    },
  },
});
