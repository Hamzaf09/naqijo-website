import Anthropic from "@anthropic-ai/sdk";
import { aiSettings } from "../config";
import type { AiTurn } from "../types";
import { renderTurnPrompt, SYSTEM_PROMPT } from "./prompt";
import type { AiProvider, TurnInput } from "./provider";
import { parseTurn, turnJsonSchema } from "./schema";

export class AiRefusalError extends Error {}

/**
 * Claude via the official SDK, using structured outputs (`output_config.format`)
 * so the reply always parses. Forced tool choice is deliberately not used
 * (rejected by current models); adaptive thinking is left at its default.
 */
export class AnthropicProvider implements AiProvider {
  readonly name = "anthropic";
  private client: Anthropic;

  constructor(client?: Anthropic) {
    this.client = client ?? new Anthropic({ maxRetries: 2, timeout: 45_000 });
  }

  async generate(input: TurnInput): Promise<AiTurn> {
    const s = aiSettings();
    const messages: Anthropic.MessageParam[] = [];
    for (const h of input.history) {
      const last = messages[messages.length - 1];
      if (last && last.role === h.role) last.content = `${last.content as string}\n${h.content}`;
      else messages.push({ role: h.role, content: h.content });
    }
    while (messages.length && messages[0].role !== "user") messages.shift();
    // the latest customer text is the final user turn, together with this turn's context
    const turn = `${renderTurnPrompt(input)}\n\n<customer_message>\n${input.latest}\n</customer_message>`;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === "user") {
      // history already ends with the customer's message (it is stored before processing): replace it with the enriched turn
      messages[messages.length - 1] = { role: "user", content: turn };
    } else messages.push({ role: "user", content: turn });

    const res = await this.client.messages.create({
      model: s.model,
      max_tokens: s.maxTokens,
      system: SYSTEM_PROMPT,
      messages,
      output_config: { effort: s.effort, format: { type: "json_schema", schema: turnJsonSchema as never } },
    } as never);

    const msg = res as Anthropic.Message;
    if (msg.stop_reason === "refusal") throw new AiRefusalError("model refused");
    if (msg.stop_reason === "max_tokens") throw new Error("model output truncated");
    const text = msg.content.find((b): b is Anthropic.TextBlock => b.type === "text")?.text;
    if (!text) throw new Error("model returned no text");
    return parseTurn(text);
  }
}
