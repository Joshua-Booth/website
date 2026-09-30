import type { Cover } from "../lib/cover";
import type { Spring } from "../lib/motion";
import type { Stage } from "../lib/stage";

import { cover, followTilt, overlayLayer } from "../lib/cover";
import { frameLoop } from "../lib/frames";
import { drawMarks, hideWhileAssembling, SPEC_CHIP } from "../lib/marks";
import {
  atRest,
  boxInSite,
  gapBetween,
  HERO,
  hero,
  parts,
  partsWithAbove,
  tileDemos,
} from "../lib/measure";
import { clamp, stepSpring } from "../lib/motion";
import { overlay } from "../ui/overlay-styles";
import { memory } from "./memory";

const RADIUS = { share: 0.2, min: 120, max: 260 };

const IDLE_CENTRE = { x: 0.6, y: 0.45 };
const IDLE_DRIFT = { x: 0.22, y: 0.16 };
const IDLE_PERIOD_MS = { x: 2600, y: 3700 };
const IDLE_PHASE = 1.3;

const FOLLOW_STIFFNESS = 12;
const MAX_FRAME_SECONDS = 0.05;

const TOUCH_LINGER_MS = 2500;

const LIGHT_ANYWAY_MS = 3500;

const MIN_GAP = 12;

const GAP_INSET = 40;

const NAME_GAP_AT = { above: 0.5, below: 0.7 };

const GAP_LABEL_WIDTH = 44;
const GAP_CLEARANCE = 8;
const GAP_STEP = 16;

const TILE_INNER_RADIUS = 7;

function roundedTopRect(x: number, y: number, width: number, height: number) {
  const r = TILE_INNER_RADIUS;

  return [
    `M${x} ${y + r}`,
    `a${r} ${r} 0 0 1 ${r} ${-r}`,
    `H${x + width - r}`,
    `a${r} ${r} 0 0 1 ${r} ${r}`,
    `V${y + height}`,
    `H${x}Z`,
  ].join("");
}

export function lightAfterHero({ reducedMotion, signal }: Stage) {
  const light = () => {
    document.body.dataset.lit = "";
  };

  if (reducedMotion || memory.built.has(HERO)) light();
  if ("lit" in document.body.dataset) return light;

  const anyway = setTimeout(light, LIGHT_ANYWAY_MS);

  signal.addEventListener(
    "abort",
    () => {
      clearTimeout(anyway);
    },
    { once: true }
  );

  return () => {
    clearTimeout(anyway);
    light();
  };
}

