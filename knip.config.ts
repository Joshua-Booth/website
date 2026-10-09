import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["scripts/audit/*.ts", "mdx-components.tsx"],
  project: ["{app,src,scripts}/**/*.{ts,tsx,mdx}"],
  ignoreDependencies: [
    // Loaded by name from configs knip doesn't read
    "@feature-sliced/steiger-plugin",
    "postcss",
    // Run by lefthook through mise exec, which knip doesn't parse
    "@commitlint/cli",
  ],
  ignoreExportsUsedInFile: true,
  includeEntryExports: true,
};

export default config;
