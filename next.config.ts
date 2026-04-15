import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imgs.search.brave.com',
      },
    ],
  },
};

export default nextConfig;
