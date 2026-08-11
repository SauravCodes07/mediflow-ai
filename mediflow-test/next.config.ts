import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Using manual service worker (public/sw.js) for PWA support
  // next-pwa is incompatible with Next.js 16 Turbopack
  turbopack: {},
};

export default nextConfig;
