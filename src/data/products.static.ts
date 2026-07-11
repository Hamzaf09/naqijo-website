import type { Locale } from "@/i18n/routing";

/**
 * SINGLE SOURCE OF TRUTH for all products.
 *
 * Every product surface — homepage featured, /products catalog, /products/[slug]
 * detail, related products, search, and filters — consumes this module. Do not
 * duplicate product data anywhere else.
 *
 * The shape is intentionally CMS-shaped (flat records + typed fields + query
 * helpers) so the array below can later be swapped for a fetch from a CMS or
 * dashboard without touching any consuming component.
 */

type L = Record<Locale, string>;

export type AvailabilityKey = "available" | "on-order";

export interface ProductImage {
  src: string;
  width: number;
  height: number;
  alt: L;
}

export interface ProductSpec {
  label: L;
  value: L;
}

export interface Product {
  slug: string;
  categoryKey: string;
  availability: AvailabilityKey;
  name: L;
  shortDescription: L;
  fullDescription: L;
  image: ProductImage;
  /** Optional additional images. Empty = detail page shows the hero only. */
  gallery: ProductImage[];
  features: L[];
  specs: ProductSpec[];
}

export interface ProductCategory {
  key: string;
  label: L;
}

export const availabilityLabels: Record<AvailabilityKey, L> = {
  available: { ar: "متوفر", en: "Available" },
  "on-order": { ar: "حسب الطلب", en: "On order" },
};

export const productCategories: ProductCategory[] = [
  { key: "central-filtration", label: { ar: "الفلترة المركزية", en: "Central filtration" } },
  { key: "water-softening", label: { ar: "معالجة عسر المياه", en: "Water softening" } },
  { key: "drinking-water", label: { ar: "تنقية مياه الشرب", en: "Drinking-water purification" } },
];

export function getCategoryLabel(key: string): L | undefined {
  return productCategories.find((c) => c.key === key)?.label;
}

