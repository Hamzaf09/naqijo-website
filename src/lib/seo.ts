import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { getServerURL } from "@/lib/env";

/** Absolute URL on the production origin (for JSON-LD, which needs absolute URLs). */
export function absoluteUrl(path = ""): string {
  const base = getServerURL().replace(/\/+$/, "");
  return path ? `${base}${path.startsWith("/") ? "" : "/"}${path}` : base;
}

type OgImageInput = string | { url: string; alt?: string };

interface PageMetadataInput {
  locale: Locale;
  /** Path WITHOUT the locale prefix, e.g. "/products" or "/products/air-purifier". Use "/" for the locale home. */
  path: string;
  /** Page-specific title (the layout template appends the brand suffix to the <title> tag). */
  title: string;
  description?: string;
  /** OG/Twitter image(s) — relative or absolute; resolved against metadataBase. */
  image?: OgImageInput;
  images?: OgImageInput[];
  type?: "website" | "article";
}

const ogLocale: Record<Locale, string> = { ar: "ar_JO", en: "en_US" };

/** Brand fallback OG image when a page has no specific one. */
const DEFAULT_OG_IMAGE = "/icon-512.png";

/**
 * Build per-page metadata with a correct self-referential canonical and
 * ar/en/x-default hreflang alternates. Because Next.js shallow-merges
 * metadata, pages MUST set their own `alternates`/`openGraph` or they inherit
 * the layout's (which point at the locale home) — this centralizes that so
 * every page canonicalizes to itself and links its true language pair.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
  images,
  type = "website",
}: PageMetadataInput): Metadata {
  const clean = path === "/" ? "" : path.replace(/\/+$/, "");
  const self = `/${locale}${clean}` || `/${locale}`;
  const ogImages = images ?? [image ?? DEFAULT_OG_IMAGE];
  const ogTitle = `${title} — ${siteConfig.brand[locale]}`;

  return {
    title,
    ...(description ? { description } : {}),
    alternates: {
      canonical: self,
      languages: {
        ar: `/ar${clean}`,
        en: `/en${clean}`,
        "x-default": `/ar${clean}`,
      },
    },
    openGraph: {
      siteName: siteConfig.brand[locale],
      title: ogTitle,
      ...(description ? { description } : {}),
      url: self,
      locale: ogLocale[locale],
      type,
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: ogImages ? "summary_large_image" : "summary",
      title: ogTitle,
      ...(description ? { description } : {}),
      ...(ogImages ? { images: ogImages } : {}),
    },
  };
}
