import Link from "next/link";
import type { ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";

import { WhiteHeader } from "@/widgets/site-header/ui/white-header";

import { JOBS } from "@/entities/job/model/jobs";
import { BIG_PROJECTS } from "@/entities/project/model/showcase";
import { BigTile, BigTiles, textLink } from "@/entities/project/ui/tiles";

import type { SiteFlags } from "@/shared/config/flags";
import { isLive, pageInfo } from "@/shared/config/pages";
import { EMAIL, LINKS, NAME } from "@/shared/config/site";
import { NewTabNote } from "@/shared/ui/new-tab-note";
import { breakpoints, colors } from "@/shared/ui/tokens.stylex";

import { homeJsonLd } from "../model/json-ld";
import { CopyEmail } from "./copy-email";

// The mock's words. Not yet settled against the live intro
const ROLE = "Design engineer, Auckland";
const INTRO = "I design and build interfaces.";

const [user, domain] = EMAIL.split("@");

const styles = stylex.create({
  main: {
    flexGrow: 1,
    width: "100%",
    maxWidth: "1200px",
    marginInline: "auto",
  },
  hero: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "baseline",
    columnGap: "32px",
    rowGap: "10px",
    marginTop: { default: "96px", [breakpoints.narrow]: "56px" },
    paddingBottom: { default: "24px", [breakpoints.narrow]: "20px" },
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: colors.rule,
  },
  name: {
    margin: 0,
    fontSize: { default: "64px", [breakpoints.narrow]: "44px" },
    fontWeight: 500,
    lineHeight: 1.05,
    letterSpacing: "-0.025em",
    color: colors.ink,
  },
  role: {
    margin: 0,
    fontSize: { default: "20px", [breakpoints.narrow]: "18px" },
    color: colors.soft,
  },
  intro: {
    marginTop: "24px",
    marginInline: 0,
    marginBottom: 0,
    fontSize: { default: "20px", [breakpoints.narrow]: "18px" },
    color: colors.ink,
  },
  section: {
    marginTop: { default: "120px", [breakpoints.narrow]: "80px" },
  },
  firstSection: {
    marginTop: { default: "64px", [breakpoints.narrow]: "56px" },
  },
  label: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: "16px",
    marginTop: 0,
    marginInline: 0,
    marginBottom: "32px",
    paddingBottom: "12px",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: colors.rule,
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: 1.3,
  },
  labelText: {
    margin: 0,
    fontSize: "inherit",
    fontWeight: "inherit",
  },
  labelTight: {
    marginBottom: 0,
  },
  postHead: {
    margin: 0,
  },
  postTitle: {
    fontSize: "20px",
    fontWeight: 600,
    letterSpacing: "-0.01em",
    color: colors.ink,
    textDecorationLine: { default: "none", ":hover": "underline" },
    textUnderlineOffset: "4px",
  },
  postAbout: {
    marginTop: "6px",
    marginInline: 0,
    marginBottom: 0,
    fontSize: "16px",
    lineHeight: 1.45,
    color: colors.soft,
  },
  jobs: {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  job: {
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1fr) minmax(0, 2fr)",
      [breakpoints.narrow]: "minmax(0, 1fr)",
    },
    columnGap: "32px",
    rowGap: "8px",
    paddingBlock: "20px",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: colors.rule,
  },
  employer: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 600,
    lineHeight: 1.3,
    color: colors.ink,
  },
  roles: {
    display: "flex",
    flexDirection: "column",
    rowGap: "2px",
  },
  role1: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: "16px",
    fontSize: "16px",
    lineHeight: 1.4,
    color: colors.soft,
  },
  earlier: {
    color: colors.faint,
  },
  years: {
    flexShrink: 0,
    fontSize: "15px",
    fontVariantNumeric: "tabular-nums",
  },
  mail: {
    display: "block",
    marginTop: "32px",
    fontSize: "clamp(28px, 7cqw, 56px)",
    fontWeight: 500,
    lineHeight: 1.1,
    letterSpacing: "-0.025em",
    color: colors.ink,
    textDecorationLine: { default: "none", ":hover": "underline" },
    textDecorationThickness: "2px",
    textUnderlineOffset: "6px",
    overflowWrap: "anywhere",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: "24px",
    rowGap: "12px",
    marginTop: "24px",
  },
});

