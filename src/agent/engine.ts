import type { Payload } from "payload";
import { audit } from "./audit";
import { classify } from "./classifier";
import { aiSettings } from "./config";
import { checkReply } from "./guards";
import { createHandoff } from "./handoff";
import { buildContext, loadApproved, type KbItem } from "./knowledge";
import { createAppointmentRequest, markLeadHandedOff, recordGap, upsertLead } from "./leads";
import { sendReply } from "./outbound";
import { getProvider, type AiProvider } from "./ai";
import type { TurnInput } from "./ai/provider";
import * as T from "./templates";
import { detectLang } from "./text";
import { EMPTY_COLLECTED, PERSONAL_FIELDS, type AiTurn, type Collected, type HandoffReason, type Lang } from "./types";

export interface EngineOutcome {
  status: "replied" | "skipped" | "handed_off" | "noop";
  reason?: string;
  handoff?: HandoffReason;
  reply?: string;
}

const LOCK_MS = 90_000;
const MAX_PROCESS_ATTEMPTS = 3;

/**
 * Runs one assistant turn for a conversation: gathers all unanswered customer
 * messages, decides (escalation rules → knowledge-grounded generation → output
 * guards), persists qualification data, performs handoffs, and replies.
 * Safe to call repeatedly (idempotent per unprocessed message set).
 */
export async function processConversation(
  payload: Payload,
  conversationId: number,
  opts: { provider?: AiProvider } = {},
): Promise<EngineOutcome> {
  const conv = await payload.findByID({ collection: "conversations", id: conversationId, depth: 0, overrideAccess: true });

  const pendingRes = await payload.find({
    collection: "messages",
    where: { and: [{ conversation: { equals: conversationId } }, { direction: { equals: "inbound" } }, { processedAt: { exists: false } }] },
    sort: "createdAt",
    limit: 50,
    depth: 0,
    overrideAccess: true,
  });
  const pending = pendingRes.docs;
  if (!pending.length) return { status: "noop" };
  const markProcessed = async () => {
    const now = new Date().toISOString();
    for (const m of pending) await payload.update({ collection: "messages", id: m.id, data: { processedAt: now }, overrideAccess: true });
  };

  // AI off (human took over / paused): keep the messages, never answer.
  if (conv.aiMode !== "ai") {
    await markProcessed();
    return { status: "skipped", reason: `ai_mode_${conv.aiMode}` };
  }

  // soft per-conversation lock against concurrent turns
  if (conv.processingLockUntil && new Date(conv.processingLockUntil) > new Date()) {
    return { status: "skipped", reason: "locked" };
  }
  await payload.update({ collection: "conversations", id: conversationId, data: { processingLockUntil: new Date(Date.now() + LOCK_MS).toISOString() }, overrideAccess: true });

  try {
    return await runTurn(payload, conv, pending, markProcessed, opts.provider ?? getProvider());
  } catch (err) {
    payload.logger.error({ err, conversationId }, "assistant turn failed");
    const attempts = Math.max(...pending.map((m) => (m.processAttempts ?? 0))) + 1;
    for (const m of pending) await payload.update({ collection: "messages", id: m.id, data: { processAttempts: attempts }, overrideAccess: true });
    if (attempts >= MAX_PROCESS_ATTEMPTS) {
      // give up politely: a person takes it from here
      const joined = pending.map((m) => m.text ?? "").join(" ").trim();
      const lang: Lang = joined ? detectLang(joined) : "ar";
      try {
        const h = await createHandoff(payload, { conversationId, reason: "ai_failure", intent: "unsupported" });
        await markProcessed();
        const text = `${T.forcedReply("ai_failure", lang)} ${T.handoffRecorded(lang, false)}`;
        if (h) await sendReply(payload, { conversationId, text, senderType: "ai" });
        return { status: "handed_off", handoff: "ai_failure" };
      } catch (e2) {
        payload.logger.error({ err: e2 }, "ai_failure handoff failed");
      }
    }
    return { status: "skipped", reason: "error_will_retry" };
  } finally {
    await payload.update({ collection: "conversations", id: conversationId, data: { processingLockUntil: null }, overrideAccess: true }).catch(() => undefined);
  }
}

type Conv = Awaited<ReturnType<Payload["findByID"]>> & Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

