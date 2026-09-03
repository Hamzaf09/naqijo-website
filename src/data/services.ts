import type { LocalizedString, LocalizedRichText } from "@/data/product-types";
import type { MediaImage } from "@/lib/payload/map";
import { toRichText } from "@/lib/rich-text";
import { services as staticServices } from "@/content/services";
import { approvedImages, type ApprovedImageKey } from "@/config/images";

/**
 * Service data access — sourced ENTIRELY from the static content in
 * `src/content/services.ts` (committed to the repo). No Payload / Supabase /
 * database query is involved, so the service detail pages render even when the
 * database is unavailable (this is what previously caused the /services/* 500s).
 * Signatures are unchanged, so the listing, detail and sitemap pages work as-is.
 */

export interface ServiceFeature {
  title: LocalizedString;
  description: LocalizedString;
}

export interface Service {
  slug: string;
  order: number;
  icon: string | null;
  name: LocalizedString;
  headline: LocalizedString;
  shortDescription: LocalizedString;
  fullDescription: LocalizedRichText | null;
  heroImage: MediaImage | null;
  gallery: MediaImage[];
  features: ServiceFeature[];
  process: LocalizedString[];
}

/** Fixed display order (matches the previous CMS `order`). */
const SLUG_ORDER = ["water", "kitchen", "solar", "protection"] as const;

function resolveImage(key: ApprovedImageKey): MediaImage {
  const img = approvedImages[key];
  return { src: img.src, width: img.width, height: img.height, alt: img.alt };
}

/** Zip the locale-first static content into a field-localized Service. */
function buildService(slug: string): Service | null {
  const ar = staticServices.ar[slug];
  const en = staticServices.en[slug];
  if (!ar || !en) return null;

  return {
    slug,
    order: parseInt(ar.index, 10) || 0,
    icon: null,
    name: { ar: ar.eyebrow, en: en.eyebrow },
    headline: { ar: ar.title, en: en.title },
    shortDescription: { ar: ar.lead, en: en.lead },
    fullDescription: {
      ar: toRichText(ar.overview, "rtl"),
      en: toRichText(en.overview, "ltr"),
    },
    heroImage: resolveImage(ar.image),
    gallery: [],
    features: ar.features.map((f, i) => ({
      title: { ar: f.t, en: en.features[i]?.t ?? f.t },
      description: { ar: f.d, en: en.features[i]?.d ?? f.d },
    })),
    process: ar.process.map((p, i) => ({ ar: p, en: en.process[i] ?? p })),
  };
}

export async function getAllServices(): Promise<Service[]> {
  return SLUG_ORDER.map(buildService).filter((s): s is Service => s !== null);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return buildService(slug);
}

export async function getServiceSlugs(): Promise<string[]> {
  return [...SLUG_ORDER];
}
