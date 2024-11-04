/** @type {import("prettier").Config} */
export default {
  plugins: [
    "prettier-plugin-astro",
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  importOrder: [
    "^astro$",
    "^astro:(.*)$",
    "^react$",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/lib/",
    "",
    "^@/components/",
    "",
    "^[.]",
  ],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
