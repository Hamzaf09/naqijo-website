import type { Lang } from "./types";

const DIACRITICS = /[ً-ٰٟـ]/g;

/**
 * Normalizes Arabic/English text for keyword matching: strips tashkeel and
 * tatweel, unifies alef/ya/ta-marbuta variants, maps Arabic-Indic digits to
 * Western digits, lowercases Latin and collapses whitespace/punctuation.
 */
export function normalize(input: string): string {
  return input
    .replace(DIACRITICS, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s.+]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Irregular (broken) plurals that matter for the catalogue. */
const IRREGULAR: Record<string, string> = { فلاتر: "فلتر", شمعات: "شمعه", شمعه: "شمعه", مضخات: "مضخه", برادات: "برادة", ملينات: "مليّن" };

/** Strips common Arabic clitic prefixes so "الفلاتر" ≈ "فلاتر" ≈ "للفلتر". */
export function stem(token: string): string {
  let t = token;
  if (t.length > 4 && /^(وال|بال|لل|فال|كال)/.test(t)) t = t.replace(/^(وال|بال|لل|فال|كال)/, "");
  else if (t.length > 3 && t.startsWith("ال")) t = t.slice(2);
  // plural / dual endings
  if (t.length > 4 && /(ات|ون|ين)$/.test(t)) t = t.slice(0, -2);
  return IRREGULAR[t] ?? t;
}

export function tokens(input: string): string[] {
  return normalize(input)
    .split(" ")
    .filter((t) => t.length > 1)
    .map(stem);
}

export function detectLang(text: string): Lang {
  const arabic = (text.match(/[؀-ۿ]/g) ?? []).length;
  const latin = (text.match(/[A-Za-z]/g) ?? []).length;
  return arabic >= latin ? "ar" : "en";
}

/** True when any phrase occurs in the (already normalized) text on word boundaries. */
export function hasAny(normalized: string, phrases: readonly string[]): boolean {
  const padded = ` ${stripArticles(normalized)} `;
  return phrases.some((p) => padded.includes(` ${stripArticles(normalize(p))} `));
}

/** Drops "ال"/"وال"/"بال"/"لل" prefixes per word so "الضمان" matches the phrase "ضمان". */
function stripArticles(n: string): string {
  return n
    .split(" ")
    .map((w) => (w.length > 4 && /^(وال|بال|فال|كال)/.test(w) ? w.slice(3) : w.length > 3 && w.startsWith("ال") ? w.slice(2) : w.length > 4 && w.startsWith("لل") ? w.slice(2) : w))
    .join(" ");
}
