import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import js from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";
import checkFile from "eslint-plugin-check-file";
import depend from "eslint-plugin-depend";
import jsdoc from "eslint-plugin-jsdoc";
import perfectionist from "eslint-plugin-perfectionist";
import promise from "eslint-plugin-promise";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  // Global ignores
  {
    ignores: [
      ".netlify/**",
      "dist/**",
      ".astro/**",
      "**/*.d.ts",
      // Vendor SDK snippets (inline scripts not authored by us)
      "src/components/shared/post-hog.astro",
    ],
  },

  // JavaScript recommended
  js.configs.recommended,

  // ESLint directive comments best practices
  comments.recommended,
  {
    rules: {
      "@eslint-community/eslint-comments/disable-enable-pair": [
        "error",
        { allowWholeFile: true },
      ],
      "@eslint-community/eslint-comments/require-description": "warn",
    },
  },

  // TypeScript strict type-checked (only for .ts/.tsx files)
  ...tseslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.{ts,tsx}"],
  })),
  ...tseslint.configs.stylisticTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.{ts,tsx}"],
  })),

  // Astro recommended
  ...eslintPluginAstro.configs.recommended,

  // Promise handling
  promise.configs["flat/recommended"],

  // Code quality / smells
  sonarjs.configs.recommended,
  {
    rules: {
      "sonarjs/no-hardcoded-passwords": "off",
    },
  },

  // Dependencies
  depend.configs["flat/recommended"],

  // JSDoc
  jsdoc.configs["flat/recommended-typescript-flavor"],

  // Export sorting (named imports handled by prettier sort-imports plugin)
  {
    plugins: { perfectionist },
    rules: {
      "perfectionist/sort-named-exports": ["error", { type: "natural" }],
    },
  },

  // Base language options for TypeScript files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: ["tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // TypeScript overrides
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "no-unused-vars": "off",
      "no-undef": "off",

      // Relax some strict rules
      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        { ignoreArrowShorthand: true },
      ],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],

      // Naming conventions
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "parameter",
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "enumMember",
          format: ["UPPER_CASE", "PascalCase"],
        },
        {
          selector: ["objectLiteralProperty", "typeProperty"],
          format: null,
        },
        {
          selector: "import",
          format: null,
        },
      ],

      // SonarJS tuning
      "sonarjs/cognitive-complexity": ["error", 20],
      "sonarjs/todo-tag": "off",
      "sonarjs/no-hardcoded-passwords": "off",
      "sonarjs/prefer-read-only-props": "off",
      "sonarjs/deprecation": "off",

      // JSDoc: TypeScript provides types, keep rules minimal
      "jsdoc/require-returns-type": "off",
      "jsdoc/require-param-type": "off",
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/require-param": "off",
      "jsdoc/require-param-description": "off",
    },
  },

  // Unicorn (selective modern JS patterns)
  {
    plugins: { unicorn },
    rules: {
      "unicorn/better-regex": "error",
      "unicorn/catch-error-name": "error",
      "unicorn/consistent-function-scoping": "error",
      "unicorn/error-message": "error",
      "unicorn/no-array-for-each": "error",
      "unicorn/no-array-reduce": "error",
      "unicorn/no-useless-undefined": "error",
      "unicorn/prefer-array-find": "error",
      "unicorn/prefer-array-flat-map": "error",
      "unicorn/prefer-array-some": "error",
      "unicorn/prefer-at": "error",
      "unicorn/prefer-includes": "error",
      "unicorn/prefer-modern-math-apis": "error",
      "unicorn/prefer-negative-index": "error",
      "unicorn/prefer-number-properties": "error",
      "unicorn/prefer-optional-catch-binding": "error",
      "unicorn/prefer-string-replace-all": "error",
      "unicorn/prefer-ternary": "error",
      "unicorn/throw-new-error": "error",
      "unicorn/no-typeof-undefined": "error",
      "unicorn/no-unnecessary-await": "error",
      "unicorn/prefer-date-now": "error",
      "unicorn/prefer-default-parameters": "error",
      "unicorn/prefer-logical-operator-over-ternary": "error",
      "unicorn/prefer-math-min-max": "error",
      "unicorn/prefer-native-coercion-functions": "error",
      "unicorn/prefer-regexp-test": "error",
      "unicorn/prefer-set-has": "error",
      "unicorn/prefer-spread": "error",
      "unicorn/prefer-string-slice": "error",
      "unicorn/prefer-structured-clone": "error",
      "unicorn/prefer-switch": "error",
      "unicorn/require-number-to-fixed-digits-argument": "error",
      "unicorn/no-empty-file": "error",
      "unicorn/no-instanceof-array": "error",
      "unicorn/no-static-only-class": "error",
      "unicorn/no-lonely-if": "error",
      "unicorn/no-negated-condition": "error",
      "unicorn/no-nested-ternary": "error",
      "unicorn/consistent-destructuring": "error",
    },
  },

  // File and folder naming conventions (kebab-case)
  {
    plugins: { "check-file": checkFile },
    ignores: ["src/pages/**"],
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        { "**/*.{astro,ts,tsx}": "KEBAB_CASE" },
        { ignoreMiddleExtensions: true },
      ],
      "check-file/folder-naming-convention": [
        "error",
        { "src/**/": "KEBAB_CASE" },
      ],
    },
  },
];
