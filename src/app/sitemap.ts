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

  const urls: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const route of staticRoutes) {
      urls.push({ url: `${base}/${locale}${route}`, lastModified: now });
    }
    for (const slug of productSlugs) {
      urls.push({ url: `${base}/${locale}/products/${slug}`, lastModified: now });
    }
    for (const slug of serviceSlugs) {
      urls.push({ url: `${base}/${locale}/services/${slug}`, lastModified: now });
    }
    for (const slug of projectSlugs) {
      urls.push({ url: `${base}/${locale}/projects/${slug}`, lastModified: now });
    }
  }
  return urls;
}
