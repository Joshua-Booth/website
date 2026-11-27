import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";
import { ArrowUp } from "lucide-react";

import { archivo, plexMono } from "@/app/styles/fonts";
import "@/app/styles/global.css";

import {
  HashFocus,
  PageEffects,
} from "@/features/page-effects/ui/page-effects";

import { getSiteFlags } from "@/shared/api/site-flags";
import { HOOK } from "@/shared/config/effect-hooks";
import { LOCALE, NAME, SITE_URL, siteDescription } from "@/shared/config/site";
import { sx } from "@/shared/lib/sx";
import { icon } from "@/shared/ui/icon";
import { interactive } from "@/shared/ui/interactive";
import { rootMarker, xrayMarker } from "@/shared/ui/markers.stylex";
import { colors, fonts, sizes, space } from "@/shared/ui/tokens.stylex";
import { whiteLook } from "@/shared/ui/white-look";
import { xray } from "@/shared/ui/xray";

export async function generateMetadata(): Promise<Metadata> {
  const { redesign } = await getSiteFlags();

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: NAME, template: `%s · ${NAME}` },
    description: siteDescription(redesign),
    twitter: { card: "summary_large_image" },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const { redesign } = await getSiteFlags();

  return {
    themeColor: redesign ? "#fff" : "#034694",
    colorScheme: redesign ? "light" : "dark",
    viewportFit: "cover",
  };
}

const show = stylex.keyframes({ to: { opacity: 1 } });

const styles = stylex.create({
  html: {
    backgroundColor: colors.ground,
    colorScheme: "dark",
  },
  htmlWhite: {
    colorScheme: "light",
  },
  body: {
    margin: 0,
    backgroundColor: colors.ground,
    color: colors.ink,
    fontFamily: fonts.sans,
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: 1.5,
    WebkitFontSmoothing: "antialiased",
    overflowX: "clip",
  },
  site: {
    position: "relative",
    containerType: "inline-size",
    backgroundColor: colors.ground,
    overflowX: "clip",
    // Hidden for the moment it takes to put the covers on, and shown anyway if
    // they never go on
    opacity: {
      default: 0,
      [stylex.when.ancestor("[data-ready]", rootMarker)]: 1,
      "@media (prefers-reduced-motion: reduce)": 1,
    },
    animationName: {
      default: show,
      [stylex.when.ancestor("[data-ready]", rootMarker)]: "none",
      "@media (prefers-reduced-motion: reduce)": "none",
    },
    animationDuration: "0s",
    animationDelay: "2.5s",
    animationFillMode: "forwards",
  },
  // With no covers to wait for, the white look shows at once
  siteShown: {
    opacity: 1,
    animationName: "none",
  },
  page: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    minHeight: "100svh",
    paddingInline: space.gutter,
    paddingTop: 0,
    paddingBottom: "56px",
  },
  foot: {
    width: "100%",
    maxWidth: sizes.page,
    marginInline: "auto",
    marginTop: "64px",
    borderTopWidth: "2px",
    paddingTop: "16px",
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    fontSize: "14px",
    color: {
      default: colors.faint,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
  },
  // The redesign's page is 1200 wide, with a hairline over the footer
  footWhite: {
    maxWidth: "1200px",
    marginTop: "120px",
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: colors.rule,
    fontSize: "13px",
  },
  footLink: {
    color: {
      default: colors.faint,
      ":hover": colors.ink,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.xrayText,
    },
    textDecoration: "none",
  },
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { redesign } = await getSiteFlags();

  return (
    // global.css scrolls smoothly within a page; this tells Next.js to jump,
    // not glide, when the page changes
    <html
      lang={LOCALE.lang}
      data-scroll-behavior="smooth"
      data-look={redesign ? "white" : undefined}
      {...sx(
        `${archivo.variable} ${plexMono.variable}`,
        styles.html,
        redesign && [whiteLook, styles.htmlWhite]
      )}
    >
      <head>
        <noscript>
          <style>{".site{opacity:1!important;animation:none!important}"}</style>
        </noscript>
      </head>
      <body {...stylex.props(styles.body, rootMarker)}>
        <div {...sx(HOOK.site, styles.site, redesign && styles.siteShown)}>
          <div {...sx(HOOK.page, styles.page)}>
            {children}
            <footer
              data-name="Footer"
              {...sx(
                "foot",
                xray.ruleTop,
                styles.foot,
                redesign && styles.footWhite
              )}
            >
              <span>© 2026</span>
              <a
                href="#top"
                {...stylex.props(interactive.raise, styles.footLink)}
              >
                Back to top <ArrowUp {...stylex.props(icon.inline)} />
              </a>
            </footer>
          </div>
          {redesign ? <HashFocus /> : <PageEffects />}
        </div>
      </body>
    </html>
  );
}
