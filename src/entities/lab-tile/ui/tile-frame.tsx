import type { TileId } from "../model/tiles";

import type { ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";

import { sx } from "@/shared/lib/sx";
import { xrayMarker } from "@/shared/ui/markers.stylex";
import { colors, fonts } from "@/shared/ui/tokens.stylex";
import { xray } from "@/shared/ui/xray";

import { TILES } from "../model/tiles";

const styles = stylex.create({
  tile: {
    containerType: "inline-size",
    breakInside: "avoid",
    marginTop: 0,
    marginInline: 0,
    marginBottom: "16px",
    borderWidth: "1px",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    // A tile you point at or tab into comes up whole, above the x-ray and the
    // build covers, like a link does
    position: "relative",
    zIndex: { default: "auto", ":hover": 22, ":focus-within": 22 },
  },
  strip: {
    marginBottom: 0,
    display: "flex",
    flexDirection: "column",
  },
  caption: {
    display: "grid",
    gap: "2px",
    paddingBlock: "10px",
    paddingInline: "12px",
    borderTopWidth: "1px",
    fontSize: "14px",
  },
  name: {
    fontWeight: 700,
    fontStretch: "108%",
    color: {
      default: null,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
  },
  tag: {
    fontFamily: fonts.sans,
    fontWeight: 500,
    fontSize: "12.5px",
    lineHeight: "normal",
    color: {
      default: colors.faint,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
    whiteSpace: "nowrap",
  },
});

interface Props {
  id: TileId;
  layout: "grid" | "strip";
  hidden?: boolean;
  children: ReactNode;
}

export function TileFrame({ id, layout, hidden, children }: Props) {
  const tile = TILES[id];

  return (
    <figure
      hidden={hidden}
      {...sx(
        "tile",
        xray.ruleAll,
        styles.tile,
        layout === "strip" && styles.strip
      )}
    >
      {children}
      <figcaption {...stylex.props(xray.ruleTop, styles.caption)}>
        <b {...stylex.props(styles.name)}>{tile.name}</b>
        <span {...stylex.props(styles.tag)}>{tile.tag}</span>
      </figcaption>
    </figure>
  );
}
