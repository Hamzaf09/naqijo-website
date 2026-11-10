import { aiSettings, cronSecret, credentials, graphVersion, instagramMode, missingConfig, notifySettings } from "@/agent/config";
import { isResponse, json, requireStaff } from "@/agent/auth";
import { checkConnection } from "@/agent/channels/send";
import type { MetaChannel } from "@/agent/types";
import { getServerURL } from "@/lib/env";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const CHANNELS: MetaChannel[] = ["whatsapp", "messenger", "instagram"];

/** Integration health: configuration, webhook traffic, failures. `?check=1` makes live Graph calls. */
export async function GET(req: Request) {
  const staff = await requireStaff(req);
  if (isResponse(staff)) return staff;
  const { payload } = staff;
  const live = new URL(req.url).searchParams.get("check") === "1";
  const since = new Date(Date.now() - 24 * 3_600_000).toISOString();
  const base = getServerURL();

  const channels = [];
  for (const ch of CHANNELS) {
    const missing = missingConfig(ch);
    const last = await payload.find({ collection: "webhook-events", where: { and: [{ channel: { equals: ch } }, { status: { in: ["processed", "ignored"] } }] }, sort: "-createdAt", limit: 1, depth: 0, overrideAccess: true });
    const lastErr = await payload.find({ collection: "webhook-events", where: { and: [{ channel: { equals: ch } }, { status: { in: ["error", "invalid_signature"] } }] }, sort: "-createdAt", limit: 1, depth: 0, overrideAccess: true });
    const errs24 = await payload.count({ collection: "webhook-events", where: { and: [{ channel: { equals: ch } }, { createdAt: { greater_than: since } }, { status: { in: ["error", "invalid_signature"] } }] }, overrideAccess: true });
    const failed = await payload.count({ collection: "messages", where: { and: [{ channel: { equals: ch } }, { direction: { equals: "outbound" } }, { status: { equals: "failed" } }] }, overrideAccess: true });
    const retrying = await payload.count({ collection: "messages", where: { and: [{ channel: { equals: ch } }, { status: { equals: "queued" } }, { attempts: { greater_than: 0 } }] }, overrideAccess: true });
    channels.push({
      channel: ch,
      configured: missing.length === 0,
      missing,
      webhookUrl: `${base}/api/webhooks/${ch}`,
      lastEventAt: last.docs[0]?.createdAt ?? null,
      lastError: lastErr.docs[0] ? { at: lastErr.docs[0].createdAt, status: lastErr.docs[0].status, message: lastErr.docs[0].error } : null,
      errors24h: errs24.totalDocs,
      failedMessages: failed.totalDocs,
      retrying: retrying.totalDocs,
      hasAccessToken: Boolean(credentials(ch).accessToken),
      connection: live ? await checkConnection(ch) : null,
    });
  }

  const failedMessages = await payload.find({
    collection: "messages",
    where: { and: [{ direction: { equals: "outbound" } }, { status: { in: ["failed", "blocked"] } }] },
    sort: "-updatedAt",
    limit: 20,
    depth: 0,
    overrideAccess: true,
  });
  const ai = aiSettings();
  const notify = notifySettings();
  return json(200, {
    graphVersion: graphVersion(),
    instagramMode: instagramMode(),
    ai: { provider: ai.provider, model: ai.provider === "anthropic" ? ai.model : "offline rules", keyConfigured: Boolean(process.env.ANTHROPIC_API_KEY) },
    notifications: { email: notify.emails.length > 0, webhook: Boolean(notify.webhookUrl) },
    cronConfigured: Boolean(cronSecret()),
    channels,
    failedMessages: failedMessages.docs.map((m) => ({
      id: m.id,
      conversation: typeof m.conversation === "object" ? m.conversation.id : m.conversation,
      channel: m.channel,
      status: m.status,
      error: m.error,
      errorCode: m.errorCode,
      attempts: m.attempts,
      at: m.updatedAt,
    })),
  });
}
