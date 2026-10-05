import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets CI or a verification build write somewhere other than the dev server's .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  async redirects() {
    return [
      // Old placeholder content sections now live in the guides hub
      { source: '/travel-blog', destination: '/blog', permanent: true },
      { source: '/travel-guide', destination: '/blog', permanent: true },
      { source: '/guides', destination: '/blog', permanent: true },
      { source: '/guides/:slug', destination: '/blog/:slug', permanent: true },
      { source: '/medicine', destination: '/buy', permanent: true },
      { source: '/doctor', destination: '/teleconsultation', permanent: true },
    ];
  },
};

export default nextConfig;
