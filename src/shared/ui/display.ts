import * as stylex from "@stylexjs/stylex";

export const display = stylex.create({
  type: {
    fontWeight: 850,
    fontStretch: "125%",
    textTransform: "uppercase",
  },
  big: {
    fontSize: "clamp(30px, 6.2cqw, 86px)",
    lineHeight: 0.92,
    letterSpacing: "-0.015em",
  },
});
