"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { flushSync } from "react-dom";

import * as stylex from "@stylexjs/stylex";

import type { TileFilter } from "@/entities/lab-tile/model/filter";
import { FILTERS, isShown } from "@/entities/lab-tile/model/filter";
import type { TileId } from "@/entities/lab-tile/model/tiles";
import { TILES } from "@/entities/lab-tile/model/tiles";
import { LabTiles } from "@/entities/lab-tile/ui/lab-tiles";
import { TileFrame } from "@/entities/lab-tile/ui/tile-frame";

import { requestRelayout } from "@/shared/lib/relayout";
import { sx } from "@/shared/lib/sx";
import { interactive } from "@/shared/ui/interactive";
import { xrayMarker } from "@/shared/ui/markers.stylex";
import { colors } from "@/shared/ui/tokens.stylex";

const styles = stylex.create({
  filters: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "28px",
    marginInline: 0,
    marginBottom: "14px",
  },
  filter: {
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: colors.rule,
    backgroundColor: "transparent",
    color: {
      default: colors.soft,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
    paddingBlock: "5px",
    paddingInline: "14px",
    fontSize: "14px",
    cursor: "pointer",
  },
  filterOn: {
    borderColor: colors.ink,
    backgroundColor: colors.ink,
    color: colors.ground,
  },
});

interface Props {
  tiles: readonly { id: TileId; demo: ReactNode }[];
}

export function LabGrid({ tiles }: Props) {
  const [filter, setFilter] = useState<TileFilter>("all");

  return (
    <>
      <div role="group" aria-label="Show" {...sx("filters", styles.filters)}>
        {FILTERS.map(({ value, label }) => {
          const on = filter === value;

          return (
            <button
              key={value}
              type="button"
              aria-pressed={on}
              {...stylex.props(
                interactive.raise,
                interactive.pill,
                styles.filter,
                on && styles.filterOn
              )}
              onClick={() => {
                // The grid changes height without the page changing width, so
                // the page's effects measure it again
                flushSync(() => {
                  setFilter(value);
                });

                requestRelayout();
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
      <LabTiles layout="grid">
        {tiles.map(({ id, demo }) => (
          <TileFrame
            key={id}
            id={id}
            layout="grid"
            hidden={!isShown(TILES[id].kind, filter)}
          >
            {demo}
          </TileFrame>
        ))}
      </LabTiles>
    </>
  );
}
