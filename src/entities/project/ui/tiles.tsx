import type { BigProject, ShowcaseLink, SmallProject } from "../model/showcase";

import Image from "next/image";
import type { ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";

import { NewTabNote } from "@/shared/ui/new-tab-note";
import { breakpoints, colors } from "@/shared/ui/tokens.stylex";

const styles = stylex.create({
  bigGrid: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(3, minmax(0, 1fr))",
      [breakpoints.mid]: "repeat(2, minmax(0, 1fr))",
      [breakpoints.narrow]: "minmax(0, 1fr)",
    },
    columnGap: "33px",
    rowGap: { default: "56px", [breakpoints.narrow]: "48px" },
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  smallGrid: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(4, minmax(0, 1fr))",
      [breakpoints.mid]: "repeat(3, minmax(0, 1fr))",
      [breakpoints.narrow]: "repeat(2, minmax(0, 1fr))",
    },
    columnGap: { default: "20px", [breakpoints.narrow]: "16px" },
    rowGap: { default: "40px", [breakpoints.narrow]: "32px" },
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  tile: {
    minWidth: 0,
  },
  wide: {
    gridColumn: { default: "span 2", [breakpoints.narrow]: "auto" },
  },
  mat: {
    display: "block",
    overflow: "hidden",
    borderRadius: "12px",
    backgroundColor: colors.mat,
  },
  smallMat: {
    borderRadius: "8px",
  },
  picture: {
    display: "block",
    width: "100%",
    height: "auto",
  },
  // A wide picture keeps its height when its tile drops to one column, and
  // loses its sides rather than shrinking
  widePicture: {
    aspectRatio: { default: null, [breakpoints.narrow]: "378 / 284" },
    objectFit: "cover",
    objectPosition: "12% 50%",
  },
  head: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    columnGap: "12px",
    marginTop: "14px",
  },
  smallHead: {
    flexWrap: "wrap",
    marginTop: "8px",
  },
  name: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 600,
    lineHeight: 1.1,
    letterSpacing: "-0.01em",
    color: colors.ink,
  },
  smallName: {
    fontSize: "16px",
    letterSpacing: 0,
  },
  tag: {
    flexShrink: 0,
    fontSize: "13px",
    lineHeight: 1.1,
    color: colors.faint,
    fontVariantNumeric: "tabular-nums",
  },
  about: {
    marginTop: "12px",
    marginInline: 0,
    marginBottom: 0,
    fontSize: "16px",
    lineHeight: 1.45,
    color: colors.soft,
    textWrap: "pretty",
  },
  what: {
    marginTop: "6px",
    marginInline: 0,
    marginBottom: 0,
    fontSize: "13px",
    lineHeight: 1.1,
    color: colors.faint,
  },
  smallLinks: {
    marginTop: "8px",
  },
  links: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: "24px",
    rowGap: "8px",
    marginTop: "14px",
  },
});

export const textLink = stylex.create({
  link: {
    fontSize: "15px",
    fontWeight: 500,
    lineHeight: 1.5,
    color: colors.ink,
    textDecorationLine: "underline",
    textDecorationThickness: { default: "1px", ":hover": "2px" },
    textUnderlineOffset: "4px",
  },
});

function OutLink({ href, label }: ShowcaseLink) {
  const mail = href.startsWith("mailto:");

  return (
    <a
      href={href}
      target={mail ? undefined : "_blank"}
      {...stylex.props(textLink.link)}
    >
      {label}
      {!mail && <NewTabNote />}
    </a>
  );
}

export function BigTiles({ children }: { children: ReactNode }) {
  return <ul {...stylex.props(styles.bigGrid)}>{children}</ul>;
}

export function SmallTiles({ children }: { children: ReactNode }) {
  return <ul {...stylex.props(styles.smallGrid)}>{children}</ul>;
}

export function BigTile({
  project,
  hidden,
  eager,
}: {
  project: BigProject;
  hidden?: boolean;
  eager?: boolean;
}) {
  const { name, tag, about, links, picture, wide } = project;

  return (
    <li hidden={hidden} {...stylex.props(styles.tile, wide && styles.wide)}>
      <span {...stylex.props(styles.mat)}>
        <Image
          src={picture.src}
          width={picture.width}
          height={picture.height}
          alt={picture.alt}
          // Already sized and compressed when exported from Figma
          unoptimized
          preload={eager}
          sizes={
            wide
              ? "(max-width: 760px) 100vw, 790px"
              : "(max-width: 760px) 100vw, 380px"
          }
          {...stylex.props(styles.picture, wide && styles.widePicture)}
        />
      </span>
      <div {...stylex.props(styles.head)}>
        <h3 {...stylex.props(styles.name)}>{name}</h3>
        {tag !== undefined && <span {...stylex.props(styles.tag)}>{tag}</span>}
      </div>
      <p {...stylex.props(styles.about)}>{about}</p>
      {links.length > 0 && (
        <div {...stylex.props(styles.links)}>
          {links.map((link) => (
            <OutLink key={link.href} {...link} />
          ))}
        </div>
      )}
    </li>
  );
}

export function SmallTile({
  project,
  hidden,
}: {
  project: SmallProject;
  hidden?: boolean;
}) {
  const { name, when, what, code, picture } = project;

  return (
    <li hidden={hidden} {...stylex.props(styles.tile)}>
      <span {...stylex.props(styles.mat, styles.smallMat)}>
        <Image
          src={picture.src}
          width={picture.width}
          height={picture.height}
          alt={picture.alt}
          unoptimized
          sizes="(max-width: 760px) 50vw, 285px"
          {...stylex.props(styles.picture)}
        />
      </span>
      <div {...stylex.props(styles.head, styles.smallHead)}>
        <h3 {...stylex.props(styles.name, styles.smallName)}>{name}</h3>
        <span {...stylex.props(styles.tag)}>{when}</span>
      </div>
      <p {...stylex.props(styles.what)}>{what}</p>
      {code !== undefined && (
        <div {...stylex.props(styles.smallLinks)}>
          <OutLink href={code} label="View the code" />
        </div>
      )}
    </li>
  );
}
