import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getServerURL } from "@/lib/env";
import { getProductSlugs } from "@/data/products";
import { getServiceSlugs } from "@/data/services";
import { getProjectSlugs } from "@/data/projects";
import { getAllGuides, getGuideSlugs } from "@/data/guides";
import { categoryContent } from "@/content/product-categories";

const staticRoutes = [
  "",
  "/about",
  "/commercial-water-treatment",
  "/consultation",
  "/contact",
  "/faq",
  "/guides",
  "/maintenance",
  "/privacy",
  "/products",
  "/projects",
  "/services",
  "/terms",
  "/water-filters-amman",
] as const;

/** Indexable product-category landing pages (static category taxonomy). */
const categoryRoutes = Object.keys(categoryContent).map(
  (key) => `/products/category/${key}`,
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getServerURL();

  // Slugs come from the CMS; fall back to empty lists so a build with an
  // unreachable/empty DB still produces a valid sitemap of the static routes.
  const [productSlugs, serviceSlugs, projectSlugs, guideSlugs, guides] = await Promise.all([
    getProductSlugs().catch(() => [] as string[]),
    getServiceSlugs().catch(() => [] as string[]),
    getProjectSlugs().catch(() => [] as string[]),
    getGuideSlugs().catch(() => [] as string[]),
    getAllGuides().catch(() => []),
  ]);

  // `lastmod` is only emitted where a truthful date exists (guides carry an
  // authored `dateModified`). Stamping every URL with the build time told
  // crawlers that all pages changed on every deploy, which devalues the signal.
  const guideLastMod = new Map(guides.map((g) => [`/guides/${g.slug}`, g.dateModified]));

  // Every canonical URL points at its ar/en language alternates (hreflang) so
  // search engines cluster the two locales instead of treating them as dupes.
  const paths = [
    ...staticRoutes,
    ...categoryRoutes,
    ...productSlugs.map((s) => `/products/${s}`),
    ...serviceSlugs.map((s) => `/services/${s}`),
    ...projectSlugs.map((s) => `/projects/${s}`),
    ...guideSlugs.map((s) => `/guides/${s}`),
  ];

  const urls: MetadataRoute.Sitemap = [];
  for (const path of paths) {
    const languages = {
      ar: `${base}/ar${path}`,
      en: `${base}/en${path}`,
      "x-default": `${base}/ar${path}`,
    };
    for (const locale of routing.locales) {
      urls.push({
        url: `${base}/${locale}${path}`,
        ...(guideLastMod.has(path) ? { lastModified: guideLastMod.get(path) } : {}),
        alternates: { languages },
      });
    }
  }
  return urls;
}
