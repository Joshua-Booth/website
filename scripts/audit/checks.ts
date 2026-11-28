import type { Page } from "playwright";

// Layout at every width, links, keyboard focus, hover, and client-side
// navigation

const SIZES = [
  [1440, 900],
  [1280, 800],
  [1024, 768],
  [768, 1024],
  [390, 844],
  [360, 740],
] as const;

export interface Finding {
  page: string;
  size: string;
  kind: string;
  detail: string;
}

export const NOT_FOUND = "/not-a-page";

export async function sitemapPaths(base: string) {
  const res = await fetch(`${base}/sitemap.xml`);

  if (!res.ok) throw new Error(`${base}/sitemap.xml answered ${res.status}`);

  const paths = [...(await res.text()).matchAll(/<loc>(.+?)<\/loc>/g)].map(
    ([, loc]) => new URL(loc!).pathname
  );

  if (!paths.includes("/")) {
    throw new Error(`${base}/sitemap.xml lists no homepage`);
  }

  return paths;
}

async function ready(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;

    // A lazy image below the fold never loads until it's scrolled to, so
    // only wait a moment for each
    const loaded = (img: HTMLImageElement) =>
      img.complete
        ? Promise.resolve()
        : Promise.race([
            new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
            }),
            new Promise((resolve) => setTimeout(resolve, 3000)),
          ]);

    await Promise.all([...document.images].map(loaded));
  });
}

// Lazy images only load near the viewport, so walk down the page first
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) {
      scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 40));
    }

    scrollTo({ top: 0, behavior: "instant" });
  });
}

// Runs in the page: text that overlaps other text, text cut off by its box,
// images that failed, and sideways scroll
function layoutIssues() {
  // Screen-reader text sits in a 1px clipped box, so it never reaches the eye
  const srOnly = (el: Element) => {
    for (let at: Element | null = el; at; at = at.parentElement) {
      const rect = at.getBoundingClientRect();

      if (rect.width <= 1 || rect.height <= 1) return true;
    }

    return false;
  };

  const shown = (el: Element) => {
    const style = getComputedStyle(el);

    return (
      style.visibility !== "hidden" &&
      style.display !== "none" &&
      Number(style.opacity) > 0.05 &&
      !srOnly(el)
    );
  };

  const label = (el: Element) => {
    const text = el.textContent.trim().replaceAll(/\s+/g, " ");

    return `${el.tagName.toLowerCase()} "${text.slice(0, 40)}"`;
  };

  // Every line box of visible text, with the element it belongs to
  const textLines = () => {
    const lines: { el: Element; rect: DOMRect }[] = [];

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );

    const counted = (node: Node) =>
      !!node.textContent?.trim() &&
      !!node.parentElement &&
      shown(node.parentElement) &&
      !node.parentElement.closest(
        "[aria-hidden=true], script, style, noscript"
      );

    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!counted(node)) continue;

      const range = document.createRange();

      range.selectNodeContents(node);

      const rects = [...range.getClientRects()].filter(
        (rect) => rect.width > 1 && rect.height > 1
      );

      for (const rect of rects) lines.push({ el: node.parentElement!, rect });
    }

    return lines;
  };

  // Line boxes of neighbouring lines can share a pixel or two of leading
  const overlap = (a: DOMRect, b: DOMRect) =>
    Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 &&
    Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) >
      Math.min(a.height, b.height) * 0.3;

  const overlaps = () => {
    const lines = textLines();
    const pairs = new Set<string>();

    for (const [i, a] of lines.entries()) {
      for (const b of lines.slice(i + 1)) {
        if (a.el !== b.el && overlap(a.rect, b.rect)) {
          pairs.add(`${label(a.el)} | ${label(b.el)}`);
        }
      }
    }

    return [...pairs].map((detail) => ({ kind: "text-overlap", detail }));
  };

  const clips = (el: Element) => {
    const style = getComputedStyle(el);

    return (
      /hidden|clip/.test(style.overflowX + style.overflowY) &&
      style.textOverflow !== "ellipsis" &&
      el.clientWidth > 0 &&
      el.scrollWidth > el.clientWidth + 1
    );
  };

  const clipped = [...document.body.querySelectorAll("*")]
    .filter((el) => el.textContent.trim() && shown(el) && clips(el))
    .map((el) => ({
      kind: "text-clipped",
      detail: `${label(el)} needs ${el.scrollWidth}px, has ${el.clientWidth}px`,
    }));

  const broken = [...document.images]
    .filter((img) => img.complete && img.naturalWidth === 0)
    .map((img) => ({
      kind: "image-broken",
      detail: img.currentSrc || img.src,
    }));

  const overflow = document.documentElement.scrollWidth - innerWidth;
  const issues = [...overlaps(), ...clipped, ...broken];

  if (overflow > 0) {
    issues.push({ kind: "sideways-scroll", detail: `${overflow}px` });
  }

  return issues;
}

