import { loadPartialConfigAsync, transformAsync } from "@babel/core";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const babel = await loadPartialConfigAsync({
  configFile: fileURLToPath(new URL("babel.config.js", import.meta.url)),
});

const stylexPlugins = (babel?.options.plugins ?? []).filter(
  (plugin) =>
    typeof plugin === "object" &&
    "file" in plugin &&
    plugin.file?.request === "@stylexjs/babel-plugin"
);

export default defineConfig({
  plugins: [
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
  ],
  resolve: {
    alias: { "@": fileURLToPath(new URL("src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
