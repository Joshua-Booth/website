import * as stylex from "@stylexjs/stylex";

import { colors } from "./tokens.stylex";

export const interactive = stylex.create({
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
});
