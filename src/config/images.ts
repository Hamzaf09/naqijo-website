import type { Locale } from "@/i18n/routing";

/**
 * Approved brand photography (the ONLY real images permitted).
 * Never substitute stock/AI imagery. Slots without an approved image use
 * <ImagePlaceholder> instead. Alt text is functional/bilingual (not marketing).
 */
export type ApprovedImageKey =
  | "heroLifestyle"
  | "luxuryKitchen"
  | "crystalWater"
  | "familyLifestyle"
  | "underSinkSystem"
  | "wholeHouseSystem"
  | "premiumInstallation"
  | "engineeringConsultation"
  | "roofWaterproofing"
  | "solarEnergy"
  | "featuredProject"
  | "brandClosing";

export interface ApprovedImage {
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
}

export const approvedImages: Record<ApprovedImageKey, ApprovedImage> = {
  heroLifestyle: {
    src: "/images/brand/hero-lifestyle.webp",
    width: 1672,
    height: 941,
    alt: { ar: "أسرة في منزل أردني مضيء", en: "Family in a bright Jordanian home" },
  },
  luxuryKitchen: {
    src: "/images/brand/luxury-kitchen.webp",
    width: 1672,
    height: 941,
    alt: { ar: "مطبخ فاخر بتشطيب راقٍ", en: "A luxury, finely finished kitchen" },
  },
  crystalWater: {
    src: "/images/brand/crystal-water.webp",
    width: 1672,
    height: 941,
    alt: { ar: "ماء نقي صافٍ", en: "Crystal-clear pure water" },
  },
  familyLifestyle: {
    src: "/images/brand/family-lifestyle.webp",
    width: 1672,
    height: 941,
    alt: { ar: "لحظة عائلية في المنزل", en: "A family moment at home" },
  },
  underSinkSystem: {
    src: "/images/brand/under-sink-system.webp",
    width: 1536,
    height: 1024,
    alt: { ar: "نظام تنقية مياه تحت الحوض", en: "Under-sink water filtration system" },
  },
  wholeHouseSystem: {
    src: "/images/brand/whole-house-system.webp",
    width: 1535,
    height: 1024,
    alt: { ar: "نظام تنقية مركزي للمنزل", en: "Whole-house water treatment system" },
  },
  premiumInstallation: {
    src: "/images/brand/premium-installation.webp",
    width: 1672,
    height: 941,
    alt: { ar: "تركيب احترافي على يد فنيّي نقي الرابية", en: "Premium installation by NaqiJo technicians" },
  },
  engineeringConsultation: {
    src: "/images/brand/engineering-consultation.webp",
    width: 1672,
    height: 941,
    alt: { ar: "استشارة هندسية للعميل", en: "Engineering consultation with a client" },
  },
  roofWaterproofing: {
    src: "/images/brand/roof-waterproofing.webp",
    width: 1672,
    height: 941,
    alt: { ar: "عزل أسطح احترافي على يد فنيّي نقي الرابية", en: "Professional roof waterproofing by NaqiJo technicians" },
  },
  solarEnergy: {
    src: "/images/brand/solar-energy.webp",
    width: 1672,
    height: 941,
    alt: { ar: "ألواح شمسية تحت سماء صافية", en: "Solar panels under a clear sky" },
  },
  featuredProject: {
    src: "/images/brand/featured-project.webp",
    width: 1672,
    height: 941,
    alt: { ar: "مشروع سكني مميّز", en: "A signature residential project" },
  },
  brandClosing: {
    src: "/images/brand/brand-closing.webp",
    width: 1672,
    height: 941,
    alt: { ar: "نقي الرابية — حلولٌ متكاملة", en: "NaqiJo — integrated home solutions" },
  },
};

/** Labels for on-brand ImagePlaceholder slots (no approved photo yet). */
export const placeholderLabels = {
  hero: { ar: "صورة رئيسية", en: "Hero Image" },
  lifestyle: { ar: "صورة نمط حياة", en: "Lifestyle Image" },
  kitchen: { ar: "صورة مطبخ", en: "Kitchen Image" },
  project: { ar: "صورة مشروع", en: "Project Image" },
  engineering: { ar: "صورة هندسية", en: "Engineering Image" },
  team: { ar: "صورة فريق العمل", en: "Team Image" },
  solar: { ar: "صورة طاقة شمسية", en: "Solar Image" },
  waterproofing: { ar: "صورة عزل الأسطح", en: "Waterproofing Image" },
  office: { ar: "صورة المكتب", en: "Office Image" },
  customerStory: { ar: "قصة عميل", en: "Customer Story" },
  maintenance: { ar: "صورة صيانة", en: "Maintenance Image" },
  waterRoom: { ar: "غرفة أنظمة المياه", en: "Water System Room" },
} as const;

export type PlaceholderKey = keyof typeof placeholderLabels;
