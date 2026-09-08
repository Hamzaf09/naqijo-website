import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getServerURL } from "@/lib/env";
import { getProductSlugs } from "@/data/products";
import { getServiceSlugs } from "@/data/services";
import { getProjectSlugs } from "@/data/projects";

const staticRoutes = [
  "",
  "/about",
  "/consultation",
  "/contact",
  "/faq",
  "/maintenance",
  "/privacy",
  "/products",
  "/projects",
  "/services",
  "/terms",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getServerURL();
  const now = new Date();

  // Slugs come from the CMS; fall back to empty lists so a build with an
  // unreachable/empty DB still produces a valid sitemap of the static routes.
  const [productSlugs, serviceSlugs, projectSlugs] = await Promise.all([
    getProductSlugs().catch(() => [] as string[]),
    getServiceSlugs().catch(() => [] as string[]),
    getProjectSlugs().catch(() => [] as string[]),
  ]);

  // Every canonical URL points at its ar/en language alternates (hreflang) so
  // search engines cluster the two locales instead of treating them as dupes.
  const paths = [
    ...staticRoutes,
    ...productSlugs.map((s) => `/products/${s}`),
    ...serviceSlugs.map((s) => `/services/${s}`),
    ...projectSlugs.map((s) => `/projects/${s}`),
  ];

  const urls: MetadataRoute.Sitemap = [];
  for (const path of paths) {
    const languages = {
      ar: `${base}/ar${path}`,
      en: `${base}/en${path}`,
    };
    for (const locale of routing.locales) {
      urls.push({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        alternates: { languages },
      });
    }
  }
  return urls;
}