export const products: Product[] = [
  {
    slug: "jumbo-filter",
    categoryKey: "central-filtration",
    availability: "available",
    name: { ar: "فلتر مركزي جامبو", en: "Jumbo Central Filter" },
    shortDescription: {
      ar: "فلتر مركزي عالي السعة يحمي شبكة المياه المنزلية ويزيل الرواسب والشوائب قبل وصولها إلى جميع نقاط الاستخدام.",
      en: "A high-capacity central filter that protects your home's water network, removing sediment and impurities before they reach every point of use.",
    },
    fullDescription: {
      ar: "يُركّب فلتر جامبو المركزي عند مدخل المياه الرئيسي للمنزل ليعالج المياه قبل توزيعها على كل الصنابير. يزيل الرواسب والصدأ والشوائب العالقة، فيحمي السخانات والمضخات والتمديدات من التلف، ويمنحك مياهاً أنظف في كل نقطة استخدام. مصمّم لسعة عالية وأداء ثابت يدوم طويلاً مع صيانة دورية بسيطة.",
      en: "The Jumbo central filter installs at your home's main water inlet, treating water before it reaches every tap. It removes sediment, rust and suspended impurities — protecting heaters, pumps and plumbing from damage and delivering cleaner water at every point of use. Built for high capacity and steady, long-lasting performance with simple periodic maintenance.",
    },
    image: {
      src: "/images/products/jumbo-filter.webp",
      width: 1400,
      height: 1174,
      alt: { ar: "فلتر مركزي جامبو من نقي الرابية", en: "NaqiJo Jumbo central filter" },
    },
    gallery: [],
    features: [
      { ar: "حماية كاملة للمنزل", en: "Whole-home protection" },
      { ar: "إزالة الرواسب والشوائب", en: "Removes sediment and impurities" },
      { ar: "أداء ثابت وسعة عالية", en: "Steady performance, high capacity" },
    ],
    specs: [
      { label: { ar: "مراحل المعالجة", en: "Treatment stages" }, value: { ar: "ثلاث مراحل", en: "3 stages" } },
      { label: { ar: "نوع التركيب", en: "Installation" }, value: { ar: "مركزي عند مدخل المياه", en: "Point-of-entry (central)" } },
      { label: { ar: "السعة", en: "Capacity" }, value: { ar: "تدفّق عالٍ", en: "High flow" } },
      { label: { ar: "نطاق الحماية", en: "Coverage" }, value: { ar: "المنزل بالكامل", en: "Whole home" } },
      { label: { ar: "الصيانة", en: "Maintenance" }, value: { ar: "استبدال دوري للحشوات", en: "Periodic cartridge change" } },
    ],
  },
  {
    slug: "softener",
    categoryKey: "water-softening",
    availability: "available",
    name: { ar: "سوفتنر منزلي", en: "Home Water Softener" },
    shortDescription: {
      ar: "نظام معالجة المياه القاسية لحماية السخانات والتمديدات والأجهزة المنزلية وإطالة عمرها.",
      en: "A hard-water treatment system that protects heaters, plumbing and home appliances — and extends their life.",
    },
    fullDescription: {
      ar: "يعالج السوفتنر عسر المياه عبر التبادل الأيوني، فيقلّل الكالسيوم والمغنيسيوم المسبّبين للترسّبات الكلسية. يحمي السخانات والغسالات والتمديدات من الترسّبات ويطيل عمرها، ويجعل ملمس البشرة والملابس أنعم، مع تجديد أوتوماتيكي يعمل بصمت في الخلفية.",
      en: "The softener treats hard water through ion exchange, reducing the calcium and magnesium that cause scale. It protects heaters, washing machines and plumbing from limescale and extends their life, leaves skin and laundry softer, and regenerates automatically — quietly, in the background.",
    },
    image: {
      src: "/images/products/softener.webp",
      width: 1400,
      height: 1174,
      alt: { ar: "سوفتنر منزلي من نقي الرابية", en: "NaqiJo home water softener" },
    },
    gallery: [],
    features: [
      { ar: "تقليل عسر المياه", en: "Reduces water hardness" },
      { ar: "حماية السخانات والأجهزة", en: "Protects heaters and appliances" },
      { ar: "إطالة عمر شبكة المياه", en: "Extends the plumbing's life" },
    ],
    specs: [
      { label: { ar: "طريقة المعالجة", en: "Method" }, value: { ar: "تبادل أيوني", en: "Ion exchange" } },
      { label: { ar: "التجديد", en: "Regeneration" }, value: { ar: "أوتوماتيكي", en: "Automatic" } },
      { label: { ar: "الاستخدام", en: "Best for" }, value: { ar: "المياه القاسية", en: "Hard water" } },
      { label: { ar: "الحماية", en: "Protects" }, value: { ar: "السخانات والأجهزة", en: "Heaters & appliances" } },
      { label: { ar: "الفئة", en: "Class" }, value: { ar: "منزلي", en: "Residential" } },
    ],
  },
  {
    slug: "digital-filter-8s",
    categoryKey: "drinking-water",
    availability: "available",
    name: { ar: "فلتر رقمي ذكي – 8 مراحل", en: "Smart Digital Filter – 8 Stages" },
    shortDescription: {
      ar: "منظومة تنقية ذكية متعددة المراحل مزودة بشاشة رقمية لمراقبة الأداء وجودة المياه.",
      en: "A smart multi-stage purification system with a digital display to monitor performance and water quality.",
    },
    fullDescription: {
      ar: "منظومة تنقية مياه الشرب بثماني مراحل تجمع الفلترة والتناضح العكسي وإعادة إضافة المعادن لمياهٍ نقية ومتوازنة الطعم. تعرض الشاشة الرقمية الذكية جودة المياه (TDS) وحالة الحشوات وتنبّهك عند موعد الاستبدال، فتبقى على اطّلاع دائم بأداء نظامك.",
      en: "An eight-stage drinking-water purification system that combines filtration, reverse osmosis and remineralization for pure, balanced-tasting water. The smart digital display shows water quality (TDS) and filter status and alerts you when a change is due — so you always know how your system is performing.",
    },
    image: {
      src: "/images/products/digital-filter-8s.webp",
      width: 1400,
      height: 1174,
      alt: { ar: "فلتر رقمي ذكي 8 مراحل من نقي الرابية", en: "NaqiJo smart digital 8-stage filter" },
    },
    gallery: [],
    features: [
      { ar: "8 مراحل تنقية", en: "8 purification stages" },
      { ar: "شاشة رقمية ذكية", en: "Smart digital display" },
      { ar: "مياه شرب عالية النقاء", en: "High-purity drinking water" },
    ],
    specs: [
      { label: { ar: "مراحل التنقية", en: "Purification stages" }, value: { ar: "ثماني مراحل", en: "8 stages" } },
      { label: { ar: "الشاشة", en: "Display" }, value: { ar: "رقمية ذكية", en: "Smart digital" } },
      { label: { ar: "المراقبة", en: "Monitoring" }, value: { ar: "قياس جودة المياه (TDS)", en: "Water quality (TDS)" } },
      { label: { ar: "المخرجات", en: "Output" }, value: { ar: "مياه شرب نقية", en: "Pure drinking water" } },
      { label: { ar: "التنبيهات", en: "Alerts" }, value: { ar: "موعد استبدال الحشوات", en: "Filter-change reminders" } },
    ],
  },
];

/* ----------------------------- Query helpers ----------------------------- */

export const productSlugs = products.map((p) => p.slug);

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categoryKey: string): Product[] {
  if (!categoryKey || categoryKey === "all") return products;
  return products.filter((p) => p.categoryKey === categoryKey);
}

/** Deterministic (SSR-safe) featured slice; clients may re-shuffle after mount. */
export function getFeaturedProducts(count = 4): Product[] {
  return products.slice(0, Math.min(count, products.length));
}

export function getRelatedProducts(slug: string, count = 3): Product[] {
  const current = getProductBySlug(slug);
  if (!current) return [];
  const sameCategory = products.filter(
    (p) => p.slug !== slug && p.categoryKey === current.categoryKey,
  );
  const others = products.filter(
    (p) => p.slug !== slug && p.categoryKey !== current.categoryKey,
  );
  return [...sameCategory, ...others].slice(0, count);
}

/** Fisher–Yates shuffle (used client-side for per-load featured randomization). */
export function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* Home "Featured Products" section copy (kept with the data it describes). */
export const productsSection = {
  ar: {
    eyebrow: "منتجاتنا",
    title: "منتجات هندسية صُممت لتدوم.",
    subtitle:
      "منتجات مختارة تجمع بين الأداء الهندسي والجودة طويلة الأمد لتمنح منزلك مياه أنقى وحماية أكبر.",
    cta: "استكشف المنتج",
    viewAll: "عرض جميع المنتجات",
  },
  en: {
    eyebrow: "Our products",
    title: "Engineering products, built to last.",
    subtitle:
      "A curated selection combining engineering performance and long-term quality — for purer water and greater protection at home.",
    cta: "Explore the product",
    viewAll: "View all products",
  },
} as const;
