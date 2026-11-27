import Link from "next/link";

import * as stylex from "@stylexjs/stylex";

import { NAME } from "@/shared/config/site";
import { breakpoints, colors } from "@/shared/ui/tokens.stylex";

const styles = stylex.create({
  bar: {
    width: "100%",
    maxWidth: "1200px",
    marginInline: "auto",
    paddingTop: { default: "24px", [breakpoints.narrow]: "18px" },
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  },
  name: {
    fontSize: "15px",
    fontWeight: 600,
    color: colors.ink,
    textDecorationLine: { default: "none", ":hover": "underline" },
    textUnderlineOffset: "4px",
    paddingBlock: "6px",
  },
  nav: {
    display: "flex",
    marginInlineStart: "auto",
    gap: { default: "28px", [breakpoints.narrow]: "20px" },
    fontSize: "15px",
  },
  link: {
    color: { default: colors.soft, ":hover": colors.ink },
    textDecoration: "none",
    paddingBlock: "6px",
  },
  current: {
    color: colors.ink,
  },
});

/** The bar the redesign flag puts at the top of every page. */
export function WhiteHeader({ current }: { current?: "home" | "projects" }) {
  const home = current === "home";

  const at = (id: "contact" | "work") =>
    home ? (`#${id}` as const) : (`/#${id}` as const);

  return (
    <header id="top" {...stylex.props(styles.bar)}>
      {!home && (
        <Link href="/" {...stylex.props(styles.name)}>
          {NAME}
        </Link>
      )}
      <nav aria-label="Main" {...stylex.props(styles.nav)}>
        <Link
          href="/projects"
          aria-current={current === "projects" ? "page" : undefined}
          {...stylex.props(
            styles.link,
            current === "projects" && styles.current
          )}
        >
          Projects
        </Link>
        <Link href={at("work")} {...stylex.props(styles.link)}>
          Work
        </Link>
        <Link href={at("contact")} {...stylex.props(styles.link)}>
          Contact
        </Link>
      </nav>
    </header>
  );
}