async function layoutAudit(page: Page, base: string, paths: string[]) {
  const findings: Finding[] = [];

  for (const [width, height] of SIZES) {
    const size = `${width}x${height}`;

    await page.setViewportSize({ width, height });

    for (const path of paths) {
      await page.goto(`${base}${path}`, { waitUntil: "load" });
      await scrollThrough(page);
      await ready(page);

      for (const issue of await page.evaluate(layoutIssues)) {
        findings.push({ page: path, size, ...issue });
      }
    }
  }

  return findings;
}

// Every link on every page has to land: a 200 for pages and files on this
// site, and a matching id for a hash. Outside links are listed, not fetched
async function linkAudit(page: Page, base: string, paths: string[]) {
  const findings: Finding[] = [];
  const outside = new Set<string>();
  const fetched = new Map<string, { status: number; html: string }>();

  const load = async (path: string) => {
    if (!fetched.has(path)) {
      const res = await fetch(`${base}${path}`);

      fetched.set(path, { status: res.status, html: await res.text() });
    }

    return fetched.get(path)!;
  };

  const problem = async (url: URL) => {
    const { status, html } = await load(url.pathname);
    const id = decodeURIComponent(url.hash.slice(1));

    if (status !== 200) return `${url.pathname} answered ${status}`;

    return id && !html.includes(`id="${id}"`)
      ? `no ${url.hash} on ${url.pathname}`
      : null;
  };

  const missingHere = async (url: URL) => {
    const id = decodeURIComponent(url.hash.slice(1));

    return id && !(await page.$(`[id="${id}"]`)) ? `no ${url.hash}` : null;
  };

  await page.setViewportSize({ width: 1280, height: 800 });

  for (const path of paths) {
    await page.goto(`${base}${path}`, { waitUntil: "load" });

    const links = await page.$$eval("a[href]", (as) =>
      as.flatMap((a) => (a instanceof HTMLAnchorElement ? [a.href] : []))
    );

    for (const url of [...new Set(links)].map((href) => new URL(href))) {
      if (url.origin !== new URL(base).origin) {
        if (url.protocol.startsWith("http")) {
          outside.add(url.origin + url.pathname);
        }

        continue;
      }

      // A link within this page is checked against the page as it rendered,
      // since the 404 page answers 404 on purpose
      const detail =
        url.pathname === path ? await missingHere(url) : await problem(url);

      if (detail) {
        findings.push({ page: path, size: "-", kind: "link-broken", detail });
      }
    }
  }

  return { findings, outside: [...outside].toSorted(), checked: fetched.size };
}

// Press Tab and describe where focus landed, or null once it leaves the page
async function tabStop(page: Page) {
  await page.keyboard.press("Tab");

  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      )
  );

  return page.evaluate(() => {
    const el = document.activeElement;

    if (!el || el === document.body) return null;

    const rect = el.getBoundingClientRect();

    const top = document.elementFromPoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    );

    const style = getComputedStyle(el);

    return {
      name: (el.getAttribute("aria-label") ?? el.textContent)
        .trim()
        .replaceAll(/\s+/g, " ")
        .slice(0, 40),
      onScreen: rect.bottom > 0 && rect.top < innerHeight && rect.width > 0,
      covered: !!top && top !== el && !el.contains(top) && !top.contains(el),
      ring:
        style.outlineStyle !== "none" &&
        Number.parseFloat(style.outlineWidth) > 0,
    };
  });
}

