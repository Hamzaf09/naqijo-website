import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { parseWebhook } from "@/agent/channels/parse";
import { splitMessage, LIMITS } from "@/agent/channels/send";
import { signBody, verifyChallenge, verifySignature } from "@/agent/channels/signature";
import { planSend, windowState } from "@/agent/channels/window";
import { isRetryable } from "@/agent/channels/graph";
import { _resetRateLimits, rateLimit } from "@/agent/ratelimit";
import { igRead, igText, msngrDelivery, msngrEcho, msngrText, waAudio, waStatus, waText } from "../fixtures/payloads";

describe("webhook signature (X-Hub-Signature-256)", () => {
  const secret = "s3cret";
  const body = JSON.stringify({ a: 1, ar: "مرحبا" });
  it("accepts the correct HMAC of the raw body", () => {
    expect(verifySignature(body, signBody(body, secret), secret)).toBe(true);
  });
  it("rejects tampered body, wrong secret, missing/malformed header", () => {
    expect(verifySignature(body + " ", signBody(body, secret), secret)).toBe(false);
    expect(verifySignature(body, signBody(body, "other"), secret)).toBe(false);
    expect(verifySignature(body, null, secret)).toBe(false);
    expect(verifySignature(body, "sha1=abc", secret)).toBe(false);
    expect(verifySignature(body, "sha256=zz", secret)).toBe(false);
    expect(verifySignature(body, signBody(body, secret), "")).toBe(false);
  });
  it("verification handshake echoes challenge only for the right token", () => {
    const ok = verifyChallenge(new URLSearchParams({ "hub.mode": "subscribe", "hub.verify_token": "tok", "hub.challenge": "1234" }), "tok");
    expect(ok).toEqual({ ok: true, challenge: "1234" });
    expect(verifyChallenge(new URLSearchParams({ "hub.mode": "subscribe", "hub.verify_token": "bad", "hub.challenge": "1" }), "tok").ok).toBe(false);
    expect(verifyChallenge(new URLSearchParams({ "hub.mode": "subscribe", "hub.verify_token": "", "hub.challenge": "1" }), "").ok).toBe(false);
  });
});

describe("payload normalization", () => {
  it("WhatsApp text → normalized message with profile name and phone_number_id", () => {
    const r = parseWebhook("whatsapp", waText({ id: "wamid.1", body: "مرحبا", name: "سامر" }));
    expect(r.messages).toHaveLength(1);
    expect(r.messages[0]).toMatchObject({ channel: "whatsapp", externalId: "wamid.1", customerId: "962790000001", accountId: "100200300", customerName: "سامر", text: "مرحبا", kind: "text" });
  });
  it("WhatsApp statuses incl. failure error", () => {
    const r = parseWebhook("whatsapp", waStatus("wamid.9", "failed", [{ code: 131047, title: "Re-engagement message" }]));
    expect(r.statuses[0]).toMatchObject({ externalId: "wamid.9", status: "failed", error: { code: 131047 } });
  });
  it("WhatsApp media without caption is kind=media", () => {
    expect(parseWebhook("whatsapp", waAudio("wamid.a")).messages[0].kind).toBe("media");
  });
  it("Messenger message, delivery and echo", () => {
    expect(parseWebhook("messenger", msngrText("m.1", "P1", "hi")).messages[0]).toMatchObject({ channel: "messenger", externalId: "m.1", customerId: "P1", accountId: "555666" });
    expect(parseWebhook("messenger", msngrEcho("m.2")).messages).toHaveLength(0);
    expect(parseWebhook("messenger", msngrEcho("m.2")).ignored).toBe(1);
    expect(parseWebhook("messenger", msngrDelivery(["m.1", "m.3"])).statuses.map((s) => s.externalId)).toEqual(["m.1", "m.3"]);
  });
  it("Instagram message and read receipt; wrong object ignored", () => {
    expect(parseWebhook("instagram", igText("ig.1")).messages[0]).toMatchObject({ channel: "instagram", customerId: "IGSID1", accountId: "17841400000" });
    expect(parseWebhook("instagram", igRead("ig.1")).statuses[0].status).toBe("read");
    expect(parseWebhook("instagram", msngrText("m.1")).messages).toHaveLength(0);
  });
});

