"use client";

import { useState } from "react";

import * as stylex from "@stylexjs/stylex";

import { colors, fonts } from "@/shared/ui/tokens.stylex";

const styles = stylex.create({
  dial: {
    display: "grid",
    gap: "12px",
  },
  stretch: (width: number) => ({ fontStretch: `${width}%` }),
  word: {
    fontFamily: fonts.sans,
    fontWeight: 850,
    fontSize: "calc((100cqw - 38px) / 6.1)",
    lineHeight: 1,
    textTransform: "uppercase",
    letterSpacing: "-0.01em",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  label: {
    display: "grid",
    gap: "10px",
  },
  reading: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: fonts.sans,
    fontWeight: 500,
    fontSize: "13px",
    lineHeight: "normal",
    fontVariantNumeric: "tabular-nums",
    color: colors.soft,
  },
  range: {
    width: "100%",
    accentColor: colors.ink,
  },
});

export function WidthDial() {
  const [width, setWidth] = useState(125);

  return (
    <div {...stylex.props(styles.dial)}>
      <span {...stylex.props(styles.word, styles.stretch(width))}>Archivo</span>
      <label {...stylex.props(styles.label)}>
        <span {...stylex.props(styles.reading)}>
          Width <output>{width}%</output>
        </span>
        <input
          type="range"
          min={62}
          max={125}
          aria-label="Font width"
          value={width}
          onChange={(event) => {
            setWidth(Number(event.target.value));
          }}
          {...stylex.props(styles.range)}
        />
      </label>
    </div>
  );
}
