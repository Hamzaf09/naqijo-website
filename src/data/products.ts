import { toRichText } from "@/lib/rich-text";
import type { Product, ProductCategory } from "./product-types";
import {
  getAllProducts as staticGetAll,
  getProductBySlug as staticGetBySlug,
  getFeaturedProducts as staticGetFeatured,
  getRelatedProducts as staticGetRelated,
  productSlugs as staticSlugs,
  productCategories as staticCategories,
  getCategoryLabel,
  type Product as StaticProduct,
} from "./products.static";

/**
 * Product data access — sourced ENTIRELY from the static catalog in
 * `products.static.ts` (committed to the repo). No Payload / Supabase / database
 * query is involved, so product pages render even when the database is
 * unavailable. The async signatures below are unchanged, so every caller
 * (catalog, detail, homepage featured, related, sitemap) works as before.
 *
 * To add or edit a product: edit `products.static.ts` and drop its image in
 * `public/images/products/`. That's the single source of truth.
 */

/** Adapt a static product to the shared `Product` shape the pages consume. */
function toProduct(p: StaticProduct): Product {
  return {
    slug: p.slug,
    categoryKey: p.categoryKey,
    categoryLabel: getCategoryLabel(p.categoryKey) ?? null,
    subcategoryLabel: null,
    availability: p.availability,
    name: p.name,
    shortDescription: p.shortDescription,
    // Plain static text → Lexical state so the existing <RichText /> renders it.
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
    seoTitle: null,
    seoDescription: null,
  };
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  return staticCategories.map((c) => ({ key: c.key, label: c.label }));
}

export async function getAllProducts(): Promise<Product[]> {
  return staticGetAll().map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const p = staticGetBySlug(slug);
  return p ? toProduct(p) : null;
}

export async function getProductSlugs(): Promise<string[]> {
  return [...staticSlugs];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return staticGetFeatured(4).map(toProduct);
}

export async function getRelatedProducts(slug: string, count = 4): Promise<Product[]> {
  return staticGetRelated(slug, count).map(toProduct);
}
