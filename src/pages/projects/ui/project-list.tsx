"use client";

import { useState } from "react";

import * as stylex from "@stylexjs/stylex";

import type { ProjectKind } from "@/entities/project/model/showcase";
import {
  BIG_PROJECTS,
  KIND_LABELS,
  SMALL_PROJECTS,
} from "@/entities/project/model/showcase";
import {
  BigTile,
  BigTiles,
  SmallTile,
  SmallTiles,
} from "@/entities/project/ui/tiles";

import { breakpoints, colors } from "@/shared/ui/tokens.stylex";

type Filter = "all" | ProjectKind;

const FILTERS: readonly Filter[] = ["all", "apps", "designs", "games", "tools"];

const styles = stylex.create({
  filters: {
    display: "flex",
    flexWrap: "wrap",
    gap: { default: "8px", [breakpoints.narrow]: "6px" },
    marginTop: { default: "48px", [breakpoints.narrow]: "28px" },
    marginBottom: { default: "40px", [breakpoints.narrow]: "28px" },
  },
  chip: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: { default: "#d4d4d8", ":hover": colors.ink },
    borderRadius: "999px",
    backgroundColor: "transparent",
    color: colors.ink,
    paddingBlock: "6px",
    paddingInline: { default: "14px", [breakpoints.narrow]: "12px" },
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: 1.2,
    cursor: "pointer",
  },
  on: {
    borderColor: colors.ink,
    backgroundColor: colors.ink,
    color: colors.ground,
  },
  label: {
    marginTop: { default: "120px", [breakpoints.narrow]: "80px" },
    marginBottom: "32px",
    paddingBottom: "12px",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: colors.rule,
    fontSize: "16px",
    fontWeight: 500,
  },
  labelFirst: {
    marginTop: 0,
  },
});

/** Every project, big ones first, with a filter by what they are. */
export function ProjectList() {
  const [filter, setFilter] = useState<Filter>("all");
  const shows = (kind: ProjectKind) => filter === "all" || filter === kind;
  const anyBig = BIG_PROJECTS.some((p) => shows(p.kind));
  const anySmall = SMALL_PROJECTS.some((p) => shows(p.kind));

  return (
    <>
      <div role="group" aria-label="Show" {...stylex.props(styles.filters)}>
        {FILTERS.map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => {
              setFilter(key);
            }}
            {...stylex.props(styles.chip, filter === key && styles.on)}
          >
            {KIND_LABELS[key]}
          </button>
        ))}
      </div>

      {anyBig && (
        <BigTiles>
          {BIG_PROJECTS.map((project, i) => (
            <BigTile
              key={project.name}
              project={project}
              hidden={!shows(project.kind)}
              eager={i < 2}
            />
          ))}
        </BigTiles>
      )}

      {anySmall && (
        <>
          <h2 {...stylex.props(styles.label, !anyBig && styles.labelFirst)}>
            Designs, games and tools
          </h2>
          <SmallTiles>
            {SMALL_PROJECTS.map((project) => (
              <SmallTile
                key={project.name}
                project={project}
                hidden={!shows(project.kind)}
              />
            ))}
          </SmallTiles>
        </>
      )}
    </>
  );
}
