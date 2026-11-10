import { timingSafeEqual } from "node:crypto";
import { cronSecret } from "@/agent/config";
import { runJobs } from "@/agent/jobs";
import { getPayloadClient } from "@/lib/payload/client";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** Cron entry point (Vercel Cron / system cron): `Authorization: Bearer $AGENT_CRON_SECRET`. */
async function handle(req: Request) {
  const secret = cronSecret();
  const given = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  if (!secret || a.length !== b.length || !timingSafeEqual(a, b)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const payload = await getPayloadClient();
  return Response.json(await runJobs(payload));
}
export { handle as GET, handle as POST };
