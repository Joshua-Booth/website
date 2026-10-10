import type { AuditResult, Issue } from "./in-page.ts";
import type { Page } from "playwright";

import {
  blueprintOpacity,
  centre,
  frames,
  lightAt,
  SELECTOR,
  settled,
  topAt,
} from "./browse.ts";

const SIZES = [
  [1440, 900],
  [1280, 800],
  [1024, 768],
  [768, 1024],
  [390, 844],
  [360, 740],
] as const;

export const NOT_FOUND = "/not-a-page";

const LOAD_SAMPLES = [150, 400, 1400, 3300];

const WHILE_RESIZING_MS = 120;

export interface Finding extends Partial<Issue> {
  page: string;
  size: string;
  when: string;
  kind: string;
}

type Where = Omit<Finding, "kind">;

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

export async function overlapAudit(
  page: Page,
  base: string,
  out: string,
  live: string[]
) {
  const pages = [...live, NOT_FOUND];
  const findings: Finding[] = [];
  const shots: string[] = [];

  const audit = async (where: Where) => {
    const result: AuditResult = await page.evaluate(() => window.__audit());

    for (const issue of result.issues) findings.push({ ...where, ...issue });

    if (result.overflow > 0) {
      findings.push({ ...where, kind: "sideways-scroll", px: result.overflow });
    }

    return result;
  };

  const blueprintShows = async (where: Where, kind: string) => {
    const opacity = await blueprintOpacity(page);

    if (opacity > 0.01) {
      findings.push({ ...where, kind, a: `opacity ${opacity}` });
    }
  };

  async function load(
    path: string,
    size: string,
    width: number,
    height: number
  ) {
    await page.goto(base + path, { waitUntil: "load" });
    await page.mouse.move(width * 0.5, height * 0.5);

    let waited = 0;

    for (const at of LOAD_SAMPLES) {
      await page.waitForTimeout(at - waited);
      waited = at;

      const where = { page: path, size, when: `load+${at}` };

      await audit(where);
      await blueprintShows(where, "blueprint-on-at-load");
    }
  }

  async function scroll(
    path: string,
    size: string,
    width: number,
    height: number
  ) {
    const max = await page.evaluate(
      () => document.documentElement.scrollHeight - innerHeight
    );

    const step = Math.round(height * 0.18);

    for (let y = 0; y <= max + step; y += step) {
      const at = Math.min(y, max);

      await page.evaluate((top) => {
        scrollTo({ top, behavior: "instant" });
      }, at);

      await frames(page);

      const point = await page.evaluate(() => {
        const heading = document.querySelector("[data-asm] :is(.big, .mid)");
        const box = heading?.getBoundingClientRect();

        if (!box || box.bottom < 0 || box.top > innerHeight) return null;

        return [
          box.left + Math.min(box.width, 300) / 2,
          Math.max(20, Math.min(innerHeight - 20, box.top + box.height / 2)),
        ] as const;
      });

      const [x, y2] = point ?? [width * 0.5, height * 0.5];

      await page.mouse.move(x, y2, { steps: 2 });
      await lightAt(page, x, y2);

      const result = await audit({ page: path, size, when: `y${at}` });
      const taken = shots.filter((s) => s.startsWith(`${width}${path}`));

      if (result.issues.length && taken.length < 4) {
        const file = `${width}${path.replaceAll("/", "_")}-y${at}.png`;
        const kinds = new Set(result.issues.map((issue) => issue.kind));

        await page.screenshot({ path: `${out}/${file}` });
        shots.push(`${width}${path} ${file} ${[...kinds].join(",")}`);
      }
    }
  }

  async function subpageAndResize(size: string, width: number, height: number) {
    const where = (when: string) => ({ page: "/", size, when });

    const settle = async (when: string) => {
      if (!(await settled(page))) {
        findings.push({ ...where(when), kind: "never-settled" });
      }
    };

    if (live.includes("/work/pcos-protocol")) {
      await centre(page, SELECTOR.pcosRow);
      await settle("before-case");
      await page.click(SELECTOR.pcosRow);
      await page.waitForURL("**/work/pcos-protocol", { waitUntil: "commit" });
      await frames(page);
      await blueprintShows(where("case-open"), "blueprint-flash-on-subpage");
      await settle("case");
      await audit(where("case"));
      await page.click(SELECTOR.back);
      await page.waitForURL((u) => u.pathname === "/", { waitUntil: "commit" });
      await settle("home");
    }

    await topAt(page, SELECTOR.work, 0.75);
    await frames(page);
    await page.setViewportSize({ width: Math.max(340, width - 180), height });
    await page.waitForTimeout(WHILE_RESIZING_MS);
    await audit(where("resizing"));

    const shown = await page.evaluate(
      (s) => document.querySelector(s)?.hasAttribute("data-on") ?? false,
      SELECTOR.blueprint
    );

    if (!shown) {
      findings.push({ ...where("resizing"), kind: "blueprint-not-shown" });
    }

    await page.screenshot({ path: `${out}/${width}-resizing.png` });

    const faded = await page
      .waitForFunction(
        (s) => {
          const blueprint = document.querySelector(s);

          return !blueprint || getComputedStyle(blueprint).opacity === "0";
        },
        SELECTOR.blueprint,
        { timeout: 2000 }
      )
      .then(() => true)
      .catch(() => false);

    if (!faded) {
      findings.push({ ...where("after-resize"), kind: "blueprint-stuck" });
    }

    await audit(where("after-resize"));
    await page.setViewportSize({ width, height });
  }

  for (const [width, height] of SIZES) {
    const size = `${width}x${height}`;

    await page.setViewportSize({ width, height });

    for (const path of pages) {
      await load(path, size, width, height);
      await scroll(path, size, width, height);
      if (path === "/") await subpageAndResize(size, width, height);
    }
  }

  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const [width, height] of SIZES) {
    await page.setViewportSize({ width, height });

    for (const path of pages) {
      await page.goto(base + path, { waitUntil: "load" });

      await page.waitForFunction(() => {
        const xray = document.querySelector('[data-overlay="xray"]');

        return !!xray && getComputedStyle(xray).opacity === "1";
      });

      for (const problem of await page.evaluate(() => window.__chips())) {
        findings.push({
          page: path,
          size: `${width}x${height}`,
          when: "flat",
          kind: "chip-collides",
          a: problem,
        });
      }
    }
  }

  await page.emulateMedia({ reducedMotion: "no-preference" });

  return { findings, pages, shots };
}
