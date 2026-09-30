import * as stylex from "@stylexjs/stylex";

import { colors, fonts } from "@/shared/ui/tokens.stylex";

const styles = stylex.create({
  figure: {
    position: "relative",
    height: "150px",
    overflow: "hidden",
    marginTop: "-18px",
    marginInline: "-18px",
    marginBottom: "14px",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: colors.rule,
  },
  letters: {
    position: "absolute",
    left: "-0.6em",
    top: "calc(40px - 0.146em)",
    fontFamily: fonts.sans,
    fontWeight: 850,
    fontSize: "calc(100cqw / 1.1)",
    lineHeight: 1,
    fontStretch: "125%",
    whiteSpace: "nowrap",
  },
  line: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "40px",
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: colors.measure,
    marginTop: "-0.5px",
  },
  note: {
    position: "absolute",
    left: "12px",
    top: "18px",
    fontFamily: fonts.sans,
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: "normal",
    color: colors.measure,
  },
  caption: {
    margin: 0,
    color: colors.soft,
    fontSize: "13px",
  },
});

export function Overshoot() {
  return (
    <>
      <div aria-hidden="true" {...stylex.props(styles.figure)}>
        <span {...stylex.props(styles.letters)}>HO</span>
        <span {...stylex.props(styles.line)} />
        <small {...stylex.props(styles.note)}>cap height</small>
      </div>
      <p {...stylex.props(styles.caption)}>
        The O rises 12 of 1000 units past the cap height, so it looks as tall as
        the H.
      </p>
    </>
  );
}
