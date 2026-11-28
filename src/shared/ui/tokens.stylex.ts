import * as stylex from "@stylexjs/stylex";

// The site's one look: near-black ink on white, grey for quieter text and
// rules
export const colors = stylex.defineVars({
  ground: "#fff",
  ink: "#0e0e10",
  soft: "#55575d",
  faint: "#8a8c92",
  rule: "#e4e4e7",
  invertBg: "#0e0e10",
  invertInk: "#fff",
  // The ground a project's picture sits on
  mat: "#f3f3f1",
});

export const fonts = stylex.defineVars({
  sans: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif",
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
  mid: "@container (min-width: 761px) and (max-width: 1040px)",
});
