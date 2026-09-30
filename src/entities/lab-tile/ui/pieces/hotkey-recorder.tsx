"use client";

import { useState } from "react";

import * as stylex from "@stylexjs/stylex";

import { colors, fonts } from "@/shared/ui/tokens.stylex";

import { recordHotkey, START_KEYS } from "../../model/hotkey";
import { card } from "../demo-surface";
import { surface } from "../tile-tokens.stylex";

const styles = stylex.create({
  field: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    paddingBlock: "10px",
    paddingInline: "11px",
    cursor: "text",
    minHeight: "52px",
    outlineWidth: { default: null, ":focus-visible": "2px" },
    outlineStyle: { default: null, ":focus-visible": "solid" },
    outlineColor: { default: null, ":focus-visible": colors.ground },
    outlineOffset: { default: null, ":focus-visible": "2px" },
  },
  key: {
    fontFamily: fonts.sans,
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "normal",
    minWidth: "30px",
    textAlign: "center",
    paddingBlock: "5px",
    paddingInline: "8px",
    borderWidth: "1px",
    borderBottomWidth: "3px",
    borderStyle: "solid",
    borderColor: surface.lightRule,
    borderRadius: "6px",
    backgroundColor: surface.card,
  },
  empty: {
    fontStyle: "normal",
    color: surface.lightSoft,
    fontSize: "13px",
  },
  hint: {
    marginTop: "8px",
    marginInline: 0,
    marginBottom: 0,
    color: surface.lightSoft,
    fontSize: "12.5px",
  },
});

export function HotkeyRecorder() {
  const [keys, setKeys] = useState(START_KEYS);

  return (
    <>
      <div
        tabIndex={0}
        role="textbox"
        aria-readonly="true"
        aria-label="Shortcut. Focus and press keys to record one"
        onKeyDown={(event) => {
          const next = recordHotkey(event);

          if (next === "pass") return;

          event.preventDefault();

          if (next === "clear") setKeys([]);
          else if (next !== "wait") setKeys(next);
        }}
        {...stylex.props(card.card, styles.field)}
      >
        {keys.length ? (
          keys.map((key) => (
            <kbd key={key} {...stylex.props(styles.key)}>
              {key}
            </kbd>
          ))
        ) : (
          <em {...stylex.props(styles.empty)}>Press a shortcut</em>
        )}
      </div>
      <p {...stylex.props(styles.hint)}>
        Click, then press a shortcut. Esc clears it.
      </p>
    </>
  );
}
