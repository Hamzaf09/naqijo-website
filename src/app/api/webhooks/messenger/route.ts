import { metaWebhook } from "@/lib/webhook-route";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export const { GET, POST } = metaWebhook("messenger");
