import { loadPartialConfigAsync, transformAsync } from "@babel/core";
import { defineMain } from "@storybook/nextjs-vite/node";
import { fileURLToPath } from "node:url";

export default defineMain({
  framework: "@storybook/nextjs-vite",
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-vitest"],
  features: { experimentalTestSyntax: true },
  async viteFinal(config) {
    const babel = await loadPartialConfigAsync({
      configFile: fileURLToPath(new URL("../babel.config.js", import.meta.url)),
    });

    const stylexPlugins = (babel?.options.plugins ?? []).filter(
      (plugin) =>
        typeof plugin === "object" &&
        "file" in plugin &&
        plugin.file?.request === "@stylexjs/babel-plugin"
    );

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
            plugins: stylexPlugins,
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
