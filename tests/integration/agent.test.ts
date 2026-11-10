/* eslint-disable @typescript-eslint/no-explicit-any */
import "./env";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import { getPayload, type Payload } from "payload";
import config from "@payload-config";
import { signBody } from "@/agent/channels/signature";
import { setHttpClient } from "@/agent/channels/graph";
import { handleVerification, handleWebhook } from "@/agent/webhook";
import { seedAgentKnowledge } from "@/agent/seed";
import { setProvider } from "@/agent/ai";
import * as A from "@/agent/actions";
import { retryDue } from "@/agent/outbound";
import { computeAnalytics } from "@/agent/analytics";
import { runJobs } from "@/agent/jobs";
import { igText, msngrText, waAudio, waStatus, waText } from "../fixtures/payloads";

let payload: Payload;
let adminId: number;
let salesUser: { id: number; role: string; email: string };

interface Call { url: string; method: string; body: any; auth: string }
let calls: Call[] = [];
let outSeq = 0; // globally unique provider ids (like real Meta ids)
const isSend = (c: Call) => c.method === "POST" && (c.body?.type === "text" || c.body?.type === "template" || c.body?.message?.text !== undefined);
const okSend = (c: Call) => (c.url.includes("/100200300/") ? { status: 200, json: { messages: [{ id: `wamid.OUT${++outSeq}` }] } } : { status: 200, json: { recipient_id: "x", message_id: `m.out.${++outSeq}` } });
const defaultRespond = (c: Call): { status: number; json: unknown } => (isSend(c) ? okSend(c) : { status: 200, json: { success: true } });
let respond: (c: Call, n: number) => { status: number; json: unknown } = defaultRespond;

function installGraphMock() {
  calls = [];
  setHttpClient(async (url, init) => {
    const call: Call = { url, method: init?.method ?? "GET", body: init?.body ? JSON.parse(init.body as string) : null, auth: (init?.headers as Record<string, string>)?.Authorization ?? "" };
    calls.push(call);
    const r = respond(call, calls.length);
    return new Response(JSON.stringify(r.json), { status: r.status, headers: { "Content-Type": "application/json" } });
  });
}
const textSends = () => calls.filter(isSend).length;

async function post(channel: "whatsapp" | "messenger" | "instagram", body: unknown, opts: { sig?: string | null; run?: boolean } = {}) {
  const raw = JSON.stringify(body);
  const sig = opts.sig === undefined ? signBody(raw, "app-secret") : opts.sig;
  const r = await handleWebhook(payload, channel, raw, sig, "1.2.3.4");
  if (opts.run !== false && r.deferred) await r.deferred();
  return r;
}
const wa = (id: string, body: string, from = "962790000001") => post("whatsapp", waText({ id, body, from }));
const convOf = async (from = "962790000001") =>
  (await payload.find({ collection: "conversations", where: { customerExternalId: { equals: from } }, limit: 1, depth: 0, overrideAccess: true })).docs[0];
const msgs = async (convId: number) =>
  (await payload.find({ collection: "messages", where: { conversation: { equals: convId } }, sort: "createdAt", limit: 100, depth: 0, overrideAccess: true, pagination: false })).docs;
const lastAi = async (convId: number) => [...(await msgs(convId))].reverse().find((m) => m.senderType === "ai");

beforeAll(async () => {
  payload = await getPayload({ config });
  const admin = await payload.create({ collection: "users", data: { email: "admin@test.local", password: "Test-pass-123!", role: "admin", name: "Admin" }, overrideAccess: true });
  adminId = Number(admin.id);
  const s = await payload.create({ collection: "users", data: { email: "sales@test.local", password: "Test-pass-123!", role: "sales", name: "Sales" }, overrideAccess: true });
  salesUser = { id: Number(s.id), role: "sales", email: "sales@test.local" };
  await seedAgentKnowledge(payload);
});
beforeEach(() => {
  setProvider(null);
  respond = defaultRespond;
  installGraphMock();
});
afterAll(() => setHttpClient(null));

