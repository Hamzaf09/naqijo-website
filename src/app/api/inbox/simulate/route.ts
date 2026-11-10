import { randomUUID } from "node:crypto";
import { z } from "zod";
import { isResponse, json, requireStaff } from "@/agent/auth";
import { simulatorEnabled } from "@/agent/config";
import { ingestInbound } from "@/agent/conversations";
import { processConversation } from "@/agent/engine";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const body = z.object({
  text: z.string().min(1).max(2000),
  customerId: z.string().min(1).max(60).default("tester-1"),
  name: z.string().max(80).optional(),
});

/**
 * Test-channel simulator for staff: runs a message through the REAL engine
 * (same ingest, AI, guards, handoffs) without calling Meta. Conversations are
 * marked channel "test" and are never counted as a live-channel test.
 */
export async function POST(req: Request) {
  const staff = await requireStaff(req, { mutate: true });
  if (isResponse(staff)) return staff;
  if (!simulatorEnabled()) return json(404, { error: "simulator_disabled" });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json(400, { error: "invalid_body" });
  const { text, customerId, name } = parsed.data;
  const ingested = await ingestInbound(
    staff.payload,
    { channel: "test", externalId: `sim-in-${randomUUID()}`, customerId, accountId: "simulator", customerName: name, text, kind: "text", timestamp: new Date(), raw: null },
    { simulated: true },
  );
  const outcome = await processConversation(staff.payload, ingested.conversationId);
  return json(200, { conversationId: ingested.conversationId, outcome });
}
