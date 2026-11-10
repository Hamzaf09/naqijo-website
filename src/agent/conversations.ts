import type { Payload } from "payload";
import { TENANT_ID } from "./config";
import type { Channel, NormalizedInbound } from "./types";

export const threadKey = (channel: Channel, accountId: string, customerId: string) =>
  `${TENANT_ID}:${channel}:${accountId || "-"}:${customerId}`;

export const dedupeKey = (channel: Channel, externalId: string) => `${channel}:${externalId}`;

const preview = (s: string) => (s.length > 120 ? s.slice(0, 117) + "…" : s);

export async function findMessageByExternalId(payload: Payload, channel: Channel, externalId: string) {
  const r = await payload.find({
    collection: "messages",
    where: { dedupeKey: { equals: dedupeKey(channel, externalId) } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  return r.docs[0] ?? null;
}

async function upsertCustomer(payload: Payload, m: NormalizedInbound) {
  const identityKey = `${m.channel}:${m.customerId}`;
  const found = await payload.find({
    collection: "customers",
    where: { identityKey: { equals: identityKey } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  if (found.docs[0]) {
    const c = found.docs[0];
    if (m.customerName && !c.displayName) {
      await payload.update({ collection: "customers", id: c.id, data: { displayName: m.customerName }, overrideAccess: true });
    }
    return c;
  }
  return payload.create({
    collection: "customers",
    overrideAccess: true,
    data: {
      tenant: TENANT_ID,
      identityKey,
      channel: m.channel,
      displayName: m.customerName || undefined,
    },
  });
}

/**
 * Stores an inbound message idempotently. Duplicate deliveries (Meta retries,
 * replays) are detected by the unique `dedupeKey` and never create a second row
 * or a second AI reply.
 */
export async function ingestInbound(
  payload: Payload,
  m: NormalizedInbound,
  opts: { simulated?: boolean } = {},
): Promise<{ duplicate: boolean; conversationId: number; messageId?: number }> {
  const existing = await findMessageByExternalId(payload, m.channel, m.externalId);
  if (existing) {
    return { duplicate: true, conversationId: Number(typeof existing.conversation === "object" ? existing.conversation.id : existing.conversation) };
  }

  const customer = await upsertCustomer(payload, m);
  const key = threadKey(m.channel, m.accountId, m.customerId);
  const found = await payload.find({
    collection: "conversations",
    where: { threadKey: { equals: key } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  let conv = found.docs[0];
  if (!conv) {
    conv = await payload.create({
      collection: "conversations",
      overrideAccess: true,
      data: {
        tenant: TENANT_ID,
        threadKey: key,
        channel: m.channel,
        customerExternalId: m.customerId,
        channelAccountId: m.accountId,
        customerName: m.customerName || customer.displayName || m.customerId,
        customer: customer.id,
        status: "open",
        aiMode: "ai",
        unreadCount: 0,
        firstInboundAt: m.timestamp.toISOString(),
      },
    });
  }

  let message;
  try {
    message = await payload.create({
      collection: "messages",
      overrideAccess: true,
      data: {
        tenant: TENANT_ID,
        conversation: conv.id,
        channel: m.channel,
        direction: "inbound",
        senderType: "customer",
        kind: m.kind,
        text: m.text,
        externalId: m.externalId,
        dedupeKey: dedupeKey(m.channel, m.externalId),
        status: "received",
        simulated: Boolean(opts.simulated),
        raw: m.kind === "text" ? undefined : (m.raw as never),
        createdAt: m.timestamp.toISOString(),
      },
    });
  } catch (err) {
    // Lost a race with a concurrent identical delivery → the unique index rejected it.
    const again = await findMessageByExternalId(payload, m.channel, m.externalId);
    if (again) return { duplicate: true, conversationId: Number(conv.id) };
    throw err;
  }

  await payload.update({
    collection: "conversations",
    id: conv.id,
    overrideAccess: true,
    data: {
      status: conv.status === "resolved" ? "open" : conv.status,
      unreadCount: (conv.unreadCount ?? 0) + 1,
      lastMessageAt: m.timestamp.toISOString(),
      lastInboundAt: m.timestamp.toISOString(),
      lastMessagePreview: preview(m.text || (m.kind === "media" ? "📎" : "")),
      firstInboundAt: conv.firstInboundAt ?? m.timestamp.toISOString(),
      customerName: conv.customerName || m.customerName || undefined,
    },
  });

  return { duplicate: false, conversationId: Number(conv.id), messageId: Number(message.id) };
}
