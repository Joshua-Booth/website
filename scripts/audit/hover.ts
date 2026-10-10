import type { Page } from "playwright";

import { mkdirSync } from "node:fs";

import { centre, frames, lightAt, SELECTOR, settled, topAt } from "./browse.ts";

const HIDE =
  "[data-overlay=xray],[data-overlay=glow],[data-overlay=build]{visibility:hidden!important}";

const UNFIX =
  ".page :is(a,button),.page [data-asm],.page .tile{z-index:auto!important}body:not([data-lit]) .page [data-asm]{z-index:21!important}";

const TAX_CODE = '#projects a.code[href*="calculate-tax"]';

const PROJECTS_LINK = '.nav a[href="#projects"]';

interface Target {
  name: string;
  sel: string;
  judge?: string;
  needs?: string;
}

const HOME: Target[] = [
  { name: "nav-work", sel: '.nav a[href="#work"]' },
  { name: "nav-projects", sel: PROJECTS_LINK },
  { name: "nav-lab", sel: '.nav a[href="/lab"]', needs: "/lab" },
  { name: "nav-contact", sel: '.nav a[href="#contact"]' },
  { name: "mark", sel: ".mark" },
  { name: "pcos-row", sel: SELECTOR.pcosRow, needs: "/work/pcos-protocol" },
  { name: "this-site-row", sel: "#this-site", needs: "/writing/this-site" },
  { name: "creact-row", sel: '#projects a.row[href*="creact"]' },
  { name: "tax-code", sel: TAX_CODE },
  {
    name: "lab-tile",
    sel: "#strip .tile",
    judge: "#strip .tile figcaption",
    needs: "/lab",
  },
  { name: "lab-more", sel: ".more a", needs: "/lab" },
  { name: "mail", sel: ".mail" },
  { name: "copy", sel: ".copy" },
  { name: "linkedin", sel: ".links a" },
  { name: "top", sel: ".foot a" },
];

const SUBPAGES: Record<string, Target[]> = {
  "/work/pcos-protocol": [{ name: "case-back", sel: SELECTOR.back }],
  "/lab": [
    { name: "lab-filter", sel: '.filters button[aria-pressed="false"]' },
    {
      name: "lab-page-tile",
      sel: "#grid .tile:nth-child(3)",
      judge: "#grid .tile:nth-child(3) figcaption",
    },
  ],
  "/writing/this-site": [{ name: "write-up-back", sel: SELECTOR.back }],
};

export async function hoverTest(
  page: Page,
  base: string,
  root: string,
  live: string[]
) {
  const home = HOME.filter(({ needs }) => !needs || live.includes(needs));

  const subpages = Object.entries(SUBPAGES).filter(([path]) =>
    live.includes(path)
  );

  // Screenshots clear a real :hover, so hover is forced through the DevTools
  // protocol
  const cdp = await page.context().newCDPSession(page);
  const width = 1280;

  await page.setViewportSize({ width, height: 800 });
  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");

  const results: Record<
    "fixed" | "control",
    { name: string; bright: number; kept: number }[]
  > = { fixed: [], control: [] };

  for (const pass of ["fixed", "control"] as const) {
    const out = `${root}/${pass}`;

    mkdirSync(out, { recursive: true });

    const force = async (sel: string, on: boolean) => {
      const { root: doc } = await cdp.send("DOM.getDocument", { depth: 0 });

      const { nodeId } = await cdp.send("DOM.querySelector", {
        nodeId: doc.nodeId,
        selector: sel,
      });

      if (nodeId) {
        await cdp.send("CSS.forcePseudoState", {
          nodeId,
          forcedPseudoClasses: on ? ["hover"] : [],
        });
      }
    };

    const snap = async (name: string, sel: string, judge = sel) => {
      const b = await page.locator(sel).first().boundingBox();

      if (!b) return;

      const pointer = {
        x: b.x + Math.min(b.width, 200) / 2,
        y: b.y + b.height / 2,
      };

      await page.mouse.move(pointer.x, pointer.y, { steps: 3 });
      await force(sel, true);
      await lightAt(page, pointer.x, pointer.y);

      const box = (await page.locator(judge).first().boundingBox()) ?? b;
      const x = Math.max(0, box.x - 4);

      const clip = {
        x,
        y: Math.max(0, box.y - 4),
        width: Math.min(box.width + 8, width - x),
        height: box.height + 8,
      };

      const actual = await page.screenshot({
        clip,
        animations: "disabled",
        path: `${out}/${name}-actual.png`,
      });

      const tag = await page.addStyleTag({ content: HIDE });

      const truth = await page.screenshot({
        clip,
        animations: "disabled",
        path: `${out}/${name}-truth.png`,
      });

      await tag.evaluate((t) => {
        if (t instanceof Element) t.remove();
      });

      await force(sel, false);
      results[pass].push({ name, ...(await compare(page, truth, actual)) });
    };

    const load = async (path: string) => {
      await page.goto(base + path, { waitUntil: "load" });
      if (pass === "control") await page.addStyleTag({ content: UNFIX });
    };

    await load("/");
    await page.waitForTimeout(500);

    const building = await page.evaluate(
      () => !!document.querySelector('[data-overlay="build"][data-building]')
    );

    if (building) await snap("nav-while-building", PROJECTS_LINK);

    await settled(page);

    for (const { name, sel, judge } of home) {
      await centre(page, sel);
      await settled(page);
      await snap(name, sel, judge);
    }

    if (live.includes("/work/pcos-protocol")) {
      await topAt(page, SELECTOR.pcosRow, 0.86);
      await frames(page);

      const moving = await page.evaluate(
        (s) => document.querySelector(s)!.hasAttribute("data-asm"),
        SELECTOR.work
      );

      if (moving) await snap("pcos-row-moving", SELECTOR.pcosRow);
    }

    await topAt(page, TAX_CODE, 0.86);
    await frames(page);

    const codeMoving = await page.evaluate(
      (s) => document.querySelector(s)!.hasAttribute("data-asm"),
      "#projects"
    );

    if (codeMoving) await snap("tax-code-moving", TAX_CODE);

    for (const [path, targets] of subpages) {
      await load(path);
      await settled(page);

      for (const { name, sel, judge } of targets) await snap(name, sel, judge);
    }
  }

  return results;
}

async function compare(page: Page, truth: Buffer, actual: Buffer) {
  return page.evaluate(
    async ([t, a]) => {
      const pixels = async (b64: string) => {
        const img = await createImageBitmap(
          await (await fetch(`data:image/png;base64,${b64}`)).blob()
        );

        const c = new OffscreenCanvas(img.width, img.height).getContext("2d")!;

        c.drawImage(img, 0, 0);

        return c.getImageData(0, 0, img.width, img.height).data;
      };

      const pt = await pixels(t);
      const pa = await pixels(a);

      let bright = 0;
      let kept = 0;

      for (let i = 0; i < pt.length; i += 4) {
        if (Math.min(pt[i]!, pt[i + 1]!, pt[i + 2]!) > 200) {
          bright++;
          if (Math.min(pa[i]!, pa[i + 1]!, pa[i + 2]!) > 185) kept++;
        }
      }

      return { bright, kept: bright ? kept / bright : 1 };
    },
    [truth.toString("base64"), actual.toString("base64")] as const
  );
}
