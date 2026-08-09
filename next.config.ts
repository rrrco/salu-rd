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

    // Lets a link upgrade to a *full* prefetch when the pointer lands on it.
    //
    // Without this, a dynamic route only ever gets a partial prefetch as far as
    // the nearest `loading.js`, so the product overlay fetched nothing ahead of
    // time and the whole render happened after the click. The flag alone does
    // nothing: the link has to opt in with `unstable_dynamicOnHover` too, which
    // is why only the product tiles carry it. Hovering is the cheapest possible
    // signal of intent, so the work starts while the finger is still moving.
    dynamicOnHover: true,

    // How long the client router may reuse a route it already has.
    //
    // `dynamic` covers the product overlay: come back to a product within two
    // minutes and it renders from memory with no server round trip at all. The
    // ceiling is deliberately short of the 60s ISR window plus a margin, so a
    // price or a description edited in Studio still reaches a browsing buyer
    // quickly. `static` must be at least 30s per Next's own validation.
    staleTimes: {
      dynamic: 120,
      static: 180,
    },
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
