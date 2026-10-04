import Link from "next/link";

import * as stylex from "@stylexjs/stylex";
import { ArrowRight } from "lucide-react";

import { SiteHeader } from "@/widgets/site-header/ui/site-header";

import { STRIP } from "@/entities/lab-tile/model/tiles";
import { LabTiles } from "@/entities/lab-tile/ui/lab-tiles";
import { TileDemo } from "@/entities/lab-tile/ui/tile-demo";
import { TileFrame } from "@/entities/lab-tile/ui/tile-frame";

import type { SiteFlags } from "@/shared/config/flags";
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
            <Row
              title="Solve Data"
              size="big"
              meta="2021 to now"
              job="UI Engineer"
            />
            <Row
              title="stuff.co.nz"
              size="big"
              meta="2021"
              job="Frontend Engineer"
            />
            <Row
              title="The PCOS Nutritionist"
              size="big"
              meta="2020 to 2021"
              job="Full Stack Developer"
              link={
                flags.pcosCaseStudy
                  ? {
                      href: "/work/pcos-protocol",
                      id: "pcos-protocol",
                      go: "Case study",
                    }
                  : undefined
              }
            />
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
            <Row
              title="This site"
              size="mid"
              meta="open source"
              sub="The page you're on. Move your pointer over anything to see its x-ray."
              link={
                flags.thisSiteCaseStudy
                  ? {
                      href: "/writing/this-site",
                      id: "this-site",
                      go: "How it's built",
                    }
                  : { href: LINKS.repo, go: "Code", external: true }
              }
            />
            <Row
              title="Tax Calculator"
              size="mid"
              meta="web app"
              sub="Works out your New Zealand take-home pay after tax, ACC, KiwiSaver and student loan."
              link={{ href: LINKS.taxCalculator, go: "Try it", external: true }}
            />
            <Row
              title="creact"
              size="mid"
              meta="open source"
              sub="A project template for React web apps, with the testing and coding agent setup already done."
              link={{ href: LINKS.creact, go: "Code", external: true }}
            />
            <Row
              title="Audio Devotions"
              size="mid"
              meta="web app"
              sub="Daily audio devotional web app designed for people with reduced vision."
              link={{
                href: LINKS.audioDevotions,
                go: "Code",
                external: true,
              }}
            />
          </Rows>
        </section>

        {flags.lab && (
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