describe("webhook verification & authenticity", () => {
  it("answers the GET handshake only with the right verify token", async () => {
    const ok = await handleVerification(payload, "whatsapp", new URLSearchParams({ "hub.mode": "subscribe", "hub.verify_token": "wa-verify", "hub.challenge": "42" }));
    expect(ok).toMatchObject({ status: 200, body: "42" });
    const bad = await handleVerification(payload, "whatsapp", new URLSearchParams({ "hub.mode": "subscribe", "hub.verify_token": "nope", "hub.challenge": "42" }));
    expect(bad.status).toBe(403);
  });
  it("rejects bad/missing signatures and stores nothing", async () => {
    const before = await payload.count({ collection: "messages", overrideAccess: true });
    expect((await post("whatsapp", waText({ id: "wamid.bad1", body: "hi" }), { sig: "sha256=deadbeef" })).status).toBe(401);
    expect((await post("whatsapp", waText({ id: "wamid.bad2", body: "hi" }), { sig: null })).status).toBe(401);
    expect((await payload.count({ collection: "messages", overrideAccess: true })).totalDocs).toBe(before.totalDocs);
    const ev = await payload.find({ collection: "webhook-events", where: { status: { equals: "invalid_signature" } }, overrideAccess: true });
    expect(ev.totalDocs).toBeGreaterThan(0);
  });
});

