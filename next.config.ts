import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the Next.js dev badge out of the sidebar (dev only, never shown in production)
  devIndicators: { position: "bottom-right" },
  turbopack: {
    // Pin the project root to this folder so a stray package-lock.json
    // higher up (e.g. in your home folder) is never picked up.
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
