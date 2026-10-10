import type { FxState } from "./in-page.ts";
import type { CDPSession, Page } from "playwright";

import { centre, SELECTOR, settled } from "./browse.ts";

interface Step {
  label: string;
  click: string;
  path: string;
  needs: string;
}

const STEPS: Step[] = [
  {
    label: "case study",
    click: SELECTOR.pcosRow,
    path: "/work/pcos-protocol",
    needs: "/work/pcos-protocol",
  },
  {
    label: "back",
    click: SELECTOR.back,
    path: "/",
    needs: "/work/pcos-protocol",
  },
  { label: "lab", click: '.nav a[href="/lab"]', path: "/lab", needs: "/lab" },
  { label: "home", click: ".mark", path: "/", needs: "/lab" },
  {
    label: "case study again",
    click: SELECTOR.pcosRow,
    path: "/work/pcos-protocol",
    needs: "/work/pcos-protocol",
  },
  {
    label: "back again",
    click: SELECTOR.back,
    path: "/",
    needs: "/work/pcos-protocol",
  },
];

async function listeners(cdp: CDPSession) {
  const count = async (expression: string) => {
    const { result } = await cdp.send("Runtime.evaluate", { expression });

    if (!result.objectId) return 0;

    const { listeners: l } = await cdp.send("DOMDebugger.getEventListeners", {
      objectId: result.objectId,
    });

    return l.length;
  };

  return (
    (await count("window")) +
    (await count("document")) +
    (await count("document.documentElement"))
  );
}

export async function navigationAudit(
  page: Page,
  base: string,
  live: string[]
) {
  const problems: string[] = [];
  const log: string[] = [];

  const cdp = await page.context().newCDPSession(page);

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${base}/`, { waitUntil: "load" });

  const seen = new Map<string, { fx: FxState; listeners: number }>();

  const settle = async (label: string, path: string) => {
    if (!(await settled(page))) problems.push(`${label}: never settled`);

    const fx = await page.evaluate(() => window.__fx());
    const n = await listeners(cdp);

    log.push(
      `${label.padEnd(18)} ${path.padEnd(22)} overlays ${fx.overlays}, x-ray ${fx.xray}, blueprint ${fx.blueprint}, covers ${fx.covers}, frames ${fx.frames}, listeners ${n}`
    );

    if (fx.xray !== 1 || fx.glow !== 1 || fx.blueprint !== 1) {
      problems.push(
        `${label}: expected one x-ray, glow and blueprint, found ${fx.xray}, ${fx.glow}, ${fx.blueprint}`
      );
    }

    if (!fx.ready) problems.push(`${label}: the page never showed`);

    const before = seen.get(path);

    if (before) {
      if (n > before.listeners) {
        problems.push(
          `${label}: ${n} listeners on ${path}, ${before.listeners} last time`
        );
      }

      if (fx.frames > before.fx.frames) {
        problems.push(
          `${label}: ${fx.frames} animation frames waiting on ${path}, ${before.fx.frames} last time`
        );
      }

      if (fx.overlays > before.fx.overlays) {
        problems.push(
          `${label}: ${fx.overlays} overlays on ${path}, ${before.fx.overlays} last time`
        );
      }
    } else seen.set(path, { fx, listeners: n });
  };

  await settle("load", "/");

  for (const step of STEPS.filter((s) => live.includes(s.needs))) {
    await centre(page, step.click);
    if (!(await settled(page))) problems.push(`${step.label}: never settled`);

    const firstFrame = page.evaluate(
      (from) =>
        new Promise<{ uncovered: string[] }>((resolve) => {
          const check = () => {
            if (location.pathname === from) {
              requestAnimationFrame(check);

              return;
            }

            const covers = [
              ...document.querySelectorAll('[data-overlay="build"]'),
            ].map((cover) => cover.getBoundingClientRect());

            const uncovered = [
              ...document.querySelectorAll<HTMLElement>(
                ".page main [data-name]"
              ),
            ]
              .filter((part) => {
                const box = part.getBoundingClientRect();

                if (box.bottom < 0 || box.top > innerHeight) return false;

                return !covers.some(
                  (cover) =>
                    cover.top <= box.top + 1 && cover.bottom >= box.bottom - 1
                );
              })
              .map((part) => part.dataset.name ?? "");

            resolve({ uncovered });
          };

          requestAnimationFrame(check);
        }),
      new URL(page.url()).pathname
    );

    await page.click(step.click);

    await page.waitForURL((u) => u.pathname === step.path, {
      waitUntil: "commit",
    });

    const first = await firstFrame;

    if (!seen.has(step.path) && first.uncovered.length) {
      problems.push(
        `${step.label}: shown before its cover was on: ${first.uncovered.join(", ")}`
      );
    }

    await settle(step.label, step.path);
  }

  return { problems, log };
}
