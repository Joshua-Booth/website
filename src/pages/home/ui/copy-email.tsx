"use client";

import { useEffect, useRef, useState } from "react";

import * as stylex from "@stylexjs/stylex";

import { EMAIL } from "@/shared/config/site";
import { sx } from "@/shared/lib/sx";
import { interactive } from "@/shared/ui/interactive";
import { xrayMarker } from "@/shared/ui/markers.stylex";
import { colors, fonts } from "@/shared/ui/tokens.stylex";

const styles = stylex.create({
  copy: {
    fontFamily: fonts.sans,
    fontSize: "14px",
    lineHeight: "normal",
    backgroundColor: {
      default: colors.invertBg,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: "transparent",
    },
    color: {
      default: colors.invertInk,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.faint,
    },
    borderWidth: 0,
    paddingBlock: "6px",
    paddingInline: "14px",
    cursor: "pointer",
  },
});

/**
 * Copies the address, since a mailto link alone depends on the visitor having a
 * mail app set up.
 */
export function CopyEmail({ addressId }: { addressId: string }) {
  const [label, setLabel] = useState("Copy address");
  const reset = useRef(0);

  useEffect(
    () => () => {
      clearTimeout(reset.current);
    },
    []
  );

  async function copy() {
    try {
      // eslint-disable-next-line baseline-js/use-baseline -- falls back to selecting the address below
      await navigator.clipboard.writeText(EMAIL);
      setLabel("Copied");
    } catch {
      const address = document.getElementById(addressId);
      const selection = getSelection();

      if (address && selection) {
        const range = document.createRange();

        range.selectNodeContents(address);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      setLabel("Selected");
    }

    clearTimeout(reset.current);

    reset.current = window.setTimeout(() => {
      setLabel("Copy address");
    }, 1600);
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      {...sx(
        "copy",
        interactive.raise,
        interactive.pill,
        interactive.pillOutline,
        styles.copy
      )}
    >
      {label}
    </button>
  );
}
