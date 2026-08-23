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
  phones: ["+962792900008", "+962792300005"],
  // The single consultation WhatsApp number used by every CTA on the site.
  whatsapp: "+962792900008",
  phonePrimary: "+962792900008",
  phoneSecondary: "+962792300005",
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
      ar: "م. محمد حكم الجهني",
    },
    title: {
      en: "Founder of Naqi Al Rabieh",
      ar: "مؤسس نقي الرابية",
    },
    photo: "/brand/founder.webp",
  },
} as const;

export type SiteConfig = typeof siteConfig;
