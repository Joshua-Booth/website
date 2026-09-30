export type TileKind = "component" | "detail" | "experiment";

export interface TileInfo {
  name: string;
  tag: string;
  kind: TileKind;
  surface: "code" | "light" | "site";
}

// Tags name a project only once it's public
export const TILES = {
  recurrence: {
    name: "Recurrence editor",
    tag: "Component",
    kind: "component",
    surface: "light",
  },
  duration: {
    name: "Duration input",
    tag: "Component",
    kind: "component",
    surface: "light",
  },
  hotkey: {
    name: "Hotkey recorder",
    tag: "Component",
    kind: "component",
    surface: "light",
  },
  json: {
    name: "JSON inspector",
    tag: "Component",
    kind: "component",
    surface: "code",
  },
  dial: {
    name: "Width dial",
    tag: "Experiment",
    kind: "experiment",
    surface: "site",
  },
  overshoot: {
    name: "Overshoot",
    tag: "Detail · type",
    kind: "detail",
    surface: "site",
  },
} as const satisfies Record<string, TileInfo>;

export type TileId = keyof typeof TILES;

export const STRIP: readonly TileId[] = [
  "recurrence",
  "hotkey",
  "dial",
  "overshoot",
];
export const GRID: readonly TileId[] = [
  "recurrence",
  "hotkey",
  "duration",
  "overshoot",
  "dial",
  "json",
];
