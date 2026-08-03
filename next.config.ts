import type { NextConfig } from "next";
import path from "path";

/** Pin tracing to this app folder (avoids parent lockfile / monorepo confusion). */
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    // Avoid flaky PageNotFoundError for /_document during "Collecting page data" on Windows.
    webpackBuildWorker: false,
  },
};

export default nextConfig;