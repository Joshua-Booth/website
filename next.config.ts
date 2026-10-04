import type { NextConfig } from "next";

import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Netlify serves the built pages straight from its CDN. Flags are read at
  // build time, so a flag flipped in PostHog shows up after the next deploy
  output: "export",
  pageExtensions: ["ts", "tsx", "mdx"],
  poweredByHeader: false,
  reactStrictMode: true,
  typedRoutes: true,
};

const withMDX = createMDX();

export default withMDX(nextConfig);
