// @ts-check
import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://joshuabooth.nz",
  adapter: netlify(),
  integrations: [react(), mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["@radix-ui/themes", "classnames"],
    },
    ssr: {
      noExternal: ["@radix-ui/themes", "@astrojs/netlify"],
    },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Albert Sans",
      cssVariable: "--font-albert-sans",
      weights: ["500", "600", "700", "800"],
    },
  ],
});
