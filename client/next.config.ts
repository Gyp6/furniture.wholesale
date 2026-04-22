import type { NextConfig } from 'next';
import path from 'path';

const BACKEND_URL = process.env.BACKEND_URL;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  turbopack: {
    root: process.cwd(),
  },
  reactCompiler: true,
  cacheComponents: true,
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/auth/:path*',
  //       destination: `${BACKEND_URL}/api/auth/:path*`,
  //     },
  //     {
  //       source: '/api/:path*',
  //       destination: `${BACKEND_URL}/api/:path*`,
  //     },
  //   ];
  // },
  output: 'standalone',
};

export default nextConfig;