function focusProblem(stop: {
  onScreen: boolean;
  covered: boolean;
  ring: boolean;
}) {
  if (!stop.onScreen) return "focus-off-screen";
  if (stop.covered) return "focus-covered";

  return stop.ring ? null : "focus-no-ring";
}

// Tab through each page. Every stop must be on screen, not covered, and show
// a focus ring
async function keyboardAudit(page: Page, base: string, paths: string[]) {
  const findings: Finding[] = [];
  const stops: Record<string, string[]> = {};

  for (const [width, height] of [
    [1280, 800],
    [390, 844],
  ] as const) {
    const size = `${width}x${height}`;

    await page.setViewportSize({ width, height });
    // Smooth scrolling would still be moving when the focus is measured
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const path of paths) {
      await page.goto(`${base}${path}`, { waitUntil: "load" });
      await ready(page);

      await page.addStyleTag({
        content: "html{scroll-behavior:auto!important}",
      });

      const names: string[] = [];

      for (let stop = await tabStop(page); stop; stop = await tabStop(page)) {
        // Back at the first stop means Tab has been all the way round
        if (stop.name === names[0]) break;

        names.push(stop.name);

        const problem = focusProblem(stop);

        if (problem) {
          findings.push({ page: path, size, kind: problem, detail: stop.name });
        }
      }

      stops[`${path} ${size}`] = names;
    }
  }

  return { findings, stops };
}

// Force :hover on every link and button and compare computed styles. A
// control that looks the same hovered gives no feedback
async function hoverAudit(page: Page, base: string, paths: string[]) {
  const findings: Finding[] = [];
  const cdp = await page.context().newCDPSession(page);

  const PROPS = [
    "color",
    "background-color",
    "text-decoration-color",
    "text-decoration-line",
    "text-decoration-thickness",
    "text-underline-offset",
    "border-color",
    "opacity",
    "box-shadow",
    "transform",
    "filter",
    "outline-color",
  ];

  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");
  await page.setViewportSize({ width: 1280, height: 800 });

  for (const path of paths) {
    await page.goto(`${base}${path}`, { waitUntil: "load" });
    await page.emulateMedia({ reducedMotion: "reduce" });

    const { root } = await cdp.send("DOM.getDocument", { depth: -1 });

    const { nodeIds } = await cdp.send("DOM.querySelectorAll", {
      nodeId: root.nodeId,
      selector: "a[href], button",
    });

    for (const [i, nodeId] of nodeIds.entries()) {
      const snapshot = () =>
        page.evaluate(
          ([index, props]) => {
            const el =
              document.querySelectorAll<HTMLElement>("a[href], button")[index];

            if (!el) {
              return { name: "", shown: false, marked: false, style: "" };
            }

            const all = [el, ...el.querySelectorAll("*")];

            return {
              name: (el.getAttribute("aria-label") ?? el.textContent)
                .trim()
                .replaceAll(/\s+/g, " ")
                .slice(0, 40),
              shown: !!el.offsetParent,
              marked:
                el.getAttribute("aria-current") === "page" ||
                el.getAttribute("aria-pressed") === "true",
              style: all
                .map((node) => {
                  const s = getComputedStyle(node);

                  return props.map((p) => s.getPropertyValue(p)).join(";");
                })
                .join("|"),
            };
          },
          [i, PROPS] as const
        );

      const before = await snapshot();

      // The current page's link and a chosen filter are already in their
      // marked state
      if (!before.shown || before.marked) continue;

      await cdp.send("CSS.forcePseudoState", {
        nodeId,
        forcedPseudoClasses: ["hover"],
      });

      // Jump any hover transition to its end before reading the style
      await page.evaluate(() => {
        for (const a of document.getAnimations()) a.finish();
      });

      const after = await snapshot();

      await cdp.send("CSS.forcePseudoState", {
        nodeId,
        forcedPseudoClasses: [],
      });

      if (before.style === after.style) {
        findings.push({
          page: path,
          size: "1280x800",
          kind: "hover-no-change",
          detail: before.name,
        });
      }
    }
  }

  return findings;
}