describe("WhatsApp end-to-end (mocked Graph API)", () => {
  it("greeting → conversation, AI reply sent through Graph with correct request, first reply introduces the assistant", async () => {
    const r = await wa("wamid.IN1", "مرحبا");
    expect(r.status).toBe(200);
    const conv = await convOf();
    expect(conv).toMatchObject({ channel: "whatsapp", aiMode: "ai", customerName: "سامر" });
    const sent = calls.filter((c) => c.url.endsWith("/100200300/messages") && c.body.type === "text");
    expect(sent).toHaveLength(1);
    expect(sent[0].url).toMatch(/^https:\/\/graph\.facebook\.com\/v\d+\.\d+\/100200300\/messages$/);
    expect(sent[0].auth).toBe("Bearer wa-token");
    expect(sent[0].body).toMatchObject({ messaging_product: "whatsapp", to: "962790000001", type: "text" });
    expect(sent[0].body.text.body).toContain("المساعد الافتراضي");
    const out = await lastAi(Number(conv.id));
    expect(out).toMatchObject({ status: "sent", externalId: expect.stringMatching(/^wamid\.OUT/) });
  });

  it("duplicate delivery of the same wamid creates no second message and no second reply", async () => {
    await wa("wamid.DUP", "هلا", "962790000002");
    const conv = await convOf("962790000002");
    const before = (await msgs(Number(conv.id))).length;
    const callsBefore = textSends();
    const r = await wa("wamid.DUP", "هلا", "962790000002");
    expect(r.summary?.duplicates).toBe(1);
    expect((await msgs(Number(conv.id))).length).toBe(before);
    expect(textSends()).toBe(callsBefore);
  });

  it("quotes the approved 160 JOD offer and states installation is not included", async () => {
    await wa("wamid.P1", "بكم الفلتر التقليدي سبع مراحل؟ والتركيب؟", "962790000003");
    const reply = (await lastAi(Number((await convOf("962790000003")).id)))!.text!;
    expect(reply).toContain("160");
    expect(reply).toMatch(/مش مشمول|not included/i);
    expect(reply).not.toMatch(/مجاني|ضمان|تقسيط/);
  });

  it("unknown offer scope: answers honestly, records the gap and hands off to sales (no invented scope)", async () => {
    await wa("wamid.S1", "شو بيشمل عرض صيانة الفلتر 35 دينار؟", "962790000004");
    const conv = await convOf("962790000004");
    const reply = (await lastAi(Number(conv.id)))!.text!;
    expect(reply).toContain("35");
    expect(reply).toMatch(/لسا مش معتمدة/);
    expect(reply).toMatch(/تم تسجيل طلبك/);
    const h = await payload.find({ collection: "handoffs", where: { conversation: { equals: conv.id } }, depth: 0, overrideAccess: true });
    expect(h.docs[0]).toMatchObject({ reason: "missing_info" });
    expect(h.docs[0].summaryText).toContain("Unanswered question");
    const gaps = await payload.find({ collection: "knowledge-gaps", overrideAccess: true });
    expect(gaps.totalDocs).toBeGreaterThan(0);
  });

  it("question with no approved answer → honest 'I don't have approved info' + handoff, never a guess", async () => {
    await wa("wamid.U1", "ما هو لون شعاركم الرسمي بالضبط؟", "962790000005");
    const conv = await convOf("962790000005");
    const reply = (await lastAi(Number(conv.id)))!.text!;
    expect(reply).toMatch(/ما عندي معلومة معتمدة/);
    expect((await payload.count({ collection: "handoffs", where: { conversation: { equals: conv.id } }, overrideAccess: true })).totalDocs).toBe(1);
  });

  it("delivery status webhooks update the outbound message monotonically; failure keeps the provider error", async () => {
    await wa("wamid.ST0", "مرحبا", "962790000006");
    const conv = await convOf("962790000006");
    const out = (await lastAi(Number(conv.id)))!;
    await post("whatsapp", waStatus(out.externalId!, "delivered"));
    await post("whatsapp", waStatus(out.externalId!, "read"));
    await post("whatsapp", waStatus(out.externalId!, "delivered")); // out of order → ignored
    let m = await payload.findByID({ collection: "messages", id: out.id, depth: 0, overrideAccess: true });
    expect(m.status).toBe("read");
    expect(m.readAt).toBeTruthy();

    await wa("wamid.ST1", "بكم الفلتر سبع مراحل", "962790000006");
    const out2 = (await lastAi(Number(conv.id)))!;
    await post("whatsapp", waStatus(out2.externalId!, "failed", [{ code: 131026, title: "Message undeliverable" }]));
    m = await payload.findByID({ collection: "messages", id: out2.id, depth: 0, overrideAccess: true });
    expect(m).toMatchObject({ status: "failed", errorCode: "131026" });
  });

  it("voice notes: asks for text, then escalates on repeat", async () => {
    await post("whatsapp", waAudio("wamid.V1", "962790000007"));
    const conv = await convOf("962790000007");
    expect((await lastAi(Number(conv.id)))!.text).toMatch(/ما بقدر أفتح/);
    await post("whatsapp", waAudio("wamid.V2", "962790000007"));
    expect((await payload.count({ collection: "handoffs", where: { conversation: { equals: conv.id } }, overrideAccess: true })).totalDocs).toBe(1);
  });
});

describe("Messenger & Instagram", () => {
  it("Messenger: normalized, replied via /me/messages with RESPONSE type", async () => {
    await post("messenger", msngrText("m.IN1", "PSID9", "مرحبا"));
    const send = calls.find((c) => c.url.endsWith("/me/messages") && c.body.message);
    expect(send!.body).toMatchObject({ recipient: { id: "PSID9" }, messaging_type: "RESPONSE" });
    expect(send!.auth).toBe("Bearer page-token");
    const conv = await convOf("PSID9");
    expect(conv.channel).toBe("messenger");
  });
  it("Instagram: replied via Instagram Login host with the IG account id", async () => {
    await post("instagram", igText("ig.IN1", "IGSID9", "hello"));
    const send = calls.find((c) => c.body?.message?.text);
    expect(send!.url).toMatch(/^https:\/\/graph\.instagram\.com\/v[\d.]+\/17841400000\/messages$/);
    const conv = await convOf("IGSID9");
    expect(conv.channel).toBe("instagram");
    expect((await lastAi(Number(conv.id)))!.text).toMatch(/virtual assistant/i);
  });
  it("ignores events for assets that are not ours", async () => {
    const body = msngrText("m.OTHER", "PSIDX", "hi");
    body.entry[0].messaging[0].recipient.id = "999";
    const r = await post("messenger", body);
    expect(r.summary).toMatchObject({ messages: 1 });
    expect(await convOf("PSIDX")).toBeUndefined();
  });
});

