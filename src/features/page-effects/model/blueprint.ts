import type { Cover } from "../lib/cover";
import type { Box, Line } from "../lib/measure";
import type { Stage } from "../lib/stage";

import { cover, followTilt } from "../lib/cover";
import { frameLoop } from "../lib/frames";
import { hideWhileAssembling } from "../lib/marks";
import {
  atRest,
  boxInSite,
  gapBetween,
  hero,
  lineMetrics,
  NARROW,
  partName,
  partsWithAbove,
} from "../lib/measure";
import { overlay } from "../ui/overlay-styles";

const LINGER_MS = 500;

const NARROW_SCALE = 0.75;

const PAGE_WIDTH_Y = 34;
const NAME_WIDTH_ABOVE = 30;
const NAME_CAP_BESIDE = 34;
const BAR_GAP_INSET = 50;
const INTRO_BELOW = 30;
const PART_GAP_FROM_RIGHT = 30;
const HEADING_ABOVE = 26;
const HEADING_CAP_BESIDE = 26;
const ROW_HEIGHT_FROM_RIGHT = 90;

const NAME_GAP_AT = 0.62;

const PART_HEADING = ":is(.big, .mid, .mail, .case-h)";

const TITLE_BLOCK = {
  narrow: { width: 250, above: 96 },
  wide: { width: 330, above: 118 },
};

const SVG = "http://www.w3.org/2000/svg";

function svgElement<K extends keyof SVGElementTagNameMap>(
  tag: K,
  className: string,
  attributes: Record<string, string | number>
) {
  const element = document.createElementNS(SVG, tag);

  element.setAttribute("class", className);

  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(
      name,
      typeof value === "number" ? value.toFixed(1) : value
    );
  }

  return element;
}

function cell(className: string, text: string) {
  const span = document.createElement("span");

  span.className = className;
  span.textContent = text;

  return span;
}

function drafting(scale: number) {
  const s = (px: number) => px * scale;

  const line = (x1: number, y1: number, x2: number, y2: number, opacity = 1) =>
    svgElement("line", overlay.dimLine, {
      x1,
      y1,
      x2,
      y2,
      "stroke-opacity": String(opacity),
      pathLength: "1",
    });

  const label = (
    x: number,
    y: number,
    text: string | number,
    anchor: "start" | "middle" | "end"
  ) => {
    const element = svgElement("text", overlay.dimText, {
      x,
      y,
      "text-anchor": anchor,
    });

    element.textContent = String(text);

    return element;
  };

  const tick = (x: number, y: number) =>
    line(x - s(5), y + s(5), x + s(5), y - s(5));

  const horizontal = (
    x1: number,
    x2: number,
    y: number,
    text: string | number
  ) => [
    line(x1, y - s(10), x1, y + s(16), 0.6),
    line(x2, y - s(10), x2, y + s(16), 0.6),
    line(x1, y, x2, y),
    tick(x1, y),
    tick(x2, y),
    label((x1 + x2) / 2, y - s(8), text, "middle"),
  ];

  const vertical = (
    x: number,
    y1: number,
    y2: number,
    text: string | number,
    side: "left" | "right" = "right"
  ) => {
    if (y2 - y1 < 8) return [];

    return [
      line(x - s(16), y1, x + s(10), y1, 0.6),
      line(x - s(16), y2, x + s(10), y2, 0.6),
      line(x, y1, x, y2),
      tick(x, y1),
      tick(x, y2),
      side === "left"
        ? label(x - s(12), (y1 + y2) / 2 + s(5), text, "end")
        : label(x + s(12), (y1 + y2) / 2 + s(5), text, "start"),
    ];
  };

  return { s, horizontal, vertical };
}

type Drafting = ReturnType<typeof drafting>;

interface Sheet extends Cover {
  svg: SVGSVGElement;
  titleBlock: HTMLElement;
  keepTilt: () => void;
  dimensions: { measures: HTMLElement[]; marks: SVGGElement }[];
}

