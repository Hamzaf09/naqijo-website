import { createHmac } from "node:crypto";
import type { Payload } from "payload";
import { audit } from "./audit";
import { notifySettings, TENANT_ID } from "./config";
import { PAUSING_REASONS, type HandoffReason } from "./types";
import { recommendedAction, TEAM_BY_REASON } from "./templates";

export interface HandoffInput {
  conversationId: number;
  reason: HandoffReason;
  intent?: string;
  unansweredQuestion?: string;
  leadId?: number | null;
}

export interface HandoffResult {
  id: number;
  created: boolean;
  notifyStatus: "sent" | "partial" | "failed" | "not_configured";
}

/** Builds the structured summary staff see — everything needed to continue without re-reading. */
export async function buildSummary(payload: Payload, input: HandoffInput) {
  const conv = await payload.findByID({ collection: "conversations", id: input.conversationId, depth: 1, overrideAccess: true });
  const customer = typeof conv.customer === "object" && conv.customer ? conv.customer : null;
  const lead = input.leadId
    ? await payload.findByID({ collection: "leads", id: input.leadId, depth: 0, overrideAccess: true }).catch(() => null)
    : (
        await payload.find({ collection: "leads", where: { conversation: { equals: conv.id } }, sort: "-updatedAt", limit: 1, depth: 0, overrideAccess: true })
      ).docs[0] ?? null;
  const msgs = await payload.find({
    collection: "messages",
    where: { conversation: { equals: conv.id } },
    sort: "-createdAt",
    limit: 30,
    depth: 0,
    overrideAccess: true,
  });
  const history = msgs.docs
    .reverse()
    .filter((m) => m.status !== "blocked")
    .map((m) => ({ at: m.createdAt, from: m.senderType, text: m.text ?? "" }));

  const consent = customer?.consentStatus === "granted";
  return {
    channel: conv.channel,
    customer: {
      displayName: customer?.displayName ?? conv.customerName,
      // personal details are shown only if the customer consented to their storage
      name: consent ? customer?.name : undefined,
      phone: consent ? customer?.phone : conv.channel === "whatsapp" ? conv.customerExternalId : undefined,
      area: customer?.area ?? lead?.area,
      consent: customer?.consentStatus ?? "unknown",
    },
    intent: input.intent ?? conv.lastIntent,
    productOrService: lead?.productInterest ?? lead?.equipmentType ?? null,
    qualification: lead
      ? {
          kind: lead.kind,
          area: lead.area,
          homeType: lead.homeType,
          existingSystem: lead.existingSystem,
          problem: lead.problem,
          budget: lead.budget,
          equipmentType: lead.equipmentType,
          brandModel: lead.brandModel,
          preferredTime: lead.preferredTime,
          qualified: lead.qualified,
        }
      : null,
    reason: input.reason,
    unansweredQuestion: input.unansweredQuestion || undefined,
    recommendedAction: recommendedAction(input.reason),
    conversationHistory: history,
  };
}

const renderText = (s: Awaited<ReturnType<typeof buildSummary>>): string =>
  [
    `Reason: ${s.reason}  |  Channel: ${s.channel}  |  Intent: ${s.intent ?? "-"}`,
    `Customer: ${s.customer.displayName ?? "-"}${s.customer.phone ? " · " + s.customer.phone : ""}${s.customer.area ? " · " + s.customer.area : ""}`,
    `Interest: ${s.productOrService ?? "-"}`,
    s.unansweredQuestion ? `Unanswered question: ${s.unansweredQuestion}` : "",
    `Recommended action: ${s.recommendedAction}`,
    "",
    "Recent messages:",
    ...s.conversationHistory.slice(-8).map((h) => `  [${h.from}] ${h.text}`),
  ]
    .filter((l) => l !== "")
    .join("\n");

/**
 * Persists the handoff, flags the conversation, then notifies the team.
 * `created`/DB success is the ONLY thing the customer-facing confirmation may rely on;
 * notification status is tracked separately and shown to staff.
 */
