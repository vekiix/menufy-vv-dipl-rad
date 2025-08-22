import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@radix-ui/react-avatar', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'lucide-react'],
  },
  
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Enable compression
  compress: true,
  
  // Webpack configuration to handle Node.js modules in browser environment
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Provide polyfills for Node.js modules when bundling for the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "websocket": require.resolve("websocket"),
        "ws": require.resolve("ws"),
        "net": require.resolve("net"),
        "tls": require.resolve("tls"),
        "fs": require.resolve("fs"),
      };
    }
    return config;
  },
  
  // Bundle analyzer (comment out for production)
  // bundleAnalyzer: {
  //   enabled: process.env.ANALYZE === 'true',
  // },
};

export default nextConfig;
