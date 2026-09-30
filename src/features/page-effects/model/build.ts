import type { Cover } from "../lib/cover";
import type { Stage } from "../lib/stage";

import { cover } from "../lib/cover";
import { frameLoop } from "../lib/frames";
import { drawMarks } from "../lib/marks";
import { ASSEMBLE, HERO, partName, parts } from "../lib/measure";
import { clamp, easeInOut } from "../lib/motion";
import { overlay } from "../ui/overlay-styles";
import { memory } from "./memory";

const GUIDES_AT = 200;
const LETTERS_AT = 700;
const SWEEP = { from: 1000, to: 1900 };
const HERO_SWEEP = { from: 1300, to: 2600 };

const SWEEP_OVERRUN = 24;

const REMOVE_AFTER = 60;

const IN_VIEW = 0.2;

interface Building extends Cover {
  edge: HTMLElement;
  startedAt: number;
}

export function startBuild(stage: Stage, onBuilt: (name: string) => void) {
  const { page, reducedMotion, signal, onLayout } = stage;

  if (reducedMotion) return;

  const building = new Map<HTMLElement, Building>();

  function coverPart(part: HTMLElement): Building {
    const covered = cover(stage, part, "build", overlay.build);
    const edge = document.createElement("div");

    covered.copy.className += ` ${overlay.buildCopy}`;
    drawMarks(stage, covered.layer, part, covered.box);
    edge.className = overlay.buildEdge;
    covered.layer.append(edge);

    return { ...covered, edge, startedAt: 0 };
  }

  const onScreen = new Set<Element>();

  const watch = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);

        if (entry.target instanceof HTMLElement) startIfSeen(entry.target);
      }
    },
    { threshold: IN_VIEW }
  );

  signal.addEventListener(
    "abort",
    () => {
      watch.disconnect();
    },
    { once: true }
  );

  function startIfSeen(part: HTMLElement) {
    const state = building.get(part);

    if (state && !state.startedAt && onScreen.has(part)) {
      state.startedAt = performance.now();
      state.layer.dataset.building = "";
      loop.start();
    }
  }

  function coverUnbuilt() {
    // A part already building carries on from where it was, drawn there
    // before it's painted, so a resize doesn't flash it back to the start
    const startedAt = new Map<HTMLElement, number>();

    for (const [part, state] of building) {
      startedAt.set(part, state.startedAt);
      state.layer.remove();
    }

    building.clear();

    const now = performance.now();

    for (const part of parts(page)) {
      if (memory.built.has(partName(part)) || part.matches(ASSEMBLE.sections)) {
        continue;
      }

      const state = coverPart(part);

      state.startedAt = startedAt.get(part) ?? 0;
      building.set(part, state);
      watch.observe(part);

      if (state.startedAt) {
        state.layer.dataset.building = "";
        paint(part, state, now);
      }
    }

    for (const part of building.keys()) startIfSeen(part);
  }

  function finish(part: HTMLElement, state: Building) {
    state.layer.remove();
    building.delete(part);
    memory.built.add(partName(part));
    onBuilt(partName(part));
  }

  function paint(part: HTMLElement, state: Building, now: number) {
    const elapsed = now - state.startedAt;
    const sweep = partName(part) === HERO ? HERO_SWEEP : SWEEP;

    state.layer.toggleAttribute("data-guides", elapsed > GUIDES_AT);
    state.layer.toggleAttribute("data-letters", elapsed > LETTERS_AT);

    const progress = clamp(
      (elapsed - sweep.from) / (sweep.to - sweep.from),
      0,
      1
    );

    const x = easeInOut(progress) * (state.box.width + SWEEP_OVERRUN);
    const sweeping = elapsed >= sweep.from && elapsed < sweep.to;

    state.layer.style.clipPath = `inset(0 0 0 ${x}px)`;
    state.edge.style.transform = `translateX(${x}px)`;
    state.edge.style.opacity = sweeping ? "1" : "0";

    if (elapsed > sweep.to + REMOVE_AFTER) finish(part, state);
  }

  const loop = frameLoop(signal, () => {
    const now = performance.now();

    for (const [part, state] of building) {
      if (state.startedAt) paint(part, state, now);
    }

    return [...building.values()].some((state) => state.startedAt);
  });

  onLayout(coverUnbuilt);
  coverUnbuilt();
  document.body.dataset.ready = "";
}
