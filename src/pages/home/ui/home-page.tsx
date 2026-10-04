import Link from "next/link";

import * as stylex from "@stylexjs/stylex";
import { ArrowRight } from "lucide-react";

import { SiteHeader } from "@/widgets/site-header/ui/site-header";

import { JOBS } from "@/entities/job/model/jobs";
import { STRIP } from "@/entities/lab-tile/model/tiles";
import { LabTiles } from "@/entities/lab-tile/ui/lab-tiles";
import { TileDemo } from "@/entities/lab-tile/ui/tile-demo";
import { TileFrame } from "@/entities/lab-tile/ui/tile-frame";
import type { Project } from "@/entities/project/model/projects";
import { PROJECTS } from "@/entities/project/model/projects";

import type { SiteFlags } from "@/shared/config/flags";
import type { Study } from "@/shared/config/pages";
import { isLive, liveStudy } from "@/shared/config/pages";
import { EMAIL, LINKS } from "@/shared/config/site";
import { sx } from "@/shared/lib/sx";
import { icon } from "@/shared/ui/icon";
import { interactive } from "@/shared/ui/interactive";
import { asmMarker, xrayMarker } from "@/shared/ui/markers.stylex";
import { NewTabNote } from "@/shared/ui/new-tab-note";
import { Main } from "@/shared/ui/page-frame";
import { Label } from "@/shared/ui/prose";
import { colors } from "@/shared/ui/tokens.stylex";
import { xray } from "@/shared/ui/xray";

import { CopyEmail } from "./copy-email";
import { Row, Rows } from "./rows";

const [user, domain] = EMAIL.split("@");

function studyLink(study: Study | undefined, flags: SiteFlags) {
  const live = liveStudy(study, flags);

  return live && { href: live.path, id: live.id, go: live.go };
}

function projectLinks({ study, app, code }: Project, flags: SiteFlags) {
  const link = studyLink(study, flags);

  if (link) return { link };
  if (app) return { link: { href: app, go: "Try it", external: true }, code };

  return { link: { href: code, go: "Code", external: true } };
}

const styles = stylex.create({
  // Work and Projects assemble as you scroll to them. While one is mid-flight
  // (data-asm) it keeps its layers in 3D, floats above any part still waiting
  // to build until the torch comes on, and comes up whole when you point at or
  // tab to a link in it
  assembles: {
    position: "relative",
    transformStyle: { default: null, ":is([data-asm])": "preserve-3d" },
    zIndex: {
      default: "auto",
      ":is(body:not([data-lit]) [data-asm]):not(:has(:is(a, button):is(:hover, :focus-visible)))": 21,
      ":is([data-asm]):has(:is(a, button):is(:hover, :focus-visible))": 22,
    },
  },
  more: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "12px",
    fontSize: "15px",
    fontWeight: 600,
  },
  moreLink: {
    color: colors.ink,
    textDecoration: "none",
  },
  contact: {
    marginTop: "80px",
  },
  mail: {
    display: "block",
    fontWeight: 850,
    fontStretch: "125%",
    fontSize: "clamp(26px, 5.6cqw, 78px)",
    lineHeight: 1,
    letterSpacing: "-0.02em",
    textDecorationLine: { default: "none", ":hover": "underline" },
    textDecorationThickness: "4px",
    textDecorationColor: colors.ink,
    textUnderlineOffset: "5px",
    overflowWrap: "anywhere",
    color: {
      default: "inherit",
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: "transparent",
    },
  },
  links: {
    display: "flex",
    rowGap: "12px",
    columnGap: "28px",
    flexWrap: "wrap",
    marginTop: "18px",
    fontSize: "17px",
    alignItems: "center",
  },
  outLink: {
    color: {
      default: "inherit",
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
  },
});

export function HomePage({ flags }: { flags: SiteFlags }) {
  const outLink = stylex.props(
    interactive.raise,
    interactive.link,
    styles.outLink
  );

  return (
    <>
      <SiteHeader current="home" sheet="Home" />

      <Main>
        <section
          id="work"
          data-name="Work"
          aria-labelledby="work-heading"
          {...stylex.props(styles.assembles, asmMarker)}
        >
          <Label id="work-heading">Work</Label>
          <Rows>
            {JOBS.map((job) => (
              <Row
                key={job.employer}
                title={job.employer}
                size="big"
                meta={job.when}
                job={job.role}
                link={studyLink(job.study, flags)}
              />
            ))}
          </Rows>
        </section>

        <section
          id="projects"
          data-name="Projects"
          aria-labelledby="projects-heading"
          {...stylex.props(styles.assembles, asmMarker)}
        >
          <Label id="projects-heading">Projects</Label>
          <Rows>
            {PROJECTS.map((project) => (
              <Row
                key={project.name}
                title={project.name}
                size="mid"
                meta={project.meta}
                sub={project.sub}
                {...projectLinks(project, flags)}
              />
            ))}
          </Rows>
        </section>

        {isLive("/lab", flags) && (
          <section id="lab" data-name="Lab" aria-labelledby="lab-heading">
            <Label id="lab-heading">Lab</Label>
            <LabTiles layout="strip">
              {STRIP.map((id) => (
                <TileFrame key={id} id={id} layout="strip">
                  <TileDemo id={id} layout="strip" />
                </TileFrame>
              ))}
            </LabTiles>
            <div {...sx("more", styles.more)}>
              <Link
                href="/lab"
                {...stylex.props(interactive.raise, styles.moreLink)}
              >
                The lab <ArrowRight {...stylex.props(icon.inline)} />
              </Link>
            </div>
          </section>
        )}

        <section
          id="contact"
          data-name="Contact"
          aria-labelledby="contact-heading"
          {...stylex.props(styles.contact)}
        >
          <Label id="contact-heading" flush>
            Contact
          </Label>
          <a
            id="contact-email"
            href={`mailto:${EMAIL}`}
            {...sx("mail", interactive.raise, xray.outlined, styles.mail)}
          >
            {user}@<wbr />
            {domain}
          </a>
          <div {...sx("links", styles.links)}>
            <CopyEmail addressId="contact-email" />
            <a href={LINKS.linkedin} target="_blank" {...outLink}>
              LinkedIn
              <NewTabNote />
            </a>
            <a href={LINKS.github} target="_blank" {...outLink}>
              GitHub
              <NewTabNote />
            </a>
          </div>
        </section>
      </Main>
    </>
  );
}
