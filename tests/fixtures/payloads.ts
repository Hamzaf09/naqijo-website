/** Webhook fixtures shaped like Meta's documented payloads. */
export const WA_PHONE_ID = "100200300";

export function waText(opts: { id: string; from?: string; name?: string; body: string; ts?: number }) {
  return {
    object: "whatsapp_business_account",
    entry: [
      {
        id: "WABA1",
        changes: [
          {
            field: "messages",
            value: {
              messaging_product: "whatsapp",
              metadata: { display_phone_number: "962792900008", phone_number_id: WA_PHONE_ID },
              contacts: [{ profile: { name: opts.name ?? "سامر" }, wa_id: opts.from ?? "962790000001" }],
              messages: [
                { from: opts.from ?? "962790000001", id: opts.id, timestamp: String(opts.ts ?? Math.floor(Date.now() / 1000)), type: "text", text: { body: opts.body } },
              ],
            },
          },
        ],
      },
    ],
  };
}

export function waStatus(id: string, status: "sent" | "delivered" | "read" | "failed", errors?: unknown[]) {
  return {
    object: "whatsapp_business_account",
    entry: [
      {
        id: "WABA1",
        changes: [
          {
            field: "messages",
            value: {
              messaging_product: "whatsapp",
              metadata: { display_phone_number: "962792900008", phone_number_id: WA_PHONE_ID },
              statuses: [{ id, status, timestamp: String(Math.floor(Date.now() / 1000)), recipient_id: "962790000001", ...(errors ? { errors } : {}) }],
            },
          },
        ],
      },
    ],
  };
}

export function waAudio(id: string, from = "962790000001") {
  return {
    object: "whatsapp_business_account",
    entry: [{ id: "W", changes: [{ field: "messages", value: { metadata: { phone_number_id: WA_PHONE_ID }, contacts: [{ wa_id: from, profile: { name: "x" } }], messages: [{ from, id, timestamp: String(Math.floor(Date.now() / 1000)), type: "audio", audio: { id: "m1" } }] } }] }],
  };
}

export const PAGE_ID = "555666";
export function msngrText(mid: string, psid = "PSID1", text = "مرحبا") {
  return { object: "page", entry: [{ id: PAGE_ID, time: Date.now(), messaging: [{ sender: { id: psid }, recipient: { id: PAGE_ID }, timestamp: Date.now(), message: { mid, text } }] }] };
}
export function msngrEcho(mid: string) {
  return { object: "page", entry: [{ id: PAGE_ID, time: 1, messaging: [{ sender: { id: PAGE_ID }, recipient: { id: "PSID1" }, timestamp: 1, message: { mid, text: "hi", is_echo: true } }] }] };
}
export function msngrDelivery(mids: string[]) {
  return { object: "page", entry: [{ id: PAGE_ID, time: 1, messaging: [{ sender: { id: "PSID1" }, recipient: { id: PAGE_ID }, timestamp: 1, delivery: { mids, watermark: 1 } }] }] };
}

export const IG_ID = "17841400000";
export function igText(mid: string, igsid = "IGSID1", text = "hello") {
  return { object: "instagram", entry: [{ id: IG_ID, time: Math.floor(Date.now() / 1000), messaging: [{ sender: { id: igsid }, recipient: { id: IG_ID }, timestamp: Date.now(), message: { mid, text } }] }] };
}
export function igRead(mid: string) {
  return { object: "instagram", entry: [{ id: IG_ID, time: 1, messaging: [{ sender: { id: "IGSID1" }, recipient: { id: IG_ID }, timestamp: 1, read: { mid } }] }] };
}
