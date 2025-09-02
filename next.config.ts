import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vladclaudecode.wpenginepowered.com',
      },
      {
        protocol: 'https',
        hostname: 'wordpress-1406888-5229870.cloudwaysapps.com',
      },
      {
        protocol: 'https',
        hostname: '**.wpenginepowered.com',
      },
      {
        protocol: 'https',
        hostname: '**.wordpress.com',
      },
      {
        protocol: 'https',
        hostname: '**.wp.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;
