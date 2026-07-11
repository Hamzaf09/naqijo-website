import { getPayloadClient } from "@/lib/payload/client";
import { L, mapMedia, type MediaImage } from "@/lib/payload/map";
import type { LocalizedString } from "@/data/product-types";

export interface Project {
  slug: string;
  order: number;
  featured: boolean;
  title: LocalizedString;
  category: LocalizedString;
  location: LocalizedString;
  completionDate: string | null;
  year: string;
  clientName: string | null;
  shortDescription: LocalizedString;
  challenge: LocalizedString;
  solution: LocalizedString;
  outcome: LocalizedString;
  scope: LocalizedString[];
  heroImage: MediaImage | null;
  gallery: MediaImage[];
}

const PUBLISHED = { _status: { equals: "published" } } as const;

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapProject(doc: any): Project {
  const date =
    typeof doc.completionDate === "string" ? doc.completionDate : null;
  return {
    slug: String(doc.slug),
    order: typeof doc.order === "number" ? doc.order : 0,
    featured: Boolean(doc.featured),
    title: L(doc.title),
    category: L(doc.category),
    location: L(doc.location),
    completionDate: date,
    year: date ? String(new Date(date).getFullYear()) : "",
    clientName: typeof doc.clientName === "string" ? doc.clientName : null,
    shortDescription: L(doc.shortDescription),
    challenge: L(doc.challenge),
    solution: L(doc.solution),
    outcome: L(doc.outcome),
    scope: Array.isArray(doc.scope)
      ? doc.scope.map((s: any) => L(s.item)).filter((s: LocalizedString) => s.ar || s.en)
      : [],
    heroImage: mapMedia(doc.heroImage),
    gallery: Array.isArray(doc.gallery)
      ? doc.gallery.map(mapMedia).filter((x: MediaImage | null): x is MediaImage => x !== null)
      : [],
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getAllProjects(): Promise<Project[]> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "projects",
    locale: "all",
    where: PUBLISHED,
    sort: "order",
    limit: 100,
    depth: 2,
  });
  return res.docs.map(mapProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "projects",
    locale: "all",
    where: { and: [{ slug: { equals: slug } }, PUBLISHED] },
    limit: 1,
    depth: 2,
  });
  return res.docs[0] ? mapProject(res.docs[0]) : null;
}

export async function getProjectSlugs(): Promise<string[]> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "projects",
    where: PUBLISHED,
    limit: 200,
    depth: 0,
    pagination: false,
  });
  return (res.docs as unknown as Record<string, unknown>[]).map((d) => String(d.slug));
}

/** Featured projects for the homepage (falls back to the most recent). */
export async function getFeaturedProjects(limit = 1): Promise<Project[]> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "projects",
    locale: "all",
    where: { and: [{ featured: { equals: true } }, PUBLISHED] },
    sort: "order",
    limit,
    depth: 2,
  });
  if (res.docs.length > 0) return res.docs.map(mapProject);

  const fallback = await payload.find({
    collection: "projects",
    locale: "all",
    where: PUBLISHED,
    sort: "order",
    limit,
    depth: 2,
  });
  return fallback.docs.map(mapProject);
}
