import type { FontMetrics } from "./measure";

import { RELAYOUT } from "@/shared/lib/relayout";

import { measureFont } from "./measure";

export type LayoutChange = "resize" | "content";

export interface Stage {
  site: HTMLElement;
  page: HTMLElement;
  fx: HTMLElement;
  font: FontMetrics;
  reducedMotion: boolean;
  signal: AbortSignal;
  onLayout: (listener: (change: LayoutChange) => void) => void;
}

export function createStage(
  site: HTMLElement,
  fx: HTMLElement,
  signal: AbortSignal
): Stage {
  const page = site.querySelector<HTMLElement>(".page");

  if (!page) throw new Error("The page effects need a .page inside .site");

  const listeners = new Set<(change: LayoutChange) => void>();

  const relayout = (change: LayoutChange) => {
    for (const listener of listeners) listener(change);
  };

  let width = site.clientWidth;

  const watchWidth = new ResizeObserver(() => {
    if (Math.abs(site.clientWidth - width) > 0.5) {
      width = site.clientWidth;
      relayout("resize");
    }
  });

  watchWidth.observe(site);

  signal.addEventListener(
    "abort",
    () => {
      watchWidth.disconnect();
    },
    { once: true }
  );

  document.addEventListener(
    RELAYOUT,
    () => {
      relayout("content");
    },
    { signal }
  );

  return {
    site,
    page,
    fx,
    font: measureFont(site, fx),
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    signal,
    onLayout: (listener) => {
      listeners.add(listener);
    },
  };
}
