/**
 * Small fixed-window limiter. State is per server instance (in memory), which
 * is a best-effort shield on serverless; the hard guarantees (duplicate
 * suppression, per-conversation AI reply cap) are enforced in the database.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): { allowed: boolean; retryAfterSec: number } {
  if (buckets.size > 5000) for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }
  b.count++;
  return { allowed: b.count <= limit, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
}

export const _resetRateLimits = () => buckets.clear();
