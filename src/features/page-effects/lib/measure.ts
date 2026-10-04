export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Line {
  x: number;
  width: number;
  baseline: number;
  capLine: number;
  top: number;
  fontSize: number;
}

/**
 * Archivo's own measurements, as fractions of the font size. Round letters like
 * O overshoot both lines slightly, as type is drawn to, so they poke just past
 * the guides; flat ones sit on them.
 */
export interface FontMetrics {
  baseline: number;
  cap: number;
  xHeight: number;
  ascender: number;
}

export const NARROW = 700;

export const HERO = "Hero";

export const ASSEMBLE = {
  sections: "#work, #projects",
  headings: ".big, .mid",
  details: ".label, .meta, .sub, .role, .go, .code",
};

const ASSEMBLE_LAYERS = `${ASSEMBLE.headings}, ${ASSEMBLE.details}`;

export const isAssembling = (part: Element) => part.hasAttribute("data-asm");

const SAME_LINE = 4;

export const parts = (page: HTMLElement) =>
  [...page.querySelectorAll<HTMLElement>("[data-name]")].filter(
    (part) => !part.closest("[hidden]")
  );

export const partName = (part: HTMLElement) => part.dataset.name ?? "";

export const partsWithAbove = (page: HTMLElement) =>
  parts(page).flatMap((part, i, all) => {
    const above = all[i - 1];

    return above ? [{ above, part }] : [];
  });

const emptyPadding = (border: string, padding: string) =>
  Number.parseFloat(border) > 0 ? 0 : Number.parseFloat(padding);

export function gapBetween(
  site: HTMLElement,
  above: HTMLElement,
  below: HTMLElement
) {
  const aboveBox = boxInSite(site, above);
  const belowBox = boxInSite(site, below);
  const aboveStyle = getComputedStyle(above);
  const belowStyle = getComputedStyle(below);

  return {
    from:
      aboveBox.y +
      aboveBox.height -
      emptyPadding(aboveStyle.borderBottomWidth, aboveStyle.paddingBottom),
    to:
      belowBox.y +
      emptyPadding(belowStyle.borderTopWidth, belowStyle.paddingTop),
  };
}

export const assembleLayers = (section: HTMLElement) => [
  section,
  ...section.querySelectorAll<HTMLElement>(ASSEMBLE_LAYERS),
];

export function hero(page: HTMLElement) {
  const bar = page.querySelector<HTMLElement>(".bar");
  const name = page.querySelector<HTMLElement>(".name");
  const intro = page.querySelector<HTMLElement>(".intro");

  return name?.offsetParent && bar && intro ? { bar, name, intro } : null;
}

export const tileDemos = (page: HTMLElement) =>
  [...page.querySelectorAll<HTMLElement>(".tile .demo")].filter(
    (demo) => !demo.closest("[hidden]")
  );

export function atRest<T>(measure: () => T): T {
  const layers = [
    ...document.querySelectorAll<HTMLElement>(ASSEMBLE.sections),
  ].flatMap(assembleLayers);

  const saved = layers.map((layer) => layer.style.transform);

  for (const layer of layers) layer.style.transform = "";

  try {
    return measure();
  } finally {
    for (const [i, layer] of layers.entries()) {
      layer.style.transform = saved[i] ?? "";
    }
  }
}

export function boxInSite(site: HTMLElement, element: Element): Box {
  const origin = site.getBoundingClientRect();
  const rect = element.getBoundingClientRect();

  return {
    x: rect.left - origin.left,
    y: rect.top - origin.top,
    width: rect.width,
    height: rect.height,
  };
}

export function measureFont(site: HTMLElement, fx: HTMLElement): FontMetrics {
  // Measured at 1000px so rounding can't creep in, in the family the page
  // resolved, since next/font renames it. The probe is an unknown element, so
  // none of the site's span rules apply
  const family = getComputedStyle(site).fontFamily;
  const probe = document.createElement("font-probe");
  const glyph = new Text("H");
  const marker = document.createElement("i");

  marker.style.display = "inline-block";
  probe.append(glyph, marker);

  Object.assign(probe.style, {
    font: `850 1000px/1 ${family}`,
    fontStretch: "125%",
    position: "absolute",
    left: "0",
    top: "0",
    visibility: "hidden",
  });

  fx.append(probe);

  const letters = document.createRange();

  letters.selectNodeContents(glyph);

  const lineTop = letters.getBoundingClientRect().top;
  const baseline = (marker.getBoundingClientRect().bottom - lineTop) / 1000;

  probe.remove();

  const canvas = document.createElement("canvas").getContext("2d");

  if (!canvas) throw new Error("The page effects need a 2D canvas");

  canvas.font = `850 1000px ${family}`;
  canvas.fontStretch = "expanded";

  const inkHeight = (letter: string) =>
    canvas.measureText(letter).actualBoundingBoxAscent / 1000;

  return {
    baseline,
    cap: inkHeight("H"),
    xHeight: inkHeight("x"),
    ascender: inkHeight("h"),
  };
}

export function lineMetrics(
  site: HTMLElement,
  font: FontMetrics,
  heading: Element
): Line[] {
  const style = getComputedStyle(heading);
  const fontSize = Number.parseFloat(style.fontSize);
  const origin = site.getBoundingClientRect();
  const rows = new Map<number, { top: number; left: number; right: number }>();

  const capitals =
    style.textTransform === "uppercase" || !/[a-z]/.test(heading.textContent);

  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);

  for (let text; (text = walker.nextNode());) {
    if (text.parentElement?.closest(".go")) continue;

    const range = document.createRange();

    range.selectNodeContents(text);

    for (const rect of range.getClientRects()) {
      if (rect.width < 1) continue;

      const key = Math.round(rect.top / SAME_LINE);
      const row = rows.get(key);

      if (row) {
        row.left = Math.min(row.left, rect.left);
        row.right = Math.max(row.right, rect.right);
      } else {
        rows.set(key, { top: rect.top, left: rect.left, right: rect.right });
      }
    }
  }

  // Letters are painted from the font's exact ascent, even where a browser
  // rounds it to lay boxes out, so the baseline comes from the font rather
  // than from a layout probe
  return [...rows.values()].map((row) => {
    const baseline = row.top + font.baseline * fontSize - origin.top;

    return {
      x: row.left - origin.left,
      width: row.right - row.left,
      baseline,
      capLine: baseline - (capitals ? font.cap : font.xHeight) * fontSize,
      top: baseline - (capitals ? font.cap : font.ascender) * fontSize,
      fontSize,
    };
  });
}
