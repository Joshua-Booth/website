import { chromium } from "playwright";

const out = process.argv[2] ?? "public/og.png";

const browser = await chromium.launch();

const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

await page.goto(new URL("og.html", import.meta.url).href);
await page.waitForFunction(() => document.body.dataset.ready === "true");
await page.screenshot({ path: out });
await browser.close();

console.log(`Wrote ${out}`);
