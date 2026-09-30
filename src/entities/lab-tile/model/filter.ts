import type { TileKind } from "./tiles";

export type TileFilter = "all" | TileKind;

export const FILTERS: readonly { value: TileFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "component", label: "Components" },
  { value: "experiment", label: "Experiments" },
  { value: "detail", label: "Details" },
];

export const isShown = (kind: TileKind, filter: TileFilter) =>
  filter === "all" || kind === filter;
