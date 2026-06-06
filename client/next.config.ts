import type { NextConfig } from 'next';

const BACKEND_URL = process.env.BACKEND_URL;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '4566',
        pathname: '/furniture-wholesale-bucket/**',
      },
      {
        protocol: 'http',
        hostname: 'furniture.wholesale',
        pathname: '/uploads/**',
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
  reactCompiler: true,
  // cacheComponents: true,
  // transpilePackages: ['lucide-react'],
  async rewrites() {
    return [
      {
        source: '/api/v1/auth/:path*',
        destination: `${BACKEND_URL}/api/v1/auth/:path*`,
      },
      {
        source: '/api/v1/:path*',
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
  // output: 'standalone',
};

export default nextConfig;
