import { getPayloadClient } from "@/lib/payload/client";
import { L, mapMedia, type MediaImage } from "@/lib/payload/map";
import type { LocalizedString } from "@/data/product-types";

export interface Banner {
  title: LocalizedString;
  subtitle: LocalizedString;
  ctaLabel: LocalizedString;
  link: string | null;
  desktopImage: MediaImage | null;
  mobileImage: MediaImage | null;
}

/**
 * Published banners currently inside their schedule window (startDate/endDate
 * are both optional). Ready for whichever surface renders banners next —
 * nothing on the current design consumes them yet.
 */
export async function getActiveBanners(): Promise<Banner[]> {
  const payload = await getPayloadClient();
  const now = new Date().toISOString();
  const res = await payload.find({
    collection: "banners",
    locale: "all",
    where: {
      and: [
        { _status: { equals: "published" } },
        { or: [{ startDate: { exists: false } }, { startDate: { less_than_equal: now } }] },
        { or: [{ endDate: { exists: false } }, { endDate: { greater_than_equal: now } }] },
      ],
    },
    sort: "order",
    limit: 20,
    depth: 1,
  });
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return res.docs.map((doc: any) => ({
    title: L(doc.title),
    subtitle: L(doc.subtitle),
    ctaLabel: L(doc.ctaLabel),
    link: typeof doc.link === "string" ? doc.link : null,
    desktopImage: mapMedia(doc.desktopImage),
    mobileImage: mapMedia(doc.mobileImage),
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
