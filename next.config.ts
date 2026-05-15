import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  images: {
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
