import { after } from "next/server";
import { getPayloadClient } from "@/lib/payload/client";
import { handleVerification, handleWebhook } from "@/agent/webhook";
import type { MetaChannel } from "@/agent/types";

const ip = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

/** Builds GET/POST handlers for one Meta channel webhook endpoint. */
export function metaWebhook(channel: MetaChannel) {
  return {
    async GET(req: Request) {
      const payload = await getPayloadClient();
      const r = await handleVerification(payload, channel, new URL(req.url).searchParams);
      return new Response(r.body, { status: r.status, headers: { "Content-Type": "text/plain" } });
    },
    async POST(req: Request) {
      const payload = await getPayloadClient();
      // The signature covers the exact bytes — read the raw text, never re-serialize.
      const raw = await req.text();
      const r = await handleWebhook(payload, channel, raw, req.headers.get("x-hub-signature-256"), ip(req));
      if (r.deferred) after(r.deferred);
      return new Response(r.body, { status: r.status, headers: { "Content-Type": "text/plain" } });
    },
  };
}