function Label({
  id,
  children,
  tight,
  allProjects,
}: {
  id: string;
  children: ReactNode;
  tight?: boolean;
  allProjects?: boolean;
}) {
  return (
    <div {...stylex.props(styles.label, tight && styles.labelTight)}>
      <h2 id={id} {...stylex.props(styles.labelText)}>
        {children}
      </h2>
      {allProjects && (
        <Link href="/projects" {...stylex.props(textLink.link)}>
          All projects
        </Link>
      )}
    </div>
  );
}

/** The home page the redesign flag turns on, from the Figma home mock. */
export function RedesignHome({ flags }: { flags: SiteFlags }) {
  const writing = isLive("/writing/this-site", flags);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()) }}
      />
      <WhiteHeader current="home" />

      <main {...stylex.props(styles.main)}>
        <div {...stylex.props(styles.hero)}>
          <h1 {...stylex.props(styles.name)}>{NAME}</h1>
          <p {...stylex.props(styles.role)}>{ROLE}</p>
        </div>
        <p {...stylex.props(styles.intro)}>{INTRO}</p>

        <section
          id="projects"
          aria-labelledby="projects-heading"
          {...stylex.props(styles.section, styles.firstSection)}
        >
          <Label id="projects-heading" allProjects>
            Projects
          </Label>
          <BigTiles>
            {BIG_PROJECTS.map((project, i) => (
              <BigTile key={project.name} project={project} eager={i < 2} />
            ))}
          </BigTiles>
        </section>

        {writing && (
          <section
            id="writing"
            aria-labelledby="writing-heading"
            {...stylex.props(styles.section)}
          >
            <Label id="writing-heading">Writing</Label>
            <h3 {...stylex.props(styles.postHead)}>
              <Link
                href="/writing/this-site"
                {...stylex.props(styles.postTitle)}
              >
                {pageInfo("/writing/this-site").title}
              </Link>
            </h3>
            <p {...stylex.props(styles.postAbout)}>
              {pageInfo("/writing/this-site").description}
            </p>
          </section>
        )}

        <section
          id="work"
          aria-labelledby="work-heading"
          {...stylex.props(styles.section)}
        >
          <Label id="work-heading" tight>
            Work
          </Label>
          <ul {...stylex.props(styles.jobs)}>
            {JOBS.map((job) => (
              <li key={job.employer} {...stylex.props(styles.job)}>
                <h3 {...stylex.props(styles.employer)}>{job.employer}</h3>
                <div {...stylex.props(styles.roles)}>
                  {job.roles.map((role, i) => (
                    <span
                      key={role.title}
                      {...stylex.props(styles.role1, i > 0 && styles.earlier)}
                    >
                      <span>{role.title}</span>
                      <span {...stylex.props(styles.years)}>{role.when}</span>
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="contact"
          aria-labelledby="contact-heading"
          {...stylex.props(styles.section)}
        >
          <Label id="contact-heading" tight>
            Contact
          </Label>
          <a
            id="contact-email"
            href={`mailto:${EMAIL}`}
            {...stylex.props(styles.mail)}
          >
            {user}@<wbr />
            {domain}
          </a>
          <div {...stylex.props(styles.actions)}>
            <CopyEmail addressId="contact-email" />
            <a
              href={LINKS.linkedin}
              target="_blank"
              {...stylex.props(textLink.link)}
            >
              LinkedIn
              <NewTabNote />
            </a>
            <a
              href={LINKS.github}
              target="_blank"
              {...stylex.props(textLink.link)}
            >
              GitHub
              <NewTabNote />
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
