/**
 * Single source of truth for the public site URL. Prefers the explicit
 * env var, then Vercel's production URL, then the canonical domain. Trailing
 * slashes are stripped so it can be concatenated safely.
 */
export function getServerURL(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SERVER_URL;
  const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined;
  return (fromEnv || fromVercel || "https://www.naqijo.com").replace(/\/+$/, "");
}

export const isProduction = process.env.NODE_ENV === "production";

/**
 * True when the host is a loopback, unspecified, link-local, or RFC-1918
 * private address — i.e. only reachable from the machine/network it runs on,
 * never from a real visitor's browser.
 */
function isPrivateHost(host: string): boolean {
  const h = host.toLowerCase().replace(/^\[|\]$/g, ""); // strip IPv6 brackets
  if (
    h === "localhost" ||
    h.endsWith(".localhost") ||
    h.endsWith(".local") ||
    h === "127.0.0.1" ||
    h === "0.0.0.0" ||
    h === "::1" ||
    h === "::" ||
    h === "" // e.g. "http://:3000"
  ) {
    return true;
  }
  // IPv4 private / loopback / link-local ranges.
  return (
    /^127\./.test(h) || // loopback
    /^10\./.test(h) || // 10.0.0.0/8
    /^192\.168\./.test(h) || // 192.168.0.0/16
    /^169\.254\./.test(h) || // link-local
    /^172\.(1[6-9]|2\d|3[01])\./.test(h) // 172.16.0.0/12
  );
}

/**
 * Fail fast when the public site origin is a development/private address but
 * NODE_ENV=production. NEXT_PUBLIC_SERVER_URL is inlined at build time and
 * used to build absolute image, email, sitemap, and preview URLs — a
 * localhost/127.0.0.1/0.0.0.0/private value there silently produces URLs that
 * no real browser can load. A clear startup error beats broken production
 * pages. No-op outside production (dev/test intentionally use localhost).
 */
export function assertPublicServerURL(url: string = getServerURL()): void {
  if (process.env.NODE_ENV !== "production") return;

  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    throw new Error(
      `Invalid NEXT_PUBLIC_SERVER_URL in production: ${JSON.stringify(url)}. ` +
        "Set it to your public site origin, e.g. https://www.naqijo.com",
    );
  }

  if (isPrivateHost(host)) {
    throw new Error(
      `NEXT_PUBLIC_SERVER_URL is set to a development/private address ` +
        `(${JSON.stringify(url)}) while NODE_ENV=production. This value is ` +
        `baked into absolute image, email, sitemap, and preview URLs, so a ` +
        `loopback/private host produces links no visitor can load. Set it to ` +
        `your public origin, e.g. https://www.naqijo.com`,
    );
  }
}
