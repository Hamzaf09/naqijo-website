/**
 * Client-safe product types + label maps shared by the public product surfaces.
 * Contains NO server code, so client components may import from here freely.
 * The actual data is fetched from Payload in `./products` (server only).
 */

export type Locale = "ar" | "en";
export type LocalizedString = Record<Locale, string>;

export type AvailabilityKey = "available" | "on-order" | "out-of-stock";

export interface ProductImage {
  src: string;
  width: number;
  height: number;
  alt: LocalizedString;
}

export interface ProductSpec {
  label: LocalizedString;
  value: LocalizedString;
  unit?: string;
}

export interface ProductDownload {
  label: LocalizedString;
  url: string;
}

export interface ProductFaq {
  question: LocalizedString;
  answer: LocalizedString;
}

/** Lexical rich-text state per locale (rendered with Payload's <RichText />). */
export type LocalizedRichText = Record<Locale, unknown>;

export interface Product {
  slug: string;
  categoryKey: string;
  categoryLabel: LocalizedString | null;
  subcategoryLabel: LocalizedString | null;
  availability: AvailabilityKey;
  name: LocalizedString;
  shortDescription: LocalizedString;
  fullDescription: LocalizedRichText | null;
  image: ProductImage;
  gallery: ProductImage[];
  features: LocalizedString[];
  specs: ProductSpec[];
  included: LocalizedString[];
  downloads: ProductDownload[];
  faqs: ProductFaq[];
  seoTitle: LocalizedString | null;
  seoDescription: LocalizedString | null;
}

export interface ProductCategory {
  key: string;
  label: LocalizedString;
}

export const availabilityLabels: Record<AvailabilityKey, LocalizedString> = {
  available: { ar: "متوفر", en: "Available" },
  "on-order": { ar: "حسب الطلب", en: "On order" },
  "out-of-stock": { ar: "غير متوفر", en: "Out of stock" },
};
