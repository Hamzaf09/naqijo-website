import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Meta signs every webhook POST with HMAC-SHA256 of the RAW body using the app
 * secret, sent as `X-Hub-Signature-256: sha256=<hex>`. Verify against the raw
 * bytes (never re-serialized JSON) with a constant-time comparison.
 */
export function verifySignature(rawBody: string, header: string | null, appSecret: string): boolean {
  if (!appSecret || !header) return false;
  const [scheme, provided] = header.split("=");
  if (scheme !== "sha256" || !provided) return false;
  const expected = createHmac("sha256", appSecret).update(rawBody, "utf8").digest();
  let given: Buffer;
  try {
    given = Buffer.from(provided, "hex");
  } catch {
    return false;
  }
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export function signBody(rawBody: string, appSecret: string): string {
  return "sha256=" + createHmac("sha256", appSecret).update(rawBody, "utf8").digest("hex");
}

/** GET verification handshake: echo hub.challenge only when the verify token matches. */
export function verifyChallenge(
  params: URLSearchParams,
  verifyToken: string,
): { ok: true; challenge: string } | { ok: false } {
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");
  if (mode !== "subscribe" || !verifyToken || !token || challenge === null) return { ok: false };
  const a = Buffer.from(token);
  const b = Buffer.from(verifyToken);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false };
  return { ok: true, challenge };
}
