"use client";

import type { CopyLabel, CopyStatus } from "../model/copy-labels";

import { useEffect, useRef, useState } from "react";

import * as stylex from "@stylexjs/stylex";

import { EMAIL } from "@/shared/config/site";
import { interactive } from "@/shared/ui/interactive";
import { colors, fonts } from "@/shared/ui/tokens.stylex";
import { visuallyHidden } from "@/shared/ui/visually-hidden";

import { COPY_RESET_MS, copyLabels } from "../model/copy-labels";

const styles = stylex.create({
  copy: {
    fontFamily: fonts.sans,
    fontSize: "14px",
    lineHeight: "normal",
    // The dark pill lightens on hover, like the site's other buttons
    backgroundColor: { default: colors.invertBg, ":hover": colors.soft },
    color: colors.invertInk,
    borderWidth: 0,
    paddingBlock: "6px",
    paddingInline: "14px",
    cursor: "pointer",
    display: "inline-grid",
  },
  label: {
    gridRow: 1,
    gridColumn: 1,
  },
  // Not display: none, so every label keeps its width in the shared cell and
  // the button stays as wide as the longest. aria-hidden
  // keeps them out of the button's name
  hidden: {
    visibility: "hidden",
  },
});

/**
 * Copies the address, since a mailto link alone depends on the visitor having a
 * mail app set up.
 */
export function CopyEmail({ addressId }: { addressId: string }) {
  const [label, setLabel] = useState<CopyLabel>("Copy address");
  const [announcement, setAnnouncement] = useState("");
  const reset = useRef(0);

  useEffect(
    () => () => {
      clearTimeout(reset.current);
    },
    []
  );

  async function copy() {
    let status: CopyStatus;

    try {
      // eslint-disable-next-line baseline-js/use-baseline -- falls back to selecting the address below
      await navigator.clipboard.writeText(EMAIL);
      status = "Copied";
    } catch {
      const address = document.getElementById(addressId);
      const selection = getSelection();

      if (address && selection) {
        const range = document.createRange();

        range.selectNodeContents(address);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      status = "Selected";
    }

    setLabel(status);
    setAnnouncement(status);

    clearTimeout(reset.current);

    reset.current = window.setTimeout(() => {
      setLabel("Copy address");
      setAnnouncement("");
    }, COPY_RESET_MS);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => void copy()}
        {...stylex.props(interactive.pill, styles.copy)}
      >
        {copyLabels(label).map(({ text, hidden }) => (
          <span
            key={text}
            aria-hidden={hidden || undefined}
            {...stylex.props(styles.label, hidden && styles.hidden)}
          >
            {text}
          </span>
        ))}
      </button>
      <span aria-live="polite" {...stylex.props(visuallyHidden.text)}>
        {announcement}
      </span>
    </>
  );
}
