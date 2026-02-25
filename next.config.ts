import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
