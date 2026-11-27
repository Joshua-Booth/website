import { chromium } from "playwright";

const out = process.argv[2] ?? "public/og.png";
const template = process.argv[3] ?? "og.html";

// AUDIT_CHROME points at a browser when Playwright's own isn't installed
const browser = await chromium.launch({
  executablePath: process.env.AUDIT_CHROME,
});

const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

await page.goto(new URL(template, import.meta.url).href);
await page.waitForFunction(() => document.body.dataset.ready === "true");
await page.screenshot({ path: out });
await browser.close();

console.log(`Wrote ${out}`);
