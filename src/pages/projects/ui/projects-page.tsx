import * as stylex from "@stylexjs/stylex";

import { SiteHeader } from "@/widgets/site-header/ui/site-header";

import { breakpoints, colors } from "@/shared/ui/tokens.stylex";

import { ProjectList } from "./project-list";

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
});

export function ProjectsPage() {
  return (
    <>
      <SiteHeader current="projects" />
      <main {...stylex.props(styles.main)}>
        <h1 {...stylex.props(styles.title)}>Projects</h1>
        <ProjectList />
      </main>
    </>
  );
}
