import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    /* 2026-05-18 INCIDENT: Next/Image optimization on Vercel double-bills
     * when fetching from remote sources. Set unoptimized=true to bypass
     * the optimization service entirely. Images render as plain <img>
     * equivalents at their source resolution. */
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.apexflowlabs.com',
        pathname: '/api/shop/image/**',
      },
      {
        protocol: 'https',
        hostname: 'apexflowlabs.com',
        pathname: '/api/shop/image/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default config;
