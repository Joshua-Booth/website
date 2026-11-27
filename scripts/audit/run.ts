import type { Finding } from "./overlap.ts";
import type { WhiteFinding } from "./white.ts";

import { mkdirSync, rmSync } from "node:fs";
import { chromium } from "playwright";

import { ALL_ON } from "../../src/shared/config/flags.ts";
import { livePages } from "../../src/shared/config/pages.ts";
import { hoverTest } from "./hover.ts";
import { installAudit } from "./in-page.ts";
import { navigationAudit } from "./navigation.ts";
import { NOT_FOUND, overlapAudit, sitemapPaths } from "./overlap.ts";
import { isWhite, whiteAudit } from "./white.ts";

const base = process.env.AUDIT_URL;

if (!base) {
  throw new Error("Set AUDIT_URL to the address mise run preview prints");
}

const live = await sitemapPaths(base);
const white = await isWhite(base);

// The x-ray look has every page but the ones only the redesign adds
const missing = livePages({ ...ALL_ON, redesign: false }).filter(
  (path) => !live.includes(path)
);

// The white look is checked on the pages it ships, so a build with only the
// redesign flag on can be audited too
if (!white && missing.length > 0) {
  throw new Error(
    `${base}/sitemap.xml leaves out ${missing.join(", ")}. The x-ray audit needs every page, so build with every flag but the redesign: SITE_FLAGS=lab,pcos-case-study,this-site-case-study`
  );
}

const out = "audit-output";

rmSync(out, { recursive: true, force: true });
mkdirSync(`${out}/overlap`, { recursive: true });

// AUDIT_CHROME points at a browser when Playwright's own isn't installed
const browser = await chromium.launch({
  executablePath: process.env.AUDIT_CHROME,
});

const context = await browser.newContext({ deviceScaleFactor: 1 });

await context.addInitScript(installAudit);

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

if (white) {
  const result = await whiteAudit(page, base, live);

  const report = (title: string, rows: WhiteFinding[], none: string) => {
    heading(title);

    const grouped = new Map<string, WhiteFinding[]>();

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

  console.log(`White look. Pages: ${result.paths.join(", ")}`);

  report(
    "Layout",
    result.layout,
    "Nothing overlaps, clips or scrolls sideways"
  );

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
} else {
  heading("Overlap");

  const { findings, pages, shots } = await overlapAudit(
    page,
    base,
    `${out}/overlap`,
    live
  );

  console.log(`Pages: ${pages.join(", ")}`);

  const worst = new Map<string, { count: number; finding: Finding }>();

  for (const finding of findings) {
    const key = `${finding.page} ${finding.size} ${finding.kind}`;
    const seen = worst.get(key);
    const count = (seen?.count ?? 0) + 1;

    if (!seen || (finding.px ?? 0) > (seen.finding.px ?? 0)) {
      worst.set(key, { count, finding });
    } else seen.count = count;
  }

  for (const [key, { count, finding }] of worst) {
    const size = finding.px === undefined ? "" : ` worst ${finding.px}px`;

    console.log(
      `${key} ×${count}${size} @${finding.when}: ${finding.a ?? ""} | ${finding.b ?? ""}`
    );
  }

  if (worst.size) failed = true;
  else console.log("Nothing overlaps");
  for (const s of shots) console.log(`screenshot ${s}`);

  heading("Navigation");

  const nav = await navigationAudit(page, base);

  for (const l of nav.log) console.log(l);
  for (const p of nav.problems) console.log(`FAIL ${p}`);
  if (nav.problems.length) failed = true;

  heading("Hover and focus above the overlays");

  const hover = await hoverTest(page, base, `${out}/hover`);

  for (const pass of ["fixed", "control"] as const) {
    const rows = hover[pass];
    const bad = rows.filter((r) => r.kept < 0.9);

    console.log(`-- ${pass}`);

    for (const r of rows) {
      console.log(
        `${r.kept < 0.9 ? "FAIL" : "ok  "} ${r.name.padEnd(22)} bright px ${String(r.bright).padStart(6)}  kept ${Math.round(r.kept * 100)}%`
      );
    }

    console.log(`${bad.length} of ${rows.length} hover states hidden`);
    if (pass === "fixed" && bad.length) failed = true;

    if (pass === "control" && !bad.length) {
      console.log(
        "FAIL the control pass should fail, so the test isn't checking anything"
      );

      failed = true;
    }
  }
}

heading("Errors");
console.log(errors.size ? [...errors].join("\n") : "None");
if (errors.size) failed = true;

await browser.close();
process.exitCode = failed ? 1 : 0;
