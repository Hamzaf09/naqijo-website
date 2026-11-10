/** Shared domain types for the NaqiJo AI customer-service & sales agent. */

export const CHANNELS = ["whatsapp", "messenger", "instagram", "test"] as const;
export type Channel = (typeof CHANNELS)[number];

/** Channels that go through Meta's official APIs (everything except the simulator). */
export type MetaChannel = Exclude<Channel, "test">;

export const INTENTS = [
  "greeting",
  "product_inquiry",
  "price_inquiry",
  "product_comparison",
  "maintenance_request",
  "installation_inquiry",
  "technical_support",
  "existing_order",
  "complaint",
  "purchase_intent",
  "human_request",
  "unsupported",
] as const;
export type Intent = (typeof INTENTS)[number];

export const HANDOFF_REASONS = [
  "complaint",
  "human_request",
  "technical_uncertain",
  "missing_info",
  "discount_request",
  "warranty_dispute",
  "appointment_confirmation",
  "high_intent_lead",
  "safety",
  "unsupported_service",
  "existing_order",
  "ai_failure",
] as const;
export type HandoffReason = (typeof HANDOFF_REASONS)[number];

/** Reasons that require a person: the AI stops replying until a human returns the chat. */
export const PAUSING_REASONS: ReadonlySet<HandoffReason> = new Set([
  "complaint",
  "human_request",
  "discount_request",
  "warranty_dispute",
  "safety",
  "ai_failure",
  "existing_order",
  "appointment_confirmation",
]);

export type Lang = "ar" | "en";

/** Normalized inbound message — identical shape for every channel. */
export interface NormalizedInbound {
  channel: Channel;
  /** Provider message id (wamid / mid). Used for duplicate prevention. */
  externalId: string;
  /** Customer id on the platform (wa_id / PSID / IGSID). */
  customerId: string;
  /** Our business account on that platform (phone_number_id / page id / ig id). */
  accountId: string;
  customerName?: string;
  text: string;
  /** "text" or the media kind when the message carried no usable text. */
  kind: "text" | "media" | "unsupported";
  timestamp: Date;
  raw: unknown;
}

/** Delivery-status update for a message we sent. */
export interface NormalizedStatus {
  channel: MetaChannel;
  externalId: string;
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: Date;
  error?: { code?: number | string; message: string };
}

export interface ParsedWebhook {
  messages: NormalizedInbound[];
  statuses: NormalizedStatus[];
  /** Events that were understood but intentionally not turned into messages (echoes, reactions...). */
  ignored: number;
}

/** Qualification data the agent collects progressively. Empty string = unknown. */
export interface Collected {
  product_interest: string;
  area: string;
  home_type: string;
  existing_system: string;
  problem: string;
  budget: string;
  name: string;
  phone: string;
  equipment_type: string;
  brand_model: string;
  preferred_time: string;
  address: string;
}

export const EMPTY_COLLECTED: Collected = {
  product_interest: "",
  area: "",
  home_type: "",
  existing_system: "",
  problem: "",
  budget: "",
  name: "",
  phone: "",
  equipment_type: "",
  brand_model: "",
  preferred_time: "",
  address: "",
};

/** Personal fields that may only be persisted to the customer profile with consent. */
export const PERSONAL_FIELDS = ["name", "phone", "address"] as const;

export interface AiTurn {
  reply: string;
  intent: Intent;
  language: Lang;
  handoff: { needed: boolean; reason: HandoffReason | "none" };
  consent: "none" | "granted" | "declined";
  collected: Collected;
  unanswered_question: string;
  sources_used: string[];
  appointment_requested: boolean;
}
