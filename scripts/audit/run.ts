import type { Finding } from "./overlap.ts";

import { mkdirSync, rmSync } from "node:fs";
import { chromium } from "playwright";

import { hoverTest } from "./hover.ts";
import { installAudit } from "./in-page.ts";
import { navigationAudit } from "./navigation.ts";
import { NOT_FOUND, overlapAudit } from "./overlap.ts";

const base = process.env.AUDIT_URL ?? "http://localhost:3000";
const out = "audit-output";

rmSync(out, { recursive: true, force: true });
mkdirSync(`${out}/overlap`, { recursive: true });

const browser = await chromium.launch();
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

heading("Overlap");

const { findings, shots } = await overlapAudit(page, base, `${out}/overlap`);

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

heading("Errors");
console.log(errors.size ? [...errors].join("\n") : "None");
if (errors.size) failed = true;

await browser.close();
process.exitCode = failed ? 1 : 0;
