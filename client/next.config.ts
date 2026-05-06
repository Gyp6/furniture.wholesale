import type { NextConfig } from 'next';

const BACKEND_URL = process.env.BACKEND_URL;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4566',
        pathname: '/furniture-wholesale-bucket/**',
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
  reactCompiler: true,
  cacheComponents: true,
  transpilePackages: ['lucide-react'],
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
