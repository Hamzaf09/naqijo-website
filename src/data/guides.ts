import {
  getAllGuides as staticGetAll,
  getGuideBySlug as staticGetBySlug,
  guideSlugs as staticSlugs,
  type Guide,
} from "@/content/guides";

/**
 * Guide data access — sourced ENTIRELY from the static content in
 * `src/content/guides.ts` (committed to the repo). No Payload / database is
 * involved, so the guides build even when DATABASE_URI is unavailable. Async
 * signatures match the products/services readers so the sitemap and pages
 * consume them the same way.
 */

export type { Guide } from "@/content/guides";

export async function getAllGuides(): Promise<Guide[]> {
  return staticGetAll();
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  return staticGetBySlug(slug) ?? null;
}

export async function getGuideSlugs(): Promise<string[]> {
  return [...staticSlugs];
}
