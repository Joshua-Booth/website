import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // No barrel files: modules are imported from the file that defines them,
    // so the index.ts public APIs Feature-Sliced Design suggests are off
    rules: {
      "fsd/public-api": "off",
      "fsd/no-public-api-sidestep": "off",
      "fsd/no-layer-public-api": "off",
    },
  },
  {
    // Its one importer is app/layout.tsx, outside src/, where steiger can't
    // see it
    files: ["./src/features/page-effects/**"],
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },
]);
