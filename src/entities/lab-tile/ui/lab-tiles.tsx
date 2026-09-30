import type { ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";

import { sx } from "@/shared/lib/sx";

const styles = stylex.create({
  grid: {
    columns: "3 250px",
    columnGap: "16px",
    marginTop: "6px",
  },
  strip: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginTop: "6px",
  },
});

export function LabTiles({
  layout,
  children,
}: {
  layout: "grid" | "strip";
  children: ReactNode;
}) {
  return (
    <div
      id={layout}
      {...sx(layout === "strip" ? "lab strip" : "lab", styles[layout])}
    >
      {children}
    </div>
  );
}
