import type { Payload } from "payload";
import { audit } from "./audit";
import { parseWebhook } from "./channels/parse";
import { markRead } from "./channels/send";
import { credentials, missingConfig } from "./config";
import { verifyChallenge, verifySignature } from "./channels/signature";
import { ingestInbound } from "./conversations";
import { processConversation } from "./engine";
import { applyStatus } from "./outbound";
import { rateLimit } from "./ratelimit";
import { TENANT_ID } from "./config";
import type { MetaChannel } from "./types";

export interface WebhookResult {
  status: number;
  body: string;
  /** Work to run after the HTTP response (AI processing, read receipts). */
  deferred?: () => Promise<void>;
  summary?: { messages: number; statuses: number; duplicates: number; ignored: number };
}

async function logEvent(
  payload: Payload,
  channel: MetaChannel,
  status: "verification" | "processed" | "ignored" | "invalid_signature" | "bad_request" | "error",
  extra: { messageCount?: number; statusCount?: number; duplicateCount?: number; error?: string } = {},
) {
  try {
    await payload.create({ collection: "webhook-events", overrideAccess: true, data: { tenant: TENANT_ID, channel, status, ...extra } });
  } catch (err) {
    payload.logger.error({ err }, "webhook event log failed");
  }
}

/** GET handshake: Meta calls this when the webhook URL is saved in the app dashboard. */
export async function handleVerification(payload: Payload, channel: MetaChannel, params: URLSearchParams): Promise<WebhookResult> {
  const c = credentials(channel);
  const r = verifyChallenge(params, c.verifyToken);
  if (!r.ok) {
    await logEvent(payload, channel, "bad_request", { error: "verification failed (verify token mismatch or not configured)" });
    return { status: 403, body: "Forbidden" };
  }
  await logEvent(payload, channel, "verification");
  return { status: 200, body: r.challenge };
}

/**
 * POST delivery. Order matters: authenticate the RAW body first, then parse.
 * Meta retries non-2xx responses, so anything we accepted (even partially
 * failed) returns 200 and failures are recorded for the retry worker/monitoring.
 */
export async function handleWebhook(
  payload: Payload,
  channel: MetaChannel,
  rawBody: string,
  signature: string | null,
  clientIp = "unknown",
): Promise<WebhookResult> {
  const c = credentials(channel);
  if (!c.appSecret) {
    await logEvent(payload, channel, "error", { error: `webhook received but not configured: ${missingConfig(channel).join(", ")}` });
    return { status: 503, body: "Not configured" };
  }
  if (!verifySignature(rawBody, signature, c.appSecret)) {
    const rl = rateLimit(`badsig:${clientIp}`, 20, 60_000);
    if (rl.allowed) await logEvent(payload, channel, "invalid_signature", { error: "X-Hub-Signature-256 mismatch or missing" });
    return { status: 401, body: "Invalid signature" };
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    await logEvent(payload, channel, "bad_request", { error: "body is not JSON" });
    return { status: 400, body: "Bad request" };
  }

  const parsed = parseWebhook(channel, json as Record<string, unknown>);
  let duplicates = 0;
  const touched = new Set<number>();
  const toMarkRead: { to: string; id: string }[] = [];
  const errors: string[] = [];

  for (const m of parsed.messages) {
    // Ignore traffic for assets that are not ours (shared app, multiple pages/numbers).
    if (c.accountId && m.accountId && m.accountId !== c.accountId) {
      parsed.ignored++;
      continue;
    }
    try {
      const r = await ingestInbound(payload, m);
      if (r.duplicate) duplicates++;
      else {
        touched.add(r.conversationId);
        toMarkRead.push({ to: m.customerId, id: m.externalId });
      }
    } catch (err) {
      errors.push((err as Error).message);
      payload.logger.error({ err, externalId: m.externalId }, "inbound ingest failed");
    }
  }
  for (const s of parsed.statuses) {
    try {
      await applyStatus(payload, s);
    } catch (err) {
      errors.push((err as Error).message);
    }
  }

  await logEvent(payload, channel, errors.length ? "error" : parsed.messages.length + parsed.statuses.length ? "processed" : "ignored", {
    messageCount: parsed.messages.length,
    statusCount: parsed.statuses.length,
    duplicateCount: duplicates,
    error: errors.join("; ").slice(0, 900) || undefined,
  });

  const deferred = async () => {
    const last = toMarkRead[toMarkRead.length - 1];
    if (last) await markRead(channel, last.to, last.id);
    for (const id of touched) {
      try {
        await processConversation(payload, id);
      } catch (err) {
        payload.logger.error({ err, conversationId: id }, "deferred processing failed");
      }
    }
  };
  // Failed ingests still return 200 (they are logged); an unparseable sender can't be fixed by Meta retrying.
  void audit;
  return {
    status: 200,
    body: "EVENT_RECEIVED",
    deferred,
    summary: { messages: parsed.messages.length, statuses: parsed.statuses.length, duplicates, ignored: parsed.ignored },
  };
}
