import eslintPluginAstro from "eslint-plugin-astro";

export default [
  {
    ignores: [".netlify/**"],
  },
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {},
  },
];
