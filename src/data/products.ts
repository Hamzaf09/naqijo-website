import { getPayloadClient } from "@/lib/payload/client";
import type {
  AvailabilityKey,
  LocalizedString,
  Product,
  ProductCategory,
  ProductImage,
} from "./product-types";

/**
 * SERVER-ONLY product data access. Every public product surface (catalog,
 * detail, homepage featured, related, search, filters) reads through here, so
 * the entire frontend is CMS-driven — nothing about products is hardcoded.
 *
 * Docs are fetched with `locale: "all"`, so localized fields arrive as
 * `{ ar, en }` objects and the existing bilingual components work unchanged.
 */

const PUBLISHED = { _status: { equals: "published" } } as const;

type MaybeLocalized = Partial<Record<string, string>> | string | null | undefined;

/** Normalize a Payload localized value into a complete `{ ar, en }` pair. */
function L(value: MaybeLocalized): LocalizedString {
  if (value && typeof value === "object") {
    const ar = value.ar ?? value.en ?? "";
    const en = value.en ?? value.ar ?? "";
    return { ar, en };
  }
  const str = typeof value === "string" ? value : "";
  return { ar: str, en: str };
}

function mapImage(media: unknown): ProductImage | null {
  if (!media || typeof media !== "object") return null;
  const m = media as Record<string, unknown>;
  if (typeof m.url !== "string") return null;
  return {
    src: m.url,
    width: typeof m.width === "number" ? m.width : 1400,
    height: typeof m.height === "number" ? m.height : 1174,
    alt: L(m.alt as MaybeLocalized),
  };
}

function pickLocalizedRel(rel: unknown): LocalizedString | null {
  if (rel && typeof rel === "object" && "name" in rel) {
    return L((rel as Record<string, unknown>).name as MaybeLocalized);
  }
  return null;
}

function categoryKeyOf(rel: unknown): string {
  if (rel && typeof rel === "object" && "slug" in rel) {
    return String((rel as Record<string, unknown>).slug ?? "");
  }
  return "";
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapProduct(doc: any): Product {
  return {
    slug: String(doc.slug),
    categoryKey: categoryKeyOf(doc.category),
    categoryLabel: pickLocalizedRel(doc.category),
    subcategoryLabel: pickLocalizedRel(doc.subcategory),
    availability: (doc.availability as AvailabilityKey) || "available",
    name: L(doc.name),
    shortDescription: L(doc.shortDescription),
    fullDescription:
      doc.fullDescription && typeof doc.fullDescription === "object"
        ? { ar: (doc.fullDescription as any).ar, en: (doc.fullDescription as any).en }
        : null,
    image: mapImage(doc.mainImage) ?? {
      src: "",
      width: 1400,
      height: 1174,
      alt: { ar: "", en: "" },
    },
    gallery: Array.isArray(doc.gallery)
      ? doc.gallery.map(mapImage).filter((x: ProductImage | null): x is ProductImage => x !== null)
      : [],
    features: Array.isArray(doc.features)
      ? doc.features.map((f: any) => L(f.text)).filter((f: LocalizedString) => f.ar || f.en)
      : [],
    specs: Array.isArray(doc.specs)
      ? doc.specs.map((s: any) => ({
          label: L(s.label),
          value: L(s.value),
          unit: typeof s.unit === "string" ? s.unit : undefined,
        }))
      : [],
    included: Array.isArray(doc.included)
      ? doc.included.map((i: any) => L(i.item)).filter((i: LocalizedString) => i.ar || i.en)
      : [],
    downloads: Array.isArray(doc.downloads)
      ? doc.downloads
          .map((d: any) => ({ label: L(d.label), url: mapImage(d.file)?.src ?? "" }))
          .filter((d: { url: string }) => d.url)
      : [],
    faqs: Array.isArray(doc.faqs)
      ? doc.faqs.map((f: any) => ({ question: L(f.question), answer: L(f.answer) }))
      : [],
    seoTitle: doc.seo?.metaTitle ? L(doc.seo.metaTitle) : null,
    seoDescription: doc.seo?.metaDescription ? L(doc.seo.metaDescription) : null,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getProductCategories(): Promise<ProductCategory[]> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "categories",
    locale: "all",
    where: { and: [{ status: { equals: "published" } }, { parent: { exists: false } }] },
    sort: "order",
    limit: 100,
    depth: 0,
  });
  return (res.docs as unknown as Record<string, unknown>[]).map((c) => ({
    key: String(c.slug),
    label: L(c.name as MaybeLocalized),
  }));
}

export async function getAllProducts(): Promise<Product[]> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "products",
    locale: "all",
    where: PUBLISHED,
    sort: "order",
    limit: 200,
    depth: 2,
  });
  return res.docs.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "products",
    locale: "all",
    where: { and: [{ slug: { equals: slug } }, PUBLISHED] },
    limit: 1,
    depth: 2,
  });
  return res.docs[0] ? mapProduct(res.docs[0]) : null;
}

export async function getProductSlugs(): Promise<string[]> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "products",
      where: PUBLISHED,
      limit: 500,
      depth: 0,
      pagination: false,
    });
    return (res.docs as unknown as Record<string, unknown>[]).map((d) => String(d.slug));
  } catch {
    // Build-time resilience: fall back to on-demand rendering (dynamicParams).
    return [];
  }
}

/** Homepage-eligible pool (Show on homepage). Falls back to featured products. */
export async function getFeaturedProducts(): Promise<Product[]> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "products",
    locale: "all",
    where: { and: [{ showOnHomepage: { equals: true } }, PUBLISHED] },
    sort: "order",
    limit: 24,
    depth: 2,
  });
  if (res.docs.length > 0) return res.docs.map(mapProduct);

  const fallback = await payload.find({
    collection: "products",
    locale: "all",
    where: { and: [{ featured: { equals: true } }, PUBLISHED] },
    sort: "order",
    limit: 24,
    depth: 2,
  });
  return fallback.docs.map(mapProduct);
}

/**
 * Related products: manual selection if set on the product, otherwise up to
 * `count` other published products from the same category.
 */
export async function getRelatedProducts(slug: string, count = 4): Promise<Product[]> {
  const payload = await getPayloadClient();
  const base = await payload.find({
    collection: "products",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  const doc = base.docs[0] as unknown as Record<string, unknown> | undefined;
  if (!doc) return [];

  const relatedIds = Array.isArray(doc.relatedProducts)
    ? (doc.relatedProducts as unknown[]).map((r) =>
        typeof r === "object" && r ? (r as Record<string, unknown>).id : r,
      )
    : [];

  if (relatedIds.length > 0) {
    const res = await payload.find({
      collection: "products",
      locale: "all",
      where: { and: [{ id: { in: relatedIds } }, PUBLISHED] },
      limit: count,
      depth: 2,
    });
    if (res.docs.length > 0) return res.docs.map(mapProduct);
  }

  const categoryId =
    doc.category && typeof doc.category === "object"
      ? (doc.category as Record<string, unknown>).id
      : doc.category;

  const res = await payload.find({
    collection: "products",
    locale: "all",
    where: {
      and: [
        { category: { equals: categoryId } },
        { slug: { not_equals: slug } },
        PUBLISHED,
      ],
    },
    limit: count,
    depth: 2,
  });
  return res.docs.map(mapProduct);
}
