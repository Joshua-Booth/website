import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";
import { ArrowUp } from "lucide-react";

import { archivo } from "@/app/styles/fonts";
import "@/app/styles/global.css";

import { HashFocus } from "@/features/hash-focus/ui/hash-focus";

import { DESCRIPTION, LOCALE, NAME, SITE_URL } from "@/shared/config/site";
import { icon } from "@/shared/ui/icon";
import { colors, fonts, space } from "@/shared/ui/tokens.stylex";

// The .ico is for browsers that can't use the SVG
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: NAME, template: `%s · ${NAME}` },
  description: DESCRIPTION,
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180" },
  },
};

export const viewport: Viewport = {
  themeColor: "#fff",
  colorScheme: "light",
  viewportFit: "cover",
};

const styles = stylex.create({
  html: {
    backgroundColor: colors.ground,
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
  // A hairline over the footer
  foot: {
    width: "100%",
    maxWidth: "1200px",
    marginInline: "auto",
    marginTop: "120px",
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: colors.rule,
    paddingTop: "16px",
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    fontSize: "13px",
    color: colors.faint,
  },
  footLink: {
    color: { default: colors.faint, ":hover": colors.ink },
    textDecoration: "none",
  },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const html = stylex.props(styles.html);

  return (
    // global.css scrolls smoothly within a page; this tells Next.js to jump,
    // not glide, when the page changes
    <html
      lang={LOCALE.lang}
      data-scroll-behavior="smooth"
      className={[archivo.variable, html.className].join(" ")}
    >
      <body {...stylex.props(styles.body)}>
        <div {...stylex.props(styles.site)}>
          <div {...stylex.props(styles.page)}>
            {children}
            <footer {...stylex.props(styles.foot)}>
              <span>© 2026</span>
              <a href="#top" {...stylex.props(styles.footLink)}>
                Back to top <ArrowUp {...stylex.props(icon.inline)} />
              </a>
            </footer>
          </div>
          <HashFocus />
        </div>
      </body>
    </html>
  );
}
