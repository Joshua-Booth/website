import type { NextConfig } from "next";

import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  poweredByHeader: false,
  reactStrictMode: true,
  typedRoutes: true,
};

const withMDX = createMDX();

export default withMDX(nextConfig);
