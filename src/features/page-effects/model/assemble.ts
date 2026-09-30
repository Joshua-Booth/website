import type { Stage } from "../lib/stage";

import { frameLoop } from "../lib/frames";
import { ASSEMBLE, NARROW, parts } from "../lib/measure";
import { clamp, easeInOut } from "../lib/motion";

const SETTLE_FROM = 0.95;
const SETTLE_OVER = 0.5;

const DEPTH = {
  narrow: { details: 34, headings: 68 },
  wide: { details: 80, headings: 160 },
};

const TILT = { perspective: 2400, lift: 60, pitch: 44, roll: -7, shrink: 0.08 };

interface Section {
  element: HTMLElement;
  headings: HTMLElement[];
  details: HTMLElement[];
  top: number;
  lastProgress: number;
}

function tilt(amount: number) {
  const lift = (amount * TILT.lift).toFixed(1);
  const pitch = (amount * TILT.pitch).toFixed(2);
  const roll = (amount * TILT.roll).toFixed(2);
  const scale = (1 - amount * TILT.shrink).toFixed(3);

  return `perspective(${TILT.perspective}px) translateY(${lift}px) rotateX(${pitch}deg) rotateZ(${roll}deg) scale(${scale})`;
}

function flatten({ element, headings, details }: Section) {
  element.style.transform = "";
  element.removeAttribute("data-asm");

  for (const layer of [...headings, ...details]) layer.style.transform = "";
}

export function startAssemble({
  site,
  page,
  reducedMotion,
  signal,
  onLayout,
}: Stage) {
  if (reducedMotion) return;

  let sections: Section[] = [];

  function measure() {
    for (const section of sections) flatten(section);

    sections = parts(page)
      .filter((part) => part.matches(ASSEMBLE.sections))
      .map((element) => ({
        element,
        headings: [...element.querySelectorAll<HTMLElement>(ASSEMBLE.headings)],
        details: [...element.querySelectorAll<HTMLElement>(ASSEMBLE.details)],
        // Measured once, flat, so its own tilt can't feed back into its
        // progress
        top: element.getBoundingClientRect().top + scrollY,
        lastProgress: -1,
      }));

    // A layout change lands after this frame's tilt and before its paint, so
    // the tilt goes straight back on rather than painting a flat frame
    frame();
  }

  function frame() {
    const windowHeight = innerHeight;
    const depth = site.clientWidth < NARROW ? DEPTH.narrow : DEPTH.wide;

    for (const section of sections) {
      const distance = windowHeight * SETTLE_FROM - (section.top - scrollY);
      const progress = clamp(distance / (windowHeight * SETTLE_OVER), 0, 1);

      if (Math.abs(progress - section.lastProgress) < 0.0005) continue;

      section.lastProgress = progress;

      const amount = 1 - easeInOut(progress);

      if (amount < 0.001) {
        flatten(section);
        continue;
      }

      const { element } = section;

      element.setAttribute("data-asm", "");
      element.style.transformOrigin = "50% 0";
      element.style.transform = tilt(amount);

      const lift = (layer: HTMLElement, height: number) => {
        layer.style.transform = `translateZ(${(amount * height).toFixed(1)}px)`;
      };

      for (const heading of section.headings) lift(heading, depth.headings);
      for (const detail of section.details) lift(detail, depth.details);
    }

    return true;
  }

  onLayout(measure);
  measure();

  signal.addEventListener(
    "abort",
    () => {
      for (const section of sections) flatten(section);
    },
    { once: true }
  );

  frameLoop(signal, frame).start();
}
