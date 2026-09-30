import type { Page } from "playwright";

export const SELECTOR = {
  pcosRow: "#pcos-protocol",
  back: ".back",
  work: "#work",
  blueprint: '[data-overlay="blueprint"]',
};

export async function centre(page: Page, selector: string) {
  await page.evaluate((s) => {
    document
      .querySelector(s)
      ?.scrollIntoView({ block: "center", behavior: "instant" });
  }, selector);
}

export async function topAt(page: Page, selector: string, share: number) {
  await page.evaluate(
    ([s, at]) => {
      const top = document.querySelector(s)!.getBoundingClientRect().top;

      scrollTo({ top: top + scrollY - innerHeight * at, behavior: "instant" });
    },
    [selector, share] as const
  );
}

export async function frames(page: Page) {
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      })
  );
}

export async function settled(page: Page) {
  await frames(page);

  return page
    .waitForFunction(() => window.__settled(), null, { timeout: 10_000 })
    .then(() => true)
    .catch(() => false);
}

export async function lightAt(page: Page, x: number, y: number) {
  await page.waitForFunction(
    ([px, py]) => {
      const glow = document
        .querySelector('[data-overlay="glow"]')
        ?.getBoundingClientRect();

      return (
        !!glow &&
        Math.hypot(
          glow.left + glow.width / 2 - px,
          glow.top + glow.height / 2 - py
        ) < 2
      );
    },
    [x, y] as const,
    { timeout: 5000 }
  );
}

export const blueprintOpacity = (page: Page) =>
  page.evaluate((s) => {
    const blueprint = document.querySelector(s);

    return blueprint ? Number(getComputedStyle(blueprint).opacity) : 0;
  }, SELECTOR.blueprint);
