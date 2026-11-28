"use client";

import Link from "next/link";

import * as stylex from "@stylexjs/stylex";

import { SiteHeader } from "@/widgets/site-header/ui/site-header";

import { textLink } from "@/entities/project/ui/tiles";

import { EMAIL } from "@/shared/config/site";
import { breakpoints, colors } from "@/shared/ui/tokens.stylex";

const styles = stylex.create({
  main: {
    flexGrow: 1,
    width: "100%",
    maxWidth: "1200px",
    marginInline: "auto",
  },
  title: {
    marginTop: { default: "96px", [breakpoints.narrow]: "56px" },
    marginInline: 0,
    marginBottom: 0,
    fontSize: { default: "48px", [breakpoints.narrow]: "40px" },
    fontWeight: 500,
    lineHeight: 1.05,
    letterSpacing: "-0.02em",
    color: colors.ink,
  },
  lead: {
    maxWidth: "620px",
    marginTop: { default: "16px", [breakpoints.narrow]: "12px" },
    marginInline: 0,
    marginBottom: 0,
    fontSize: { default: "20px", [breakpoints.narrow]: "18px" },
    lineHeight: 1.45,
    color: colors.soft,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "24px",
    marginTop: { default: "28px", [breakpoints.narrow]: "20px" },
  },
  retry: {
    paddingBlock: "7px",
    paddingInline: "12px",
    borderWidth: 0,
    borderRadius: "999px",
    backgroundColor: { default: colors.ink, ":hover": colors.soft },
    color: colors.ground,
    fontFamily: "inherit",
    fontSize: "15px",
    fontWeight: 500,
    lineHeight: 1,
    cursor: "pointer",
  },
  note: {
    maxWidth: "620px",
    marginTop: { default: "32px", [breakpoints.narrow]: "24px" },
    marginInline: 0,
    marginBottom: 0,
    fontSize: "16px",
    lineHeight: 1.45,
    color: colors.soft,
  },
});

/** Shown when a script breaks in the browser, in place of a blank screen. */
export function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <>
      <SiteHeader />
      <main {...stylex.props(styles.main)}>
        <h1 {...stylex.props(styles.title)}>Something went wrong</h1>
        <p {...stylex.props(styles.lead)}>
          This page hit an error while loading. It&apos;s most likely a one-off,
          so try again.
        </p>
        <div {...stylex.props(styles.actions)}>
          <button type="button" onClick={retry} {...stylex.props(styles.retry)}>
            Try again
          </button>
          <Link href="/" {...stylex.props(textLink.link)}>
            Go to the home page
          </Link>
        </div>
        <p {...stylex.props(styles.note)}>
          If it keeps happening, email me at{" "}
          <a href={`mailto:${EMAIL}`} {...stylex.props(textLink.link)}>
            {EMAIL}
          </a>
          .
        </p>
      </main>
    </>
  );
}
