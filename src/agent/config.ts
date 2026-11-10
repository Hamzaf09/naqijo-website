import type { MetaChannel } from "./types";

/**
 * Environment-driven configuration. Read lazily (never at import time) so tests
 * and serverless cold starts see the current environment. Secrets live ONLY in
 * the environment / host secret manager — never in the database or the repo.
 *
 * The tenant id is a seam for future multi-business support; in this release
 * NaqiJo is the only active tenant.
 */
export const TENANT_ID = "naqijo";

const env = (k: string): string => (process.env[k] ?? "").trim();

export interface ChannelCredentials {
  /** Business-side id: phone_number_id | page id | instagram account id */
  accountId: string;
  accessToken: string;
  verifyToken: string;
  appSecret: string;
  /** WhatsApp only */
  businessAccountId?: string;
}

export function graphVersion(): string {
  return env("META_GRAPH_VERSION") || "v26.0";
}

export function graphHost(channel: MetaChannel): string {
  if (channel === "instagram" && instagramMode() === "instagram_login") {
    return env("INSTAGRAM_GRAPH_HOST") || "https://graph.instagram.com";
  }
  return env("META_GRAPH_HOST") || "https://graph.facebook.com";
}

/** instagram_login → Instagram API with Instagram Login; facebook_login → via the linked Page. */
export function instagramMode(): "instagram_login" | "facebook_login" {
  return env("INSTAGRAM_API_MODE") === "facebook_login" ? "facebook_login" : "instagram_login";
}

export function credentials(channel: MetaChannel): ChannelCredentials {
  const shared = env("META_APP_SECRET");
  switch (channel) {
    case "whatsapp":
      return {
        accountId: env("WHATSAPP_PHONE_NUMBER_ID"),
        accessToken: env("WHATSAPP_ACCESS_TOKEN"),
        verifyToken: env("WHATSAPP_VERIFY_TOKEN"),
        appSecret: env("WHATSAPP_APP_SECRET") || shared,
        businessAccountId: env("WHATSAPP_BUSINESS_ACCOUNT_ID"),
      };
    case "messenger":
      return {
        accountId: env("MESSENGER_PAGE_ID"),
        accessToken: env("MESSENGER_PAGE_ACCESS_TOKEN"),
        verifyToken: env("MESSENGER_VERIFY_TOKEN"),
        appSecret: env("MESSENGER_APP_SECRET") || shared,
      };
    case "instagram":
      return {
        accountId: env("INSTAGRAM_ACCOUNT_ID"),
        accessToken: env("INSTAGRAM_ACCESS_TOKEN"),
        verifyToken: env("INSTAGRAM_VERIFY_TOKEN"),
        appSecret: env("INSTAGRAM_APP_SECRET") || shared,
      };
  }
}

/** Which required settings are missing for a channel (names only, never values). */
export function missingConfig(channel: MetaChannel): string[] {
  const c = credentials(channel);
  const names: Record<MetaChannel, [keyof ChannelCredentials, string][]> = {
    whatsapp: [
      ["accountId", "WHATSAPP_PHONE_NUMBER_ID"],
      ["accessToken", "WHATSAPP_ACCESS_TOKEN"],
      ["verifyToken", "WHATSAPP_VERIFY_TOKEN"],
      ["appSecret", "WHATSAPP_APP_SECRET or META_APP_SECRET"],
    ],
    messenger: [
      ["accountId", "MESSENGER_PAGE_ID"],
      ["accessToken", "MESSENGER_PAGE_ACCESS_TOKEN"],
      ["verifyToken", "MESSENGER_VERIFY_TOKEN"],
      ["appSecret", "MESSENGER_APP_SECRET or META_APP_SECRET"],
    ],
    instagram: [
      ["accountId", "INSTAGRAM_ACCOUNT_ID"],
      ["accessToken", "INSTAGRAM_ACCESS_TOKEN"],
      ["verifyToken", "INSTAGRAM_VERIFY_TOKEN"],
      ["appSecret", "INSTAGRAM_APP_SECRET or META_APP_SECRET"],
    ],
  };
  return names[channel].filter(([k]) => !c[k]).map(([, label]) => label);
}

export function humanAgentTagEnabled(): boolean {
  return env("META_HUMAN_AGENT_TAG_ENABLED") === "true";
}

export function aiSettings() {
  const provider = (env("AI_PROVIDER") || (env("ANTHROPIC_API_KEY") ? "anthropic" : "rules")) as
    | "anthropic"
    | "rules";
  return {
    provider,
    model: env("AI_MODEL") || "claude-opus-5-5",
    effort: (env("AI_EFFORT") || "low") as "low" | "medium" | "high",
    maxTokens: Number(env("AI_MAX_TOKENS")) || 1500,
    historyLimit: Number(env("AI_HISTORY_LIMIT")) || 16,
    /** Hard cap of AI replies per conversation per minute (loop / abuse guard). */
    maxRepliesPerMinute: Number(env("AI_MAX_REPLIES_PER_MINUTE")) || 6,
  };
}

export function notifySettings() {
  return {
    emails: env("HANDOFF_NOTIFY_EMAILS")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    webhookUrl: env("HANDOFF_WEBHOOK_URL"),
    webhookSecret: env("HANDOFF_WEBHOOK_SECRET"),
    inboxUrl: (env("NEXT_PUBLIC_SERVER_URL") || "http://localhost:3000").replace(/\/+$/, "") + "/inbox",
  };
}

/** Vercel Cron sends `Authorization: Bearer $CRON_SECRET`; AGENT_CRON_SECRET works for any other scheduler. */
export const cronSecret = (): string => env("AGENT_CRON_SECRET") || env("CRON_SECRET");
export const simulatorEnabled = (): boolean =>
  process.env.NODE_ENV !== "production" || env("AGENT_SIMULATOR_ENABLED") === "true";
