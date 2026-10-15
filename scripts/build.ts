import { spawnSync } from "node:child_process";

import { askPostHog, flagsOverride } from "../src/shared/api/site-flags.ts";
import { siteFlagsValue } from "../src/shared/config/flags.ts";

// Next keeps fetches in .next/cache from one build to the next, so the flags
// are asked for here, once per build, and every page reads them from SITE_FLAGS
const flags = flagsOverride() ?? (await askPostHog());

const { status } = spawnSync("next", ["build"], {
  stdio: "inherit",
  env: { ...process.env, SITE_FLAGS: siteFlagsValue(flags) },
});

process.exitCode = status ?? 1;
