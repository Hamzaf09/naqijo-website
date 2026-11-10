import { humanAgentTagEnabled } from "../config";
import type { Channel } from "../types";

const HOUR = 3_600_000;

export type SendPlan =
  | { allowed: true; messagingType: "RESPONSE" | "MESSAGE_TAG"; tag?: "HUMAN_AGENT" }
  | { allowed: false; reason: string };

/**
 * Messaging-window policy (Meta platform rules):
 *  - WhatsApp: free-form messages only within 24h of the customer's last
 *    message; afterwards only approved templates.
 *  - Messenger / Instagram: standard replies within 24h; a HUMAN_AGENT tag
 *    (needs the Human Agent feature approved) extends this to 7 days for
 *    messages written by a person.
 *  - The "test" simulator is unrestricted.
 */
export function planSend(args: {
  channel: Channel;
  lastInboundAt: Date | null;
  now?: Date;
  byHuman: boolean;
  template?: boolean;
}): SendPlan {
  const { channel, lastInboundAt, byHuman } = args;
  const now = (args.now ?? new Date()).getTime();
  if (channel === "test") return { allowed: true, messagingType: "RESPONSE" };
  if (args.template && channel === "whatsapp") return { allowed: true, messagingType: "RESPONSE" };
  if (!lastInboundAt) return { allowed: false, reason: "no_inbound_message_yet" };
  const age = now - lastInboundAt.getTime();
  if (age <= 24 * HOUR) return { allowed: true, messagingType: "RESPONSE" };
  if (channel === "whatsapp") {
    return { allowed: false, reason: "whatsapp_24h_window_closed_template_required" };
  }
  if (byHuman && humanAgentTagEnabled() && age <= 7 * 24 * HOUR) {
    return { allowed: true, messagingType: "MESSAGE_TAG", tag: "HUMAN_AGENT" };
  }
  return {
    allowed: false,
    reason: byHuman
      ? "window_closed_human_agent_tag_unavailable_or_over_7_days"
      : "window_closed_ai_cannot_message",
  };
}

export function windowState(channel: Channel, lastInboundAt: Date | null, now = new Date()) {
  if (channel === "test") return { open: true, expiresAt: null as Date | null };
  if (!lastInboundAt) return { open: false, expiresAt: null as Date | null };
  const expiresAt = new Date(lastInboundAt.getTime() + 24 * HOUR);
  return { open: expiresAt.getTime() > now.getTime(), expiresAt };
}
