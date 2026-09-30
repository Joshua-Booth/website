import type { Box } from "./measure";
import type { Stage } from "./stage";

import {
  ASSEMBLE,
  assembleLayers,
  atRest,
  boxInSite,
  isAssembling,
  partName,
} from "./measure";

export interface Cover {
  layer: HTMLElement;
  copy: HTMLElement;
  box: Box;
}

export type OverlayKind = "xray" | "glow" | "blueprint" | "build";

export function overlayLayer(kind: OverlayKind, className: string) {
  const layer = document.createElement("div");

  layer.className = className;
  layer.dataset.overlay = kind;
  layer.setAttribute("aria-hidden", "true");
  layer.inert = true;

  return layer;
}

export function cover(
  { site, fx }: Stage,
  part: HTMLElement,
  kind: OverlayKind,
  className: string
): Cover {
  const box = atRest(() => boxInSite(site, part));
  const layer = overlayLayer(kind, className);

  layer.dataset.xray = "";

  Object.assign(layer.style, {
    position: "absolute",
    left: `${box.x}px`,
    top: `${box.y}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
  });

  const copy = part.cloneNode(true);

  if (!(copy instanceof HTMLElement)) throw new TypeError("Not an element");

  const sections = copy.matches(ASSEMBLE.sections)
    ? [copy]
    : [...copy.querySelectorAll<HTMLElement>(ASSEMBLE.sections)];

  for (const tilted of sections.flatMap(assembleLayers)) {
    tilted.style.transform = "";
  }

  for (const node of [copy, ...copy.querySelectorAll("[id]")]) {
    node.removeAttribute("id");
  }

  copy.style.margin = "0";
  layer.append(copy);
  fx.append(layer);

  // On the page, a first child's top margin (the Lab's heading, a section's
  // label) collapses through the part and sits above it. The copy is a block
  // of its own, so the margin would land inside it and push everything down.
  // A negative margin cancels it
  const first = part.firstElementChild;
  const copyFirst = copy.firstElementChild;

  if (first && copyFirst) {
    const drift =
      atRest(() => boxInSite(site, first).y) - boxInSite(site, copyFirst).y;

    if (Math.abs(drift) > 0.5) copy.style.marginTop = `${drift}px`;
  }

  return { layer, copy, box };
}

export function followTilt(page: HTMLElement, copy: HTMLElement) {
  const pairs = [
    ...page.querySelectorAll<HTMLElement>(ASSEMBLE.sections),
  ].flatMap((section) => {
    const twin = copy.querySelector<HTMLElement>(
      `[data-name="${CSS.escape(partName(section))}"]`
    );

    if (!twin) return [];

    return [
      {
        section,
        twin,
        from: assembleLayers(section),
        to: assembleLayers(twin),
        lastTransform: null as string | null,
      },
    ];
  });

  return () => {
    for (const pair of pairs) {
      const { section, twin, from, to } = pair;

      if (section.style.transform === pair.lastTransform) continue;

      pair.lastTransform = section.style.transform;
      twin.toggleAttribute("data-asm", isAssembling(section));
      twin.style.transformOrigin = section.style.transformOrigin;

      for (const [i, layer] of from.entries()) {
        const target = to[i];

        if (target) target.style.transform = layer.style.transform;
      }
    }
  };
}
