"use client";

import { useState } from "react";

import * as stylex from "@stylexjs/stylex";

import { colors } from "@/shared/ui/tokens.stylex";

import {
  DAYS,
  describeRecurrence,
  START_DAYS,
  toggleDay,
  WEEKS,
} from "../../model/recurrence";
import { surface } from "../tile-tokens.stylex";

const styles = stylex.create({
  line: {
    margin: 0,
  },
  num: {
    display: "inline-block",
    paddingBlock: "1px",
    paddingInline: "8px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: surface.lightRule,
    borderRadius: "5px",
    backgroundColor: surface.card,
    fontWeight: 600,
  },
  days: {
    display: "flex",
    gap: "5px",
    marginBlock: "10px",
  },
  day: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    minWidth: 0,
    paddingBlock: "7px",
    paddingInline: 0,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: surface.lightRule,
    borderRadius: "6px",
    backgroundColor: surface.card,
    color: surface.lightInk,
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
  },
  dayOn: {
    borderColor: colors.ground,
    backgroundColor: colors.ground,
    color: colors.ink,
  },
  say: {
    margin: 0,
    color: surface.lightSoft,
  },
});

export function RecurrenceEditor() {
  const [days, setDays] = useState(START_DAYS);

  return (
    <div>
      <p {...stylex.props(styles.line)}>
        Every <span {...stylex.props(styles.num)}>{WEEKS}</span> weeks on
      </p>
      <div role="group" aria-label="Days" {...stylex.props(styles.days)}>
        {DAYS.map((day, i) => {
          const on = days[i] ?? false;

          return (
            <button
              key={day}
              type="button"
              aria-label={day}
              aria-pressed={on}
              onClick={() => {
                setDays((current) => toggleDay(current, i));
              }}
              {...stylex.props(styles.day, on && styles.dayOn)}
            >
              {day[0]}
            </button>
          );
        })}
      </div>
      <p aria-live="polite" {...stylex.props(styles.say)}>
        {describeRecurrence(days)}
      </p>
    </div>
  );
}
