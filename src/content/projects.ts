import type { ApprovedImageKey } from "@/config/images";
import type { Locale } from "@/i18n/routing";

export interface ProjectDetail {
  slug: string;
  image: ApprovedImageKey;
  category: string;
  title: string;
  location: string;
  year: string;
  summary: string;
  challenge: string;
  solution: string;
  outcome: string;
  scope: string[];
}

export const projectSlugs = ["villa-amman", "apartment-abdoun", "commercial-tower", "restaurant-jabal"] as const;

export const projects: Record<Locale, Record<string, ProjectDetail>> = {
  ar: {
    "villa-amman": {
      slug: "villa-amman", image: "featuredProject", category: "فيلا سكنية", title: "فيلا عائلية متكاملة — عمّان", location: "دابوق، عمّان", year: "2025",
      summary: "منظومة مياه وطاقة متكاملة لفيلا عائلية، من التصميم إلى التشغيل والصيانة.",
      challenge: "أرادت العائلة بيتاً يجمع بين نقاء المياه واستقلال الطاقة، دون تعدّد المقاولين أو تشتّت المسؤولية.",
      solution: "صمّمنا منظومة واحدة: تنقية مركزية لكل الطوابق، نظام طاقة شمسية على السطح، وعزل حراري ومائي — بإشرافٍ هندسي واحد.",
      outcome: "مياهٌ نقية في كل صنبور، فاتورة كهرباء أخف، وبيتٌ محميّ لسنوات — بعقدٍ صيانةٍ واحد.",
      scope: ["تنقية مركزية", "طاقة شمسية", "عزل الأسطح", "صيانة دورية"],
    },
    "apartment-abdoun": {
      slug: "apartment-abdoun", image: "heroLifestyle", category: "شقة سكنية", title: "شقة فاخرة — عبدون", location: "عبدون، عمّان", year: "2024",
      summary: "تنقية مياه وتشطيب مطبخ متكامل لشقةٍ عصرية.",
      challenge: "مساحة محدودة تتطلّب حلاً أنيقاً يدمج التنقية ضمن تشطيبٍ راقٍ للمطبخ.",
      solution: "نظام تناضح عكسي مخفيّ ضمن تصميم المطبخ، بخاماتٍ راقية وتنفيذٍ نظيف.",
      outcome: "مطبخٌ جميلٌ وعمليّ، وماءٌ نقيّ دون أن يظهر أي تعقيد تقني.",
      scope: ["تناضح عكسي", "تشطيب مطبخ", "تركيب احترافي"],
    },
    "commercial-tower": {
      slug: "commercial-tower", image: "wholeHouseSystem", category: "مبنى تجاري", title: "برج مكاتب — العبدلي", location: "العبدلي، عمّان", year: "2024",
      summary: "نظام معالجة مياه مركزي لمبنى مكاتب متعدد الطوابق.",
      challenge: "حاجة لمياه معالجة موثوقة على مدار الساعة لعشرات المكاتب.",
      solution: "منظومة معالجة مركزية بسعةٍ عالية وتحكّمٍ رقمي، مع خطة صيانة استباقية.",
      outcome: "إمدادٌ ثابت وموثوق، وصيانةٌ تسبق الأعطال.",
      scope: ["معالجة مركزية", "تحكّم رقمي", "صيانة استباقية"],
    },
    "restaurant-jabal": {
      slug: "restaurant-jabal", image: "luxuryKitchen", category: "مطعم", title: "مطعم راقٍ — جبل عمّان", location: "جبل عمّان", year: "2023",
      summary: "تنقية مياه ومطبخ تجاري بمعايير تشغيل صارمة.",
      challenge: "مطبخٌ تجاري يتطلّب مياهاً نقية وأداءً لا يتوقف في ساعات الذروة.",
      solution: "نظام تنقية عالي التدفّق متكامل مع تجهيز المطبخ التجاري.",
      outcome: "جودةٌ ثابتة وتشغيلٌ موثوق، بلا انقطاع.",
      scope: ["تنقية عالية التدفّق", "تجهيز مطبخ", "صيانة"],
    },
  },
  en: {
    "villa-amman": {
      slug: "villa-amman", image: "featuredProject", category: "Residential villa", title: "An integrated family villa — Amman", location: "Dabouq, Amman", year: "2025",
      summary: "A complete water and energy system for a family villa — from design to operation and maintenance.",
      challenge: "The family wanted a home that combined pure water and energy independence, without juggling contractors or scattered accountability.",
      solution: "We designed one system: whole-house central treatment, a rooftop solar system, and thermal + waterproof insulation — under a single engineering lead.",
      outcome: "Pure water at every tap, a lighter electricity bill, and a home protected for years — under one maintenance contract.",
      scope: ["Central treatment", "Solar energy", "Roof insulation", "Scheduled maintenance"],
    },
    "apartment-abdoun": {
      slug: "apartment-abdoun", image: "heroLifestyle", category: "Residential apartment", title: "A luxury apartment — Abdoun", location: "Abdoun, Amman", year: "2024",
      summary: "Water purification and integrated kitchen finishing for a modern apartment.",
      challenge: "A compact space needed an elegant solution that integrated purification within a refined kitchen finish.",
      solution: "A reverse-osmosis system hidden within the kitchen design, in refined materials, cleanly executed.",
      outcome: "A beautiful, functional kitchen and pure water — with no technical complexity on show.",
      scope: ["Reverse osmosis", "Kitchen finishing", "Premium install"],
    },
    "commercial-tower": {
      slug: "commercial-tower", image: "wholeHouseSystem", category: "Commercial building", title: "An office tower — Abdali", location: "Abdali, Amman", year: "2024",
      summary: "A central water-treatment system for a multi-floor office building.",
      challenge: "A need for reliable treated water around the clock for dozens of offices.",
      solution: "A high-capacity central treatment system with digital control and a proactive maintenance plan.",
      outcome: "Steady, reliable supply, with maintenance that precedes failures.",
      scope: ["Central treatment", "Digital control", "Proactive maintenance"],
    },
    "restaurant-jabal": {
      slug: "restaurant-jabal", image: "luxuryKitchen", category: "Restaurant", title: "A fine restaurant — Jabal Amman", location: "Jabal Amman", year: "2023",
      summary: "Water purification and a commercial kitchen to strict operating standards.",
      challenge: "A commercial kitchen requiring pure water and uninterrupted performance at peak hours.",
      solution: "A high-flow purification system integrated with the commercial kitchen fit-out.",
      outcome: "Consistent quality and reliable operation, without interruption.",
      scope: ["High-flow purification", "Kitchen fit-out", "Maintenance"],
    },
  },
};
