import { getPayloadClient } from "@/lib/payload/client";
import { L, mapMedia, type MediaImage } from "@/lib/payload/map";
import type { LocalizedString } from "@/data/product-types";
import {
  projects as staticProjectContent,
  projectSlugs as staticProjectSlugs,
} from "@/content/projects";
import { approvedImages } from "@/config/images";

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

/**
 * Static fallback so project pages still render when the database is
 * unavailable (e.g. during a build). Zips the committed locale-first content
 * in `src/content/projects.ts` into the same `Project` shape.
 */
function buildStaticProject(slug: string): Project | null {
  const ar = staticProjectContent.ar[slug];
  const en = staticProjectContent.en[slug];
  if (!ar || !en) return null;
  const img = approvedImages[ar.image];
  return {
    slug,
    order: staticProjectSlugs.indexOf(slug as (typeof staticProjectSlugs)[number]),
    featured: true,
    title: { ar: ar.title, en: en.title },
    category: { ar: ar.category, en: en.category },
    location: { ar: ar.location, en: en.location },
    completionDate: null,
    year: ar.year,
    clientName: null,
    shortDescription: { ar: ar.summary, en: en.summary },
    challenge: { ar: ar.challenge, en: en.challenge },
    solution: { ar: ar.solution, en: en.solution },
    outcome: { ar: ar.outcome, en: en.outcome },
    scope: ar.scope.map((s, i) => ({ ar: s, en: en.scope[i] ?? s })),
    heroImage: { src: img.src, width: img.width, height: img.height, alt: img.alt },
    gallery: [],
  };
}

function staticProjectList(): Project[] {
  return [...staticProjectSlugs]
    .map(buildStaticProject)
    .filter((p): p is Project => p !== null);
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "projects",
      locale: "all",
      where: PUBLISHED,
      sort: "order",
      limit: 100,
      depth: 2,
    });
    return res.docs.length > 0 ? res.docs.map(mapProject) : staticProjectList();
  } catch {
    return staticProjectList();
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "projects",
      locale: "all",
      where: { and: [{ slug: { equals: slug } }, PUBLISHED] },
      limit: 1,
      depth: 2,
    });
    return res.docs[0] ? mapProject(res.docs[0]) : buildStaticProject(slug);
  } catch {
    return buildStaticProject(slug);
  }
}

export async function getProjectSlugs(): Promise<string[]> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "projects",
      where: PUBLISHED,
      limit: 200,
      depth: 0,
      pagination: false,
    });
    const slugs = (res.docs as unknown as Record<string, unknown>[]).map((d) => String(d.slug));
    return slugs.length > 0 ? slugs : [...staticProjectSlugs];
  } catch {
    return [...staticProjectSlugs];
  }
}

/** Featured projects for the homepage (falls back to the most recent). */
export async function getFeaturedProjects(limit = 1): Promise<Project[]> {
  try {
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
    return fallback.docs.length > 0
      ? fallback.docs.map(mapProject)
      : staticProjectList().slice(0, limit);
  } catch {
    return staticProjectList().slice(0, limit);
  }
}
