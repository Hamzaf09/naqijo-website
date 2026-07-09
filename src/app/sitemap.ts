import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { projectSlugs } from "@/content/projects";
import { serviceSlugs } from "@/content/services";

const staticRoutes = [
  "",
  "/about",
  "/consultation",
  "/contact",
  "/faq",
  "/maintenance",
  "/privacy",
  "/projects",
  "/services",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const route of staticRoutes) {
      urls.push({
        url: `${siteConfig.url}/${locale}${route}`,
        lastModified: new Date(),
      });
    }

    for (const slug of projectSlugs) {
      urls.push({
        url: `${siteConfig.url}/${locale}/projects/${slug}`,
        lastModified: new Date(),
      });
    }

    for (const slug of serviceSlugs) {
      urls.push({
        url: `${siteConfig.url}/${locale}/services/${slug}`,
        lastModified: new Date(),
      });
    }
  }

  return urls;
}
