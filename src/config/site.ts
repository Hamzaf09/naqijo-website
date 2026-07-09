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
  phones: ["+962792300005", "+962792900008"],
  whatsapp: "+962792300005",
  address: {
    ar: "خلدا، شارع وصفي التل، مجمع فهيد جريسات، الطابق الأرضي، عمّان، الأردن",
    en: "Khalda, Wasfi Al-Tal Street, Fahid Greissat Complex, Ground Floor, Amman, Jordan",
  },
  hours: {
    ar: "خدمة على مدار الساعة، طوال أيام الأسبوع",
    en: "24/7 service",
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
} as const;

export type SiteConfig = typeof siteConfig;
