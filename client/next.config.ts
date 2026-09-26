import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Ignore minor ESLint warnings during cloud deployment build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 1. Production Security Headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
      ],
    },
  ],

  // 2. Proxy API calls to the Express backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.SERVER_PROXY_URL || 'http://127.0.0.1:5000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