describe("messaging-window compliance", () => {
  const now = new Date("2026-10-09T12:00:00Z");
  const ago = (h: number) => new Date(now.getTime() - h * 3_600_000);
  beforeEach(() => { delete process.env.META_HUMAN_AGENT_TAG_ENABLED; });
  afterEach(() => { delete process.env.META_HUMAN_AGENT_TAG_ENABLED; });

  it("allows free-form replies inside 24h", () => {
    for (const ch of ["whatsapp", "messenger", "instagram"] as const) {
      expect(planSend({ channel: ch, lastInboundAt: ago(23), now, byHuman: false })).toMatchObject({ allowed: true, messagingType: "RESPONSE" });
    }
  });
  it("WhatsApp: closed after 24h → only templates", () => {
    expect(planSend({ channel: "whatsapp", lastInboundAt: ago(25), now, byHuman: true })).toMatchObject({ allowed: false });
    expect(planSend({ channel: "whatsapp", lastInboundAt: ago(25), now, byHuman: true, template: true })).toMatchObject({ allowed: true });
  });
  it("Messenger/Instagram: HUMAN_AGENT tag only for humans, only when enabled, only ≤7 days", () => {
    expect(planSend({ channel: "messenger", lastInboundAt: ago(30), now, byHuman: true }).allowed).toBe(false);
    process.env.META_HUMAN_AGENT_TAG_ENABLED = "true";
    expect(planSend({ channel: "messenger", lastInboundAt: ago(30), now, byHuman: true })).toMatchObject({ allowed: true, tag: "HUMAN_AGENT" });
    expect(planSend({ channel: "instagram", lastInboundAt: ago(30), now, byHuman: false }).allowed).toBe(false);
    expect(planSend({ channel: "instagram", lastInboundAt: ago(24 * 8), now, byHuman: true }).allowed).toBe(false);
  });
  it("never messages a customer who never wrote", () => {
    expect(planSend({ channel: "whatsapp", lastInboundAt: null, now, byHuman: true }).allowed).toBe(false);
  });
  it("window state reports expiry", () => {
    expect(windowState("whatsapp", ago(2), now).open).toBe(true);
    expect(windowState("whatsapp", ago(30), now).open).toBe(false);
  });
});

describe("message splitting respects platform limits", () => {
  it("keeps short text intact", () => expect(splitMessage("hello", "whatsapp")).toEqual(["hello"]));
  it("splits Arabic text for Instagram by UTF-8 bytes", () => {
    const long = Array.from({ length: 60 }, (_, i) => `هذه جملة رقم ${i} من الرد الطويل جدًا.`).join(" ");
    const parts = splitMessage(long, "instagram");
    expect(parts.length).toBeGreaterThan(1);
    for (const p of parts) expect(Buffer.byteLength(p, "utf8")).toBeLessThanOrEqual(LIMITS.instagram.max);
    expect(parts.join(" ").replace(/\s+/g, " ")).toContain("رقم 59");
  });
  it("hard-cuts pathological tokens", () => {
    const parts = splitMessage("x".repeat(5000), "messenger");
    expect(parts.every((p) => p.length <= LIMITS.messenger.max)).toBe(true);
    expect(parts.join("").length).toBe(5000);
  });
});

describe("retry classification & rate limit", () => {
  it("retries throttling/5xx/network, not auth/policy errors", () => {
    expect(isRetryable(0)).toBe(true);
    expect(isRetryable(503)).toBe(true);
    expect(isRetryable(429)).toBe(true);
    expect(isRetryable(400, 130429)).toBe(true);
    expect(isRetryable(400, 131047)).toBe(false);
    expect(isRetryable(401, 190)).toBe(false);
  });
  it("fixed-window limiter", () => {
    _resetRateLimits();
    expect(rateLimit("k", 2, 1000, 0).allowed).toBe(true);
    expect(rateLimit("k", 2, 1000, 1).allowed).toBe(true);
    expect(rateLimit("k", 2, 1000, 2).allowed).toBe(false);
    expect(rateLimit("k", 2, 1000, 1500).allowed).toBe(true);
  });
});
