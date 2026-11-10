import { getPayloadClient } from "@/lib/payload/client";
import { isInboxRole } from "@/access/roles";
import type { Payload } from "payload";

export interface Staff {
  payload: Payload;
  user: { id: number; email?: string; name?: string | null; role?: string };
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
export { json };

/**
 * Authenticates a dashboard API call with the Payload session cookie and
 * requires an inbox role. Mutations additionally need a same-origin `Origin`
 * header (defense in depth on top of SameSite=Lax cookies).
 */
export async function requireStaff(req: Request, opts: { mutate?: boolean } = {}): Promise<Staff | Response> {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: req.headers });
  if (!user) return json(401, { error: "unauthenticated" });
  if (!isInboxRole(user as never)) return json(403, { error: "forbidden" });
  if (opts.mutate) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin && host && new URL(origin).host !== host) return json(403, { error: "bad_origin" });
  }
  return { payload, user: user as Staff["user"] };
}

export const isResponse = (v: unknown): v is Response => v instanceof Response;