export function startTorch(stage: Stage) {
  const { site, page, fx, reducedMotion, signal, onLayout } = stage;
  const glow = overlayLayer("glow", overlay.glow);

  fx.append(glow);

  let xray: Cover | null = null;
  let radius = 0;
  let keepTilt = () => {};
  let marks: Parameters<typeof hideWhileAssembling>[0] = [];
  let placed = false;

  const light: { x: Spring; y: Spring } = {
    x: { value: 0, velocity: 0 },
    y: { value: 0, velocity: 0 },
  };

  function cutOutTiles(copy: Cover) {
    const holes = tileDemos(page).map((demo) => {
      const box = boxInSite(site, demo);

      return roundedTopRect(
        box.x - copy.box.x,
        box.y - copy.box.y,
        box.width,
        box.height
      );
    });

    const whole = `M0 0H${copy.box.width}V${copy.box.height}H0Z`;

    copy.layer.style.clipPath = holes.length
      ? `path(evenodd, "${whole}${holes.join("")}")`
      : "";
  }

  function measureGap(
    copy: Cover,
    into: HTMLElement,
    atX: number,
    from: number,
    to: number
  ) {
    if (to - from < MIN_GAP) return;

    let x = atX;

    for (const chip of copy.layer.querySelectorAll(SPEC_CHIP)) {
      const box = boxInSite(site, chip);

      const overlaps =
        box.x < x + GAP_LABEL_WIDTH &&
        box.x + box.width > x - GAP_CLEARANCE &&
        box.y < to &&
        box.y + box.height > from;

      if (overlaps) x = box.x + box.width + GAP_STEP;
    }

    const measure = document.createElement("div");
    const value = document.createElement("i");

    measure.className = overlay.redline;
    measure.dataset.mark = "gap";
    value.className = overlay.redlineValue;
    value.textContent = String(Math.round(to - from));
    measure.append(value);

    Object.assign(measure.style, {
      left: `${x - copy.box.x}px`,
      top: `${from - copy.box.y}px`,
      height: `${to - from}px`,
    });

    into.append(measure);
  }

  function measureNameGaps(copy: Cover) {
    const found = hero(page);

    if (!found) return;

    const bar = boxInSite(site, found.bar);
    const name = boxInSite(site, found.name);
    const intro = boxInSite(site, found.intro);

    measureGap(
      copy,
      copy.layer,
      name.x + name.width * NAME_GAP_AT.above,
      bar.y + bar.height,
      name.y
    );

    measureGap(
      copy,
      copy.layer,
      name.x + name.width * NAME_GAP_AT.below,
      name.y + name.height,
      intro.y
    );
  }

  function marksFor(copy: Cover, ...measures: HTMLElement[]) {
    const group = document.createElement("div");

    copy.layer.append(group);
    marks.push({ measures, marks: group });

    return group;
  }

  function build() {
    xray?.layer.remove();

    const copy = cover(stage, page, "xray", overlay.xray);

    xray = copy;
    keepTilt = followTilt(page, copy.copy);
    marks = [];

    atRest(() => {
      for (const part of parts(page)) {
        drawMarks(stage, marksFor(copy, part), part, copy.box);
      }

      measureNameGaps(copy);

      for (const { above, part } of partsWithAbove(page)) {
        const gap = gapBetween(site, above, part);

        measureGap(
          copy,
          marksFor(copy, above, part),
          boxInSite(site, part).x + GAP_INSET,
          gap.from,
          gap.to
        );
      }

      cutOutTiles(copy);
    });

    radius = Math.round(
      clamp(innerWidth * RADIUS.share, RADIUS.min, RADIUS.max)
    );

    glow.style.width = glow.style.height = `${2 * radius}px`;

    if (!placed) {
      const origin = site.getBoundingClientRect();
      const pointer = memory.pointer;

      light.x.value =
        (pointer ? pointer.x : innerWidth * IDLE_CENTRE.x) - origin.left;

      light.y.value =
        (pointer ? pointer.y : innerHeight * IDLE_CENTRE.y) - origin.top;

      placed = true;
    }

    // A relayout rebuilds the copy before the next frame, and unmasked it
    // would show whole for a frame
    shine();
  }

  function shine() {
    const x = light.x.value;
    const y = light.y.value;
    const pool = `radial-gradient(circle ${radius}px at ${x.toFixed(1)}px ${y.toFixed(1)}px, #000 35%, transparent 100%)`;

    if (xray) {
      xray.layer.style.webkitMaskImage = pool;
      xray.layer.style.maskImage = pool;
    }

    glow.style.transform = `translate(${(x - radius).toFixed(1)}px,${(y - radius).toFixed(1)}px)`;
  }

  function target(time: number) {
    const origin = site.getBoundingClientRect();
    const pointer = memory.pointer;

    // Measured again each frame, so the light stays under the pointer while
    // the page scrolls
    if (pointer) {
      return { x: pointer.x - origin.left, y: pointer.y - origin.top };
    }

    const drift = reducedMotion ? 0 : 1;

    const wanderX =
      Math.sin(time / IDLE_PERIOD_MS.x) * innerWidth * IDLE_DRIFT.x;

    const wanderY =
      Math.sin(time / IDLE_PERIOD_MS.y + IDLE_PHASE) *
      innerHeight *
      IDLE_DRIFT.y;

    return {
      x: innerWidth * IDLE_CENTRE.x - origin.left + drift * wanderX,
      y: innerHeight * IDLE_CENTRE.y - origin.top + drift * wanderY,
    };
  }

  let lastTime = 0;

  function frame(time: number) {
    const seconds =
      lastTime && !reducedMotion
        ? Math.min(MAX_FRAME_SECONDS, (time - lastTime) / 1000)
        : 0;

    lastTime = time;

    const goal = target(time);

    stepSpring(light.x, goal.x, seconds, FOLLOW_STIFFNESS);
    stepSpring(light.y, goal.y, seconds, FOLLOW_STIFFNESS);

    shine();
    keepTilt();
    hideWhileAssembling(marks);

    return true;
  }

  let lingering = 0;

  const follow = (event: PointerEvent) => {
    memory.pointer = { x: event.clientX, y: event.clientY };
    clearTimeout(lingering);
  };

  const forget = () => {
    memory.pointer = null;
  };

  // A mouse moves the light by hovering; a finger has to touch
  addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType === "mouse" || event.buttons) follow(event);
    },
    { signal }
  );

  addEventListener("pointerdown", follow, { signal });

  const letGo = (event: PointerEvent) => {
    if (event.pointerType === "mouse") return;

    clearTimeout(lingering);
    lingering = window.setTimeout(forget, TOUCH_LINGER_MS);
  };

  addEventListener("pointerup", letGo, { signal });
  addEventListener("pointercancel", letGo, { signal });

  signal.addEventListener(
    "abort",
    () => {
      clearTimeout(lingering);
    },
    { once: true }
  );

  document.documentElement.addEventListener("pointerleave", forget, {
    signal,
  });

  onLayout(build);
  build();
  frameLoop(signal, frame).start();
}