export async function createHandoff(payload: Payload, input: HandoffInput): Promise<HandoffResult> {
  const open = await payload.find({
    collection: "handoffs",
    where: { and: [{ conversation: { equals: input.conversationId } }, { reason: { equals: input.reason } }, { status: { not_equals: "resolved" } }] },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  if (open.docs[0]) {
    const h = open.docs[0];
    return { id: Number(h.id), created: false, notifyStatus: (h.notifyStatus as HandoffResult["notifyStatus"]) ?? "sent" };
  }

  const summary = await buildSummary(payload, input);
  const summaryText = renderText(summary);
  const handoff = await payload.create({
    collection: "handoffs",
    overrideAccess: true,
    data: {
      tenant: TENANT_ID,
      conversation: input.conversationId,
      lead: input.leadId ?? undefined,
      reason: input.reason,
      status: "open",
      summary: summary as never,
      summaryText,
      recommendedAction: summary.recommendedAction,
      unansweredQuestion: input.unansweredQuestion || undefined,
      notifyStatus: "pending",
    },
  });

  const pausing = PAUSING_REASONS.has(input.reason);
  await payload.update({
    collection: "conversations",
    id: input.conversationId,
    overrideAccess: true,
    data: {
      needsHuman: true,
      status: "pending",
      assignedTeam: TEAM_BY_REASON[input.reason],
      lastIntent: input.intent,
      ...(pausing ? { aiMode: "paused" as const } : {}),
    },
  });
  await audit(payload, {
    action: "handoff.created",
    actorType: "ai",
    entity: "handoffs",
    entityId: handoff.id,
    detail: { reason: input.reason, conversation: input.conversationId, aiPaused: pausing },
  });

  const n = await notify(payload, Number(handoff.id), input.conversationId, summaryText, input.reason);
  return { id: Number(handoff.id), created: true, notifyStatus: n };
}

/** Email (Payload mailer) and/or signed webhook (Slack/Teams/n8n bridge). */
async function notify(
  payload: Payload,
  handoffId: number,
  conversationId: number,
  text: string,
  reason: HandoffReason,
): Promise<HandoffResult["notifyStatus"]> {
  const cfg = notifySettings();
  const results: { channel: string; ok: boolean; detail?: string }[] = [];
  const link = `${cfg.inboxUrl}?c=${conversationId}`;
  const subject = `[NaqiJo] Customer needs attention — ${reason}`;

  if (cfg.emails.length) {
    try {
      await payload.sendEmail({ to: cfg.emails, subject, text: `${text}\n\nOpen in inbox: ${link}` });
      results.push({ channel: "email", ok: true });
    } catch (e) {
      results.push({ channel: "email", ok: false, detail: (e as Error).message });
    }
  }
  if (cfg.webhookUrl) {
    const body = JSON.stringify({ event: "handoff.created", handoffId, conversationId, reason, text: `${subject}\n${text}\n${link}`, link });
    try {
      const sig = cfg.webhookSecret ? createHmac("sha256", cfg.webhookSecret).update(body).digest("hex") : "";
      const res = await fetch(cfg.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(sig ? { "X-NaqiJo-Signature": `sha256=${sig}` } : {}) },
        body,
        signal: AbortSignal.timeout(10_000),
      });
      results.push({ channel: "webhook", ok: res.ok, detail: res.ok ? undefined : `HTTP ${res.status}` });
    } catch (e) {
      results.push({ channel: "webhook", ok: false, detail: (e as Error).message });
    }
  }

  const status: HandoffResult["notifyStatus"] = !results.length
    ? "not_configured"
    : results.every((r) => r.ok)
      ? "sent"
      : results.some((r) => r.ok)
        ? "partial"
        : "failed";
  await payload.update({
    collection: "handoffs",
    id: handoffId,
    overrideAccess: true,
    data: {
      notifyStatus: status,
      notifyDetail: results.map((r) => `${r.channel}: ${r.ok ? "ok" : "FAILED " + (r.detail ?? "")}`).join("\n") || "No notification channel configured (HANDOFF_NOTIFY_EMAILS / HANDOFF_WEBHOOK_URL). The handoff is visible in the inbox.",
      notifiedAt: status === "sent" || status === "partial" ? new Date().toISOString() : undefined,
    },
  });
  if (status === "failed" || status === "partial") payload.logger.error({ handoffId, results }, "handoff notification problem");
  return status;
}
