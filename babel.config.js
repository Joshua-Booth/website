// StyleX compiles styles at build time. Next.js runs app code through this;
// next/font still goes through SWC
import path from "node:path";

export default {
  presets: ["next/babel"],
  plugins: [
    [
      "@stylexjs/babel-plugin",
      {
        dev: process.env.NODE_ENV !== "production",
        runtimeInjection: false,
        enableInlinedConditionalMerge: true,
        treeshakeCompensation: true,
        aliases: { "@/*": [path.join(import.meta.dirname, "src", "*")] },
        unstable_moduleResolution: {
          type: "commonJS",
          rootDir: import.meta.dirname,
        },
      },
    ],
  ],
};
