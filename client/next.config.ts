import type { NextConfig } from 'next';

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
  cacheComponents: true,
  transpilePackages: ['lucide-react'],
  output: 'standalone', // Залишаємо суто standalone
};

export default nextConfig;