import type { Payload } from "payload";
import { audit } from "./audit";
import { planSend } from "./channels/window";
import { GraphError } from "./channels/graph";
import { sendText, sendWhatsAppTemplate, splitMessage } from "./channels/send";
import { dedupeKey } from "./conversations";
import { TENANT_ID } from "./config";
import type { MetaChannel } from "./types";

export const MAX_ATTEMPTS = 5;
const backoffMs = (attempts: number) => Math.min(30_000 * 2 ** Math.max(0, attempts - 1), 15 * 60_000);

export interface SendResult {
  ok: boolean;
  messageIds: number[];
  blockedReason?: string;
  error?: string;
}

interface SendOpts {
  conversationId: number;
  text?: string;
  template?: { name: string; language: string; bodyParams?: string[] };
  senderType: "ai" | "agent" | "system";
  userId?: number | string | null;
  aiMeta?: Record<string, unknown>;
}

/** Creates outbound message row(s) and attempts delivery. Retries are handled by `retryDue`. */
export async function sendReply(payload: Payload, o: SendOpts): Promise<SendResult> {
  const conv = await payload.findByID({ collection: "conversations", id: o.conversationId, depth: 0, overrideAccess: true });
  const byHuman = o.senderType === "agent";
  const plan = planSend({
    channel: conv.channel,
    lastInboundAt: conv.lastInboundAt ? new Date(conv.lastInboundAt) : null,
    byHuman,
    template: Boolean(o.template),
  });

  const base = {
    tenant: TENANT_ID,
    conversation: conv.id,
    channel: conv.channel,
    direction: "outbound" as const,
    senderType: o.senderType,
    sentBy: o.userId ? Number(o.userId) : undefined,
    aiMeta: o.aiMeta as never,
  };

  if (!plan.allowed) {
    const m = await payload.create({
      collection: "messages",
      overrideAccess: true,
      data: { ...base, kind: o.template ? "template" : "text", text: o.text ?? o.template?.name, status: "blocked", error: plan.reason },
    });
    await audit(payload, { action: "message.blocked", actorType: byHuman ? "staff" : "ai", actor: o.userId, entity: "conversations", entityId: conv.id, detail: { reason: plan.reason } });
    return { ok: false, messageIds: [Number(m.id)], blockedReason: plan.reason, error: plan.reason };
  }

  const parts = o.template ? [o.text ?? o.template.name] : splitMessage(o.text ?? "", conv.channel === "test" ? "whatsapp" : (conv.channel as MetaChannel));
  const ids: number[] = [];
  let ok = true;
  let error: string | undefined;
  for (const part of parts) {
    const m = await payload.create({
      collection: "messages",
      overrideAccess: true,
      data: {
        ...base,
        kind: o.template ? "template" : "text",
        text: part,
        template: o.template as never,
        status: "queued",
        simulated: conv.channel === "test",
      },
    });
    ids.push(Number(m.id));
    const r = await deliver(payload, Number(m.id));
    if (!r.ok) {
      ok = false;
      error = r.error;
      break; // keep ordering: later parts wait for the retry of this one
    }
  }
  await touchConversationAfterSend(payload, conv.id, o.senderType, parts[parts.length - 1], ok);
  return { ok, messageIds: ids, error };
}

/** One delivery attempt for a queued message. */
export async function deliver(payload: Payload, messageId: number): Promise<{ ok: boolean; error?: string }> {
  const msg = await payload.findByID({ collection: "messages", id: messageId, depth: 0, overrideAccess: true });
  const conv = await payload.findByID({ collection: "conversations", id: typeof msg.conversation === "object" ? msg.conversation.id : msg.conversation, depth: 0, overrideAccess: true });
  const attempts = (msg.attempts ?? 0) + 1;
  const byHuman = msg.senderType === "agent";

  // Simulator channel: no network, instant "sent".
  if (conv.channel === "test") {
    const id = `sim:${messageId}`;
    await payload.update({
      collection: "messages",
      id: messageId,
      overrideAccess: true,
      data: { status: "sent", externalId: id, dedupeKey: dedupeKey("test", id), sentAt: new Date().toISOString(), attempts, error: null, nextRetryAt: null },
    });
    return { ok: true };
  }

  const plan = planSend({
    channel: conv.channel,
    lastInboundAt: conv.lastInboundAt ? new Date(conv.lastInboundAt) : null,
    byHuman,
    template: msg.kind === "template",
  });
  if (!plan.allowed) {
    await payload.update({ collection: "messages", id: messageId, overrideAccess: true, data: { status: "blocked", error: plan.reason, attempts, nextRetryAt: null } });
    return { ok: false, error: plan.reason };
  }

  try {
    const channel = conv.channel as MetaChannel;
    const res =
      msg.kind === "template" && channel === "whatsapp"
        ? await sendWhatsAppTemplate({
            to: conv.customerExternalId,
            name: (msg.template as { name: string }).name,
            language: (msg.template as { language: string }).language,
            bodyParams: (msg.template as { bodyParams?: string[] }).bodyParams,
          })
        : await sendText({ channel, to: conv.customerExternalId, text: msg.text ?? "", plan });
    // The provider has ACCEPTED the message. Bookkeeping failures after this point must never
    // look like a failed send (a retry would deliver the message twice).
    const sentData = { status: "sent" as const, externalId: res.externalId, sentAt: new Date().toISOString(), attempts, error: null, errorCode: null, nextRetryAt: null };
    try {
      await payload.update({ collection: "messages", id: messageId, overrideAccess: true, data: { ...sentData, dedupeKey: dedupeKey(conv.channel, res.externalId) } });
    } catch (bookkeeping) {
      payload.logger.error({ err: bookkeeping, messageId, externalId: res.externalId }, "message sent but bookkeeping failed");
      await payload.update({ collection: "messages", id: messageId, overrideAccess: true, data: sentData }).catch(() => undefined);
    }
    return { ok: true };
  } catch (e) {
    const err = e as Error;
    const g = err instanceof GraphError ? err : null;
    const retryable = g ? g.retryable : true; // unknown errors (e.g. transient) are retried a few times
    const giveUp = !retryable || attempts >= MAX_ATTEMPTS;
    await payload.update({
      collection: "messages",
      id: messageId,
      overrideAccess: true,
      data: {
        status: giveUp ? "failed" : "queued",
        attempts,
        error: err.message.slice(0, 900),
        errorCode: g?.code !== undefined ? String(g.code) : undefined,
        nextRetryAt: giveUp ? null : new Date(Date.now() + backoffMs(attempts)).toISOString(),
      },
    });
    payload.logger.warn({ messageId, attempts, giveUp, err: err.message }, "outbound delivery failed");
    if (giveUp) {
      await audit(payload, { action: "message.failed", actorType: "system", entity: "messages", entityId: messageId, detail: { error: err.message, code: g?.code } });
    }
    return { ok: false, error: err.message };
  }
}

