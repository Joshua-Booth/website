import type { Box, Line } from "./measure";
import type { Stage } from "./stage";

import { overlay } from "../ui/overlay-styles";
import {
  atRest,
  boxInSite,
  isAssembling,
  lineMetrics,
  tileDemos,
} from "./measure";

interface Ink {
  owner: Element;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const HEADINGS =
  ".name, .big, .mid, .case-h, .mail, .cutlist li, .tile figcaption b";

export const SPEC_CHIP = '[data-mark="spec"]';

const DESCENDER = 0.2;

const CHIP_CLEARANCE = { x: 4, y: 2 };
const EDGE_MARGIN = 8;

const CHIP_ABOVE = 30;
const CHIP_TRIES = 6;
const CHIP_STEP = 10;

const CHIP_BESIDE = 16;

const ROW = "a.row";

const CAPTION_PADDING = 12;
const CAPTION_CLEARANCE = 8;

const inkOf = (owner: Element, box: Box): Ink => ({
  owner,
  left: box.x,
  right: box.x + box.width,
  top: box.y,
  bottom: box.y + box.height,
});

export function hideWhileAssembling(
  groups: { measures: HTMLElement[]; marks: HTMLElement | SVGElement }[]
) {
  for (const { measures, marks } of groups) {
    marks.style.visibility = measures.some(isAssembling) ? "hidden" : "";
  }
}

function drawGuides(
  into: HTMLElement,
  line: Line,
  offset: { x: number; y: number },
  tile: Box | null
) {
  for (const [className, y] of [
    [overlay.guide, line.baseline],
    [overlay.capGuide, line.capLine],
  ] as const) {
    const guide = document.createElement("div");

    guide.className = className;
    guide.style.top = `${y - offset.y}px`;

    if (tile) {
      Object.assign(guide.style, {
        left: `${tile.x - offset.x}px`,
        width: `${tile.width}px`,
        right: "auto",
      });
    }

    into.append(guide);
  }
}

function inkOnPage({ site, page, font }: Stage): Ink[] {
  const origin = site.getBoundingClientRect();
  const ink: Ink[] = [];
  const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT);

  for (let text; (text = walker.nextNode());) {
    const owner = text.parentElement;

    if (!owner || !text.textContent?.trim() || owner.closest("[hidden]")) {
      continue;
    }

    const style = getComputedStyle(owner);
    const fontSize = Number.parseFloat(style.fontSize);
    const lowercase = style.textTransform !== "uppercase";
    const range = document.createRange();

    range.selectNodeContents(text);

    for (const rect of range.getClientRects()) {
      if (rect.width <= 1) continue;

      const baseline = rect.top + font.baseline * fontSize - origin.top;
      const rise = lowercase ? font.ascender : font.cap;

      ink.push({
        owner,
        left: rect.left - origin.left,
        right: rect.right - origin.left,
        top: baseline - rise * fontSize,
        bottom: baseline + (lowercase ? DESCENDER * fontSize : 0),
      });
    }
  }

  return ink;
}

function headingChipSpot(
  site: HTMLElement,
  chip: HTMLElement,
  line: Line,
  heading: Element,
  ink: Ink[]
): [number, number] | null {
  const width = chip.offsetWidth;
  const height = chip.offsetHeight;
  const maxRight = site.clientWidth - EDGE_MARGIN;

  const inTheWay = (x: number, y: number) =>
    ink.filter(
      (other) =>
        !heading.contains(other.owner) &&
        other.left < x + width + CHIP_CLEARANCE.x &&
        other.right > x - CHIP_CLEARANCE.x &&
        other.top < y + height + CHIP_CLEARANCE.y &&
        other.bottom > y - CHIP_CLEARANCE.y
    );

  const aboveSpot = (): [number, number] | null => {
    let x = line.x;
    const y = line.top - CHIP_ABOVE;

    for (let tries = 0; tries < CHIP_TRIES && x + width <= maxRight; tries++) {
      const blockers = inTheWay(x, y);

      if (!blockers.length) return [x, y];

      x = Math.max(...blockers.map((other) => other.right)) + CHIP_STEP;
    }

    return null;
  };

  const besideSpot = (): [number, number] | null => {
    const x = line.x + line.width + CHIP_BESIDE;
    const y = line.top + (line.baseline - line.top - height) / 2;
    const fits = x + width <= maxRight && !inTheWay(x, y).length;

    return fits ? [x, y] : null;
  };

  // A row lifts above the x-ray when you point at it, so its chip only goes
  // beside the heading, inside the row. Above, it would cross into the row
  // above and be cut in half
  return heading.closest(ROW) ? besideSpot() : (aboveSpot() ?? besideSpot());
}

function captionChipSpot(
  site: HTMLElement,
  chip: HTMLElement,
  caption: Element,
  ink: Ink[]
): [number, number] | null {
  const box = boxInSite(site, caption);
  const width = chip.offsetWidth;
  const height = chip.offsetHeight;
  const x = box.x + box.width - CAPTION_PADDING - width;
  const y = box.y + (box.height - height) / 2;

  const blocked = ink.some(
    (other) =>
      (caption.contains(other.owner) || other.owner.matches(SPEC_CHIP)) &&
      other.left < x + width + CAPTION_CLEARANCE &&
      other.right > x - CAPTION_CLEARANCE &&
      other.top < y + height &&
      other.bottom > y
  );

  return blocked ? null : [x, y];
}

export function drawMarks(
  stage: Stage,
  into: HTMLElement,
  within: Element,
  offset = { x: 0, y: 0 }
) {
  const { site, page, font } = stage;

  atRest(() => {
    // Under the x-ray a Lab tile's working part is cut out of the copy, so a
    // chip there would be cut off too
    const ink = [
      ...inkOnPage(stage),
      ...tileDemos(page).map((demo) => inkOf(demo, boxInSite(site, demo))),
    ];

    for (const heading of within.querySelectorAll<HTMLElement>(HEADINGS)) {
      const style = getComputedStyle(heading);
      const lines = lineMetrics(site, font, heading);
      const tile = heading.closest(".tile");
      const tileBox = tile ? boxInSite(site, tile) : null;

      for (const line of lines) drawGuides(into, line, offset, tileBox);

      const [first] = lines;

      const laterCut =
        heading.matches(".cutlist li") && heading.previousElementSibling;

      if (!first || laterCut) continue;

      const chip = document.createElement("div");
      const size = Math.round(Number.parseFloat(style.fontSize));

      chip.className = overlay.spec;
      chip.dataset.mark = "spec";
      chip.textContent = `Archivo · ${style.fontWeight} · ${style.fontStretch} · ${size}px`;
      into.append(chip);

      const caption = tile?.querySelector("figcaption");

      const spot = caption
        ? captionChipSpot(site, chip, caption, ink)
        : headingChipSpot(site, chip, first, heading, ink);

      if (!spot) {
        chip.remove();
        continue;
      }

      const [x, y] = spot;

      chip.style.left = `${x - offset.x}px`;
      chip.style.top = `${y - offset.y}px`;

      ink.push(
        inkOf(chip, {
          x,
          y,
          width: chip.offsetWidth,
          height: chip.offsetHeight,
        })
      );
    }
  });
}
