import Link from "next/link";

import * as stylex from "@stylexjs/stylex";

import { WhiteHeader } from "@/widgets/site-header/ui/white-header";

import { BIG_PROJECTS } from "@/entities/project/model/showcase";
import { BigTile, BigTiles, textLink } from "@/entities/project/ui/tiles";

import { EMAIL } from "@/shared/config/site";
import { breakpoints, colors } from "@/shared/ui/tokens.stylex";

// Three tiles from the middle row, as in the Figma 404 mock
const SHOWN = new Set(["creact", "Recipes", "Tax Calculator"]);

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
  home: {
    display: "inline-block",
    marginTop: { default: "28px", [breakpoints.narrow]: "20px" },
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
  section: {
    marginTop: { default: "72px", [breakpoints.narrow]: "48px" },
  },
  label: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: "16px",
    marginBottom: "28px",
    paddingBottom: "10px",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: colors.rule,
  },
  labelText: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: 1.3,
  },
});

/** The 404 the redesign flag turns on, from the Figma 404 mock (option B). */
export function WhiteNotFound() {
  return (
    <>
      <WhiteHeader />
      <main {...stylex.props(styles.main)}>
        <h1 {...stylex.props(styles.title)}>Page not found</h1>
        <p {...stylex.props(styles.lead)}>
          There&apos;s no page at this address. The link may be old, or the
          address has a typo.
        </p>
        <Link href="/" {...stylex.props(textLink.link, styles.home)}>
          Go to the home page
        </Link>
        <p {...stylex.props(styles.note)}>
          If a link on this site sent you here, email me at{" "}
          <a href={`mailto:${EMAIL}`} {...stylex.props(textLink.link)}>
            {EMAIL}
          </a>{" "}
          and I&apos;ll fix it.
        </p>

        <section
          aria-labelledby="not-found-projects"
          {...stylex.props(styles.section)}
        >
          <div {...stylex.props(styles.label)}>
            <h2 id="not-found-projects" {...stylex.props(styles.labelText)}>
              Projects
            </h2>
            <Link href="/projects" {...stylex.props(textLink.link)}>
              All projects
            </Link>
          </div>
          <BigTiles>
            {BIG_PROJECTS.filter((project) => SHOWN.has(project.name)).map(
              (project) => (
                <BigTile key={project.name} project={project} />
              )
            )}
          </BigTiles>
        </section>
      </main>
    </>
  );
}
