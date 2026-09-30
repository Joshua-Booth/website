import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { useId } from "react";

import * as stylex from "@stylexjs/stylex";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { sx } from "@/shared/lib/sx";
import { display } from "@/shared/ui/display";
import { icon } from "@/shared/ui/icon";
import { interactive } from "@/shared/ui/interactive";
import { asmMarker, rowMarker, xrayMarker } from "@/shared/ui/markers.stylex";
import { NewTabNote } from "@/shared/ui/new-tab-note";
import { breakpoints, colors } from "@/shared/ui/tokens.stylex";
import { xray } from "@/shared/ui/xray";

const styles = stylex.create({
  rows: {
    transformStyle: {
      default: null,
      [stylex.when.ancestor("[data-asm]", asmMarker)]: "preserve-3d",
    },
    listStyle: "none",
    margin: 0,
    padding: 0,
    borderTopWidth: "2px",
  },
  item: {
    transformStyle: {
      default: null,
      [stylex.when.ancestor("[data-asm]", asmMarker)]: "preserve-3d",
    },
    borderBottomWidth: "2px",
  },
  row: {
    transformStyle: {
      default: null,
      [stylex.when.ancestor("[data-asm]", asmMarker)]: "preserve-3d",
    },
    width: "100%",
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1fr) auto",
      [breakpoints.narrow]: "minmax(0, 1fr)",
    },
    alignItems: "last baseline",
    rowGap: "6px",
    columnGap: "24px",
    paddingTop: "18px",
    paddingInline: "12px",
    paddingBottom: "16px",
    margin: 0,
    borderWidth: 0,
    textAlign: "left",
    textDecoration: "none",
  },
  linked: {
    cursor: "pointer",
    transitionProperty: "background-color, color",
    transitionDuration: "0.25s",
    backgroundColor: {
      default: "transparent",
      ":hover": colors.invertBg,
      ":focus-visible": colors.invertBg,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: "transparent",
    },
    color: {
      default: "inherit",
      ":hover": colors.invertInk,
      ":focus-visible": colors.invertInk,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: "inherit",
    },
    outlineStyle: { default: null, ":focus-visible": "none" },
  },
  still: {
    color: "inherit",
  },
  mid: {
    fontWeight: 800,
    fontStretch: "118%",
    textTransform: "uppercase",
    fontSize: "clamp(24px, 3.6cqw, 48px)",
    lineHeight: 0.95,
    letterSpacing: "-0.01em",
  },
  meta: {
    fontSize: "15px",
    textAlign: {
      default: "right",
      [breakpoints.narrow]: "left",
    },
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",
    color: {
      default: colors.faint,
      [stylex.when.ancestor(":hover", rowMarker)]: colors.invertInk,
      [stylex.when.ancestor(":focus-visible", rowMarker)]: colors.invertInk,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
  },
  detail: {
    fontSize: "17px",
    color: {
      default: colors.soft,
      [stylex.when.ancestor(":hover", rowMarker)]: colors.invertInk,
      [stylex.when.ancestor(":focus-visible", rowMarker)]: colors.invertInk,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
  },
  sub: {
    gridColumnStart: "1",
    gridColumnEnd: "-1",
    maxWidth: "44em",
  },
  subBeside: {
    gridColumnStart: "1",
    gridColumnEnd: "auto",
  },
  go: {
    justifySelf: {
      default: "end",
      [breakpoints.narrow]: "start",
    },
    fontWeight: 600,
    fontSize: "15px",
    whiteSpace: "nowrap",
    color: {
      default: null,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
  },
});

export function Rows({ children }: { children: ReactNode }) {
  return <ul {...sx("rows", xray.ruleTop, styles.rows)}>{children}</ul>;
}

interface RowProps {
  title: string;
  size: "big" | "mid";
  meta: string;
  job?: string;
  sub?: ReactNode;
  link?:
    | { href: Route; go: string; id?: string }
    | { href: string; go: string; external: true };
}

export function Row({ title, size, meta, job, sub, link }: RowProps) {
  const id = useId();

  // A link row is named by its title and what it does ("creact, Code"), and
  // the rest is read after as its description, not as one long name
  const described = [
    `${id}-meta`,
    job !== undefined && `${id}-job`,
    sub !== undefined && `${id}-sub`,
  ]
    .filter(Boolean)
    .join(" ");

  const cells = (
    <>
      <span
        id={`${id}-title`}
        {...sx(
          size,
          size === "big" ? [display.type, display.big] : styles.mid,
          xray.outlined
        )}
      >
        {title}
      </span>
      <span id={`${id}-meta`} {...sx("meta", styles.meta)}>
        {meta}
      </span>
      {job !== undefined && (
        <span id={`${id}-job`} {...sx("role", styles.detail)}>
          {job}
        </span>
      )}
      {sub !== undefined && (
        <span
          id={`${id}-sub`}
          {...sx("sub", styles.detail, styles.sub, link && styles.subBeside)}
        >
          {sub}
        </span>
      )}
      {link && (
        <span id={`${id}-go`} {...sx("go", styles.go)}>
          {link.go}{" "}
          {"external" in link ? (
            <>
              <ArrowUpRight {...stylex.props(icon.inline)} />
              <NewTabNote />
            </>
          ) : (
            <ArrowRight {...stylex.props(icon.inline)} />
          )}
        </span>
      )}
    </>
  );

  const named = {
    "aria-labelledby": `${id}-title ${id}-go`,
    "aria-describedby": described,
  };

  const linked = sx(
    "row",
    styles.row,
    styles.linked,
    interactive.raise,
    rowMarker
  );

  let row: ReactNode;

  if (!link) row = <div {...sx("row", styles.row, styles.still)}>{cells}</div>;
  else if ("external" in link) {
    row = (
      <a href={link.href} target="_blank" {...named} {...linked}>
        {cells}
      </a>
    );
  } else {
    row = (
      <Link href={link.href} id={link.id} {...named} {...linked}>
        {cells}
      </Link>
    );
  }

  return <li {...stylex.props(xray.ruleBottom, styles.item)}>{row}</li>;
}
