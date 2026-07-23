import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload/client";
import packageInfo from "../../../package.json";

/** Health endpoint for uptime checks / load balancers. Never cached. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const startedAt = Date.now();
  let dbOk = false;
  try {
    const payload = await getPayloadClient();
    await payload.count({ collection: "users" });
    dbOk = true;
  } catch {
    dbOk = false;
  }

  const body = {
    status: dbOk ? "ok" : "degraded",
    version: packageInfo.version,
    database: dbOk ? "connected" : "unreachable",
    uptimeSeconds: Math.round(process.uptime()),
    responseMs: Date.now() - startedAt,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, {
    status: dbOk ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
