import { getPayload, type Payload } from "payload";
import config from "@payload-config";

let cached: Promise<Payload> | null = null;

/**
 * Memoized Payload local-API client for server components / data access.
 *
 * If initialization fails (e.g. the database is unreachable during a build),
 * the rejected promise is NOT cached — the failure is re-thrown so callers can
 * catch it and fall back, and the next call retries a fresh connection instead
 * of being stuck on a permanently-rejected promise.
 */
export function getPayloadClient(): Promise<Payload> {
  if (!cached) {
    cached = getPayload({ config }).catch((err) => {
      cached = null;
      throw err;
    });
  }
  return cached;
}
