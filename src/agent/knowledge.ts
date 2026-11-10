import type { Payload } from "payload";
import { tokens } from "./text";
import type { Intent, Lang } from "./types";

/** An approved (published) fact the assistant may use. */
export interface KbItem {
  id: string;
  kind: "kb" | "offer";
  category: string;
  title: { ar: string; en: string };
  content: { ar: string; en: string };
  keywords: string;
  availability: "n/a" | "unconfirmed" | "available" | "unavailable";
  alwaysInclude: boolean;
  /** Offer-only structured data */
  offer?: OfferData;
}

export interface OfferData {
  key: string;
  priceJOD: number;
  installationIncluded: "yes" | "no" | "unknown";
  scope: { ar: string; en: string };
  installationNote: { ar: string; en: string };
  warranty: { ar: string; en: string };
  accessories: { ar: string; en: string };
  installmentsAllowed: boolean;
}

type Loc = Record<string, string | null | undefined> | string | null | undefined;
const loc = (v: Loc): { ar: string; en: string } => {
  if (typeof v === "string") return { ar: v, en: v };
  return { ar: (v?.ar ?? v?.en ?? "") as string, en: (v?.en ?? v?.ar ?? "") as string };
};
export const pick = (v: { ar: string; en: string }, lang: Lang): string => (lang === "en" ? v.en || v.ar : v.ar || v.en);

/** Loads ONLY admin-approved content: published knowledge entries + active, in-date, published offers. */
export async function loadApproved(payload: Payload, now = new Date()): Promise<KbItem[]> {
  const [kb, offers] = await Promise.all([
    payload.find({
      collection: "knowledge-entries",
      where: { _status: { equals: "published" } },
      locale: "all",
      limit: 500,
      depth: 0,
      overrideAccess: true,
      pagination: false,
    }),
    payload.find({
      collection: "offers",
      where: { and: [{ _status: { equals: "published" } }, { state: { equals: "active" } }] },
      locale: "all",
      limit: 100,
      depth: 0,
      overrideAccess: true,
      pagination: false,
    }),
  ]);

  const items: KbItem[] = kb.docs.map((d) => ({
    id: `kb:${d.id}`,
    kind: "kb",
    category: d.category,
    title: loc(d.title as Loc),
    content: loc(d.content as Loc),
    keywords: Object.values((d.keywords as unknown as Record<string, string>) ?? {}).join(" "),
    availability: (d.availability ?? "n/a") as KbItem["availability"],
    alwaysInclude: Boolean(d.alwaysInclude),
  }));

  for (const o of offers.docs) {
    if (o.startsAt && new Date(o.startsAt) > now) continue;
    if (o.endsAt && new Date(o.endsAt) < now) continue;
    const scope = loc(o.scope as Loc);
    const install = loc(o.installationNote as Loc);
    items.push({
      id: `offer:${o.key}`,
      kind: "offer",
      category: "price",
      title: loc(o.title as Loc),
      content: scope,
      keywords: "",
      availability: "available",
      alwaysInclude: false,
      offer: {
        key: o.key,
        priceJOD: o.priceJOD,
        installationIncluded: (o.installationIncluded ?? "unknown") as OfferData["installationIncluded"],
        scope,
        installationNote: install,
        warranty: loc(o.warrantyText as Loc),
        accessories: loc(o.accessoriesText as Loc),
        installmentsAllowed: Boolean(o.installmentsAllowed),
      },
    });
  }
  return items;
}

const INTENT_CATEGORIES: Partial<Record<Intent, string[]>> = {
  price_inquiry: ["price", "product"],
  product_inquiry: ["product", "faq"],
  product_comparison: ["product"],
  maintenance_request: ["maintenance", "booking", "coverage"],
  installation_inquiry: ["installation", "coverage"],
  technical_support: ["maintenance", "faq"],
  existing_order: ["booking", "escalation"],
  purchase_intent: ["booking", "price", "coverage"],
  complaint: ["escalation", "warranty"],
};

export interface Scored {
  item: KbItem;
  score: number;
}