async function touchConversationAfterSend(
  payload: Payload,
  id: number,
  sender: "ai" | "agent" | "system",
  lastText: string,
  ok: boolean,
) {
  const conv = await payload.findByID({ collection: "conversations", id, depth: 0, overrideAccess: true });
  const now = new Date().toISOString();
  const data: Record<string, unknown> = {
    lastMessageAt: now,
    lastMessagePreview: lastText.length > 120 ? lastText.slice(0, 117) + "…" : lastText,
  };
  if (ok && sender !== "system") {
    if (!conv.firstReplyAt) data.firstReplyAt = now;
    if (sender === "ai") data.aiReplyCount = (conv.aiReplyCount ?? 0) + 1;
    if (sender === "agent") {
      data.humanReplyCount = (conv.humanReplyCount ?? 0) + 1;
      if (!conv.firstHumanReplyAt) data.firstHumanReplyAt = now;
    }
  }
  await payload.update({ collection: "conversations", id, overrideAccess: true, data });
}

/** Retries queued messages whose backoff elapsed. Called by the cron endpoint. */
export async function retryDue(payload: Payload, limit = 25): Promise<{ attempted: number; ok: number }> {
  const due = await payload.find({
    collection: "messages",
    where: { and: [{ status: { equals: "queued" } }, { nextRetryAt: { less_than_equal: new Date().toISOString() } }] },
    limit,
    depth: 0,
    sort: "nextRetryAt",
    overrideAccess: true,
  });
  let ok = 0;
  for (const m of due.docs) if ((await deliver(payload, Number(m.id))).ok) ok++;
  return { attempted: due.docs.length, ok };
}

const RANK = { queued: 0, sent: 1, delivered: 2, read: 3 } as const;

/** Applies a provider delivery-status event (monotonic; `failed` is recorded with the provider error). */
export async function applyStatus(
  payload: Payload,
  s: { channel: MetaChannel; externalId: string; status: "sent" | "delivered" | "read" | "failed"; timestamp: Date; error?: { code?: number | string; message: string } },
): Promise<"updated" | "unknown" | "stale"> {
  const found = await payload.find({
    collection: "messages",
    where: { dedupeKey: { equals: dedupeKey(s.channel, s.externalId) } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const m = found.docs[0];
  if (!m) return "unknown";
  const cur = m.status as string;
  const at = s.timestamp.toISOString();
  if (s.status === "failed") {
    if (cur === "delivered" || cur === "read") return "stale";
    await payload.update({
      collection: "messages",
      id: m.id,
      overrideAccess: true,
      data: { status: "failed", error: s.error?.message ?? "delivery failed", errorCode: s.error?.code !== undefined ? String(s.error.code) : undefined },
    });
    await audit(payload, { action: "message.delivery_failed", actorType: "webhook", entity: "messages", entityId: m.id, detail: { ...s.error } });
    return "updated";
  }
  if ((RANK[s.status] ?? 0) <= (RANK[cur as keyof typeof RANK] ?? 0) && cur !== "failed") return "stale";
  await payload.update({
    collection: "messages",
    id: m.id,
    overrideAccess: true,
    data: {
      status: s.status,
      ...(s.status === "delivered" ? { deliveredAt: at } : {}),
      ...(s.status === "read" ? { readAt: at, deliveredAt: m.deliveredAt ?? at } : {}),
      ...(s.status === "sent" ? { sentAt: m.sentAt ?? at } : {}),
      error: null,
    },
  });
  return "updated";
}
