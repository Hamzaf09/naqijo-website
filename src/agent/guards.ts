import { normalize } from "./text";
import type { KbItem } from "./knowledge";
import { allowedPrices } from "./knowledge";

/**
 * Deterministic post-generation checks. The model is instructed to follow the
 * same rules, but customer-facing money/commitment claims are enforced in code.
 * Each violation is a short machine-readable code fed back to the model for one
 * regeneration; if it persists the engine falls back to a human handoff.
 */

const CURRENCY_AFTER = /(\d+(?:[.,]\d+)?)\s*(?:jod|jd|دينار|د\.?\s?أ|د\.?\s?ا)/gi;
const CURRENCY_BEFORE = /(?:jod|jd|دينار)\s*[:=]?\s*(\d+(?:[.,]\d+)?)/gi;

export function pricesIn(text: string): number[] {
  const t = text.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
  const out: number[] = [];
  for (const m of t.matchAll(CURRENCY_AFTER)) out.push(Number(m[1].replace(",", ".")));
  for (const m of t.matchAll(CURRENCY_BEFORE)) out.push(Number(m[1].replace(",", ".")));
  return out;
}

/** Commitments that may only be made if the approved context says so. */
const COMMITMENT_TERMS: { code: string; reply: string[]; context: string[] }[] = [
  { code: "unapproved_free", reply: ["مجاني", "مجانا", "ببلاش", "بلاش", "free"], context: ["مجاني", "مجانا", "ببلاش", "free"] },
  { code: "unapproved_warranty", reply: ["ضمان", "كفاله", "warranty", "guarantee", "guaranteed"], context: ["ضمان", "كفاله", "warranty", "guarantee"] },
  { code: "unapproved_installments", reply: ["تقسيط", "اقساط", "installment", "installments"], context: ["تقسيط", "اقساط", "installment"] },
  { code: "unapproved_accessories", reply: ["ملحقات", "اكسسوارات", "accessories"], context: ["ملحقات", "اكسسوارات", "accessories"] },
];

/** Claims the model can never make itself: bookings/forwarding are facts only the system can create. */
const ACTION_CLAIM_TOKENS = [
  "حولت", "حولتك", "حولتها", "رفعت", "بلغت", "ابلغت", "سجلت", "ثبتت", "اكدت", "حجزت",
  "forwarded", "escalated", "booked", "scheduled", "confirmed",
];
const ACTION_CLAIM_PHRASES = [
  "تم تاكيد", "تم تثبيت", "تم حجز", "تم تحويل", "تم رفع", "تم تسجيل", "تم ارسال طلبك",
  "i have booked", "i've booked", "i have confirmed", "i've confirmed", "has been confirmed", "your appointment is confirmed",
];
const HUMAN_CLAIMS = ["انا انسان", "انا موظف", "انا موظفه", "i am a human", "i'm a human", "i am a real person", "i'm a real person"];
const AVAILABILITY_WORDS = ["متوفر", "متوفره", "موجود", "موجوده", "في المخزون", "in stock", "available", "we have it"];

export interface GuardInput {
  reply: string;
  context: KbItem[];
  /** True when the system itself will create+report a handoff (the engine appends the confirmation line). */
  expectsHandoff: boolean;
}

function containsAny(normalizedText: string, words: string[]): boolean {
  const padded = ` ${normalizedText} `;
  return words.some((w) => padded.includes(` ${normalize(w)} `));
}

export function checkReply({ reply, context }: GuardInput): string[] {
  const violations: string[] = [];
  const n = normalize(reply);

  // 1) prices must be exactly the approved ones
  const allowed = allowedPrices(context);
  for (const p of pricesIn(reply)) {
    if (!allowed.some((a) => Math.abs(a - p) < 0.001)) violations.push(`price_not_approved:${p}`);
  }

  // 2) commitments must appear in approved context
  const ctxN = normalize(
    context.map((i) => `${i.title.ar} ${i.title.en} ${i.content.ar} ${i.content.en} ${i.offer ? `${i.offer.warranty.ar} ${i.offer.warranty.en} ${i.offer.accessories.ar} ${i.offer.accessories.en} ${i.offer.installationNote.ar} ${i.offer.installationNote.en} ${i.offer.installmentsAllowed ? "installment تقسيط" : ""}` : ""}`).join(" "),
  );
  for (const term of COMMITMENT_TERMS) {
    if (containsAny(n, term.reply) && !containsAny(ctxN, term.context)) violations.push(term.code);
  }

  // 3) availability: only if something in context is confirmed available / an active offer
  const anyConfirmed = context.some((i) => i.availability === "available" && (i.kind === "offer" || i.category === "product"));
  if (containsAny(n, AVAILABILITY_WORDS) && !anyConfirmed) violations.push("availability_not_confirmed");

  // 4) the model must not claim operations it cannot perform
  const toks = new Set(n.split(" "));
  if (ACTION_CLAIM_TOKENS.some((t) => toks.has(normalize(t))) || ACTION_CLAIM_PHRASES.some((p) => n.includes(normalize(p)))) {
    violations.push("action_claim");
  }

  // 5) never claim to be human
  if (HUMAN_CLAIMS.some((p) => n.includes(normalize(p)))) violations.push("claims_human");

  if (!reply.trim()) violations.push("empty_reply");
  return violations;
}
