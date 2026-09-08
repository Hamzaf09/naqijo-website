import type { Locale } from "@/i18n/routing";

/**
 * Internal terminology map: formal term ↔ English technical term ↔ common
 * Jordanian market spelling. Used to render a small, contextual "Also known as"
 * note on the pages a concept actually belongs to — improving entity/semantic
 * understanding for search and AI answer engines WITHOUT exposing a keyword
 * dictionary or stuffing synonyms into prose.
 *
 * Each `aka` list holds the alternative names a real user might search, in the
 * given locale, EXCLUDING the page's own H1 (which already states the primary
 * term). Keep entries to genuinely-used market variants only.
 */

export interface Term {
  id: string;
  /** Product category this concept maps to, when applicable. */
  categoryKey?: string;
  /** Alternative names users search, per locale (market + cross-language). */
  aka: Record<Locale, string[]>;
}

export const terminology: Record<string, Term> = {
  "reverse-osmosis": {
    id: "reverse-osmosis",
    categoryKey: "drinking-water",
    aka: {
      ar: ["التناضح العكسي", "فلتر RO", "فلتر آر أو", "جهاز آر أو", "فلتر 7 مراحل", "فلتر سبع مراحل", "تانك ليس"],
      en: ["Reverse Osmosis", "RO", "RO water purifier", "seven-stage filter", "tankless purifier"],
    },
  },
  "water-softener": {
    id: "water-softener",
    categoryKey: "water-softening",
    aka: {
      ar: ["سوفتنر", "ووتر سوفتنر", "جهاز تليين المياه", "معالجة عسر المياه", "معالجة الكلس"],
      en: ["Water Softener", "water softening system", "hard-water treatment"],
    },
  },
  "central-filtration": {
    id: "central-filtration",
    categoryKey: "central-filtration",
    aka: {
      ar: ["سنترال فلتر", "فلتر مياه مركزي", "نظام فلترة مركزي"],
      en: ["Central Filter", "central water filtration", "whole-home filter"],
    },
  },
  cartridge: {
    id: "cartridge",
    categoryKey: "filter-cartridges",
    aka: {
      ar: ["كارتردج", "كرتج", "شمعة فلتر", "شمعات الفلتر"],
      en: ["Filter Cartridge", "replacement cartridge"],
    },
  },
  "booster-pump": {
    id: "booster-pump",
    categoryKey: "water-pumps",
    aka: {
      ar: ["بمب", "بمب ضغط", "مضخة تعزيز", "مضخة تقوية الضغط"],
      en: ["Booster Pump", "pressure pump"],
    },
  },
};

/** Find the terminology entry mapped to a product category, if any. */
export function termForCategory(categoryKey: string): Term | undefined {
  return Object.values(terminology).find((t) => t.categoryKey === categoryKey);
}
