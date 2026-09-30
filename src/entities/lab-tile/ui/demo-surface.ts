import * as stylex from "@stylexjs/stylex";

import { fonts } from "@/shared/ui/tokens.stylex";

import { surface } from "./tile-tokens.stylex";

export const demo = stylex.create({
  base: {
    padding: "18px",
    fontSize: "14px",
    lineHeight: 1.4,
  },
  strip: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  light: {
    backgroundColor: surface.lightBg,
    color: surface.lightInk,
  },
  code: {
    backgroundColor: surface.codeBg,
    color: surface.codeInk,
    fontFamily: fonts.mono,
    fontWeight: 500,
    fontSize: "13px",
    // Each line is a tap target in the JSON inspector, so it's at least 24px
    lineHeight: "24px",
  },
});

export const card = stylex.create({
  card: {
    backgroundColor: surface.card,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: surface.lightRule,
    borderRadius: "8px",
    boxShadow: "0 1px 2px rgba(21, 23, 28, 0.06)",
  },
});
