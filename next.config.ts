import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    'sanity',
    '@sanity/ui',
    '@sanity/icons',
    'next-sanity',
    '@sanity/vision',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.sh-vet.com' },
      { protocol: 'https', hostname: 'sh-vet.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
};

export default nextConfig;