describe("escalation & handoff", () => {
  it("complaint → structured handoff, AI paused, honest 'recorded' wording, AI silent afterwards", async () => {
    await wa("wamid.C1", "هذا استهتار، أنا غير راضي عن الفني تبعكم", "962790000010");
    const conv = await convOf("962790000010");
    expect(conv).toMatchObject({ aiMode: "paused", status: "pending", needsHuman: true, assignedTeam: "support" });
    const h = (await payload.find({ collection: "handoffs", where: { conversation: { equals: conv.id } }, depth: 0, overrideAccess: true })).docs[0];
    expect(h.reason).toBe("complaint");
    const s = h.summary as any;
    expect(s).toMatchObject({ channel: "whatsapp", reason: "complaint" });
    expect(s.conversationHistory.length).toBeGreaterThan(0);
    expect(s.recommendedAction).toBeTruthy();
    expect(h.notifyStatus).toBe("not_configured");
    expect((await lastAi(Number(conv.id)))!.text).toMatch(/تم تسجيل طلبك/);

    const callsBefore = textSends();
    await wa("wamid.C2", "ليش ما حدا بيرد؟", "962790000010");
    expect(textSends()).toBe(callsBefore); // paused → no AI reply
    expect((await convOf("962790000010")).unreadCount).toBeGreaterThan(1);
  });

  it("safety issue: fixed safety wording, no repair steps, urgent handoff", async () => {
    await wa("wamid.G1", "في ريحة غاز من السخان", "962790000011");
    const conv = await convOf("962790000011");
    const text = (await lastAi(Number(conv.id)))!.text!;
    expect(text).toMatch(/سلامتك/);
    expect(text).toMatch(/ما بقدر أنصحك بخطوات إصلاح/);
    const h = (await payload.find({ collection: "handoffs", where: { conversation: { equals: conv.id } }, depth: 0, overrideAccess: true })).docs[0];
    expect(h.reason).toBe("safety");
  });

  it("discount request and unconfirmed boiler service are escalated, not answered", async () => {
    await wa("wamid.D1", "بدي خصم على الفلتر", "962790000012");
    expect((await payload.find({ collection: "handoffs", where: { conversation: { equals: (await convOf("962790000012")).id } }, depth: 0, overrideAccess: true })).docs[0].reason).toBe("discount_request");
    await wa("wamid.B1", "بدي صيانة لبويلر المسبح", "962790000013");
    const h = (await payload.find({ collection: "handoffs", where: { conversation: { equals: (await convOf("962790000013")).id } }, depth: 0, overrideAccess: true })).docs[0];
    expect(h.reason).toBe("unsupported_service");
  });

  it("notification: reports 'failed' honestly when the webhook endpoint is down", async () => {
    process.env.HANDOFF_WEBHOOK_URL = "http://127.0.0.1:9/unreachable";
    try {
      await wa("wamid.N1", "بدي احكي مع موظف", "962790000014");
      const h = (await payload.find({ collection: "handoffs", where: { conversation: { equals: (await convOf("962790000014")).id } }, depth: 0, overrideAccess: true })).docs[0];
      expect(h.notifyStatus).toBe("failed");
      expect(h.notifyDetail).toMatch(/webhook: FAILED/);
    } finally {
      delete process.env.HANDOFF_WEBHOOK_URL;
    }
  });
});

