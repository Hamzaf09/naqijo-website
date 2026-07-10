import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // WebP only: source images are pre-optimized WebP, so on-demand
    // transcoding is trivial and fast. AVIF encoding is the slowest/most
    // failure-prone step on the Vercel optimizer and is intentionally dropped.
    formats: ["image/webp"],
    // Cache optimized variants for a year so cold per-device requests are rare.
    minimumCacheTTL: 31536000,
    // Sources max out at 1600px; no need to generate huge variants.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
    imageSizes: [256, 384],
    remotePatterns: [
      // Supabase Storage + future CDNs are added here as they come online.
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default withNextIntl(nextConfig);
