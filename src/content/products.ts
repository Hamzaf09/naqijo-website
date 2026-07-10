import type { Locale } from "@/i18n/routing";

export interface ProductItem {
  slug: string;
  image: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
  category: Record<Locale, string>;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  bullets: Record<Locale, string[]>;
}

export const productsSection = {
  ar: {
    eyebrow: "منتجاتنا",
    title: "منتجات هندسية صُممت لتدوم.",
    subtitle:
      "منتجات مختارة تجمع بين الأداء الهندسي والجودة طويلة الأمد لتمنح منزلك مياه أنقى وحماية أكبر.",
    cta: "استكشف المنتج",
  },
  en: {
    eyebrow: "Our products",
    title: "Engineering products, built to last.",
    subtitle:
      "A curated selection combining engineering performance and long-term quality — for purer water and greater protection at home.",
    cta: "Explore the product",
  },
};

export const products: ProductItem[] = [
  {
    slug: "jumbo-filter",
    image: "/images/products/jumbo-filter.webp",
    width: 1400,
    height: 1174,
    alt: { ar: "فلتر مركزي جامبو من نقي الرابية", en: "NaqiJo Jumbo central filter" },
    category: { ar: "أنظمة الفلترة المركزية", en: "Central filtration systems" },
    title: { ar: "فلتر مركزي جامبو", en: "Jumbo Central Filter" },
    description: {
      ar: "فلتر مركزي عالي السعة يحمي شبكة المياه المنزلية ويزيل الرواسب والشوائب قبل وصولها إلى جميع نقاط الاستخدام.",
      en: "A high-capacity central filter that protects your home's water network, removing sediment and impurities before they reach every point of use.",
    },
    bullets: {
      ar: ["حماية كاملة للمنزل", "إزالة الرواسب والشوائب", "أداء ثابت وسعة عالية"],
      en: ["Whole-home protection", "Removes sediment and impurities", "Steady performance, high capacity"],
    },
  },
  {
    slug: "softener",
    image: "/images/products/softener.webp",
    width: 1400,
    height: 1174,
    alt: { ar: "سوفتنر منزلي من نقي الرابية", en: "NaqiJo home water softener" },
    category: { ar: "معالجة عسر المياه", en: "Hard-water treatment" },
    title: { ar: "سوفتنر منزلي", en: "Home Water Softener" },
    description: {
      ar: "نظام معالجة المياه القاسية لحماية السخانات والتمديدات والأجهزة المنزلية وإطالة عمرها.",
      en: "A hard-water treatment system that protects heaters, plumbing and home appliances — and extends their life.",
    },
    bullets: {
      ar: ["تقليل عسر المياه", "حماية السخانات والأجهزة", "إطالة عمر شبكة المياه"],
      en: ["Reduces water hardness", "Protects heaters and appliances", "Extends the plumbing's life"],
    },
  },
  {
    slug: "digital-filter-8s",
    image: "/images/products/digital-filter-8s.webp",
    width: 1400,
    height: 1174,
    alt: { ar: "فلتر رقمي ذكي 8 مراحل من نقي الرابية", en: "NaqiJo smart digital 8-stage filter" },
    category: { ar: "تنقية مياه الشرب", en: "Drinking-water purification" },
    title: { ar: "فلتر رقمي ذكي – 8 مراحل", en: "Smart Digital Filter – 8 Stages" },
    description: {
      ar: "منظومة تنقية ذكية متعددة المراحل مزودة بشاشة رقمية لمراقبة الأداء وجودة المياه.",
      en: "A smart multi-stage purification system with a digital display to monitor performance and water quality.",
    },
    bullets: {
      ar: ["8 مراحل تنقية", "شاشة رقمية ذكية", "مياه شرب عالية النقاء"],
      en: ["8 purification stages", "Smart digital display", "High-purity drinking water"],
    },
  },
];
