import type { CompiledStyles, StyleXArray } from "@stylexjs/stylex";

import * as stylex from "@stylexjs/stylex";

import { rootMarker, xrayMarker } from "@/shared/ui/markers.stylex";
import { colors, fonts } from "@/shared/ui/tokens.stylex";

const styles = stylex.create({
  xray: {
    backgroundImage:
      "repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.09) 0 1px, transparent 1px 8px)",
    backgroundColor: colors.ground,
  },
  overlay: {
    position: "absolute",
    pointerEvents: "none",
  },
  build: {
    zIndex: 19,
  },
  buildCopy: {
    opacity: {
      default: 1,
      [stylex.when.ancestor(
        ":is([data-overlay='build']:not([data-letters]))",
        xrayMarker
      )]: 0,
    },
    transitionProperty: "opacity",
    transitionDuration: "0.4s",
  },
  buildEdge: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 0,
    borderLeftWidth: "2px",
    borderLeftStyle: "solid",
    borderLeftColor: "#fff",
    boxShadow: "0 0 18px 4px rgba(190, 210, 255, 0.6)",
    opacity: 0,
  },
  xrayLight: {
    zIndex: 20,
    opacity: {
      default: 0,
      [stylex.when.ancestor("[data-lit]", rootMarker)]: 1,
    },
    transitionProperty: "opacity",
    transitionDuration: "0.8s",
  },
  glow: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 21,
    borderRadius: "50%",
    pointerEvents: "none",
    backgroundImage:
      "radial-gradient(closest-side, rgba(190, 210, 255, 0.16), rgba(190, 210, 255, 0))",
    mixBlendMode: "screen",
    opacity: {
      default: 0,
      [stylex.when.ancestor("[data-lit]", rootMarker)]: 1,
    },
    transitionProperty: "opacity",
    transitionDuration: "0.8s",
  },
  blueprint: {
    zIndex: 30,
    opacity: {
      default: 0,
      ":is([data-on])": 1,
    },
    transitionProperty: "opacity",
    transitionDuration: "0.35s",
    backgroundImage:
      "linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px)",
    backgroundSize: "40px 40px, 40px 40px, 8px 8px, 8px 8px",
    backgroundPosition: "0 0",
    backgroundColor: colors.ground,
  },
  dims: {
    position: "absolute",
    left: 0,
    top: 0,
    overflow: "visible",
  },
  dimLine: {
    stroke: "#fff",
    strokeWidth: "1.2",
    strokeDasharray: "1",
    strokeDashoffset: {
      default: "1",
      [stylex.when.ancestor("[data-on]", xrayMarker)]: "0",
    },
    transitionProperty: "stroke-dashoffset",
    transitionDuration: "0.7s",
    transitionTimingFunction: "cubic-bezier(0.3, 0.7, 0.2, 1)",
    transitionDelay: "0.15s",
  },
  // A halo in the ground colour keeps the numbers readable where they cross the
  // page's own text
  dimText: {
    fill: "#fff",
    fontFamily: fonts.mono,
    fontWeight: 500,
    fontSize: {
      default: "14px",
      "@container (max-width: 600px)": "11px",
    },
    opacity: {
      default: 0,
      [stylex.when.ancestor("[data-on]", xrayMarker)]: 1,
    },
    transitionProperty: "opacity",
    transitionDuration: "0.4s",
    transitionDelay: "0.5s",
    paintOrder: "stroke",
    stroke: colors.ground,
    strokeWidth: "5px",
    strokeLinejoin: "round",
  },
  titleBlock: {
    position: "absolute",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    width: { default: "330px", "@container (max-width: 600px)": "250px" },
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: "#fff",
    fontFamily: fonts.mono,
    fontWeight: 500,
    fontSize: { default: "12px", "@container (max-width: 600px)": "10px" },
    lineHeight: 1.2,
    color: "#fff",
    opacity: {
      default: 0,
      [stylex.when.ancestor("[data-on]", xrayMarker)]: 1,
    },
    transitionProperty: "opacity",
    transitionDuration: "0.4s",
    transitionDelay: "0.7s",
  },
  titleCell: {
    paddingBlock: "7px",
    paddingInline: "9px",
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: "rgba(255, 255, 255, 0.6)",
  },
  titleCellLeft: {
    borderLeftWidth: "1px",
    borderLeftStyle: "solid",
    borderLeftColor: "rgba(255, 255, 255, 0.6)",
  },
  titleName: {
    gridColumnStart: "1",
    gridColumnEnd: "-1",
    borderTopWidth: 0,
    fontFamily: fonts.sans,
    fontWeight: 800,
    fontSize: { default: "17px", "@container (max-width: 600px)": "14px" },
    lineHeight: 1,
    fontStretch: "125%",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
  guide: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 0,
    marginTop: "-0.5px",
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: "rgba(255, 255, 255, 0.85)",
    pointerEvents: "none",
    transformOrigin: "left center",
    transform: {
      default: "none",
      [stylex.when.ancestor(
        ":is([data-overlay='build']:not([data-guides]))",
        xrayMarker
      )]: "scaleX(0)",
    },
    transitionProperty: "transform",
    transitionDuration: "0.6s",
    transitionTimingFunction: "cubic-bezier(0.3, 0.7, 0.2, 1)",
  },
  capGuide: {
    borderTopStyle: "dashed",
    borderTopColor: "rgba(255, 255, 255, 0.6)",
  },
  spec: {
    position: "absolute",
    fontFamily: fonts.mono,
    fontWeight: 500,
    fontSize: { default: "13px", "@container (max-width: 600px)": "10px" },
    lineHeight: 1,
    color: colors.invertInk,
    backgroundColor: colors.invertBg,
    paddingBlock: "4px",
    paddingInline: "6px",
    borderRadius: "3px",
    whiteSpace: "nowrap",
    pointerEvents: "none",
    opacity: {
      default: 1,
      [stylex.when.ancestor(
        ":is([data-overlay='build']:not([data-guides]))",
        xrayMarker
      )]: 0,
    },
    transitionProperty: "opacity",
    transitionDuration: "0.3s",
    transitionDelay: "0.3s",
  },
  redline: {
    position: "absolute",
    width: 0,
    borderLeftWidth: "2px",
    borderLeftStyle: "solid",
    borderLeftColor: colors.measure,
    pointerEvents: "none",
    "::before": {
      content: '""',
      position: "absolute",
      left: "-7px",
      top: 0,
      width: "12px",
      borderTopWidth: "2px",
      borderTopStyle: "solid",
      borderTopColor: colors.measure,
    },
    "::after": {
      content: '""',
      position: "absolute",
      left: "-7px",
      bottom: 0,
      width: "12px",
      borderTopWidth: "2px",
      borderTopStyle: "solid",
      borderTopColor: colors.measure,
    },
  },
  redlineValue: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    fontFamily: fonts.mono,
    fontWeight: 500,
    fontSize: { default: "13px", "@container (max-width: 600px)": "10px" },
    lineHeight: 1,
    fontStyle: "normal",
    color: colors.measure,
    whiteSpace: "nowrap",
  },
});

const cls = (...s: StyleXArray<CompiledStyles>[]) =>
  stylex.props(...s).className ?? "";

export const overlay = {
  build: cls(styles.overlay, styles.xray, styles.build, xrayMarker),
  buildCopy: cls(styles.buildCopy),
  buildEdge: cls(styles.buildEdge),
  xray: cls(styles.overlay, styles.xray, styles.xrayLight, xrayMarker),
  glow: cls(styles.glow),
  blueprint: cls(styles.overlay, styles.blueprint, xrayMarker),
  dims: cls(styles.dims),
  dimLine: cls(styles.dimLine),
  dimText: cls(styles.dimText),
  titleBlock: cls(styles.titleBlock),
  titleName: cls(styles.titleCell, styles.titleName),
  titleCell: cls(styles.titleCell),
  titleCellLeft: cls(styles.titleCell, styles.titleCellLeft),
  guide: cls(styles.guide),
  capGuide: cls(styles.guide, styles.capGuide),
  spec: cls(styles.spec),
  redline: cls(styles.redline),
  redlineValue: cls(styles.redlineValue),
};
