import { cache } from "react";
import { toRichText } from "@/lib/rich-text";
import { getPayloadClient } from "@/lib/payload/client";
import type {
  AvailabilityKey,
  LocalizedString,
  Product,
  ProductCategory,
  ProductImage,
  ProductPrice,
} from "./product-types";
import {
  getAllProducts as staticGetAll,
  getProductBySlug as staticGetBySlug,
  getProductsByCategory as staticGetByCategory,
  getFeaturedProducts as staticGetFeatured,
  getRelatedProducts as staticGetRelated,
  productSlugs as staticSlugs,
  productCategories as staticCategories,
  getCategoryLabel,
  type Product as StaticProduct,
} from "./products.static";

/**
 * Product data access.
 *
 * SOURCE OF TRUTH = the Payload CMS (Supabase). Everything added or edited in
 * /admin appears on the public site.
 *
 * SAFETY NET = the committed static catalog (`products.static.ts`). It is used
 * ONLY when the CMS cannot be read or has no published products at all, so the
 * site never goes blank if the database is unreachable. As soon as the CMS has
 * at least one published product it is authoritative (unpublishing/deleting a
 * product in the admin removes it from the site — the static copy never
 * resurrects it).
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

function mapPrice(raw: unknown): ProductPrice | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;
  if (typeof p.amount !== "number" || !Number.isFinite(p.amount) || p.amount <= 0) return null;
  return {
    amount: p.amount,
    currency: p.currency === "USD" ? "USD" : "JOD",
    startingFrom: p.startingFrom === true,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapProduct(doc: any): Product {
  return {
    slug: String(doc.slug),
    price: mapPrice(doc.pricing),
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

/** Adapt a static product to the shared `Product` shape (fallback path). */
function toProduct(p: StaticProduct): Product {
  return {
    slug: p.slug,
    price: null,
    categoryKey: p.categoryKey,
    categoryLabel: getCategoryLabel(p.categoryKey) ?? null,
    subcategoryLabel: null,
    availability: p.availability,
    name: p.name,
    shortDescription: p.shortDescription,
    fullDescription: {
      ar: toRichText(p.fullDescription.ar, "rtl"),
      en: toRichText(p.fullDescription.en, "ltr"),
    },
    image: p.image,
    gallery: p.gallery,
    features: p.features,
    specs: p.specs,
    included: [],
    downloads: [],
    faqs: [],
    seoTitle: p.seoTitle ?? null,
    seoDescription: p.seoDescription ?? null,
  };
}

/**
 * True when the CMS is reachable AND has ≥1 published product. Cached per
 * request so the many data calls on one page share a single check.
 */
const cmsHasProducts = cache(async (): Promise<boolean> => {
  try {
    const payload = await getPayloadClient();
    const res = await payload.count({ collection: "products", where: PUBLISHED });
    return res.totalDocs > 0;
  } catch (err) {
    console.error("[products] CMS unavailable — using static catalog fallback.", err);
    return false;
  }
});

export async function getProductCategories(): Promise<ProductCategory[]> {
  if (await cmsHasProducts()) {
    try {
      const payload = await getPayloadClient();
      const res = await payload.find({
        collection: "categories",
        locale: "all",
        where: { and: [{ status: { equals: "published" } }, { parent: { exists: false } }] },
        sort: "order",
        limit: 100,
        depth: 0,
      });
      if (res.docs.length > 0) {
        return (res.docs as unknown as Record<string, unknown>[]).map((c) => ({
          key: String(c.slug),
          label: L(c.name as MaybeLocalized),
        }));
      }
    } catch (err) {
      console.error("[products] categories read failed — static fallback.", err);
    }
  }
  return staticCategories.map((c) => ({ key: c.key, label: c.label }));
}

export async function getAllProducts(): Promise<Product[]> {
  if (await cmsHasProducts()) {
    try {
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
    } catch (err) {
      console.error("[products] list read failed — static fallback.", err);
    }
  }
  return staticGetAll().map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (await cmsHasProducts()) {
    try {
      const payload = await getPayloadClient();
      const res = await payload.find({
        collection: "products",
        locale: "all",
        where: { and: [{ slug: { equals: slug } }, PUBLISHED] },
        limit: 1,
        depth: 2,
      });
      return res.docs[0] ? mapProduct(res.docs[0]) : null;
    } catch (err) {
      console.error("[products] detail read failed — static fallback.", err);
    }
  }
  const p = staticGetBySlug(slug);
  return p ? toProduct(p) : null;
}

export async function getProductsByCategory(categoryKey: string): Promise<Product[]> {
  if (await cmsHasProducts()) {
    const all = await getAllProducts();
    return all.filter((p) => p.categoryKey === categoryKey);
  }
  return staticGetByCategory(categoryKey).map(toProduct);
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
    const slugs = (res.docs as unknown as Record<string, unknown>[]).map((d) => String(d.slug));
    if (slugs.length > 0) return slugs;
  } catch {
    // Build-time resilience: fall through to the static slugs.
  }
  return [...staticSlugs];
}

/** Homepage-eligible pool (Show on homepage). Falls back to featured products. */
export async function getFeaturedProducts(): Promise<Product[]> {
  if (await cmsHasProducts()) {
    try {
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
    } catch (err) {
      console.error("[products] featured read failed — static fallback.", err);
    }
  }
  return staticGetFeatured(4).map(toProduct);
}

/**
 * Related products: manual selection if set on the product, otherwise up to
 * `count` other published products from the same category.
 */
export async function getRelatedProducts(slug: string, count = 4): Promise<Product[]> {
  if (await cmsHasProducts()) {
    try {
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
          where: { and: [{ id: { in: relatedIds as (string | number)[] } }, PUBLISHED] },
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
            { category: { equals: categoryId as string | number } },
            { slug: { not_equals: slug } },
            PUBLISHED,
          ],
        },
        limit: count,
        depth: 2,
      });
      return res.docs.map(mapProduct);
    } catch (err) {
      console.error("[products] related read failed — static fallback.", err);
    }
  }
  return staticGetRelated(slug, count).map(toProduct);
}
