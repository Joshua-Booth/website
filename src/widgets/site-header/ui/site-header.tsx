import Link from "next/link";

import * as stylex from "@stylexjs/stylex";

import { getSiteFlags } from "@/shared/api/site-flags";
import { NAME } from "@/shared/config/site";
import { sx } from "@/shared/lib/sx";
import { display } from "@/shared/ui/display";
import { interactive } from "@/shared/ui/interactive";
import { JbMark } from "@/shared/ui/jb-mark";
import { xrayMarker } from "@/shared/ui/markers.stylex";
import { colors, sizes } from "@/shared/ui/tokens.stylex";
import { xray } from "@/shared/ui/xray";

interface Props {
  current?: "home" | "lab";
  sheet: string;
}

const styles = stylex.create({
  hero: {
    position: "relative",
    width: "100%",
    maxWidth: sizes.page,
    marginInline: "auto",
    paddingTop: "24px",
    paddingBottom: "72px",
  },
  barOnly: {
    paddingBottom: "12px",
  },
  bar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  mark: {
    display: "inline-flex",
    alignItems: "center",
    color: colors.ink,
    textDecoration: "none",
  },
  nav: {
    display: "flex",
    gap: "clamp(18px, 3cqw, 30px)",
    fontSize: "15px",
    fontWeight: 600,
    letterSpacing: "0.01em",
  },
  navLink: {
    color: {
      default: colors.soft,
      ":hover": colors.ink,
      ":focus-visible": colors.ink,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
    textDecoration: "none",
    paddingBlock: "6px",
  },
  name: {
    marginTop: "clamp(56px, 10cqw, 120px)",
    marginInline: 0,
    marginBottom: 0,
    fontSize: "clamp(54px, 12.6cqw, 186px)",
    lineHeight: 0.84,
    letterSpacing: "-0.02em",
  },
  nameLine: {
    display: "block",
  },
  intro: {
    marginTop: "36px",
    marginInline: 0,
    marginBottom: 0,
    maxWidth: "30em",
    fontSize: "clamp(19px, 2cqw, 23px)",
    lineHeight: 1.45,
    color: {
      default: colors.soft,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
    textWrap: "pretty",
  },
  introLead: {
    color: {
      default: colors.ink,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
    fontWeight: 600,
  },
});

export async function SiteHeader({ current, sheet }: Props) {
  const flags = await getSiteFlags();
  const home = current === "home";

  // On the home page the sections are right here; from anywhere else they're on
  // the home page
  const at = (id: "contact" | "projects" | "work") =>
    home ? (`#${id}` as const) : (`/#${id}` as const);

  const navLink = stylex.props(interactive.raise, styles.navLink);

  return (
    <header
      id="top"
      data-name="Hero"
      data-sheet={sheet}
      {...sx(
        home ? "hero u" : "hero bar-only u",
        styles.hero,
        !home && styles.barOnly
      )}
    >
      <nav aria-label="Main" {...sx("bar", styles.bar)}>
        {home ? (
          <a
            href="#top"
            aria-label={`${NAME}, back to top`}
            {...sx("mark", interactive.raise, styles.mark)}
          >
            <JbMark />
          </a>
        ) : (
          <Link
            href="/"
            aria-label={`${NAME}, home`}
            {...sx("mark", interactive.raise, styles.mark)}
          >
            <JbMark />
          </Link>
        )}
        <span {...sx("nav", styles.nav)}>
          <Link href={at("work")} {...navLink}>
            Work
          </Link>
          <Link href={at("projects")} {...navLink}>
            Projects
          </Link>
          {flags.lab && (
            <Link
              href="/lab"
              aria-current={current === "lab" ? "page" : undefined}
              {...navLink}
            >
              Lab
            </Link>
          )}
          <Link href={at("contact")} {...navLink}>
            Contact
          </Link>
        </span>
      </nav>
      {home && (
        <>
          <h1 {...sx("name", display.type, xray.outlined, styles.name)}>
            <span {...stylex.props(styles.nameLine)}>Joshua</span>
            <span {...stylex.props(styles.nameLine)}>Booth</span>
          </h1>
          <p {...sx("intro", styles.intro)}>
            <b {...stylex.props(styles.introLead)}>
              I&apos;m an AI-native frontend engineer in Auckland.
            </b>{" "}
            I design and build products from first concept to live in
            production.
          </p>
        </>
      )}
    </header>
  );
}
