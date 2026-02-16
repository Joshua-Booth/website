import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/pages/**/*.astro", "src/content.config.ts"],

  project: ["src/**/*.{astro,ts,tsx}"],

  ignore: [
    ".astro/**",
    ".netlify/**",
    "dist/**",
    // UI components available for use across the site
    "src/components/ui/**",
  ],

  ignoreDependencies: [
    // CSS-only dependencies (imported in CSS/Astro, not JS)
    "tw-animate-css",
    "tailwindcss",
    "@sanity/visual-editing",
    // Used in astro.config.mjs or Astro templates
    "astro-og-canvas",
    "class-variance-authority",
    "classnames",
    "mini-svg-data-uri",
    // Prettier plugins (referenced by name in config)
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss",
    "@ianvs/prettier-plugin-sort-imports",
    // CLI tools (run via mise tasks, not imported)
    "cspell",
    // Used via husky pre-commit hook
    "lint-staged",
    // Test infrastructure (no tests yet)
    "vitest",
  ],

  ignoreBinaries: ["mise"],

  astro: {
    config: ["astro.config.mjs"],
    entry: ["src/pages/**/*.astro"],
  },

  eslint: {
    config: ["eslint.config.js"],
  },

  prettier: {
    config: [".prettierrc*"],
  },

  cspell: {
    config: ["cspell.json"],
  },

  commitlint: {
    config: ["commitlint.config.ts"],
  },

  "lint-staged": {
    config: [".lintstagedrc"],
  },

  ignoreExportsUsedInFile: true,
  includeEntryExports: true,
};

export default config;
