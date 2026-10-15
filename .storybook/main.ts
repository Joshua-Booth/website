import { transformAsync } from "@babel/core";
import { defineMain } from "@storybook/nextjs-vite/node";

import babelConfig from "../babel.config.js";

export default defineMain({
  framework: "@storybook/nextjs-vite",
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-vitest"],
  features: { experimentalTestSyntax: true },
  async viteFinal(config) {
    config.plugins = [
      {
        name: "stylex",
        enforce: "pre",
        async transform(code, id) {
          if (!/\.tsx?$/.test(id) || !code.includes("@stylexjs/stylex")) {
            return null;
          }

          const result = await transformAsync(code, {
            filename: id,
            babelrc: false,
            configFile: false,
            parserOpts: { plugins: ["typescript", "jsx"] },
            plugins: babelConfig.plugins,
            sourceMaps: true,
          });

          return result?.code ? { code: result.code, map: result.map } : null;
        },
      },
      ...(config.plugins ?? []),
    ];

    return config;
  },
});
