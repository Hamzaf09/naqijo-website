import { getPayloadClient } from "@/lib/payload/client";
import { L, mapMedia, type MediaImage } from "@/lib/payload/map";
import { siteConfig } from "@/config/site";
import type { LocalizedString } from "@/data/product-types";

export interface SiteSettings {
  siteName: LocalizedString;
  logo: MediaImage | null;
  favicon: MediaImage | null;
  phones: string[];
  whatsapp: string;
  email: string;
  address: LocalizedString;
  workingHours: LocalizedString;
  mapUrl: string | null;
  copyright: LocalizedString;
  footerTagline: LocalizedString;
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    twitter: string;
  };
  defaultSeo: {
    metaTitle: LocalizedString;
    metaDescription: LocalizedString;
    ogImage: MediaImage | null;
  };
  googleAnalyticsId: string | null;
  gtmId: string | null;
}

/**
 * Site settings from the CMS global, with graceful fallbacks to `siteConfig`
 * so the frontend always renders even before the global is populated.
 */
export async function getSettings(): Promise<SiteSettings> {
  const payload = await getPayloadClient();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let doc: any = {};
  try {
    doc = await payload.findGlobal({ slug: "settings", locale: "all", depth: 1 });
  } catch {
    doc = {};
  }
  const phones =
    Array.isArray(doc.phones) && doc.phones.length
      ? doc.phones.map((p: any) => String(p.number)).filter(Boolean)
      : [...siteConfig.phones];
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return {
    siteName: doc.siteName ? L(doc.siteName) : { ar: siteConfig.brand.ar, en: siteConfig.brand.en },
    logo: mapMedia(doc.logo),
    favicon: mapMedia(doc.favicon),
    phones,
    whatsapp: doc.whatsapp || siteConfig.whatsapp,
    email: doc.email || siteConfig.email,
    address: doc.address ? L(doc.address) : { ar: siteConfig.address.ar, en: siteConfig.address.en },
    workingHours: doc.workingHours
      ? L(doc.workingHours)
      : { ar: siteConfig.hours.ar, en: siteConfig.hours.en },
    mapUrl: doc.mapUrl || null,
    copyright: doc.copyright ? L(doc.copyright) : { ar: "", en: "" },
    footerTagline: doc.footerTagline ? L(doc.footerTagline) : { ar: "", en: "" },
    social: {
      facebook: doc.facebook || "",
      instagram: doc.instagram || "",
      youtube: doc.youtube || "",
      linkedin: doc.linkedin || "",
      twitter: doc.twitter || "",
    },
    defaultSeo: {
      metaTitle: doc.defaultSeo?.metaTitle ? L(doc.defaultSeo.metaTitle) : { ar: "", en: "" },
      metaDescription: doc.defaultSeo?.metaDescription
        ? L(doc.defaultSeo.metaDescription)
        : { ar: "", en: "" },
      ogImage: mapMedia(doc.defaultSeo?.ogImage),
    },
    googleAnalyticsId: doc.googleAnalyticsId || null,
    gtmId: doc.gtmId || null,
  };
}
