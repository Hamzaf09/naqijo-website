import type { Payload, Where } from "payload";
import { CHANNELS } from "./types";

export interface Analytics {
  rangeDays: number;
  since: string;
  conversations: { total: number; byChannel: Record<string, number> };
  handling: { aiOnly: number; humanInvolved: number; awaitingReply: number };
  responseSeconds: { averageFirstReply: number | null; averageFirstHumanReply: number | null; sample: number };
  escalation: { conversationsWithHandoff: number; rate: number | null; byReason: Record<string, number> };
  inquiries: { product: number; maintenance: number };
  leads: { total: number; qualified: number };
  appointments: { requested: number; confirmed: number };
  sales: { verifiedSales: number; verifiedLost: number; conversionRate: number | null; note: string };
  delivery: { failedMessages: number; retrying: number; integrationErrors: number };
}

const count = async (payload: Payload, collection: Parameters<Payload["count"]>[0]["collection"], where: Where) =>
  (await payload.count({ collection, where, overrideAccess: true })).totalDocs;

/**
 * Operational analytics straight from the database. Conservative by design:
 * a lead is never a sale and a request is never a confirmed appointment —
 * those figures only count records carrying human verification.
 */
export async function computeAnalytics(payload: Payload, days = 30): Promise<Analytics> {
  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const inRange: Where = { createdAt: { greater_than_equal: since } };

  const byChannel: Record<string, number> = {};
  let total = 0;
  for (const ch of CHANNELS) {
    const n = await count(payload, "conversations", { and: [inRange, { channel: { equals: ch } }] });
    byChannel[ch] = n;
    total += n;
  }

  const aiOnly = await count(payload, "conversations", { and: [inRange, { aiReplyCount: { greater_than: 0 } }, { humanReplyCount: { equals: 0 } }] });
  const humanInvolved = await count(payload, "conversations", { and: [inRange, { humanReplyCount: { greater_than: 0 } }] });
  const awaitingReply = await count(payload, "conversations", { and: [inRange, { firstReplyAt: { exists: false } }] });

  const replied = await payload.find({
    collection: "conversations",
    where: { and: [inRange, { firstReplyAt: { exists: true } }, { firstInboundAt: { exists: true } }] },
    limit: 1000,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  });
  const deltas = replied.docs
    .map((c) => (new Date(c.firstReplyAt!).getTime() - new Date(c.firstInboundAt!).getTime()) / 1000)
    .filter((d) => d >= 0);
  const humanDeltas = replied.docs
    .filter((c) => c.firstHumanReplyAt && c.firstInboundAt)
    .map((c) => (new Date(c.firstHumanReplyAt!).getTime() - new Date(c.firstInboundAt!).getTime()) / 1000)
    .filter((d) => d >= 0);
  const avg = (a: number[]) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : null);

  const handoffs = await payload.find({ collection: "handoffs", where: inRange, limit: 2000, depth: 0, pagination: false, overrideAccess: true });
  const handoffConvs = new Set(handoffs.docs.map((h) => (typeof h.conversation === "object" ? h.conversation.id : h.conversation)));
  const byReason: Record<string, number> = {};
  for (const h of handoffs.docs) byReason[h.reason] = (byReason[h.reason] ?? 0) + 1;

  const leadsTotal = await count(payload, "leads", inRange);
  const qualified = await count(payload, "leads", { and: [inRange, { qualified: { equals: true } }] });
  const product = await count(payload, "leads", { and: [inRange, { kind: { equals: "sales" } }] });
  const maintenance = await count(payload, "leads", { and: [inRange, { kind: { equals: "maintenance" } }] });

  const requested = await count(payload, "appointments", inRange);
  // confirmed = a staff member confirmed it (confirmedBy is stamped by the hook)
  const confirmed = await count(payload, "appointments", {
    and: [inRange, { status: { in: ["confirmed", "completed"] } }, { confirmedBy: { exists: true } }],
  });

  const won = await count(payload, "leads", { and: [inRange, { stage: { equals: "won" } }, { "verified.evidence": { exists: true } }] });
  const lost = await count(payload, "leads", { and: [inRange, { stage: { equals: "lost" } }] });
  const decided = won + lost;

  const failed = await count(payload, "messages", { and: [inRange, { direction: { equals: "outbound" } }, { status: { equals: "failed" } }] });
  const retrying = await count(payload, "messages", { and: [{ status: { equals: "queued" } }, { attempts: { greater_than: 0 } }] });
  const integrationErrors = await count(payload, "webhook-events", { and: [inRange, { status: { in: ["error", "invalid_signature"] } }] });

  return {
    rangeDays: days,
    since,
    conversations: { total, byChannel },
    handling: { aiOnly, humanInvolved, awaitingReply },
    responseSeconds: { averageFirstReply: avg(deltas), averageFirstHumanReply: avg(humanDeltas), sample: deltas.length },
    escalation: { conversationsWithHandoff: handoffConvs.size, rate: total ? handoffConvs.size / total : null, byReason },
    inquiries: { product, maintenance },
    leads: { total: leadsTotal, qualified },
    appointments: { requested, confirmed },
    sales: {
      verifiedSales: won,
      verifiedLost: lost,
      conversionRate: decided ? won / decided : null,
      note: "Sales count only leads marked 'won' by staff with invoice/order evidence. Leads and requests are not sales.",
    },
    delivery: { failedMessages: failed, retrying, integrationErrors },
  };
}
