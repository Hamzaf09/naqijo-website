/**
 * Static site configuration and verified business facts.
 * Brand names are FINAL: English "NaqiJo", Arabic "نقي الرابية".
 * Contact facts sourced from the existing business (naqijo.com).
 * Non-brand values (colors, logo) live in tokens.css / assets — not here.
 */
export const siteConfig = {
  domain: "naqijo.com",
  url: "https://www.naqijo.com",
  brand: {
    en: "NaqiJo",
    ar: "نقي الرابية",
  },
  email: "info@naqijo.com",
  brandEmail: "brand@naqijo.com",
  // Primary consultation number first (WhatsApp), then the secondary office line.
  phones: ["+962792900008", "+962793200007"],
  // The single consultation WhatsApp number used by every CTA on the site.
  whatsapp: "+962792900008",
  phonePrimary: "+962792900008",
  phoneSecondary: "+962793200007",
  address: {
    ar: "خلدا، شارع وصفي التل، مجمع فهد جريصات، الطابق الأرضي، عمّان، الأردن",
    en: "Khalda, Wasfi Al Tal Street, Fahed Jarissat Complex, Ground Floor, Amman, Jordan",
  },
  hours: {
    ar: "متاحون 7 أيام في الأسبوع",
    en: "Available 7 Days a Week",
  },
  social: {
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
  },
  // Verified proof points (used across trust sections).
  stats: {
    yearsExperience: 17,
    customers: 456,
    employees: 53,
    operations: 513,
    warrantyYearsMax: 5,
  },
  // Founder — name/title exactly as provided; photo is a local brand asset.
  founder: {
    name: {
      en: "Eng. Mohammad Hakam Al-Juhani",
      ar: "م. محمد حاكم الجهني",
    },
    title: {
      en: "Founder of Naqi Al Rabieh",
      ar: "مؤسس نقي الرابية",
    },
    photo: "/brand/founder.webp",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Optional Google local-presence values. These are intentionally NOT hard-coded:
 * they must come from the real, verified Google Business Profile, which requires
 * profile ownership we do not have here. They are read from environment
 * variables so the owner can set them once (e.g. in Vercel) without a code
 * change, and every consumer treats an empty value as "not configured" — so no
 * placeholder or fake Google link is ever rendered.
 *
 *   NEXT_PUBLIC_GOOGLE_MAPS_URL     – the business's Google Maps place URL
 *   NEXT_PUBLIC_GOOGLE_PLACE_ID     – the Google Place ID
 *   NEXT_PUBLIC_GOOGLE_REVIEW_URL   – the "write a review" short link
 *
 * Until these are set, Maps/Directions/Review CTAs and schema `hasMap` stay off.
 */
export const googleConfig: {
  mapsUrl: string;
  placeId: string;
  reviewUrl: string;
} = {
  mapsUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ?? "",
  placeId: process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID ?? "",
  reviewUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ?? "",
};
