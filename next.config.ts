import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";
import createNextIntlPlugin from "next-intl/plugin";
import { withPayload } from "@payloadcms/next/withPayload";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Payload serves CMS media as absolute URLs under the site's own origin
 * (`${serverURL}/api/media/file/...`), so next/image must allow that host.
 * Derive it from NEXT_PUBLIC_SERVER_URL, with localhost for dev.
 */
function ownOriginPattern(): RemotePattern[] {
  const patterns: RemotePattern[] = [
    { protocol: "http", hostname: "localhost" },
  ];
  const raw = process.env.NEXT_PUBLIC_SERVER_URL;
  if (raw) {
    try {
      const u = new URL(raw);
      patterns.push({
        protocol: u.protocol.replace(":", "") as "http" | "https",
        hostname: u.hostname,
        ...(u.port ? { port: u.port } : {}),
      });
    } catch {
      /* ignore malformed URL */
    }
  }
  return patterns;
}

/** Security headers applied to every response (safe for the Payload admin). */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Emit a standalone server for Docker / self-hosted Node (opt-in via env so
  // Vercel builds are unaffected).
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
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
      // The site's own origin — Payload-served CMS media (absolute URLs).
      ...ownOriginPattern(),
      // Supabase Storage, if media is served directly from the bucket.
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default withPayload(withNextIntl(nextConfig), {
  devBundleServerPackages: false,
});
