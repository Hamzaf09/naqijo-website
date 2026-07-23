import { getPayloadClient } from "@/lib/payload/client";
import { L, mapMedia, type MediaImage } from "@/lib/payload/map";
import type { LocalizedString } from "@/data/product-types";

export interface Testimonial {
  quote: LocalizedString;
  name: LocalizedString;
  /** Job title (+ company when present) — rendered as the card's byline. */
  role: LocalizedString;
  rating: number;
  photo: MediaImage | null;
}

const PUBLISHED = { _status: { equals: "published" } } as const;

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapTestimonial(doc: any): Testimonial {
  const jobTitle = L(doc.jobTitle);
  const company = L(doc.company);
  const joined = (a: string, b: string) => (a && b ? `${a} — ${b}` : a || b);
  return {
    quote: L(doc.quote),
    name: L(doc.customerName),
    role: {
      ar: joined(jobTitle.ar, company.ar),
      en: joined(jobTitle.en, company.en),
    },
    rating: typeof doc.rating === "number" ? doc.rating : 5,
    photo: mapMedia(doc.photo),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Featured + published testimonials for the homepage (falls back to all published). */
export async function getFeaturedTestimonials(limit = 3): Promise<Testimonial[]> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "testimonials",
    locale: "all",
    where: { and: [{ featured: { equals: true } }, PUBLISHED] },
    sort: "order",
    limit,
    depth: 1,
  });
  if (res.docs.length > 0) return res.docs.map(mapTestimonial);

  const fallback = await payload.find({
    collection: "testimonials",
    locale: "all",
    where: PUBLISHED,
    sort: "order",
    limit,
    depth: 1,
  });
  return fallback.docs.map(mapTestimonial);
}