/**
 * Lexical retrieval over approved content. Deliberately deterministic and
 * explainable (no embeddings): token overlap with title/keywords/content,
 * boosted for categories relevant to the detected intent.
 */
export function retrieve(items: KbItem[], query: string, intent: Intent, k = 6): Scored[] {
  const q = new Set(tokens(query));
  const boostCats = new Set(INTENT_CATEGORIES[intent] ?? []);
  const scored: Scored[] = [];
  for (const item of items) {
    const title = new Set(tokens(`${item.title.ar} ${item.title.en} ${item.keywords}`));
    const body = new Set(tokens(`${item.content.ar} ${item.content.en}`));
    let score = 0;
    for (const t of q) {
      if (title.has(t)) score += 3;
      else if (body.has(t)) score += 1;
    }
    if (score === 0 && !(item.offer && intent === "price_inquiry")) continue;
    if (boostCats.has(item.category)) score += 1.5;
    if (item.offer && (intent === "price_inquiry" || intent === "purchase_intent")) score += 1;
    scored.push({ item, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

/** Final context set: always-include entries + top retrieved + active offers relevant to the topic. */
export function buildContext(items: KbItem[], query: string, intent: Intent): KbItem[] {
  const picked = new Map<string, KbItem>();
  for (const i of items) if (i.alwaysInclude) picked.set(i.id, i);
  for (const s of retrieve(items, query, intent)) picked.set(s.item.id, s.item);
  return [...picked.values()];
}

/** Renders context for the model. Unconfirmed availability is spelled out so it can't be assumed. */
export function renderContext(items: KbItem[], lang: Lang): string {
  if (!items.length) return "(no approved information matched this message)";
  return items
    .map((i) => {
      const lines = [`[${i.id}] (${i.category}) ${pick(i.title, lang)}`];
      if (i.kind === "kb") {
        lines.push(pick(i.content, lang));
        if (i.availability === "unconfirmed") {
          lines.push("AVAILABILITY: NOT CONFIRMED by the company — never state this is available or in stock; offer to have the team confirm.");
        } else if (i.availability === "unavailable") lines.push("AVAILABILITY: NOT available.");
      } else if (i.offer) {
        const o = i.offer;
        lines.push(`ACTIVE OFFER — advertised price: ${o.priceJOD} JOD (exact, do not change).`);
        lines.push(
          o.installationIncluded === "no"
            ? "Installation: NOT included in this offer."
            : o.installationIncluded === "yes"
              ? "Installation: included."
              : "Installation: not confirmed (do not say whether it is included).",
        );
        const scope = pick(o.scope, lang);
        lines.push(scope ? `Approved scope: ${scope}` : "Approved scope: NOT PROVIDED — if asked what is included, say you will check with the team (mark unanswered).");
        const inst = pick(o.installationNote, lang);
        if (inst) lines.push(`Installation terms: ${inst}`);
        const w = pick(o.warranty, lang);
        lines.push(w ? `Warranty: ${w}` : "Warranty: none approved — do not mention any warranty.");
        const a = pick(o.accessories, lang);
        lines.push(a ? `Accessories: ${a}` : "Accessories: none approved — do not promise any.");
        lines.push(o.installmentsAllowed ? "Installments: allowed." : "Installments: not offered — do not mention.");
      }
      return lines.join("\n");
    })
    .join("\n\n");
}

/** Every price (JOD) the assistant is allowed to quote right now. */
export function allowedPrices(items: KbItem[]): number[] {
  const set = new Set<number>();
  for (const i of items) {
    if (i.offer) set.add(i.offer.priceJOD);
    // numbers explicitly written next to a currency in approved text
    const text = `${i.content.ar} ${i.content.en}`;
    for (const m of text.matchAll(/(\d+(?:[.,]\d+)?)\s*(?:jod|jd|دينار|د\.?\s?أ)/gi)) set.add(Number(m[1].replace(",", ".")));
    for (const m of text.matchAll(/(?:jod|jd|دينار)\s*(\d+(?:[.,]\d+)?)/gi)) set.add(Number(m[1].replace(",", ".")));
  }
  return [...set];
}
