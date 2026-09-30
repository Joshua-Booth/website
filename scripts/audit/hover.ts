import type { Page } from "playwright";

import { mkdirSync } from "node:fs";

import { centre, frames, lightAt, SELECTOR, settled, topAt } from "./browse.ts";

const HIDE =
  "[data-overlay=xray],[data-overlay=glow],[data-overlay=build]{visibility:hidden!important}";

const UNFIX =
  ".page :is(a,button),.page [data-asm],.page .tile{z-index:auto!important}body:not([data-lit]) .page [data-asm]{z-index:21!important}";

const HOME: [string, string, string?][] = [
  ["nav-work", ".nav a:nth-child(1)"],
  ["nav-projects", ".nav a:nth-child(2)"],
  ["nav-lab", ".nav a:nth-child(3)"],
  ["nav-contact", ".nav a:nth-child(4)"],
  ["mark", ".mark"],
  ["pcos-row", SELECTOR.pcosRow],
  ["this-site-row", "#this-site"],
  ["creact-row", '#projects a.row[href*="creact"]'],
  ["lab-tile", "#strip .tile", "#strip .tile figcaption"],
  ["lab-more", ".more a"],
  ["mail", ".mail"],
  ["copy", ".copy"],
  ["linkedin", ".links a"],
  ["top", ".foot a"],
];

export async function hoverTest(page: Page, base: string, root: string) {
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

    if (building) await snap("nav-while-building", ".nav a:nth-child(2)");

    await settled(page);

    for (const [name, sel, judge] of HOME) {
      await centre(page, sel);
      await settled(page);
      await snap(name, sel, judge);
    }

    await topAt(page, SELECTOR.pcosRow, 0.86);
    await frames(page);

    const moving = await page.evaluate(
      (s) => document.querySelector(s)!.hasAttribute("data-asm"),
      SELECTOR.work
    );

    if (moving) await snap("pcos-row-moving", SELECTOR.pcosRow);

    await load("/work/pcos-protocol");
    await settled(page);
    await snap("case-back", SELECTOR.back);
    await load("/lab");
    await settled(page);
    await snap("lab-filter", '.filters button[aria-pressed="false"]');

    await snap(
      "lab-page-tile",
      "#grid .tile:nth-child(3)",
      "#grid .tile:nth-child(3) figcaption"
    );

    await load("/writing/this-site");
    await settled(page);
    await snap("write-up-back", SELECTOR.back);
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
