import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

/**
 * Centralized Schema.org (JSON-LD) builders. Only verified company facts are
 * used (name, founding year 2005, contact, areas served); nothing invented.
 * Stable @id anchors let nodes reference each other across pages.
 */

const ORG_ID = `${absoluteUrl()}/#organization`;
const WEBSITE_ID = `${absoluteUrl()}/#website`;
const LOCALBUSINESS_ID = `${absoluteUrl()}/#localbusiness`;

const names: Record<Locale, string> = {
  ar: "نقي الرابية للمياه والطاقة",
  en: "Naqi Al Rabia Water & Energy",
};

const descriptions: Record<Locale, string> = {
  ar: "نقي الرابية للمياه والطاقة، تأسست عام 2005، شركة متخصصة في فلترة المياه وتنقيتها ومعالجتها وحلول المياه والطاقة المتكاملة للمنازل والأعمال.",
  en: "Naqi Al Rabia Water & Energy, founded in 2005, specializes in water filtration, purification, treatment, and integrated water and energy solutions for homes and businesses.",
};

// Verified from the company description (operations & branches).
const AREA_SERVED = ["Jordan", "Saudi Arabia", "Qatar", "United Arab Emirates"];

const SAME_AS = (Object.values(siteConfig.social) as string[]).filter(
  (u) => typeof u === "string" && u.length > 0,
);

function postalAddress(locale: Locale) {
  return locale === "ar"
    ? {
        "@type": "PostalAddress",
        streetAddress: "خلدا، شارع وصفي التل، مجمع فهد جريصات، الطابق الأرضي",
        addressLocality: "عمّان",
        addressCountry: "JO",
      }
    : {
        "@type": "PostalAddress",
        streetAddress: "Khalda, Wasfi Al Tal Street, Fahed Jarissat Complex, Ground Floor",
        addressLocality: "Amman",
        addressCountry: "JO",
      };
}

function organizationNode(locale: Locale) {
  const other: Locale = locale === "ar" ? "en" : "ar";
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: names[locale],
    alternateName: [names[other], "NaqiJo"],
    url: absoluteUrl(`/${locale}`),
    logo: absoluteUrl("/icon-512.png"),
    image: absoluteUrl("/icon-512.png"),
    description: descriptions[locale],
    foundingDate: "2005",
    areaServed: AREA_SERVED,
    email: siteConfig.email,
    telephone: siteConfig.phones[0],
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phones[0],
      contactType: "customer service",
      areaServed: "JO",
      availableLanguage: ["Arabic", "English"],
    },
  };
}

function localBusinessNode(locale: Locale) {
  return {
    "@type": "LocalBusiness",
    "@id": LOCALBUSINESS_ID,
    name: names[locale],
    url: absoluteUrl(`/${locale}`),
    logo: absoluteUrl("/icon-512.png"),
    image: absoluteUrl("/icon-512.png"),
    description: descriptions[locale],
    telephone: siteConfig.phones[0],
    email: siteConfig.email,
    address: postalAddress(locale),
    areaServed: AREA_SERVED,
    parentOrganization: { "@id": ORG_ID },
  };
}

function websiteNode(locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: names[locale],
    alternateName: "NaqiJo",
    url: absoluteUrl(`/${locale}`),
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
  };
}

/** Site-wide graph (Organization + LocalBusiness + WebSite) — inject once in the layout. */
export function siteGraph(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode(locale), localBusinessNode(locale), websiteNode(locale)],
  };
}

export interface Crumb {
  name: string;
  /** Path WITHOUT locale prefix, e.g. "/products". */
  path: string;
}

export function breadcrumbSchema(items: Crumb[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(`/${locale}${c.path === "/" ? "" : c.path}`),
    })),
  };
}

export function productSchema(opts: {
  name: string;
  description: string;
  image: string;
  category?: string;
  sku: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    description: opts.description,
    image: opts.image.startsWith("http") ? opts.image : absoluteUrl(opts.image),
    brand: { "@type": "Brand", name: "Naqi Al Rabia" },
    ...(opts.category ? { category: opts.category } : {}),
    sku: opts.sku,
    url: opts.url,
    manufacturer: { "@id": ORG_ID },
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    serviceType: opts.name,
    url: opts.url,
    ...(opts.image
      ? { image: opts.image.startsWith("http") ? opts.image : absoluteUrl(opts.image) }
      : {}),
    provider: { "@id": ORG_ID },
    areaServed: AREA_SERVED,
  };
}

export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
