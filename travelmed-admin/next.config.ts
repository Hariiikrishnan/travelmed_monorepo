import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets CI or a verification build write somewhere other than the dev server's .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
  /* config options here */
};

export default nextConfig;
