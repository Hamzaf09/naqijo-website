import { z } from "zod";
import { HANDOFF_REASONS, INTENTS, type AiTurn } from "../types";

const str = z.string().default("");

export const turnSchema = z.object({
  reply: z.string(),
  intent: z.enum(INTENTS),
  language: z.enum(["ar", "en"]),
  handoff: z.object({
    needed: z.boolean(),
    reason: z.enum([...HANDOFF_REASONS, "none"]),
  }),
  consent: z.enum(["none", "granted", "declined"]).default("none"),
  collected: z.object({
    product_interest: str,
    area: str,
    home_type: str,
    existing_system: str,
    problem: str,
    budget: str,
    name: str,
    phone: str,
    equipment_type: str,
    brand_model: str,
    preferred_time: str,
    address: str,
  }),
  unanswered_question: str,
  sources_used: z.array(z.string()).default([]),
  appointment_requested: z.boolean().default(false),
});

const S = { type: "string" } as const;

/** JSON Schema sent to the API as `output_config.format` (strict-compatible: all fields required). */
export const turnJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["reply", "intent", "language", "handoff", "consent", "collected", "unanswered_question", "sources_used", "appointment_requested"],
  properties: {
    reply: S,
    intent: { type: "string", enum: [...INTENTS] },
    language: { type: "string", enum: ["ar", "en"] },
    handoff: {
      type: "object",
      additionalProperties: false,
      required: ["needed", "reason"],
      properties: { needed: { type: "boolean" }, reason: { type: "string", enum: [...HANDOFF_REASONS, "none"] } },
    },
    consent: { type: "string", enum: ["none", "granted", "declined"] },
    collected: {
      type: "object",
      additionalProperties: false,
      required: ["product_interest", "area", "home_type", "existing_system", "problem", "budget", "name", "phone", "equipment_type", "brand_model", "preferred_time", "address"],
      properties: Object.fromEntries(
        ["product_interest", "area", "home_type", "existing_system", "problem", "budget", "name", "phone", "equipment_type", "brand_model", "preferred_time", "address"].map((k) => [k, S]),
      ),
    },
    unanswered_question: S,
    sources_used: { type: "array", items: S },
    appointment_requested: { type: "boolean" },
  },
} as const;

export function parseTurn(raw: string): AiTurn {
  const json = JSON.parse(raw.trim().replace(/^```(?:json)?|```$/g, ""));
  return turnSchema.parse(json) as AiTurn;
}
