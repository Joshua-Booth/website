"use client";

import { useState } from "react";

import * as stylex from "@stylexjs/stylex";

import {
  formatDuration,
  START_MINUTES,
  stepMinutes,
} from "../../model/duration";
import { surface } from "../tile-tokens.stylex";

const styles = stylex.create({
  label: {
    color: surface.lightSoft,
    marginTop: 0,
    marginInline: 0,
    marginBottom: "8px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  step: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: surface.lightRule,
    backgroundColor: surface.card,
    fontSize: "18px",
    lineHeight: 1,
    cursor: "pointer",
    color: surface.lightInk,
  },
  value: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    textAlign: "center",
    fontWeight: 750,
    fontStretch: "112%",
    fontSize: "22px",
    fontVariantNumeric: "tabular-nums",
  },
});

const STEP = 5;

export function DurationInput() {
  const [minutes, setMinutes] = useState(START_MINUTES);

  const step = (by: number) => {
    setMinutes((current) => stepMinutes(current, by));
  };

  return (
    <>
      <p {...stylex.props(styles.label)}>Cook time</p>
      <div {...stylex.props(styles.row)}>
        <button
          type="button"
          aria-label="Five minutes less"
          onClick={() => {
            step(-STEP);
          }}
          {...stylex.props(styles.step)}
        >
          −
        </button>
        <output {...stylex.props(styles.value)}>
          {formatDuration(minutes)}
        </output>
        <button
          type="button"
          aria-label="Five minutes more"
          onClick={() => {
            step(STEP);
          }}
          {...stylex.props(styles.step)}
        >
          +
        </button>
      </div>
    </>
  );
}