// Click through the header the way a visitor would, and check the page
// doesn't keep listeners from the last one
async function navigationAudit(page: Page, base: string) {
  const findings: Finding[] = [];
  const log: string[] = [];
  const cdp = await page.context().newCDPSession(page);

  const listeners = async () => {
    let n = 0;

    for (const expression of [
      "window",
      "document",
      "document.documentElement",
    ]) {
      const { result } = await cdp.send("Runtime.evaluate", { expression });

      if (result.objectId) {
        n += (
          await cdp.send("DOMDebugger.getEventListeners", {
            objectId: result.objectId,
          })
        ).listeners.length;
      }
    }

    return n;
  };

  const steps = [
    {
      label: "projects",
      click: 'nav[aria-label="Main"] a[href="/projects"]',
      want: "/projects",
    },
    { label: "home", click: '#top a[href="/"]', want: "/" },
    {
      label: "work",
      click: 'nav[aria-label="Main"] a[href$="#work"]',
      want: "/#work",
    },
    {
      label: "contact",
      click: 'nav[aria-label="Main"] a[href$="#contact"]',
      want: "/#contact",
    },
  ];

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${base}/`, { waitUntil: "load" });

  for (const round of [1, 2]) {
    for (const step of steps) {
      await page.click(step.click);

      await page
        .waitForURL((url) => url.pathname + url.hash === step.want, {
          timeout: 5000,
        })
        .catch(() => {
          findings.push({
            page: step.want,
            size: "1280x800",
            kind: "nav-wrong-page",
            detail: `${step.label} went to ${new URL(page.url()).pathname}`,
          });
        });

      await page.waitForTimeout(300);

      const state = await page.evaluate(() => ({
        title: document.title,
        focus: [
          document.activeElement?.id,
          document.activeElement?.tagName,
        ].find(Boolean),
        heading: document.querySelector("h1")?.textContent.trim(),
      }));

      const n = await listeners();

      log.push(
        `${`${step.label} ${round}`.padEnd(12)} ${step.want.padEnd(10)} h1 "${state.heading}", focus ${state.focus}, listeners ${n}`
      );

      // After a hash link, the next Tab has to start from that section, not
      // from the header
      if (step.want.includes("#")) {
        const id = step.want.split("#")[1]!;

        await page.keyboard.press("Tab");

        // The next stop is the first control at or after the section's start
        const inside = await page.evaluate((section) => {
          const start = document.getElementById(section);
          const active = document.activeElement;

          if (!start || !active) return false;

          const first = [
            ...document.querySelectorAll<HTMLElement>("a[href], button"),
          ].find(
            (el) =>
              el.offsetParent &&
              (start.contains(el) ||
                start.compareDocumentPosition(el) &
                  Node.DOCUMENT_POSITION_FOLLOWING)
          );

          return active === first;
        }, id);

        if (!inside) {
          const at = await page.evaluate(() =>
            (document.activeElement?.textContent ?? "").trim().slice(0, 30)
          );

          findings.push({
            page: step.want,
            size: "1280x800",
            kind: "nav-tab-skips-section",
            detail: `next Tab went to "${at}"`,
          });
        }
      }
    }
  }

  await page.goBack();
  await page.goBack();

  log.push(
    `back twice   ${new URL(page.url()).pathname}${new URL(page.url()).hash}`
  );

  const first = await listeners();

  for (const step of steps) {
    await page.click(step.click);
    await page.waitForTimeout(300);
  }

  if ((await listeners()) > first + 2) {
    findings.push({
      page: "/",
      size: "1280x800",
      kind: "nav-listeners-grow",
      detail: `${first} to ${await listeners()}`,
    });
  }

  return { findings, log };
}

export async function siteAudit(page: Page, base: string, live: string[]) {
  const paths = [...live, NOT_FOUND];

  const timed = async <T>(name: string, run: () => Promise<T>) => {
    const start = performance.now();
    const result = await run();

    console.log(
      `${name} took ${Math.round((performance.now() - start) / 1000)}s`
    );

    return result;
  };

  return {
    paths,
    layout: await timed("layout", () => layoutAudit(page, base, paths)),
    links: await timed("links", () => linkAudit(page, base, paths)),
    keyboard: await timed("keyboard", () => keyboardAudit(page, base, paths)),
    hover: await timed("hover", () => hoverAudit(page, base, paths)),
    navigation: await timed("navigation", () => navigationAudit(page, base)),
  };
}