async function runTurn(
  payload: Payload,
  conv: Conv,
  pending: { id: number | string; text?: string | null; kind?: string | null }[],
  markProcessed: () => Promise<void>,
  provider: AiProvider,
): Promise<EngineOutcome> {
  const conversationId = Number(conv.id);
  const settings = aiSettings();
  const texts = pending.map((m) => (m.text ?? "").trim()).filter(Boolean);
  const latest = texts.join("\n");
  const history = await loadHistory(payload, conversationId, settings.historyLimit);
  const lastCustomerText = [...history].reverse().find((h) => h.role === "user")?.content;
  const lang: Lang = latest || lastCustomerText ? detectLang(latest || lastCustomerText || "") : "ar";
  const firstReply = (conv.aiReplyCount ?? 0) === 0 && (conv.humanReplyCount ?? 0) === 0;

  // loop / abuse guard
  const recentAi = await payload.count({
    collection: "messages",
    where: { and: [{ conversation: { equals: conversationId } }, { senderType: { equals: "ai" } }, { createdAt: { greater_than: new Date(Date.now() - 60_000).toISOString() } }] },
    overrideAccess: true,
  });
  if (recentAi.totalDocs >= settings.maxRepliesPerMinute) {
    await markProcessed();
    await audit(payload, { action: "ai.rate_limited", actorType: "system", entity: "conversations", entityId: conversationId });
    return { status: "skipped", reason: "rate_limited" };
  }

  const customer = typeof conv.customer === "number"
    ? await payload.findByID({ collection: "customers", id: conv.customer, depth: 0, overrideAccess: true })
    : null;

  // ── media-only messages ────────────────────────────────────────────────
  if (!latest) {
    const strikes = (conv.mediaStrikes ?? 0) + 1;
    await payload.update({ collection: "conversations", id: conversationId, data: { mediaStrikes: strikes }, overrideAccess: true });
    await markProcessed();
    if (strikes >= 2) {
      return finishHandoff(payload, conv, { reason: "missing_info", lang, lead: "", intent: "unsupported", unanswered: "Customer sent images/voice notes the assistant cannot read", leadIntro: T.forcedReply("missing_info", lang), pausing: false });
    }
    await sendReply(payload, { conversationId, text: T.mediaReply(lang), senderType: "ai" });
    return { status: "replied", reply: T.mediaReply(lang) };
  }
  if (conv.mediaStrikes) await payload.update({ collection: "conversations", id: conversationId, data: { mediaStrikes: 0 }, overrideAccess: true });

  const cls = classify(latest);
  let consent = (customer?.consentStatus ?? "unknown") as "unknown" | "requested" | "granted" | "declined";

  // ── opt-out ───────────────────────────────────────────────────────────
  if (cls.flags.optOut) {
    if (customer) await payload.update({ collection: "customers", id: customer.id, data: { optedOut: true }, overrideAccess: true });
    await payload.update({ collection: "conversations", id: conversationId, data: { aiMode: "paused", status: "resolved" }, overrideAccess: true });
    await markProcessed();
    await sendReply(payload, { conversationId, text: T.optOutReply(lang), senderType: "ai" });
    await audit(payload, { action: "customer.opt_out", actorType: "ai", entity: "conversations", entityId: conversationId });
    return { status: "replied", reply: T.optOutReply(lang), reason: "opt_out" };
  }

  // ── answer to our consent question ───────────────────────────────────
  if (consent === "requested" && (cls.flags.yes || cls.flags.no) && customer) {
    const granted = cls.flags.yes;
    consent = granted ? "granted" : "declined";
    await payload.update({
      collection: "customers",
      id: customer.id,
      data: { consentStatus: consent, consentAt: new Date().toISOString() },
      overrideAccess: true,
    });
    await audit(payload, { action: granted ? "consent.granted" : "consent.declined", actorType: "ai", entity: "customers", entityId: customer.id });
    const needName = granted && !customer.name;
    const needPhone = granted && !customer.phone && conv.channel !== "whatsapp";
    const reply = `${granted ? T.consentGranted(lang) : T.consentDeclined(lang)} ${T.askContact(lang, needName, needPhone)}`.trim();
    await markProcessed();
    await sendReply(payload, { conversationId, text: reply, senderType: "ai", aiMeta: { consent } });
    return { status: "replied", reply, reason: "consent" };
  }

  // existing lead/customer knowledge ("never re-ask")
  const lead = (
    await payload.find({
      collection: "leads",
      where: { and: [{ conversation: { equals: conversationId } }, { stage: { not_in: ["won", "lost"] } }] },
      sort: "-updatedAt",
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
  ).docs[0];
  const known: Partial<Collected> = {
    product_interest: lead?.productInterest ?? "",
    area: lead?.area ?? customer?.area ?? "",
    home_type: lead?.homeType ?? "",
    existing_system: lead?.existingSystem ?? "",
    problem: lead?.problem ?? "",
    budget: lead?.budget ?? "",
    equipment_type: lead?.equipmentType ?? "",
    brand_model: lead?.brandModel ?? "",
    preferred_time: lead?.preferredTime ?? "",
    ...(consent === "granted" ? { name: customer?.name ?? "", phone: customer?.phone ?? "", address: lead?.address ?? customer?.address ?? "" } : {}),
  };

  // ── decide: forced escalation vs knowledge-grounded generation ───────
  let turn: AiTurn;
  let context: KbItem[] = [];
  let forced: HandoffReason | null = cls.forcedHandoff;

  if (forced) {
    turn = {
      reply: T.forcedReply(forced, lang),
      intent: cls.intent,
      language: lang,
      handoff: { needed: true, reason: forced },
      consent: "none",
      collected: { ...EMPTY_COLLECTED },
      unanswered_question: forced === "unsupported_service" ? latest.slice(0, 300) : "",
      sources_used: [],
      appointment_requested: cls.flags.appointmentRequest,
    };
  } else {
    const items = await loadApproved(payload);
    context = buildContext(items, latest, cls.intent);
    const input: TurnInput = { lang, classification: cls, latest, history, context, known, consent, isFirstReply: firstReply };
    const gen = await generateChecked(provider, input, context);
    if (gen.kind === "failed") {
      forced = "ai_failure";
      turn = { ...blankTurn(lang, cls.intent), reply: T.forcedReply("ai_failure", lang), handoff: { needed: true, reason: "ai_failure" } };
      await audit(payload, { action: "ai.generation_failed", actorType: "ai", entity: "conversations", entityId: conversationId, detail: { error: gen.error } });
    } else if (gen.kind === "guarded") {
      forced = "missing_info";
      turn = { ...blankTurn(lang, cls.intent), reply: T.forcedReply("missing_info", lang), handoff: { needed: true, reason: "missing_info" }, unanswered_question: latest.slice(0, 300) };
      await audit(payload, { action: "ai.guard_blocked", actorType: "ai", entity: "conversations", entityId: conversationId, detail: { violations: gen.violations } });
    } else turn = gen.turn;
  }

  // ── persist what the customer told us (consent-aware) ────────────────
  if (turn.consent !== "none" && consent === "requested" && customer) {
    consent = turn.consent;
    await payload.update({ collection: "customers", id: customer.id, data: { consentStatus: consent, consentAt: new Date().toISOString() }, overrideAccess: true });
  }
  const collected: Collected = { ...EMPTY_COLLECTED, ...turn.collected };
  if (consent !== "granted") for (const f of PERSONAL_FIELDS) collected[f] = "";
  if (customer) {
    const patch: Record<string, string> = {};
    if (collected.area) patch.area = collected.area;
    if (consent === "granted") {
      if (collected.name) patch.name = collected.name;
      if (collected.phone) patch.phone = collected.phone;
      if (collected.address) patch.address = collected.address;
    }
    if (Object.keys(patch).length) await payload.update({ collection: "customers", id: customer.id, data: patch, overrideAccess: true });
  }
  const offerId = context.find((c) => c.offer && turn.sources_used.includes(c.id))?.offer?.key;
  const savedLead = await upsertLead(payload, {
    conversationId,
    customerId: customer ? Number(customer.id) : null,
    intent: turn.intent,
    collected,
    allowAddress: consent === "granted",
    offerKey: offerId,
  });
  if (turn.unanswered_question) await recordGap(payload, turn.unanswered_question, conversationId);

  // ── high-intent / appointment escalation (AI may request, never confirm) ──
  let reason: HandoffReason | null = turn.handoff.needed && turn.handoff.reason !== "none" ? (turn.handoff.reason as HandoffReason) : forced;
  if (cls.flags.appointmentRequest || turn.appointment_requested) {
    await createAppointmentRequest(payload, {
      conversationId,
      leadId: savedLead ? Number(savedLead.id) : null,
      customerId: customer ? Number(customer.id) : null,
      kind: turn.intent === "installation_inquiry" ? "installation" : "maintenance",
      requestedWindow: collected.preferred_time || savedLead?.preferredTime || undefined,
      address: consent === "granted" ? collected.address || undefined : undefined,
      details: collected.problem || undefined,
    });
    if (!reason && savedLead?.qualified) reason = "appointment_confirmation";
  }
  // a bare follow-up ("ساكن بخلدا") continues the purchase intent from the previous turn
  const continuesPurchase = ["unsupported", "greeting"].includes(turn.intent) && conv.lastIntent === "purchase_intent";
  if (!reason && (turn.intent === "purchase_intent" || continuesPurchase) && savedLead?.qualified) reason = "high_intent_lead";

  // ── consent request before we collect personal details ───────────────
  let consentAsk = "";
  const wantsFollowUp = reason === "high_intent_lead" || reason === "appointment_confirmation" || turn.intent === "purchase_intent" || turn.intent === "maintenance_request" || continuesPurchase;
  if (consent === "unknown" && customer && wantsFollowUp && !forced) {
    consentAsk = T.consentNotice(lang);
    consent = "requested";
    await payload.update({ collection: "customers", id: customer.id, data: { consentStatus: "requested" }, overrideAccess: true });
    await payload.update({ collection: "conversations", id: conversationId, data: { consentAskedAt: new Date().toISOString() }, overrideAccess: true });
  }

  // ── compose final reply ──────────────────────────────────────────────
  let reply = turn.reply.trim();
  let handoffNote = "";
  let handedOff: HandoffReason | undefined;
  if (reason) {
    try {
      const h = await createHandoff(payload, {
        conversationId,
        reason,
        intent: turn.intent,
        unansweredQuestion: turn.unanswered_question,
        leadId: savedLead ? Number(savedLead.id) : null,
      });
      if (savedLead) await markLeadHandedOff(payload, Number(savedLead.id));
      handedOff = reason;
      handoffNote = T.handoffRecorded(lang, reason === "appointment_confirmation");
      void h;
    } catch (err) {
      payload.logger.error({ err, conversationId }, "handoff creation failed");
      handoffNote = T.handoffFailed(lang);
    }
  }
  const needsIntro = firstReply && !/المساعد الافتراضي|virtual assistant/i.test(reply);
  reply = [needsIntro ? T.introPrefix(lang) : "", reply, handoffNote, consentAsk].filter(Boolean).join("\n\n");

  if (!["unsupported", "greeting"].includes(turn.intent)) {
    await payload.update({ collection: "conversations", id: conversationId, data: { lastIntent: turn.intent }, overrideAccess: true });
  }
  await markProcessed();
  await sendReply(payload, {
    conversationId,
    text: reply,
    senderType: "ai",
    aiMeta: { intent: turn.intent, sources: turn.sources_used, provider: provider.name, handoff: handedOff ?? null },
  });
  return handedOff ? { status: "handed_off", handoff: handedOff, reply } : { status: "replied", reply };
}

async function finishHandoff(
  payload: Payload,
  conv: Conv,
  a: { reason: HandoffReason; lang: Lang; lead: string; intent: string; unanswered?: string; leadIntro: string; pausing: boolean },
): Promise<EngineOutcome> {
  const conversationId = Number(conv.id);
  let note: string;
  try {
    await createHandoff(payload, { conversationId, reason: a.reason, intent: a.intent, unansweredQuestion: a.unanswered });
    note = T.handoffRecorded(a.lang, false);
  } catch {
    note = T.handoffFailed(a.lang);
  }
  const reply = `${a.leadIntro} ${note}`;
  await sendReply(payload, { conversationId, text: reply, senderType: "ai" });
  return { status: "handed_off", handoff: a.reason, reply };
}

const blankTurn = (lang: Lang, intent: AiTurn["intent"]): AiTurn => ({
  reply: "",
  intent,
  language: lang,
  handoff: { needed: false, reason: "none" },
  consent: "none",
  collected: { ...EMPTY_COLLECTED },
  unanswered_question: "",
  sources_used: [],
  appointment_requested: false,
});

type Gen = { kind: "ok"; turn: AiTurn } | { kind: "guarded"; violations: string[] } | { kind: "failed"; error: string };

/** Generate → guard → (one regeneration with feedback) → give up safely. */
async function generateChecked(provider: AiProvider, input: TurnInput, context: KbItem[]): Promise<Gen> {
  let correction: string[] | undefined;
  let last: string[] = [];
  for (let attempt = 0; attempt < 2; attempt++) {
    let turn: AiTurn;
    try {
      turn = await withRetry(() => provider.generate({ ...input, correction }));
    } catch (e) {
      return { kind: "failed", error: (e as Error).message };
    }
    const violations = checkReply({ reply: turn.reply, context, expectsHandoff: turn.handoff.needed });
    if (!violations.length) return { kind: "ok", turn };
    last = violations;
    correction = violations;
  }
  return { kind: "guarded", violations: last };
}

async function withRetry<T>(fn: () => Promise<T>, tries = 2): Promise<T> {
  let err: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      err = e;
      if ((e as Error).name === "AiRefusalError") break;
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw err;
}

async function loadHistory(payload: Payload, conversationId: number, limit: number) {
  const r = await payload.find({
    collection: "messages",
    where: { and: [{ conversation: { equals: conversationId } }, { status: { not_equals: "blocked" } }] },
    sort: "-createdAt",
    limit,
    depth: 0,
    overrideAccess: true,
  });
  return r.docs
    .reverse()
    .filter((m) => (m.text ?? "").trim())
    .map((m) => ({ role: (m.direction === "inbound" ? "user" : "assistant") as "user" | "assistant", content: m.text as string }));
}
