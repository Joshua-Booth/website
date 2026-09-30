import * as stylex from "@stylexjs/stylex";

// The site's one look: a royal blue ground in light and dark alike, white ink,
// and Archivo pushed wide. Pink is only for the x-ray's measurements
export const colors = stylex.defineVars({
  ground: "#034694",
  ink: "#fff",
  soft: "rgba(255, 255, 255, 0.86)",
  faint: "rgba(255, 255, 255, 0.7)",
  rule: "rgba(255, 255, 255, 0.22)",
  invertBg: "#fff",
  invertInk: "#034694",
  measure: "#ff9ebb",
  xrayStroke: "rgba(255, 255, 255, 0.95)",
  xrayText: "rgba(255, 255, 255, 0.5)",
  xrayDash: "rgba(255, 255, 255, 0.55)",
});

export const fonts = stylex.defineVars({
  sans: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif",
  mono: "var(--font-plex-mono), ui-monospace, monospace",
});

export const space = stylex.defineVars({
  gutter: "clamp(16px, 1.6vw, 20px)",
});

export const sizes = stylex.defineConsts({
  page: "1240px",
});

// Narrow is the site's width, not the window's, so a copy of any part lays out
// the same
export const breakpoints = stylex.defineConsts({
  narrow: "@container (max-width: 760px)",
});
