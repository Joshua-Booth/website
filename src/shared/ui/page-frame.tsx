import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";
import { ArrowLeft } from "lucide-react";

import { sx } from "../lib/sx";
import { display } from "./display";
import { icon } from "./icon";
import { interactive } from "./interactive";
import { xrayMarker } from "./markers.stylex";
import { colors, sizes } from "./tokens.stylex";
import { xray } from "./xray";

const styles = stylex.create({
  main: {
    flexGrow: 1,
    width: "100%",
    maxWidth: sizes.page,
    marginInline: "auto",
  },
  back: {
    display: "inline-block",
    marginTop: "28px",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: { default: colors.rule, ":hover": colors.ink },
    paddingBlock: "6px",
    paddingInline: "16px",
    fontSize: "15px",
    lineHeight: 1.5,
    color: {
      default: "inherit",
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.faint,
    },
    textDecoration: "none",
  },
  // Room above for the x-ray's type chip, and a clear break before the text
  title: {
    marginTop: "56px",
    marginInline: 0,
    marginBottom: "32px",
    fontSize: "clamp(44px, 10cqw, 150px)",
    lineHeight: 0.86,
    letterSpacing: "-0.02em",
  },
});

export function Main({ children }: { children: ReactNode }) {
  return <main {...stylex.props(styles.main)}>{children}</main>;
}

export function BackLink({
  href,
  children,
}: {
  href: Route;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      {...sx(
        "back",
        interactive.raise,
        interactive.pill,
        interactive.pillOutline,
        styles.back
      )}
    >
      <ArrowLeft {...stylex.props(icon.inline)} /> {children}
    </Link>
  );
}

export function PageTitle({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <h1 id={id} {...sx("case-h", display.type, xray.outlined, styles.title)}>
      {children}
    </h1>
  );
}
