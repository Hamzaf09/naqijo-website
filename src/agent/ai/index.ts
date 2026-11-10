import { aiSettings } from "../config";
import { AnthropicProvider } from "./anthropic";
import type { AiProvider } from "./provider";
import { RulesProvider } from "./rules";

let override: AiProvider | null = null;
/** Test seam. */
export function setProvider(p: AiProvider | null): void {
  override = p;
}

/** Configured provider: Claude when AI_PROVIDER=anthropic (and a key exists), otherwise the offline rules provider. */
export function getProvider(): AiProvider {
  if (override) return override;
  const s = aiSettings();
  if (s.provider === "anthropic" && (process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN)) {
    return new AnthropicProvider();
  }
  return new RulesProvider();
}
export type { AiProvider } from "./provider";