describe("human takeover & AI controls", () => {
  it("takeover pauses AI; human reply goes out; AI stays silent until returned", async () => {
    await wa("wamid.H1", "مرحبا", "962790000020");
    const id = Number((await convOf("962790000020")).id);
    await A.takeover(payload, id, adminId);
    expect((await convOf("962790000020")).aiMode).toBe("human");

    const before = textSends();
    await wa("wamid.H2", "بدي أسأل عن الفلتر", "962790000020");
    expect(textSends()).toBe(before);

    const r = await A.sendHuman(payload, id, adminId, { text: "أهلا، معك سامي من الفريق" });
    expect(r.ok).toBe(true);
    expect(calls.at(-1)!.body.text.body).toContain("سامي");
    const human = (await msgs(id)).filter((m) => m.senderType === "agent");
    expect(human[0]).toMatchObject({ status: "sent" });

    await A.returnToAi(payload, id, adminId);
    await wa("wamid.H3", "بكم الفلتر سبع مراحل", "962790000020");
    expect((await lastAi(id))!.text).toContain("160");
  });

  it("a human message while AI is active switches AI off first", async () => {
    await wa("wamid.H5", "مرحبا", "962790000021");
    const id = Number((await convOf("962790000021")).id);
    await A.sendHuman(payload, id, adminId, { text: "مرحبا من الفريق" });
    expect((await convOf("962790000021")).aiMode).toBe("human");
  });

  it("manual pause/resume", async () => {
    await wa("wamid.H6", "مرحبا", "962790000022");
    const id = Number((await convOf("962790000022")).id);
    await A.setAiPaused(payload, id, true, adminId);
    const n = textSends();
    await wa("wamid.H7", "بكم الفلتر", "962790000022");
    expect(textSends()).toBe(n);
    await A.setAiPaused(payload, id, false, adminId);
    expect((await convOf("962790000022")).aiMode).toBe("ai");
  });

  it("24h WhatsApp window: human free-form message is blocked, not sent", async () => {
    await wa("wamid.W1", "مرحبا", "962790000023");
    const id = Number((await convOf("962790000023")).id);
    await payload.update({ collection: "conversations", id, data: { lastInboundAt: new Date(Date.now() - 30 * 3_600_000).toISOString() }, overrideAccess: true });
    const n = textSends();
    const r = await A.sendHuman(payload, id, adminId, { text: "متأخر" });
    expect(r.ok).toBe(false);
    expect(r.blockedReason).toBe("whatsapp_24h_window_closed_template_required");
    expect(textSends()).toBe(n);
    const t = await A.sendHuman(payload, id, adminId, { template: { name: "follow_up", language: "ar" }, text: "[template: follow_up]" });
    expect(t.ok).toBe(true);
    expect(calls.at(-1)!.body).toMatchObject({ type: "template", template: { name: "follow_up", language: { code: "ar" } } });
  });
});

describe("outbound retries", () => {
  it("transient 500 → queued with backoff, retried and delivered; non-retryable error fails immediately", async () => {
    let failed = false;
    respond = (c) => (isSend(c) && !failed ? ((failed = true), { status: 500, json: { error: { message: "boom", code: 2 } } }) : defaultRespond(c));
    await wa("wamid.RT1", "مرحبا", "962790000030");
    respond = defaultRespond;
    const id = Number((await convOf("962790000030")).id);
    let m = (await lastAi(id))!;
    expect(m).toMatchObject({ status: "queued", attempts: 1 });
    expect(m.nextRetryAt).toBeTruthy();
    await payload.update({ collection: "messages", id: m.id, data: { nextRetryAt: new Date(Date.now() - 1000).toISOString() }, overrideAccess: true });
    expect(await retryDue(payload)).toMatchObject({ attempted: 1, ok: 1 });
    m = await payload.findByID({ collection: "messages", id: m.id, depth: 0, overrideAccess: true });
    expect(m).toMatchObject({ status: "sent", attempts: 2 });

    respond = (c) => (isSend(c) ? { status: 400, json: { error: { message: "Re-engagement message", code: 131047 } } } : defaultRespond(c));
    await wa("wamid.RT2", "بكم الفلتر سبع مراحل", "962790000030");
    const f = (await lastAi(id))!;
    expect(f).toMatchObject({ status: "failed", errorCode: "131047" });
    respond = defaultRespond;
  });

  it("jobs worker re-processes inbound messages that were stored but never answered", async () => {
    const r = await post("whatsapp", waText({ id: "wamid.JOB1", body: "مرحبا", from: "962790000031" }), { run: false });
    expect(r.deferred).toBeTypeOf("function"); // response returned before AI work
    const conv = await convOf("962790000031");
    expect(await lastAi(Number(conv.id))).toBeUndefined();
    await payload.update({ collection: "messages", where: { externalId: { equals: "wamid.JOB1" } }, data: { createdAt: new Date(Date.now() - 5 * 60_000).toISOString() }, overrideAccess: true });
    await runJobs(payload);
    expect(await lastAi(Number(conv.id))).toBeDefined();
  });
});

