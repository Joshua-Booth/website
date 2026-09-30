import * as stylex from "@stylexjs/stylex";

import { xrayMarker } from "./markers.stylex";
import { colors } from "./tokens.stylex";

export const xray = stylex.create({
  outlined: {
    color: {
      default: null,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: "transparent",
    },
    WebkitTextStroke: {
      default: null,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]:
        `1.5px ${colors.xrayStroke}`,
    },
  },
  ruleTop: {
    borderTopStyle: {
      default: "solid",
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: "dashed",
    },
    borderTopColor: {
      default: colors.rule,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayDash,
    },
  },
  ruleBottom: {
    borderBottomStyle: {
      default: "solid",
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: "dashed",
    },
    borderBottomColor: {
      default: colors.rule,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayDash,
    },
  },
  ruleAll: {
    borderStyle: {
      default: "solid",
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: "dashed",
    },
    borderColor: {
      default: colors.rule,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayDash,
    },
  },
});
