// Runs inside the page (added with addInitScript), so it's plain browser code
// with no imports, and everything it uses is defined inside installAudit.

declare global {
  interface Window {
    __audit: () => AuditResult;
    __chips: () => string[];
    __fx: () => FxState;
    __settled: () => boolean;
  }
}

export interface Issue {
  kind: string;
  a: string;
  b?: string;
  px?: number;
}

export interface AuditResult {
  issues: Issue[];
  overflow: number;
}

export interface FxState {
  xray: number;
  glow: number;
  blueprint: number;
  covers: number;
  overlays: number;
  frames: number;
  ready: boolean;
}

export function installAudit() {
  const pending = new Set<number>();
  const request = window.requestAnimationFrame.bind(window);
  const cancel = window.cancelAnimationFrame.bind(window);

  window.requestAnimationFrame = (callback) => {
    const id = request((time) => {
      pending.delete(id);
      callback(time);
    });

    pending.add(id);

    return id;
  };

  window.cancelAnimationFrame = (id) => {
    pending.delete(id);
    cancel(id);
  };

  const OVERLAY = {
    xray: '[data-overlay="xray"]',
    glow: '[data-overlay="glow"]',
    blueprint: '[data-overlay="blueprint"]',
    build: '[data-overlay="build"]',
  };

  const all = (selector: string, root: ParentNode = document) => [
    ...root.querySelectorAll<HTMLElement>(selector),
  ];

  const overlapArea = (a: DOMRect, b: DOMRect) => {
    const width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);

    return width > 0 && height > 0 ? Math.round(width * height) : 0;
  };

  const onScreen = (rect: DOMRect) =>
    rect.bottom > 0 &&
    rect.top < innerHeight &&
    rect.right > 0 &&
    rect.left < innerWidth;

  const shown = (element: Element, minOpacity = 0.05) => {
    for (let e: Element | null = element; e; e = e.parentElement) {
      const style = getComputedStyle(e);

      if (
        style.visibility === "hidden" ||
        style.display === "none" ||
        Number(style.opacity) < minOpacity
      ) {
        return false;
      }
    }

    return true;
  };

  let font: { baseline: number; cap: number; ascender: number } | null = null;

  const fontMetrics = () => {
    if (font) return font;

    const family = getComputedStyle(
      document.querySelector(".site")!
    ).fontFamily;

    const probe = document.createElement("font-probe");
    const glyph = new Text("H");
    const marker = document.createElement("i");

    marker.style.display = "inline-block";
    probe.append(glyph, marker);
    probe.style.cssText = `font:850 1000px/1 ${family};font-stretch:125%;position:absolute;left:0;top:0;visibility:hidden`;
    document.body.append(probe);

    const letters = document.createRange();

    letters.selectNodeContents(glyph);

    const baseline =
      (marker.getBoundingClientRect().bottom -
        letters.getBoundingClientRect().top) /
      1000;

    probe.remove();

    const canvas = document.createElement("canvas").getContext("2d")!;

    canvas.font = `850 1000px ${family}`;
    canvas.fontStretch = "expanded";

    const inkHeight = (letter: string) =>
      canvas.measureText(letter).actualBoundingBoxAscent / 1000;

    font = { baseline, cap: inkHeight("H"), ascender: inkHeight("h") };

    return font;
  };

  const clipToAncestors = (element: Element, rect: DOMRect) => {
    let clipped = rect;

    for (
      let e = element.parentElement;
      e && !e.classList.contains("site");
      e = e.parentElement
    ) {
      const style = getComputedStyle(e);

      if (style.overflowX === "visible" && style.overflowY === "visible") {
        continue;
      }

      const bounds = e.getBoundingClientRect();
      const left = Math.max(clipped.left, bounds.left);
      const top = Math.max(clipped.top, bounds.top);
      const right = Math.min(clipped.right, bounds.right);
      const bottom = Math.min(clipped.bottom, bounds.bottom);

      if (right <= left || bottom <= top) return null;
      clipped = new DOMRect(left, top, right - left, bottom - top);
    }

    return clipped;
  };

  const inkLines = (text: Text, owner: Element) => {
    const { baseline, cap, ascender } = fontMetrics();
    const style = getComputedStyle(owner);
    const fontSize = Number.parseFloat(style.fontSize);
    const capitals = style.textTransform === "uppercase";
    const range = document.createRange();

    range.selectNodeContents(text);

    return [...range.getClientRects()]
      .filter((line) => line.width >= 1 && line.height >= 1)
      .map((line) => {
        const base = line.top + baseline * fontSize;
        const top = base - (capitals ? cap : ascender) * fontSize;
        const bottom = base + (capitals ? 0 : 0.2 * fontSize);

        return clipToAncestors(
          owner,
          new DOMRect(line.left, top, line.width, bottom - top)
        );
      })
      .filter((rect) => rect !== null);
  };

  const textIn = (root: Element, skip: string, anywhere = false) => {
    const found: {
      rect: DOMRect;
      part: Element | null;
      owner: Element;
      text: string;
    }[] = [];

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

    for (let text; (text = walker.nextNode());) {
      if (!(text instanceof Text)) continue;

      const owner = text.parentElement!;
      const words = text.data.trim();

      if (
        !words ||
        (skip && owner.closest(skip)) ||
        owner.closest("[hidden]")
      ) {
        continue;
      }

      for (const rect of inkLines(text, owner)) {
        if (anywhere || onScreen(rect)) {
          found.push({
            rect,
            part: owner.closest("[data-name]"),
            owner,
            text: words.slice(0, 16),
          });
        }
      }
    }

    return found;
  };

  const describe = (element: Element | null) => {
    if (!element) return "?";

    const part = element.closest<HTMLElement>("[data-name]");
    const name = element.classList[0] ?? element.tagName;

    return part ? `${part.dataset.name}>${name}` : name;
  };

  const misaligned = (copyRoot: Element, page: Element) => {
    let worst = 0;
    let where = "";

    for (const part of all("[data-name]", page)) {
      const twin = copyRoot.querySelector(
        `[data-name="${CSS.escape(part.dataset.name!)}"]`
      );

      if (part.closest("[hidden]") || !twin) continue;

      const originals = [part, ...part.querySelectorAll("*")];
      const copies = [twin, ...twin.querySelectorAll("*")];

      for (const [i, original] of originals.entries()) {
        const copy = copies[i];

        if (!copy) continue;

        const a = original.getBoundingClientRect();
        const b = copy.getBoundingClientRect();

        if (!a.width || !onScreen(a)) continue;

        const distance = Math.max(
          Math.abs(a.left - b.left),
          Math.abs(a.top - b.top),
          Math.abs(a.width - b.width),
          Math.abs(a.height - b.height)
        );

        if (distance > worst) {
          worst = distance;
          where = describe(original);
        }
      }
    }

    return { worst, where };
  };

  const opacityOf = (selector: string) => {
    const element = document.querySelector(selector);

    return element ? Number(getComputedStyle(element).opacity) : 0;
  };

  window.__fx = () => ({
    xray: all(OVERLAY.xray).length,
    glow: all(OVERLAY.glow).length,
    blueprint: all(OVERLAY.blueprint).length,
    covers: all(OVERLAY.build).length,
    overlays: document.querySelector(".fx")?.childElementCount ?? -1,
    frames: pending.size,
    ready: "ready" in document.body.dataset,
  });

  window.__settled = () =>
    "ready" in document.body.dataset &&
    "lit" in document.body.dataset &&
    !document.querySelector(`${OVERLAY.build}[data-building]`) &&
    opacityOf(OVERLAY.blueprint) === 0 &&
    opacityOf(OVERLAY.xray) === 1;

  type Words = ReturnType<typeof textIn>[number];

  const onText = (
    kind: string,
    mark: string,
    rect: DOMRect,
    texts: Words[],
    min = 30
  ) =>
    texts.flatMap((text) => {
      const px = overlapArea(rect, text.rect);

      return px > min
        ? [{ kind, a: mark, b: `${describe(text.owner)}:${text.text}`, px }]
        : [];
    });

  const pastSides = (kind: string, mark: string, rect: DOMRect): Issue[] => {
    const site = document.querySelector(".site")!.getBoundingClientRect();
    const px = Math.max(site.left - rect.left, rect.right - site.right);

    return px > 1 ? [{ kind, a: mark, px: Math.round(px) }] : [];
  };

  const outOfLine = (kind: string, copy: Element, page: Element): Issue[] => {
    const { worst, where } = misaligned(copy, page);

    return worst > 1 ? [{ kind, a: where, px: Math.round(worst) }] : [];
  };

  function assembleIssues(page: Element, assembling: HTMLElement[]) {
    const texts = textIn(page, "");

    return assembling.flatMap((section) =>
      all(".big, .mid", section)
        .filter((heading) => onScreen(heading.getBoundingClientRect()))
        .flatMap((heading) =>
          onText(
            "assemble-heading-over-other-part",
            `${describe(heading)}:${heading.textContent.slice(0, 14)}`,
            heading.getBoundingClientRect(),
            texts.filter((text) => text.part !== section)
          )
        )
    );
  }

  function xrayIssues(page: Element, xray: Element) {
    const pool = document.querySelector(OVERLAY.glow)!.getBoundingClientRect();

    const centre = {
      x: pool.left + pool.width / 2,
      y: pool.top + pool.height / 2,
    };

    const inPool = (rect: DOMRect) =>
      Math.hypot(
        Math.max(rect.left - centre.x, 0, centre.x - rect.right),
        Math.max(rect.top - centre.y, 0, centre.y - rect.bottom)
      ) <
      (pool.width / 2) * 0.8;

    const texts = textIn(xray, '[data-mark="spec"], [data-mark="gap"]');

    const marks = all('[data-mark="spec"], [data-mark="gap"] i', xray).filter(
      (mark) => {
        const rect = mark.getBoundingClientRect();

        return shown(mark) && onScreen(rect) && inPool(rect);
      }
    );

    return [
      ...outOfLine("xray-misaligned", xray, page),
      ...marks.flatMap((mark) =>
        onText(
          "xray-mark-over-text",
          mark.textContent.slice(0, 20),
          mark.getBoundingClientRect(),
          texts
        )
      ),
    ];
  }

  function buildIssues(cover: HTMLElement, assembling: HTMLElement[]) {
    const box = cover.getBoundingClientRect();

    const swept = Number(
      /inset\(0(?:px)? 0(?:px)? 0(?:px)? ([\d.]+)px\)/.exec(
        cover.style.clipPath
      )?.[1] ?? 0
    );

    const shows = new DOMRect(
      box.left + swept,
      box.top,
      box.width - swept,
      box.height
    );

    if (shows.width < 1 || !onScreen(shows)) return [];

    const hidden = assembling
      .filter((section) => !(Number(getComputedStyle(section).zIndex) > 20))
      .flatMap((section) =>
        all(".big, .mid, .sub, .meta, .label", section).filter(shown)
      )
      .flatMap((detail) => {
        const px = overlapArea(shows, detail.getBoundingClientRect());

        return px > 30
          ? [
              {
                kind: "cover-hides-assembling",
                a: describe(cover.firstElementChild),
                b: `${describe(detail)}:${detail.textContent.slice(0, 14)}`,
                px,
              },
            ]
          : [];
      });

    if (!cover.hasAttribute("data-guides")) return hidden;

    const texts = textIn(cover, '[data-mark="spec"]');

    const chips = all('[data-mark="spec"]', cover).filter(
      (chip) => shown(chip) && onScreen(chip.getBoundingClientRect())
    );

    return [
      ...hidden,
      ...chips.flatMap((chip) =>
        pastSides(
          "build-chip-clipped",
          chip.textContent,
          chip.getBoundingClientRect()
        )
      ),
      ...chips.flatMap((chip) =>
        onText(
          "build-chip-over-text",
          chip.textContent.slice(0, 22),
          chip.getBoundingClientRect(),
          texts
        )
      ),
    ];
  }

  function blueprintIssues(
    page: Element,
    blueprint: Element,
    assembling: HTMLElement[]
  ): Issue[] {
    const moving = new Set(assembling.map((section) => section.dataset.name));

    const shownOnMovingPart = [
      ...blueprint.querySelectorAll<SVGGElement>("g[data-for]"),
    ].filter(
      (group) =>
        group.style.visibility !== "hidden" &&
        group.dataset.for!.split(", ").some((name) => moving.has(name))
    );

    return [
      ...outOfLine("blueprint-misaligned", blueprint, page),
      ...shownOnMovingPart.map((group) => ({
        kind: "blueprint-dims-on-moving-part",
        a: group.dataset.for!,
      })),
    ];
  }

  function blueprintShowingIssues(blueprint: Element): Issue[] {
    const texts = textIn(
      blueprint,
      '[data-mark="dimensions"], [data-mark="title-block"]'
    );

    const numbers = all('[data-mark="dimensions"] text', blueprint);

    const labels = [...numbers, ...all('[data-mark="title-block"]', blueprint)]
      .map((label) => ({ label, rect: label.getBoundingClientRect() }))
      .filter(({ rect }) => rect.bottom >= 0 && rect.top <= innerHeight);

    const onScreenNumbers = numbers
      .map((label) => ({ label, rect: label.getBoundingClientRect() }))
      .filter(({ rect }) => onScreen(rect));

    return [
      ...labels.flatMap(({ label, rect }) =>
        pastSides(
          "blueprint-mark-clipped",
          label.textContent.slice(0, 20),
          rect
        )
      ),
      ...labels.flatMap(({ label, rect }) =>
        onText(
          "blueprint-mark-over-text",
          `${label.tagName === "text" ? "dimension" : "title block"} ${label.textContent.slice(0, 16)}`,
          rect,
          texts
        )
      ),
      ...onScreenNumbers.flatMap(({ label, rect }, i) =>
        onScreenNumbers.slice(i + 1).flatMap((other) =>
          onText(
            "blueprint-dims-collide",
            label.textContent,
            rect,
            [
              {
                rect: other.rect,
                part: null,
                owner: other.label,
                text: other.label.textContent,
              },
            ],
            10
          )
        )
      ),
    ];
  }

  window.__audit = () => {
    const page = document.querySelector(".page")!;
    const assembling = all("[data-asm]", page);
    const xray = document.querySelector(OVERLAY.xray);
    const blueprint = document.querySelector(OVERLAY.blueprint);

    const issues = [
      ...assembleIssues(page, assembling),
      ...(xray ? xrayIssues(page, xray) : []),
      ...all(OVERLAY.build).flatMap((cover) => buildIssues(cover, assembling)),
      ...(blueprint ? blueprintIssues(page, blueprint, assembling) : []),
      ...(blueprint?.hasAttribute("data-on")
        ? blueprintShowingIssues(blueprint)
        : []),
    ];

    return {
      issues,
      overflow: document.documentElement.scrollWidth - innerWidth,
    };
  };

  window.__chips = () => {
    const xray = document.querySelector(OVERLAY.xray);

    if (!xray) return ["no x-ray layer"];

    const site = document.querySelector(".site")!.getBoundingClientRect();
    const words = textIn(xray, '[data-mark="spec"], [data-mark="gap"]', true);
    const problems = new Set<string>();

    const chips = all('[data-mark="spec"]', xray)
      .filter((chip) => shown(chip, 0))
      .map((chip) => ({
        name: chip.textContent,
        rect: chip.getBoundingClientRect(),
      }));

    const touching = (a: DOMRect, b: DOMRect) =>
      Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
      Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;

    for (const [i, chip] of chips.entries()) {
      for (const word of words) {
        if (touching(chip.rect, word.rect)) {
          problems.add(`${chip.name} on "${word.text}"`);
        }
      }

      for (const other of chips.slice(i + 1)) {
        if (touching(chip.rect, other.rect)) {
          problems.add(`${chip.name} on another chip`);
        }
      }

      if (chip.rect.right > site.right + 1 || chip.rect.left < site.left - 1) {
        problems.add(`${chip.name} off the edge`);
      }
    }

    return [...problems];
  };
}