describe("guards keep the model honest", () => {
  it("a model draft with an invented price is blocked and replaced by an honest handoff", async () => {
    setProvider({
      name: "bad-llm",
      async generate() {
        return { reply: "الفلتر بـ 120 دينار مع تركيب مجاني", intent: "price_inquiry", language: "ar", handoff: { needed: false, reason: "none" }, consent: "none", collected: { product_interest: "", area: "", home_type: "", existing_system: "", problem: "", budget: "", name: "", phone: "", equipment_type: "", brand_model: "", preferred_time: "", address: "" }, unanswered_question: "", sources_used: [], appointment_requested: false };
      },
    });
    await wa("wamid.GD1", "كم سعر فلتر المطبخ", "962790000040");
    const conv = await convOf("962790000040");
    const text = (await lastAi(Number(conv.id)))!.text!;
    expect(text).not.toContain("120");
    expect(text).not.toContain("مجاني");
    expect(text).toMatch(/ما عندي معلومة معتمدة/);
    const log = await payload.find({ collection: "audit-logs", where: { action: { equals: "ai.guard_blocked" } }, overrideAccess: true });
    expect(log.totalDocs).toBe(1);
  });

  it("provider outage → after retries the customer is handed to a person, not left silent or answered with a guess", async () => {
    setProvider({ name: "down", async generate() { throw new Error("upstream 529"); } });
    await wa("wamid.INOUT", "بدي اعرف عن المليّنات", "962790000041");
    const conv = await convOf("962790000041");
    expect(conv.aiMode).toBe("paused");
    const h = (await payload.find({ collection: "handoffs", where: { conversation: { equals: conv.id } }, depth: 0, overrideAccess: true })).docs[0];
    expect(h.reason).toBe("ai_failure");
  });
});

