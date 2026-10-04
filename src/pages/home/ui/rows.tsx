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

const ROW_PADDING_INLINE = "12px";
const ROW_PADDING_BOTTOM = "16px";
const ROW_GAP = "6px";
const TEXT_TO_PILLS = "16px";
const CODE_ACTIVE = ":has(+ a:is(:hover, :focus-visible))";

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
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1fr) auto auto",
      [breakpoints.narrow]: "auto auto minmax(0, 1fr)",
    },
    borderBottomWidth: "2px",
  },
  row: {
    transformStyle: {
      default: null,
      [stylex.when.ancestor("[data-asm]", asmMarker)]: "preserve-3d",
    },
    gridColumnStart: "1",
    gridColumnEnd: "-1",
    gridRowStart: "1",
    display: "grid",
    gridTemplateColumns: "subgrid",
    alignItems: "last baseline",
    rowGap: ROW_GAP,
    paddingTop: "18px",
    paddingInlineStart: {
      default: ROW_PADDING_INLINE,
      [breakpoints.narrow]: 0,
    },
    paddingInlineEnd: ROW_PADDING_INLINE,
    paddingBottom: ROW_PADDING_BOTTOM,
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
      [CODE_ACTIVE]: colors.invertBg,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: "transparent",
    },
    color: {
      default: "inherit",
      ":hover": colors.invertInk,
      ":focus-visible": colors.invertInk,
      [CODE_ACTIVE]: colors.invertInk,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: "inherit",
    },
    zIndex: {
      default: "auto",
      ":hover": 22,
      ":focus-visible": 22,
      [CODE_ACTIVE]: 22,
    },
    outlineStyle: { default: null, ":focus-visible": "none" },
  },
  still: {
    color: "inherit",
  },
  title: {
    gridColumnStart: "1",
    gridColumnEnd: { default: "auto", [breakpoints.narrow]: "-1" },
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
    gridColumnStart: { default: "2", [breakpoints.narrow]: "1" },
    gridColumnEnd: "-1",
    marginInlineStart: { default: "24px", [breakpoints.narrow]: 0 },
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
      [stylex.when.ancestor(CODE_ACTIVE, rowMarker)]: colors.invertInk,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
  },
  detail: {
    fontSize: "17px",
    color: {
      default: colors.soft,
      [stylex.when.ancestor(":hover", rowMarker)]: colors.invertInk,
      [stylex.when.ancestor(":focus-visible", rowMarker)]: colors.invertInk,
      [stylex.when.ancestor(CODE_ACTIVE, rowMarker)]: colors.invertInk,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
  },
  sub: {
    gridColumnStart: "1",
    gridColumnEnd: "-1",
    maxWidth: "44em",
  },
  beside: {
    gridColumnStart: "1",
    gridColumnEnd: { default: "auto", [breakpoints.narrow]: "-1" },
    alignSelf: { default: "end", [breakpoints.narrow]: null },
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    columnGap: "4px",
    alignSelf: "end",
    paddingBlock: "6px",
    paddingInline: "14px",
    borderWidth: "1px",
    borderStyle: {
      default: "solid",
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: "dashed",
    },
    fontSize: "15px",
    lineHeight: 1.5,
    whiteSpace: "nowrap",
    transitionProperty: "background-color, border-color, color",
    transitionDuration: "0.25s",
  },
  go: {
    gridColumnStart: { default: "2", [breakpoints.narrow]: "1" },
    justifySelf: {
      default: "end",
      [breakpoints.narrow]: "start",
    },
    marginInlineStart: { default: "24px", [breakpoints.narrow]: 0 },
    marginTop: {
      default: 0,
      [breakpoints.narrow]: `calc(${TEXT_TO_PILLS} - ${ROW_GAP})`,
    },
    borderColor: {
      default: colors.ink,
      [stylex.when.ancestor(":hover", rowMarker)]: colors.invertInk,
      [stylex.when.ancestor(":focus-visible", rowMarker)]: colors.invertInk,
      [stylex.when.ancestor(CODE_ACTIVE, rowMarker)]: colors.invertInk,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayDash,
    },
    backgroundColor: {
      default: null,
      [stylex.when.ancestor(":hover", rowMarker)]: colors.invertInk,
      [stylex.when.ancestor(":focus-visible", rowMarker)]: colors.invertInk,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: "transparent",
    },
    color: {
      default: null,
      [stylex.when.ancestor(":hover", rowMarker)]: colors.invertBg,
      [stylex.when.ancestor(":focus-visible", rowMarker)]: colors.invertBg,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
  },
  goAlone: {
    gridColumnEnd: { default: "-1", [breakpoints.narrow]: "auto" },
  },
  code: {
    gridRowStart: "1",
    gridColumnStart: { default: "3", [breakpoints.narrow]: "2" },
    justifySelf: "start",
    marginInlineStart: "12px",
    marginInlineEnd: { default: ROW_PADDING_INLINE, [breakpoints.narrow]: 0 },
    marginBottom: ROW_PADDING_BOTTOM,
    position: "relative",
    zIndex: {
      default: "auto",
      ":hover": 22,
      ":focus-visible": 22,
      [stylex.when.siblingBefore(":hover", rowMarker)]: 22,
      [stylex.when.siblingBefore(":focus-visible", rowMarker)]: 22,
    },
    backgroundColor: {
      default: null,
      ":hover": colors.invertInk,
      ":focus-visible": colors.invertInk,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: "transparent",
    },
    color: {
      default: "inherit",
      [stylex.when.siblingBefore(":hover", rowMarker)]: colors.invertInk,
      [stylex.when.siblingBefore(":focus-visible", rowMarker)]:
        colors.invertInk,
      ":hover": colors.invertBg,
      ":focus-visible": colors.invertBg,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
    borderColor: {
      default: colors.faint,
      ":hover": colors.invertInk,
      ":focus-visible": colors.invertInk,
      [stylex.when.siblingBefore(":hover", rowMarker)]: colors.invertInk,
      [stylex.when.siblingBefore(":focus-visible", rowMarker)]:
        colors.invertInk,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayDash,
    },
    textDecorationLine: "none",
    outlineColor: colors.invertInk,
  },
});

export function Rows({ children }: { children: ReactNode }) {
  return <ul {...sx("rows", xray.ruleTop, styles.rows)}>{children}</ul>;
}

type RowLink =
  | { href: Route; go: string; id?: string }
  | { href: string; go: string; external: true };

interface RowText {
  title: string;
  size: "big" | "mid";
  meta: string;
  job?: string;
  sub?: ReactNode;
}

type RowProps = RowText &
  (
    | { link?: RowLink; code?: never }
    | { link: RowLink; code: `https://${string}` }
  );

export function Row({ title, size, meta, job, sub, link, code }: RowProps) {
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
          xray.outlined,
          styles.title
        )}
      >
        {title}
      </span>
      <span id={`${id}-meta`} {...sx("meta", styles.meta)}>
        {meta}
      </span>
      {job !== undefined && (
        <span id={`${id}-job`} {...sx("role", styles.detail, styles.beside)}>
          {job}
        </span>
      )}
      {sub !== undefined && (
        <span
          id={`${id}-sub`}
          {...sx("sub", styles.detail, styles.sub, link && styles.beside)}
        >
          {sub}
        </span>
      )}
      {link && (
        <span
          id={`${id}-go`}
          {...sx(
            "go",
            interactive.pill,
            styles.pill,
            styles.go,
            code === undefined && styles.goAlone
          )}
        >
          {link.go}
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
    interactive.raise,
    styles.linked,
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

  return (
    <li {...stylex.props(xray.ruleBottom, styles.item)}>
      {row}
      {code !== undefined && (
        <a
          id={`${id}-code`}
          href={code}
          target="_blank"
          aria-labelledby={`${id}-title ${id}-code`}
          {...sx("code", interactive.pill, styles.pill, styles.code)}
        >
          Code
          <ArrowUpRight {...stylex.props(icon.inline)} />
          <NewTabNote />
        </a>
      )}
    </li>
  );
}
