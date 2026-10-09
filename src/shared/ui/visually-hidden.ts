import * as stylex from "@stylexjs/stylex";

export const visuallyHidden = stylex.create({
  text: {
    position: "absolute",
    width: "1px",
    height: "1px",
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
  },
});