describe("qualification, consent and appointments", () => {
  it("purchase flow: qualifies from stated facts, asks consent before personal data, hands off high-intent lead; stores personal data only after consent", async () => {
    const from = "962790000050";
    await wa("wamid.Q1", "بدي اشتري فلتر سبع مراحل", from);
    await wa("wamid.Q2", "أنا ساكن بخلدا", from);
    const conv = await convOf(from);
    const lead = (await payload.find({ collection: "leads", where: { conversation: { equals: conv.id } }, depth: 0, overrideAccess: true })).docs[0];
    expect(lead).toMatchObject({ area: "خلدا", qualified: true });
    const hand = await payload.find({ collection: "handoffs", where: { conversation: { equals: conv.id } }, depth: 0, overrideAccess: true });
    expect(hand.docs.map((h) => h.reason)).toEqual(["high_intent_lead"]);
    expect(conv.aiMode).toBe("ai"); // sales follow-up does not silence the assistant
    const texts = (await msgs(Number(conv.id))).filter((m) => m.senderType === "ai").map((m) => m.text).join("\n");
    expect(texts).toMatch(/«نعم» أو «لا»/); // consent asked before any personal data

    const customerBefore = await payload.findByID({ collection: "customers", id: typeof conv.customer === "number" ? conv.customer : (conv.customer as any).id, depth: 0, overrideAccess: true });
    expect(customerBefore.consentStatus).not.toBe("granted");
    expect(customerBefore.phone).toBeFalsy();

    // personal data offered BEFORE consent is not stored
    await wa("wamid.Q3", "اسمي خالد ورقمي 0791234567", from);
    const c1 = await payload.findByID({ collection: "customers", id: customerBefore.id, depth: 0, overrideAccess: true });
    expect(c1.name).toBeFalsy();
    expect(c1.phone).toBeFalsy();
  });

  it("consent yes → stored; consent no → never stored", async () => {
    const from = "962790000051";
    await wa("wamid.K1", "بدي صيانة للفلتر، الضغط ضعيف، ساكن بعبدون", from);
    let conv = await convOf(from);
    const cid = typeof conv.customer === "number" ? conv.customer : (conv.customer as any).id;
    let cust = await payload.findByID({ collection: "customers", id: cid, depth: 0, overrideAccess: true });
    expect(cust.consentStatus).toBe("requested");
    expect((await lastAi(Number(conv.id)))!.text).toMatch(/«نعم» أو «لا»/);

    await wa("wamid.K2", "نعم", from);
    cust = await payload.findByID({ collection: "customers", id: cid, depth: 0, overrideAccess: true });
    expect(cust.consentStatus).toBe("granted");
    await wa("wamid.K3", "اسمي ليث ورقمي 0791112233", from);
    cust = await payload.findByID({ collection: "customers", id: cid, depth: 0, overrideAccess: true });
    expect(cust.phone).toBe("0791112233");

    const from2 = "962790000052";
    await wa("wamid.K4", "بدي صيانة للفلتر، الضغط ضعيف، ساكن بدابوق", from2);
    await wa("wamid.K5", "لا", from2);
    conv = await convOf(from2);
    const cust2 = await payload.findByID({ collection: "customers", id: typeof conv.customer === "number" ? conv.customer : (conv.customer as any).id, depth: 0, overrideAccess: true });
    expect(cust2.consentStatus).toBe("declined");
    await wa("wamid.K6", "اسمي سعد ورقمي 0793334455", from2);
    const cust3 = await payload.findByID({ collection: "customers", id: cust2.id, depth: 0, overrideAccess: true });
    expect(cust3.phone).toBeFalsy();
  });

  it("appointment: AI records a REQUEST only; wording says it is not confirmed; only staff can confirm", async () => {
    const from = "962790000053";
    await wa("wamid.AP1", "بدي موعد صيانة للفلتر الضغط ضعيف ساكن بالجبيهة", from);
    const conv = await convOf(from);
    const text = (await lastAi(Number(conv.id)))!.text!;
    expect(text).not.toMatch(/تم تأكيد/);
    const appt = (await payload.find({ collection: "appointments", where: { conversation: { equals: conv.id } }, depth: 0, overrideAccess: true })).docs[0];
    expect(appt.status).toBe("requested");
    expect(appt.confirmedBy).toBeFalsy();

    // no user → cannot confirm
    await expect(payload.update({ collection: "appointments", id: appt.id, data: { status: "confirmed", scheduledFor: new Date().toISOString() }, overrideAccess: true })).rejects.toThrow(/Only inbox staff/);
    // staff without a date → rejected; with date → confirmed + stamped
    await expect(payload.update({ collection: "appointments", id: appt.id, data: { status: "confirmed" }, user: { collection: "users", ...salesUser } as any, overrideAccess: true })).rejects.toThrow(/scheduled date/);
    const ok = await payload.update({ collection: "appointments", id: appt.id, data: { status: "confirmed", scheduledFor: new Date(Date.now() + 86_400_000).toISOString() }, user: { collection: "users", ...salesUser } as any, overrideAccess: true });
    expect(Number(typeof ok.confirmedBy === "object" ? ok.confirmedBy?.id : ok.confirmedBy)).toBe(salesUser.id);
  });
});

