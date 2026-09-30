import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  hidden: {
    position: "absolute",
    width: "1px",
    height: "1px",
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
  },
});

export function NewTabNote() {
  return <span {...stylex.props(styles.hidden)}> (opens in a new tab)</span>;
}
