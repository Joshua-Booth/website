import type { Finding } from "./checks.ts";

import { chromium } from "playwright";

import { NOT_FOUND, siteAudit, sitemapPaths } from "./checks.ts";

const base = process.env.AUDIT_URL;

if (!base) {
  throw new Error("Set AUDIT_URL to the address mise run preview prints");
}

const live = await sitemapPaths(base);

// AUDIT_CHROME points at a browser when Playwright's own isn't installed
const browser = await chromium.launch({
  executablePath: process.env.AUDIT_CHROME,
});

const context = await browser.newContext({ deviceScaleFactor: 1 });

const page = await context.newPage();
const errors = new Set<string>();

page.on("pageerror", (e) => errors.add(`pageerror: ${e.message}`));

page.on("console", (m) => {
  // The browser logs the 404 page's own status
  if (m.location().url.endsWith(NOT_FOUND)) return;

  if (m.type() === "error" || m.type() === "warning") {
    errors.add(`console ${m.type()}: ${m.text()}`);
  }
});

let failed = false;

const heading = (t: string) => {
  console.log(`\n== ${t}`);
};

const result = await siteAudit(page, base, live);

const report = (title: string, rows: Finding[], none: string) => {
  heading(title);

  const grouped = new Map<string, Finding[]>();

  for (const row of rows) {
    const key = `${row.kind} ${row.page} ${row.detail}`;

    grouped.set(key, [...(grouped.get(key) ?? []), row]);
  }

  for (const [, group] of grouped) {
    const [row] = group;

    console.log(
      `FAIL ${row!.kind} ${row!.page} @${group.map((g) => g.size).join(",")}: ${row!.detail}`
    );
  }

  if (rows.length) failed = true;
  else console.log(none);
};

console.log(`Pages: ${result.paths.join(", ")}`);

report("Layout", result.layout, "Nothing overlaps, clips or scrolls sideways");

report(
  "Links",
  result.links.findings,
  `All ${result.links.checked} paths on this site answer, and every hash has its id`
);

console.log(`Outside links, not fetched: ${result.links.outside.join(", ")}`);

report(
  "Keyboard",
  result.keyboard.findings,
  "Every tab stop shows a ring, on screen"
);

for (const [where, names] of Object.entries(result.keyboard.stops)) {
  console.log(`${where}: ${names.join(" > ")}`);
}

report("Hover", result.hover, "Every link and button changes on hover");

report(
  "Navigation",
  result.navigation.findings,
  "Header links land and move focus"
);

for (const line of result.navigation.log) console.log(line);

heading("Errors");
console.log(errors.size ? [...errors].join("\n") : "None");
if (errors.size) failed = true;

await browser.close();
process.exitCode = failed ? 1 : 0;