describe("approval workflow (knowledge base & offers)", () => {
  it("assistant only uses published content: a draft/edit is invisible until an administrator publishes", async () => {
    const e = await payload.create({
      collection: "knowledge-entries",
      overrideAccess: true,
      locale: "ar",
      draft: true,
      data: { category: "faq", title: "قطبة مخفية زيتونة", content: "المعلومة السرية الزيتونية", _status: "draft" },
    });
    const { loadApproved } = await import("@/agent/knowledge");
    expect((await loadApproved(payload)).some((i) => i.title.ar.includes("زيتونة"))).toBe(false);

    await expect(
      payload.update({ collection: "knowledge-entries", id: e.id, draft: false, data: { _status: "published" }, user: { collection: "users", ...salesUser } as any, overrideAccess: false }),
    ).rejects.toThrow();
    await payload.update({ collection: "knowledge-entries", id: e.id, draft: false, data: { _status: "published" }, user: { collection: "users", id: adminId, role: "admin", email: "admin@test.local" } as any, overrideAccess: true });
    expect((await loadApproved(payload)).some((i) => i.title.ar.includes("زيتونة"))).toBe(true);
  });

  it("pausing an offer stops the assistant from quoting it — no code change", async () => {
    const offer = (await payload.find({ collection: "offers", where: { key: { equals: "traditional-seven-stage-filter" } }, limit: 1, depth: 0, overrideAccess: true })).docs[0];
    await payload.update({ collection: "offers", id: offer.id, draft: false, data: { state: "paused", _status: "published" }, overrideAccess: true });
    await wa("wamid.OF1", "بكم الفلتر سبع مراحل", "962790000060");
    const reply = (await lastAi(Number((await convOf("962790000060")).id)))!.text!;
    expect(reply).not.toContain("160");
    await payload.update({ collection: "offers", id: offer.id, draft: false, data: { state: "active", _status: "published" }, overrideAccess: true });
  });

  it("offer end dates are honoured", async () => {
    const offer = (await payload.find({ collection: "offers", where: { key: { equals: "filter-maintenance" } }, limit: 1, depth: 0, overrideAccess: true })).docs[0];
    await payload.update({ collection: "offers", id: offer.id, draft: false, data: { endsAt: new Date(Date.now() - 86_400_000).toISOString(), _status: "published" }, overrideAccess: true });
    const { loadApproved } = await import("@/agent/knowledge");
    expect((await loadApproved(payload)).some((i) => i.id === "offer:filter-maintenance")).toBe(false);
    await payload.update({ collection: "offers", id: offer.id, draft: false, data: { endsAt: null, _status: "published" }, overrideAccess: true });
  });
});

describe("analytics report only verified outcomes", () => {
  it("a lead is not a sale; 'won' needs evidence; confirmed appointments need a staff confirmation", async () => {
    const before = await computeAnalytics(payload, 7);
    expect(before.leads.total).toBeGreaterThan(0);
    expect(before.sales.verifiedSales).toBe(0);
    expect(before.sales.conversionRate).toBeNull();
    expect(before.appointments.confirmed).toBe(1); // only the one staff confirmed above
    expect(before.appointments.requested).toBeGreaterThanOrEqual(1);

    const lead = (await payload.find({ collection: "leads", limit: 1, depth: 0, overrideAccess: true })).docs[0];
    await expect(payload.update({ collection: "leads", id: lead.id, data: { stage: "won" }, overrideAccess: true })).rejects.toThrow(/evidence/);
    await payload.update({ collection: "leads", id: lead.id, data: { stage: "won", verified: { evidence: "INV-1001", amountJOD: 160 } }, user: { collection: "users", ...salesUser } as any, overrideAccess: true });
    const after = await computeAnalytics(payload, 7);
    expect(after.sales.verifiedSales).toBe(1);
    expect(after.sales.conversionRate).toBe(1);
    expect(after.conversations.byChannel.whatsapp).toBeGreaterThan(5);
    expect(after.escalation.rate).toBeGreaterThan(0);
    expect(after.delivery.failedMessages).toBeGreaterThanOrEqual(1);
    expect(after.delivery.integrationErrors).toBeGreaterThanOrEqual(1);
    expect(after.responseSeconds.averageFirstReply).not.toBeNull();
  });
});