export function startBlueprint(stage: Stage) {
  const { site, page, signal, onLayout } = stage;

  let sheet: Sheet | null = null;

  function onSheet(origin: Box) {
    const box = (element: Element): Box => {
      const measured = boxInSite(site, element);

      return {
        ...measured,
        x: measured.x - origin.x,
        y: measured.y - origin.y,
      };
    };

    const gap = (above: HTMLElement, below: HTMLElement) => {
      const measured = gapBetween(site, above, below);

      return { from: measured.from - origin.y, to: measured.to - origin.y };
    };

    const line = (measured: Line): Line => ({
      ...measured,
      x: measured.x - origin.x,
      baseline: measured.baseline - origin.y,
      capLine: measured.capLine - origin.y,
      top: measured.top - origin.y,
    });

    return { box, gap, line };
  }

  type At = ReturnType<typeof onSheet>;

  function heroDimensions(pen: Drafting, at: At, siteWidth: number) {
    const found = hero(page);

    const lines = [...page.querySelectorAll<HTMLElement>(".name span")]
      .flatMap((span) => lineMetrics(site, stage.font, span).slice(0, 1))
      .map(at.line);

    const [first] = lines;

    if (!found || !first) return [];

    const bar = at.box(found.bar);
    const name = at.box(found.name);
    const intro = at.box(found.intro);

    // The cap height goes beside the shorter line of the name, so it stays on
    // the page when the first line fills the width
    let shorter = first;

    for (const line of lines) if (line.width < shorter.width) shorter = line;

    const measure = Math.min(
      Number.parseFloat(getComputedStyle(found.intro).maxWidth),
      intro.width
    );

    return [
      ...pen.horizontal(
        first.x,
        first.x + first.width,
        first.top - pen.s(NAME_WIDTH_ABOVE),
        Math.round(first.width)
      ),
      ...pen.vertical(
        shorter.x + shorter.width + pen.s(NAME_CAP_BESIDE),
        shorter.capLine,
        shorter.baseline,
        Math.round(shorter.baseline - shorter.capLine)
      ),
      ...pen.vertical(
        bar.x + pen.s(BAR_GAP_INSET),
        bar.y + bar.height,
        name.y,
        Math.round(name.y - bar.y - bar.height)
      ),
      ...pen.vertical(
        first.x + first.width * NAME_GAP_AT,
        name.y + name.height,
        intro.y,
        Math.round(intro.y - name.y - name.height)
      ),
      ...pen.horizontal(
        intro.x,
        intro.x + measure,
        intro.y + intro.height + pen.s(INTRO_BELOW),
        siteWidth >= NARROW ? "30em" : Math.round(measure)
      ),
    ];
  }

  function partDimensions(pen: Drafting, at: At) {
    return partsWithAbove(page)
      .filter(({ part }) => !part.matches("footer"))
      .map(({ above, part }) => {
        const partBox = at.box(part);
        const gap = at.gap(above, part);
        const group = document.createElementNS(SVG, "g");

        group.dataset.for = `${partName(above)}, ${partName(part)}`;

        group.append(
          ...pen.vertical(
            partBox.x + partBox.width - pen.s(PART_GAP_FROM_RIGHT),
            gap.from,
            gap.to,
            Math.round(gap.to - gap.from),
            "left"
          )
        );

        const heading = part.querySelector(PART_HEADING);

        const [measured] = heading
          ? lineMetrics(site, stage.font, heading)
          : [];

        if (measured) {
          const line = at.line(measured);

          group.append(
            ...pen.horizontal(
              line.x,
              line.x + line.width,
              line.top - pen.s(HEADING_ABOVE),
              Math.round(line.width)
            ),
            ...pen.vertical(
              line.x + line.width + pen.s(HEADING_CAP_BESIDE),
              line.capLine,
              line.baseline,
              Math.round(line.baseline - line.capLine)
            )
          );
        }

        const row = part.querySelector(".rows > li");

        if (row) {
          const rowBox = at.box(row);

          group.append(
            ...pen.vertical(
              rowBox.x + rowBox.width - pen.s(ROW_HEIGHT_FROM_RIGHT),
              rowBox.y,
              rowBox.y + rowBox.height,
              Math.round(rowBox.height),
              "left"
            )
          );
        }

        return { measures: [above, part], marks: group };
      });
  }

  function draw(on: Sheet) {
    const siteWidth = site.clientWidth;
    const narrow = siteWidth < NARROW;
    const pen = drafting(narrow ? NARROW_SCALE : 1);
    const at = onSheet(on.box);
    const { width, height } = on.box;

    on.svg.setAttribute("width", String(width));
    on.svg.setAttribute("height", String(height));
    on.svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    on.dimensions = partDimensions(pen, at);

    on.svg.replaceChildren(
      ...pen.horizontal(0, siteWidth, pen.s(PAGE_WIDTH_Y), `${siteWidth}px`),
      ...heroDimensions(pen, at, siteWidth),
      ...on.dimensions.map((group) => group.marks)
    );

    const foot = page.querySelector("footer");

    if (foot) {
      const footBox = at.box(foot);
      const size = narrow ? TITLE_BLOCK.narrow : TITLE_BLOCK.wide;

      Object.assign(on.titleBlock.style, {
        left: `${Math.max(footBox.x, footBox.x + footBox.width - size.width)}px`,
        top: `${footBox.y - size.above}px`,
      });
    }
  }

  function build() {
    sheet?.layer.remove();

    const copy = cover(stage, page, "blueprint", overlay.blueprint);
    const svg = document.createElementNS(SVG, "svg");
    const titleBlock = document.createElement("div");

    const sheetName =
      page.querySelector<HTMLElement>("[data-sheet]")?.dataset.sheet ?? "";

    svg.setAttribute("class", overlay.dims);
    svg.dataset.mark = "dimensions";
    titleBlock.className = overlay.titleBlock;
    titleBlock.dataset.mark = "title-block";

    titleBlock.append(
      cell(overlay.titleName, sheetName),
      cell(overlay.titleCellLeft, "Scale 1:1"),
      cell(overlay.titleCell, "Sheet 1 of 1"),
      cell(overlay.titleCellLeft, "Units px"),
      cell(overlay.titleCell, "Grid 8px")
    );

    copy.layer.append(svg, titleBlock);

    const next: Sheet = {
      ...copy,
      svg,
      titleBlock,
      keepTilt: followTilt(page, copy.copy),
      dimensions: [],
    };

    sheet = next;

    atRest(() => {
      draw(next);
    });
  }

  function fit() {
    if (!sheet) return;

    const box = boxInSite(site, page);
    const on = sheet;

    Object.assign(on.layer.style, {
      left: `${box.x}px`,
      top: `${box.y}px`,
      width: `${box.width}px`,
      height: `${box.height}px`,
    });

    on.box = box;

    atRest(() => {
      draw(on);
    });
  }

  const fitting = frameLoop(signal, () => {
    fit();

    return false;
  });

  let linger = 0;

  onLayout((change) => {
    if (change === "content") {
      build();

      return;
    }

    sheet?.layer.setAttribute("data-on", "");
    clearTimeout(linger);

    linger = window.setTimeout(() => {
      sheet?.layer.removeAttribute("data-on");
    }, LINGER_MS);

    fitting.start();
  });

  signal.addEventListener(
    "abort",
    () => {
      clearTimeout(linger);
    },
    { once: true }
  );

  build();

  frameLoop(signal, () => {
    sheet?.keepTilt();
    hideWhileAssembling(sheet?.dimensions ?? []);

    return true;
  }).start();
}
