import type { Payload } from "payload";
import { processConversation } from "./engine";
import { retryDue } from "./outbound";

/**
 * Periodic worker (hit /api/agent/jobs from a cron every minute):
 *  1. retry queued outbound messages whose backoff elapsed,
 *  2. re-run the assistant for inbound messages that were stored but never processed,
 *  3. prune old webhook diagnostics.
 */
export async function runJobs(payload: Payload) {
  const retried = await retryDue(payload);

  const stale = await payload.find({
    collection: "messages",
    where: {
      and: [
        { direction: { equals: "inbound" } },
        { processedAt: { exists: false } },
        { createdAt: { less_than: new Date(Date.now() - 60_000).toISOString() } },
      ],
    },
    limit: 50,
    depth: 0,
    overrideAccess: true,
  });
  const convIds = [...new Set(stale.docs.map((m) => Number(typeof m.conversation === "object" ? m.conversation.id : m.conversation)))];
  let reprocessed = 0;
  for (const id of convIds) {
    const r = await processConversation(payload, id).catch(() => null);
    if (r && r.status !== "noop") reprocessed++;
  }

  await payload.delete({
    collection: "webhook-events",
    where: { and: [{ createdAt: { less_than: new Date(Date.now() - 30 * 86_400_000).toISOString() } }, { status: { in: ["processed", "ignored", "verification"] } }] },
    overrideAccess: true,
  });
  return { retried, reprocessed };
}
