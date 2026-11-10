import type { MetaChannel, NormalizedInbound, NormalizedStatus, ParsedWebhook } from "../types";

type Obj = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const empty = (): ParsedWebhook => ({ messages: [], statuses: [], ignored: 0 });
const secs = (v: unknown) => new Date(Number(v) * 1000);

/** WhatsApp Cloud API: entry[].changes[].value.{messages,statuses} */
export function parseWhatsApp(body: Obj): ParsedWebhook {
  const out = empty();
  if (body?.object !== "whatsapp_business_account") return out;
  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages" || !change.value) {
        out.ignored++;
        continue;
      }
      const v = change.value as Obj;
      const accountId = String(v.metadata?.phone_number_id ?? "");
      const names = new Map<string, string>();
      for (const c of v.contacts ?? []) if (c.wa_id) names.set(String(c.wa_id), c.profile?.name ?? "");

      for (const m of v.messages ?? []) {
        let text = "";
        let kind: NormalizedInbound["kind"] = "text";
        switch (m.type) {
          case "text":
            text = m.text?.body ?? "";
            break;
          case "button":
            text = m.button?.text ?? m.button?.payload ?? "";
            break;
          case "interactive":
            text = m.interactive?.button_reply?.title ?? m.interactive?.list_reply?.title ?? "";
            break;
          case "image":
          case "video":
          case "document":
            text = m[m.type]?.caption ?? "";
            kind = text ? "text" : "media";
            break;
          case "audio":
          case "sticker":
          case "location":
          case "contacts":
            kind = "media";
            break;
          case "reaction":
            out.ignored++;
            continue;
          default:
            kind = "unsupported";
        }
        out.messages.push({
          channel: "whatsapp",
          externalId: String(m.id),
          customerId: String(m.from),
          accountId,
          customerName: names.get(String(m.from)) || undefined,
          text,
          kind,
          timestamp: secs(m.timestamp),
          raw: m,
        });
      }

      for (const s of v.statuses ?? []) {
        const status = s.status as NormalizedStatus["status"];
        if (!["sent", "delivered", "read", "failed"].includes(status)) {
          out.ignored++;
          continue;
        }
        const err = s.errors?.[0];
        out.statuses.push({
          channel: "whatsapp",
          externalId: String(s.id),
          status,
          timestamp: secs(s.timestamp),
          error: err ? { code: err.code, message: err.message ?? err.title ?? "failed" } : undefined,
        });
      }
    }
  }
  return out;
}

/**
 * Messenger (object "page") and Instagram (object "instagram") share the
 * `entry[].messaging[]` envelope. Echoes of our own sends are ignored.
 */
export function parseMessaging(body: Obj, channel: Extract<MetaChannel, "messenger" | "instagram">): ParsedWebhook {
  const out = empty();
  const expectedObject = channel === "messenger" ? "page" : "instagram";
  if (body?.object !== expectedObject) return out;
  for (const entry of body.entry ?? []) {
    for (const ev of entry.messaging ?? []) {
      const accountId = String(ev.recipient?.id ?? entry.id ?? "");
      const customerId = String(ev.sender?.id ?? "");
      const ts = new Date(Number(ev.timestamp ?? entry.time ?? Date.now()));

      if (ev.message) {
        const m = ev.message as Obj;
        if (m.is_echo || m.is_deleted || m.is_unsupported && !m.text) {
          out.ignored++;
          continue;
        }
        const hasAttachment = Array.isArray(m.attachments) && m.attachments.length > 0;
        const text: string = m.text ?? m.quick_reply?.payload ?? "";
        out.messages.push({
          channel,
          externalId: String(m.mid),
          customerId,
          accountId,
          text,
          kind: text ? "text" : hasAttachment ? "media" : "unsupported",
          timestamp: ts,
          raw: ev,
        });
      } else if (ev.postback) {
        out.messages.push({
          channel,
          externalId: String(ev.postback.mid ?? `pb:${customerId}:${ev.timestamp}`),
          customerId,
          accountId,
          text: ev.postback.title ?? ev.postback.payload ?? "",
          kind: "text",
          timestamp: ts,
          raw: ev,
        });
      } else if (ev.delivery?.mids) {
        for (const mid of ev.delivery.mids) {
          out.statuses.push({ channel, externalId: String(mid), status: "delivered", timestamp: ts });
        }
      } else if (ev.read?.mid) {
        out.statuses.push({ channel, externalId: String(ev.read.mid), status: "read", timestamp: ts });
      } else {
        out.ignored++; // reactions, read watermarks, referrals...
      }
    }
  }
  return out;
}

export function parseWebhook(channel: MetaChannel, body: Obj): ParsedWebhook {
  return channel === "whatsapp" ? parseWhatsApp(body) : parseMessaging(body, channel);
}
