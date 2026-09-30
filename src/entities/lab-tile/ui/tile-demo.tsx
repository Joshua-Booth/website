import type { TileId } from "../model/tiles";

import type { ComponentType } from "react";

import { sx } from "@/shared/lib/sx";

import { TILES } from "../model/tiles";
import { demo } from "./demo-surface";
import { DurationInput } from "./pieces/duration-input";
import { HotkeyRecorder } from "./pieces/hotkey-recorder";
import { JsonInspector } from "./pieces/json-inspector";
import { Overshoot } from "./pieces/overshoot";
import { RecurrenceEditor } from "./pieces/recurrence-editor";
import { WidthDial } from "./pieces/width-dial";

const PIECES = {
  recurrence: RecurrenceEditor,
  duration: DurationInput,
  hotkey: HotkeyRecorder,
  dial: WidthDial,
  json: JsonInspector,
  overshoot: Overshoot,
} satisfies Record<TileId, ComponentType>;

interface Props {
  id: TileId;
  layout: "grid" | "strip";
}

export function TileDemo({ id, layout }: Props) {
  const Piece = PIECES[id];
  const { surface } = TILES[id];

  return (
    <div
      {...sx(
        "demo",
        demo.base,
        layout === "strip" && demo.strip,
        surface !== "site" && demo[surface]
      )}
    >
      <Piece />
    </div>
  );
}
