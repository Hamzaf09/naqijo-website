import { getPayloadClient } from "@/lib/payload/client";
import { L, mapMedia, type MediaImage } from "@/lib/payload/map";
import type { LocalizedString, LocalizedRichText } from "@/data/product-types";

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

const PUBLISHED = { _status: { equals: "published" } } as const;

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapService(doc: any): Service {
  return {
    slug: String(doc.slug),
    order: typeof doc.order === "number" ? doc.order : 0,
    icon: typeof doc.icon === "string" ? doc.icon : null,
    name: L(doc.name),
    headline: L(doc.headline),
    shortDescription: L(doc.shortDescription),
    fullDescription:
      doc.fullDescription && typeof doc.fullDescription === "object"
        ? { ar: doc.fullDescription.ar, en: doc.fullDescription.en }
        : null,
    heroImage: mapMedia(doc.heroImage),
    gallery: Array.isArray(doc.gallery)
      ? doc.gallery.map(mapMedia).filter((x: MediaImage | null): x is MediaImage => x !== null)
      : [],
    features: Array.isArray(doc.features)
      ? doc.features.map((f: any) => ({ title: L(f.title), description: L(f.description) }))
      : [],
    process: Array.isArray(doc.process)
      ? doc.process.map((p: any) => L(p.step)).filter((s: LocalizedString) => s.ar || s.en)
      : [],
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getAllServices(): Promise<Service[]> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "services",
    locale: "all",
    where: PUBLISHED,
    sort: "order",
    limit: 100,
    depth: 2,
  });
  return res.docs.map(mapService);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "services",
    locale: "all",
    where: { and: [{ slug: { equals: slug } }, PUBLISHED] },
    limit: 1,
    depth: 2,
  });
  return res.docs[0] ? mapService(res.docs[0]) : null;
}

export async function getServiceSlugs(): Promise<string[]> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "services",
      where: PUBLISHED,
      limit: 200,
      depth: 0,
      pagination: false,
    });
    return (res.docs as unknown as Record<string, unknown>[]).map((d) => String(d.slug));
  } catch {
    return [];
  }
}
