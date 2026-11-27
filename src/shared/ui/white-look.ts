import * as stylex from "@stylexjs/stylex";

import { colors } from "./tokens.stylex";

// The white look the redesign flag turns on: near-black ink on white, grey for
// quieter text and rules. It has no x-ray, so the x-ray's colours just follow
// the ink
export const whiteLook = stylex.createTheme(colors, {
  ground: "#fff",
  ink: "#0e0e10",
  soft: "#55575d",
  faint: "#8a8c92",
  rule: "#e4e4e7",
  invertBg: "#0e0e10",
  invertInk: "#fff",
  measure: "#ff9ebb",
  mat: "#f3f3f1",
  xrayStroke: "#0e0e10",
  xrayText: "#55575d",
  xrayDash: "#e4e4e7",
});
