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
