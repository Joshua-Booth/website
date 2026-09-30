import type { ComponentProps, ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";

import { sx } from "../lib/sx";
import { display } from "./display";
import { interactive } from "./interactive";
import { xrayMarker } from "./markers.stylex";
import { breakpoints, colors } from "./tokens.stylex";
import { xray } from "./xray";

const styles = stylex.create({
  para: {
    maxWidth: "34em",
    fontSize: "20px",
    lineHeight: 1.5,
    color: {
      default: colors.soft,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
    marginTop: "16px",
    marginInline: 0,
    marginBottom: 0,
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: {
      default: colors.faint,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
    marginTop: "64px",
    marginInline: 0,
    marginBottom: "10px",
  },
  flush: {
    marginTop: 0,
  },
  big: {
    margin: 0,
  },
  facts: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(4, minmax(0, 1fr))",
      [breakpoints.narrow]: "1fr 1fr",
    },
    marginTop: "40px",
    marginInline: 0,
    marginBottom: 0,
    borderTopWidth: "2px",
  },
  fact: {
    paddingTop: "14px",
    paddingRight: "16px",
    paddingBottom: "14px",
    paddingLeft: 0,
  },
  term: {
    fontSize: "13px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: {
      default: colors.faint,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
    fontWeight: 600,
  },
  value: {
    marginTop: "4px",
    marginInline: 0,
    marginBottom: 0,
    fontSize: "17px",
    fontWeight: 500,
    color: {
      default: null,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
  },
  cutlist: {
    listStyle: "none",
    marginTop: "10px",
    marginInline: 0,
    marginBottom: 0,
    padding: 0,
    display: "flex",
    flexWrap: "wrap",
    rowGap: "4px",
    columnGap: "28px",
  },
  cut: {
    fontSize: "clamp(28px, 5cqw, 64px)",
    lineHeight: 1,
    textDecorationLine: {
      default: "line-through",
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: "none",
    },
    textDecorationThickness: "0.09em",
    color: {
      default: colors.faint,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: "transparent",
    },
  },
});

export function Para({ children }: { children?: ReactNode }) {
  return <p {...sx("para", styles.para)}>{children}</p>;
}

export function Label({
  children,
  id,
  flush,
}: {
  children: ReactNode;
  id?: string;
  flush?: boolean;
}) {
  return (
    <h2 id={id} {...sx("label", styles.label, flush && styles.flush)}>
      {children}
    </h2>
  );
}

export function Big({ children }: { children: ReactNode }) {
  return (
    <p {...sx("big", display.type, display.big, xray.outlined, styles.big)}>
      {children}
    </p>
  );
}

export function Facts({
  facts,
}: {
  facts: readonly (readonly [string, string])[];
}) {
  return (
    <dl {...sx("facts", xray.ruleTop, styles.facts)}>
      {facts.map(([term, value]) => (
        <div key={term} {...stylex.props(styles.fact)}>
          <dt {...stylex.props(styles.term)}>{term}</dt>
          <dd {...stylex.props(styles.value)}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CutList({ items }: { items: readonly string[] }) {
  return (
    <ul {...sx("cutlist", styles.cutlist)}>
      {items.map((item) => (
        <li
          key={item}
          {...stylex.props(display.type, xray.outlined, styles.cut)}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function TextLink({ children, ...props }: ComponentProps<"a">) {
  return (
    <a {...props} {...stylex.props(interactive.raise, interactive.link)}>
      {children}
    </a>
  );
}

export function Only({
  when,
  children,
}: {
  when: boolean;
  children: ReactNode;
}) {
  return when ? children : null;
}

export const proseComponents = {
  p: Para,
  a: TextLink,
  Label,
  Big,
  Facts,
  CutList,
  Only,
};
