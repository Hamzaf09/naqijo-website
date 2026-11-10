import { credentials, instagramMode } from "../config";
import type { MetaChannel } from "../types";
import { graphRequest } from "./graph";
import type { SendPlan } from "./window";

export interface SendTextArgs {
  channel: MetaChannel;
  to: string;
  text: string;
  plan: Extract<SendPlan, { allowed: true }>;
}

export interface SendTemplateArgs {
  to: string;
  name: string;
  language: string;
  bodyParams?: string[];
}

/** Per-platform text limits (Instagram counts UTF-8 BYTES, Arabic is 2 bytes/char). */
export const LIMITS: Record<MetaChannel, { max: number; bytes: boolean }> = {
  whatsapp: { max: 4000, bytes: false },
  messenger: { max: 1900, bytes: false },
  instagram: { max: 950, bytes: true },
};

const size = (s: string, bytes: boolean) => (bytes ? Buffer.byteLength(s, "utf8") : s.length);

/** Splits on paragraph → sentence → word boundaries so no part exceeds the platform limit. */
export function splitMessage(text: string, channel: MetaChannel): string[] {
  const { max, bytes } = LIMITS[channel];
  const t = text.trim();
  if (size(t, bytes) <= max) return [t];
  const parts: string[] = [];
  let cur = "";
  const push = (unit: string, sep: string) => {
    const candidate = cur ? cur + sep + unit : unit;
    if (size(candidate, bytes) <= max) cur = candidate;
    else {
      if (cur) parts.push(cur);
      cur = unit;
    }
  };
  for (const para of t.split(/\n{2,}/)) {
    if (size(para, bytes) <= max) {
      push(para, "\n\n");
      continue;
    }
    for (const sent of para.split(/(?<=[.!؟?!\n])\s+/)) {
      if (size(sent, bytes) <= max) push(sent, " ");
      else {
        for (const word of sent.split(" ")) {
          if (size(word, bytes) > max) {
            // pathological token: hard cut by characters
            for (const ch of Array.from(word)) push(ch, "");
          } else push(word, " ");
        }
      }
    }
  }
  if (cur) parts.push(cur);
  return parts;
}

export async function sendText(args: SendTextArgs): Promise<{ externalId: string }> {
  const { channel, to, text, plan } = args;
  const c = credentials(channel);
  if (!c.accessToken) throw new Error(`${channel}: access token not configured`);

  if (channel === "whatsapp") {
    const res = await graphRequest<{ messages?: { id: string }[] }>(
      channel,
      "POST",
      `${c.accountId}/messages`,
      c.accessToken,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { body: text, preview_url: false },
      },
    );
    const id = res.messages?.[0]?.id;
    if (!id) throw new Error("WhatsApp send returned no message id");
    return { externalId: id };
  }

  const path =
    channel === "instagram" && instagramMode() === "instagram_login" && c.accountId
      ? `${c.accountId}/messages`
      : "me/messages";
  const res = await graphRequest<{ message_id?: string }>(channel, "POST", path, c.accessToken, {
    recipient: { id: to },
    messaging_type: plan.messagingType,
    ...(plan.tag ? { tag: plan.tag } : {}),
    message: { text },
  });
  if (!res.message_id) throw new Error(`${channel} send returned no message id`);
  return { externalId: res.message_id };
}

/** WhatsApp approved-template message (the only option outside the 24h window). */
export async function sendWhatsAppTemplate(a: SendTemplateArgs): Promise<{ externalId: string }> {
  const c = credentials("whatsapp");
  if (!c.accessToken) throw new Error("whatsapp: access token not configured");
  const res = await graphRequest<{ messages?: { id: string }[] }>(
    "whatsapp",
    "POST",
    `${c.accountId}/messages`,
    c.accessToken,
    {
      messaging_product: "whatsapp",
      to: a.to,
      type: "template",
      template: {
        name: a.name,
        language: { code: a.language },
        ...(a.bodyParams?.length
          ? {
              components: [
                { type: "body", parameters: a.bodyParams.map((text) => ({ type: "text", text })) },
              ],
            }
          : {}),
      },
    },
  );
  const id = res.messages?.[0]?.id;
  if (!id) throw new Error("WhatsApp template send returned no message id");
  return { externalId: id };
}

/** Best-effort read receipt; failures are never surfaced to the customer. */
export async function markRead(channel: MetaChannel, to: string, externalId: string): Promise<void> {
  const c = credentials(channel);
  if (!c.accessToken) return;
  try {
    if (channel === "whatsapp") {
      await graphRequest(channel, "POST", `${c.accountId}/messages`, c.accessToken, {
        messaging_product: "whatsapp",
        status: "read",
        message_id: externalId,
      });
    } else {
      const path =
        channel === "instagram" && instagramMode() === "instagram_login" && c.accountId
          ? `${c.accountId}/messages`
          : "me/messages";
      await graphRequest(channel, "POST", path, c.accessToken, {
        recipient: { id: to },
        sender_action: "mark_seen",
      });
    }
  } catch {
    /* non-critical */
  }
}

/** Live token/asset check used by the integration-status page (a real API call). */
export async function checkConnection(
  channel: MetaChannel,
): Promise<{ ok: boolean; detail: string }> {
  const c = credentials(channel);
  if (!c.accessToken) return { ok: false, detail: "access token not configured" };
  try {
    if (channel === "whatsapp") {
      const r = await graphRequest<{ display_phone_number?: string; verified_name?: string }>(
        channel,
        "GET",
        `${c.accountId}?fields=display_phone_number,verified_name`,
        c.accessToken,
      );
      return { ok: true, detail: `${r.verified_name ?? ""} ${r.display_phone_number ?? ""}`.trim() };
    }
    const r = await graphRequest<{ id?: string; name?: string; username?: string }>(
      channel,
      "GET",
      "me?fields=id,name,username",
      c.accessToken,
    );
    return { ok: true, detail: r.username ?? r.name ?? r.id ?? "ok" };
  } catch (e) {
    return { ok: false, detail: (e as Error).message };
  }
}
