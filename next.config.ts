import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only: lets phones on the LAN load dev assets (Next 16 blocks
  // cross-origin dev requests by default). No effect on production builds.
  allowedDevOrigins: ['192.168.1.24', 'localhost'],
  transpilePackages: [
    'sanity',
    '@sanity/ui',
    '@sanity/icons',
    'next-sanity',
    '@sanity/vision',
  ],
  experimental: {
    // Phosphor's entry re-exports ~9000 icons. Without this, importing eight of
    // them pulls the whole barrel into the module graph and slows dev compiles
    // badly. This rewrites the imports to their direct paths.
    optimizePackageImports: ['@phosphor-icons/react'],
  },
  images: {
    // Sanity's CDN already resizes and format-negotiates, so its URLs skip
    // Next's optimizer entirely. Local assets still go through it.
    // See app/lib/imageLoader.ts.
    loader: 'custom',
    loaderFile: './app/lib/imageLoader.ts',
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
};

export default nextConfig;
