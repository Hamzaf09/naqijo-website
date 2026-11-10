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
  /** Optional dedicated SEO overrides (brand suffix is added by the site title template). */
  seoTitle?: L;
  seoDescription?: L;
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
  { key: "water-dispensers", label: { ar: "برادات وموزعات المياه", en: "Water Dispensers" } },
  { key: "filter-cartridges", label: { ar: "فلاتر وقطع غيار", en: "Filter Cartridges & Accessories" } },
  { key: "water-pumps", label: { ar: "مضخات المياه", en: "Water Pumps" } },
  { key: "air-purification", label: { ar: "تنقية الهواء", en: "Air Purification" } },
];

export function getCategoryLabel(key: string): L | undefined {
  return productCategories.find((c) => c.key === key)?.label;
}

export const products: Product[] = [
  {
    slug: "jumbo-filter",
    categoryKey: "central-filtration",
    availability: "available",
    name: {
      ar: "فلتر مياه مركزي نقي جامبو – 3 مراحل",
      en: "Naqi Jumbo Central Water Filter – 3 Stages",
    },
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
      width: 1162,
      height: 1400,
      alt: { ar: "فلتر مياه مركزي نقي جامبو – 3 مراحل", en: "Naqi Jumbo Central Water Filter – 3 Stages" },
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
    name: {
      ar: "سوفتنر نقي منزلي – تجديد أوتوماتيكي",
      en: "Naqi Home Water Softener – Automatic Regeneration",
    },
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
      alt: { ar: "سوفتنر نقي منزلي – تجديد أوتوماتيكي", en: "Naqi Home Water Softener – Automatic Regeneration" },
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
    name: {
      ar: "فلتر مياه نقي ديجيتال – 8 مراحل",
      en: "Naqi Digital 8-Stage Water Filter",
    },
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
      width: 917,
      height: 1400,
      alt: { ar: "فلتر مياه نقي ديجيتال – 8 مراحل", en: "Naqi Digital 8-Stage Water Filter" },
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
  {
    slug: "ro-system-7stage",
    categoryKey: "drinking-water",
    availability: "available",
    name: {
      ar: "فلتر مياه نقي – 7 مراحل تناضح عكسي (RO)",
      en: "Naqi 7-Stage RO Water Filter",
    },
    shortDescription: {
      ar: "نظام تنقية مياه الشرب بالتناضح العكسي عبر سبع مراحل، مزوّد بمضخة دفع وخزان تخزين وصنبور مخصّص، لمياهٍ نقية ومتوازنة الطعم.",
      en: "A seven-stage reverse-osmosis drinking-water system with a booster pump, storage tank and dedicated faucet — for pure, balanced-tasting water.",
    },
    fullDescription: {
      ar: "يعالج النظام مياه الشرب عبر سبع مراحل متتابعة: حشوة سيديمنت PP لإزالة الرواسب، ثم كربون حبيبي وكربون مكتل لإزالة الكلور والطعم والرائحة، فغشاء التناضح العكسي الذي يزيل الأملاح والشوائب الدقيقة، تليها مراحل ما بعد المعالجة لإعادة إضافة المعادن ورفع القلوية (ORP) وإضافة الهيدروجين. تدعمه مضخة دفع لأداءٍ ثابت، مع خزان تخزين وصنبور مخصّص للاستخدام اليومي. مصمّم للتركيب أسفل الحوض.",
      en: "The system treats drinking water through seven sequential stages: a PP sediment cartridge removes particles; granular and carbon-block stages remove chlorine, taste and odour; the reverse-osmosis membrane rejects dissolved salts and fine contaminants; and post-treatment stages remineralize, raise alkalinity (ORP) and add hydrogen. A booster pump keeps performance steady, and a storage tank with a dedicated faucet serves everyday use. Designed for under-sink installation.",
    },
    image: {
      src: "/images/products/ro-system-7stage.webp",
      width: 1400,
      height: 947,
      alt: { ar: "فلتر مياه نقي – 7 مراحل تناضح عكسي (RO)", en: "Naqi 7-Stage RO Water Filter" },
    },
    gallery: [],
    features: [
      { ar: "سبع مراحل تنقية", en: "Seven purification stages" },
      { ar: "غشاء تناضح عكسي", en: "Reverse-osmosis membrane" },
      { ar: "مراحل معادن وقلوية وهيدروجين", en: "Mineral, alkaline and hydrogen stages" },
      { ar: "مضخة دفع وخزان وصنبور مخصّص", en: "Booster pump, tank and dedicated faucet" },
    ],
    specs: [
      { label: { ar: "مراحل التنقية", en: "Purification stages" }, value: { ar: "سبع مراحل", en: "7 stages" } },
      { label: { ar: "التقنية", en: "Technology" }, value: { ar: "تناضح عكسي", en: "Reverse osmosis" } },
      { label: { ar: "ما بعد المعالجة", en: "Post-treatment" }, value: { ar: "معادن + ORP قلوي + هيدروجين", en: "Mineral + ORP alkaline + hydrogen" } },
      { label: { ar: "التركيب", en: "Installation" }, value: { ar: "أسفل الحوض", en: "Under-sink" } },
      { label: { ar: "الملحقات", en: "Includes" }, value: { ar: "مضخة دفع + خزان + صنبور", en: "Booster pump + tank + faucet" } },
    ],
  },
  {
    slug: "water-dispenser-hot-cold",
    categoryKey: "water-dispensers",
    availability: "available",
    name: {
      ar: "كولر مياه نقي – ساخن وبارد، مكتبي",
      en: "Naqi Countertop Hot & Cold Water Cooler",
    },
    shortDescription: {
      ar: "موزّع مياه سطحي أنيق يقدّم الماء الساخن والبارد بلمسة زر، بتصميمٍ عصري يناسب المطبخ والمكتب.",
      en: "A sleek countertop dispenser that serves hot and cold water at the touch of a button, with a modern design for kitchen or office.",
    },
    fullDescription: {
      ar: "برّاد مياه سطحي يوفّر الماء الساخن والبارد عبر لوحة تحكّم لمسية سهلة الاستخدام، مع صنبورين منفصلين ومؤشّرات واضحة. تصميمه المدمج والأنيق يجعله مناسباً للمنزل والمكتب، ويكمّل أنظمة التنقية بتقديم مياهٍ جاهزة بالحرارة المطلوبة في أي وقت.",
      en: "A countertop water dispenser that delivers hot and cold water through an easy touch-control panel, with two separate taps and clear indicators. Its compact, elegant design suits home and office, and it complements purification systems by serving ready-to-drink water at the temperature you want.",
    },
    image: {
      src: "/images/products/water-dispenser.webp",
      width: 871,
      height: 1400,
      alt: { ar: "كولر مياه نقي – ساخن وبارد، مكتبي", en: "Naqi Countertop Hot & Cold Water Cooler" },
    },
    gallery: [],
    features: [
      { ar: "ماء ساخن وبارد", en: "Hot and cold water" },
      { ar: "تحكّم لمسي", en: "Touch controls" },
      { ar: "تصميم سطحي عصري", en: "Modern countertop design" },
    ],
    specs: [
      { label: { ar: "المخارج", en: "Outputs" }, value: { ar: "ساخن وبارد", en: "Hot & cold" } },
      { label: { ar: "التحكّم", en: "Controls" }, value: { ar: "لوحة لمسية", en: "Touch panel" } },
      { label: { ar: "التركيب", en: "Placement" }, value: { ar: "سطحي", en: "Countertop" } },
      { label: { ar: "الاستخدام", en: "Best for" }, value: { ar: "المنزل والمكتب", en: "Home & office" } },
    ],
  },
  {
    slug: "tankless-ro-purifier",
    categoryKey: "drinking-water",
    availability: "available",
    name: {
      ar: "فلتر مياه نقي RO بدون خزان – تحت المجلى",
      en: "Naqi Tankless RO Water Filter – Under-Sink",
    },
    shortDescription: {
      ar: "منقّي مياه شرب بالتناضح العكسي بتصميمٍ مدمج بدون خزّان، يوفّر مياهاً نقية مباشرةً ويشغل حيّزاً أقل أسفل الحوض.",
      en: "A compact tankless reverse-osmosis drinking-water purifier that delivers pure water on demand while taking up less space under the sink.",
    },
    fullDescription: {
      ar: "يعتمد هذا المنقّي على تقنية التناضح العكسي ضمن هيكلٍ مغلق ومدمج بدون خزّان تخزين، فيقدّم مياه شربٍ نقية مباشرةً عند الطلب. تصميمه العملي يقلّل المساحة المطلوبة أسفل الحوض ويسهّل التركيب والصيانة، ليمنحك مياهاً نظيفة بأناقةٍ وبساطة.",
      en: "This purifier uses reverse-osmosis technology inside a sealed, compact tankless housing, delivering pure drinking water directly on demand. Its practical design reduces the space needed under the sink and simplifies installation and maintenance — giving you clean water, elegantly and simply.",
    },
    image: {
      src: "/images/products/tankless-ro.webp",
      width: 1175,
      height: 1400,
      alt: { ar: "فلتر مياه نقي RO بدون خزان – تحت المجلى", en: "Naqi Tankless RO Water Filter – Under-Sink" },
    },
    gallery: [],
    features: [
      { ar: "تصميم بدون خزّان", en: "Tankless design" },
      { ar: "تناضح عكسي", en: "Reverse osmosis" },
      { ar: "هيكل مدمج موفّر للمساحة", en: "Compact, space-saving body" },
    ],
    specs: [
      { label: { ar: "التقنية", en: "Technology" }, value: { ar: "تناضح عكسي", en: "Reverse osmosis" } },
      { label: { ar: "التصميم", en: "Design" }, value: { ar: "بدون خزّان (مدمج)", en: "Tankless (compact)" } },
      { label: { ar: "التركيب", en: "Installation" }, value: { ar: "أسفل الحوض", en: "Under-sink" } },
      { label: { ar: "المخرجات", en: "Output" }, value: { ar: "مياه شرب نقية", en: "Pure drinking water" } },
    ],
  },
  {
    slug: "whole-home-treatment-station",
    categoryKey: "central-filtration",
    availability: "on-order",
    name: {
      ar: "محطة معالجة مياه نقي المتكاملة للفلل والمنازل",
      en: "Naqi Whole-Home Water Treatment Station",
    },
    shortDescription: {
      ar: "محطة معالجة متكاملة تجمع خزّانات الوسائط ومعالجة العسر مع مرحلة فلترة/تناضح، لتزويد المنزل بأكمله بمياهٍ نظيفة ومعالجة.",
      en: "An integrated treatment station that combines media tanks and hardness treatment with a filtration/RO stage, supplying the whole home with clean, treated water.",
    },
    fullDescription: {
      ar: "محطة معالجة مياه متكاملة مصمّمة للفلل والمنازل الكبيرة والاستخدامات ذات الاستهلاك العالي. تضمّ خزّاني وسائط لمعالجة العسر والفلترة مع صمّام تحكّم رقمي وخزان محلول للتجديد، إضافةً إلى مرحلة فلترة/تناضح عكسي. تعالج المياه عند المصدر لحماية الشبكة والأجهزة وتوفير جودة مياهٍ ثابتة في كل نقاط الاستخدام. يُحدَّد التكوين المناسب حسب جودة المياه وحجم الاستهلاك عبر استشارةٍ هندسية.",
      en: "An integrated water-treatment station designed for villas, large homes and higher-demand uses. It combines media tanks for hardness treatment and filtration with a digital control valve and a brine tank for regeneration, plus a filtration / reverse-osmosis stage. It treats water at the source to protect the plumbing and appliances and to deliver consistent water quality at every point of use. The right configuration is set to your water quality and demand through an engineering consultation.",
    },
    image: {
      src: "/images/products/treatment-station.webp",
      width: 1011,
      height: 1400,
      alt: { ar: "محطة معالجة مياه نقي المتكاملة للفلل والمنازل", en: "Naqi Whole-Home Water Treatment Station" },
    },
    gallery: [],
    features: [
      { ar: "خزّانات وسائط لمعالجة العسر والفلترة", en: "Media tanks for softening and filtration" },
      { ar: "صمّام تحكّم رقمي وخزان تجديد", en: "Digital control valve and regeneration tank" },
      { ar: "مرحلة فلترة/تناضح عكسي", en: "Filtration / reverse-osmosis stage" },
      { ar: "معالجة للمنزل بالكامل", en: "Whole-home treatment" },
    ],
    specs: [
      { label: { ar: "المكوّنات", en: "Components" }, value: { ar: "خزّانات وسائط + خزان محلول + مرحلة تناضح", en: "Media tanks + brine tank + RO stage" } },
      { label: { ar: "التحكّم", en: "Control" }, value: { ar: "صمّام رقمي", en: "Digital valve" } },
      { label: { ar: "النطاق", en: "Coverage" }, value: { ar: "المنزل بالكامل", en: "Whole home" } },
      { label: { ar: "الأنسب لـ", en: "Best for" }, value: { ar: "الفلل والاستهلاك العالي", en: "Villas & high demand" } },
      { label: { ar: "التكوين", en: "Configuration" }, value: { ar: "حسب استشارة هندسية", en: "Per engineering consultation" } },
    ],
  },
  {
    slug: "replacement-cartridge-set",
    categoryKey: "filter-cartridges",
    availability: "available",
    name: {
      ar: "طقم شمعات فلتر نقي بديلة – كربون وترسيب",
      en: "Naqi Replacement Filter Cartridge Set – GAC, Carbon Block & Sediment",
    },
    shortDescription: {
      ar: "طقم حشوات بديلة يشمل الكربون الحبيبي والكربون المكتل وحشوة السيديمنت، للحفاظ على أداء نظام التنقية وجودة المياه.",
      en: "A replacement cartridge set — granular carbon, carbon block and sediment — to keep your purification system performing and your water quality high.",
    },
    fullDescription: {
      ar: "طقم حشوات بديلة يضمّ حشوة الكربون الحبيبي (GAC) لإزالة الكلور والطعم والرائحة، وحشوة الكربون المكتل لالتقاط الشوائب الدقيقة والعضوية، وحشوة السيديمنت (PP) لإزالة الرواسب والعوالق. الاستبدال الدوري للحشوات هو أساس الحفاظ على كفاءة نظام التنقية وسلامة المياه، ويُنصَح باستبداله ضمن جداول الصيانة الموصى بها.",
      en: "A replacement cartridge set that includes a granular activated carbon (GAC) cartridge to remove chlorine, taste and odour, a carbon-block cartridge to capture fine and organic impurities, and a PP sediment cartridge to remove particles and turbidity. Periodic cartridge replacement is the foundation of keeping a purification system efficient and the water safe — replace it within the recommended maintenance schedule.",
    },
    image: {
      src: "/images/products/filter-cartridges.webp",
      width: 1362,
      height: 1400,
      alt: { ar: "طقم شمعات فلتر نقي بديلة – كربون وترسيب", en: "Naqi Replacement Filter Cartridge Set – GAC, Carbon Block & Sediment" },
    },
    seoTitle: {
      ar: "طقم شمعات فلتر نقي بديلة – كربون وترسيب",
      en: "Naqi Replacement Filter Cartridge Set – GAC & Carbon Block",
    },
    gallery: [],
    features: [
      { ar: "حشوة كربون حبيبي (GAC)", en: "Granular activated carbon (GAC)" },
      { ar: "حشوة كربون مكتل", en: "Carbon-block cartridge" },
      { ar: "حشوة سيديمنت PP", en: "PP sediment cartridge" },
    ],
    specs: [
      { label: { ar: "المكوّنات", en: "Set contents" }, value: { ar: "كربون حبيبي + كربون مكتل + سيديمنت", en: "GAC + carbon block + sediment" } },
      { label: { ar: "الاستخدام", en: "Use" }, value: { ar: "حشوات بديلة", en: "Replacement cartridges" } },
      { label: { ar: "الغرض", en: "Purpose" }, value: { ar: "صيانة أنظمة التنقية", en: "Purifier maintenance" } },
    ],
  },
  {
    slug: "water-booster-pump",
    categoryKey: "water-pumps",
    availability: "available",
    name: {
      ar: "مضخة تقوية ضغط مياه نقي – أوتوماتيك، ستانلس ستيل",
      en: "Naqi Automatic Water Booster Pump – Stainless Steel",
    },
    shortDescription: {
      ar: "مضخة سطحية لتقوية ضغط المياه مزوّدة بمنظّم ضغط أوتوماتيكي، لتحسين تدفّق المياه في المنزل وتشغيلٍ ذكي عند الحاجة.",
      en: "A surface booster pump with an automatic pressure controller that improves water flow around the home and runs on demand.",
    },
    fullDescription: {
      ar: "مضخة مياه سطحية بجسمٍ من الستانلس ستيل مصمّمة لتقوية ضغط المياه وتحسين التدفّق عند نقاط الاستخدام. تعمل مع منظّم ضغط أوتوماتيكي يشغّل المضخة ويوقفها تلقائياً حسب الطلب، مع حماية من التشغيل الجاف، ما يوفّر أداءً ثابتاً واستهلاكاً أذكى للطاقة. مناسبة للمنازل والتطبيقات التي تعاني من ضعف ضغط المياه.",
      en: "A surface water pump with a stainless-steel body, designed to boost pressure and improve flow at points of use. It works with an automatic pressure controller that starts and stops the pump on demand, with dry-running protection, for steady performance and smarter energy use. Ideal for homes and applications that suffer from low water pressure.",
    },
    image: {
      src: "/images/products/booster-pump.webp",
      width: 1203,
      height: 1400,
      alt: { ar: "مضخة تقوية ضغط مياه نقي – أوتوماتيك، ستانلس ستيل", en: "Naqi Automatic Water Booster Pump – Stainless Steel" },
    },
    gallery: [],
    features: [
      { ar: "منظّم ضغط أوتوماتيكي", en: "Automatic pressure controller" },
      { ar: "جسم ستانلس ستيل", en: "Stainless-steel body" },
      { ar: "تشغيل عند الطلب", en: "Runs on demand" },
    ],
    specs: [
      { label: { ar: "النوع", en: "Type" }, value: { ar: "مضخة سطحية", en: "Surface pump" } },
      { label: { ar: "التحكّم", en: "Control" }, value: { ar: "منظّم ضغط أوتوماتيكي", en: "Automatic pressure controller" } },
      { label: { ar: "الجسم", en: "Body" }, value: { ar: "ستانلس ستيل", en: "Stainless steel" } },
      { label: { ar: "الاستخدام", en: "Best for" }, value: { ar: "تقوية ضغط المياه", en: "Boosting water pressure" } },
    ],
  },
  {
    slug: "air-purifier",
    categoryKey: "air-purification",
    availability: "available",
    name: {
      ar: "جهاز تنقية هواء نقي – شاشة رقمية ولمس",
      en: "Naqi Digital Air Purifier – Touch Control",
    },
    shortDescription: {
      ar: "جهاز تنقية هواء منزلي بتصميمٍ عصري وشاشة رقمية وتحكّمٍ لمسي، لهواءٍ أنظف وأكثر انتعاشاً في الغرفة.",
      en: "A home air purifier with a modern design, digital display and touch control — for cleaner, fresher room air.",
    },
    fullDescription: {
      ar: "جهاز تنقية هواء منزلي يسحب هواء الغرفة عبر مداخل حول الجسم ويعيده أنظف، بتصميمٍ أسطواني أنيق وشاشة رقمية تعرض حالة التشغيل ولوحة تحكّم لمسية في الأعلى. يكمّل رؤية نقي الرابية لبيئةٍ منزلية أنقى بالانتقال من نقاء الماء إلى نقاء الهواء. تُحدَّد المساحة المناسبة والاستخدام الأمثل حسب الغرفة.",
      en: "A home air purifier that draws room air through intakes around its body and returns it cleaner, in an elegant cylindrical design with a digital status display and a touch-control panel on top. It extends Naqi Al-Rabia's vision of a purer home — from pure water to pure air. The suitable coverage and best use are matched to your room.",
    },
    image: {
      src: "/images/products/air-purifier.webp",
      width: 773,
      height: 1400,
      alt: { ar: "جهاز تنقية هواء نقي – شاشة رقمية ولمس", en: "Naqi Digital Air Purifier – Touch Control" },
    },
    gallery: [],
    features: [
      { ar: "تنقية هواء الغرفة", en: "Room air purification" },
      { ar: "شاشة رقمية", en: "Digital display" },
      { ar: "تحكّم لمسي", en: "Touch control" },
    ],
    specs: [
      { label: { ar: "النوع", en: "Type" }, value: { ar: "منقّي هواء منزلي", en: "Home air purifier" } },
      { label: { ar: "الشاشة", en: "Display" }, value: { ar: "رقمية", en: "Digital" } },
      { label: { ar: "التحكّم", en: "Controls" }, value: { ar: "لمسي", en: "Touch" } },
      { label: { ar: "التركيب", en: "Placement" }, value: { ar: "محمول/أرضي", en: "Freestanding" } },
    ],
  },
  {
    slug: "ro-bn01",
    categoryKey: "drinking-water",
    availability: "available",
    name: {
      ar: "فلتر مياه نقي RO-BN01 – تناضح عكسي مع UV بدون خزان",
      en: "Naqi RO-BN01 Tankless RO Water Filter with UV",
    },
    shortDescription: {
      ar: "منظومة تناضح عكسي بدون خزّان مع تعقيم بالأشعّة فوق البنفسجية (UV) ولوحة تحكّم لمسية ذكية، لمياه شربٍ نقية ومعقّمة.",
      en: "A tankless reverse-osmosis system with UV sterilization and a smart touch panel, for pure, sterilized drinking water.",
    },
    fullDescription: {
      ar: "يجمع RO-BN01 بين التناضح العكسي والتعقيم بالأشعّة فوق البنفسجية (UV) في هيكلٍ أنيق مدمج بدون خزّان. يزيل غشاء التناضح العكسي الأملاح والشوائب الدقيقة، بينما تقضي مرحلة الـ UV على الجراثيم لمياهٍ نقية ومعقّمة. تعرض لوحة التحكّم اللمسية حالة الطاقة والفلاتر والخزان والـ UV مع مؤشّر لعمر الحشوات، إضافةً إلى زرَّي الغسيل (Flush) وإعادة الضبط (Reset). يأتي النظام بطقم تركيب كامل يشمل صنبوراً مخصّصاً وأنابيب ومثبّتات. حاصل على شهادتَي CE وISO 9001.",
      en: "The RO-BN01 combines reverse osmosis with UV sterilization in a sleek, compact tankless body. The RO membrane rejects dissolved salts and fine contaminants while the UV stage inactivates microorganisms for pure, sterilized water. Its touch panel shows power, filter, tank and UV status with a filter-life indicator, plus Flush and Reset controls. The system ships with a complete installation kit — a dedicated faucet, tubing and fittings. Certified to CE and ISO 9001.",
    },
    image: {
      src: "/images/products/ro-bn01.webp",
      width: 1086,
      height: 1448,
      alt: { ar: "فلتر مياه نقي RO-BN01 – تناضح عكسي مع UV بدون خزان", en: "Naqi RO-BN01 Tankless RO Water Filter with UV" },
    },
    gallery: [],
    features: [
      { ar: "تناضح عكسي مع تعقيم UV", en: "Reverse osmosis with UV sterilization" },
      { ar: "تصميم مدمج بدون خزّان", en: "Compact tankless design" },
      { ar: "لوحة تحكّم لمسية ذكية بمؤشّرات", en: "Smart touch panel with status indicators" },
      { ar: "طقم تركيب كامل مع صنبور مخصّص", en: "Complete install kit with a dedicated faucet" },
    ],
    specs: [
      { label: { ar: "الطراز", en: "Model" }, value: { ar: "RO-BN01", en: "RO-BN01" } },
      { label: { ar: "التقنية", en: "Technology" }, value: { ar: "تناضح عكسي + UV", en: "Reverse osmosis + UV" } },
      { label: { ar: "غشاء التناضح", en: "RO membrane" }, value: { ar: "75 جالون/يوم", en: "75 GPD" } },
      { label: { ar: "التصميم", en: "Design" }, value: { ar: "بدون خزّان (مدمج)", en: "Tankless (compact)" } },
      { label: { ar: "التحكّم", en: "Controls" }, value: { ar: "لوحة لمسية ومؤشّرات", en: "Touch panel + indicators" } },
      { label: { ar: "الشهادات", en: "Certifications" }, value: { ar: "CE و ISO 9001", en: "CE, ISO 9001" } },
    ],
  },
  {
    slug: "naqi-m445-softening-resin",
    categoryKey: "water-softening",
    availability: "available",
    name: {
      ar: "رزن تليين المياه نقي M445 – 25 كغ",
      en: "NAQI M445 Softening Resin – 25 kg",
    },
    seoTitle: {
      ar: "رزن تليين المياه نقي M445 – عبوة 25 كغ",
      en: "NAQI M445 Softening Resin, 25 kg Bag",
    },
    seoDescription: {
      ar: "رزن تبادل كاتيوني قوي الحموضة (Na⁺) لأجهزة تليين المياه، بسعة تبادل ≥2.0 مكافئ/لتر وعبوة 25 كغ. متوفر في الأردن.",
      en: "Strong-acid cation (Na⁺ form) softening resin with ≥2.0 eq/L exchange capacity, supplied in a 25 kg bag. Available in Jordan.",
    },
    shortDescription: {
      ar: "رزن تبادل كاتيوني قوي الحموضة (شكل الصوديوم) عالي السعة لأجهزة تليين المياه، بحبيبات منتظمة وثبات عالٍ للحبيبات، حصرياً لنقي الدولية.",
      en: "A high-capacity strong-acid cation exchange resin (Na⁺ form) for water softeners, with uniform beads and high bead integrity — exclusive to NAQI International.",
    },
    fullDescription: {
      ar: "نقي M445 رزن تبادل أيوني من النوع الكاتيوني القوي الحموضة (شكل الصوديوم Na⁺)، مصمّم لأجهزة تليين المياه. تأتي حبيباته بحجم منتظم يتراوح بين 0.3 و1.2 ملم، ويتميّز بسعة تبادل عالية لا تقل عن 2.0 مكافئ/لتر (4.5 مكافئ/كغ جاف) وبثبات للحبيبات لا يقل عن 95%. يُشار على عبوته إلى معيار NSF/ANSI/CAN 61 للاستخدام مع مياه الشرب. يُورَّد في عبوة صافي وزنها 25 كغ، وهو منتج حصري لنقي الدولية.",
      en: "NAQI M445 is a strong-acid cation exchange resin (sodium, Na⁺ form) designed for water softeners. Its beads are uniformly sized between 0.3 and 1.2 mm, with a high exchange capacity of at least 2.0 eq/L (4.5 eq/kg dry) and bead integrity of 95% or better. It is marked NSF/ANSI/CAN 61 for drinking-water use. Supplied in a 25 kg net-weight bag, and exclusive to NAQI International.",
    },
    image: {
      src: "/images/products/naqi-m445-resin.webp",
      width: 1050,
      height: 1400,
      alt: {
        ar: "عبوة رزن تليين المياه نقي M445 وزن 25 كغ",
        en: "NAQI M445 premium softening resin, 25 kg bag",
      },
    },
    gallery: [],
    features: [
      { ar: "تبادل كاتيوني قوي الحموضة (Na⁺)", en: "Strong-acid cation exchange (Na⁺ form)" },
      { ar: "سعة تبادل عالية ≥ 2.0 مكافئ/لتر", en: "High exchange capacity ≥ 2.0 eq/L" },
      { ar: "حبيبات منتظمة 0.3–1.2 ملم", en: "Uniform 0.3–1.2 mm beads" },
      { ar: "ثبات الحبيبات ≥ 95%", en: "Bead integrity ≥ 95%" },
      { ar: "NSF/ANSI/CAN 61 لمياه الشرب", en: "NSF/ANSI/CAN 61 for drinking water" },
    ],
    specs: [
      { label: { ar: "نوع الرزن", en: "Resin type" }, value: { ar: "كاتيوني قوي الحموضة", en: "Strong acid cation" } },
      { label: { ar: "الشكل الأيوني", en: "Ionic form" }, value: { ar: "صوديوم (Na⁺)", en: "Sodium (Na⁺)" } },
      { label: { ar: "سعة التبادل الكلية", en: "Total exchange capacity" }, value: { ar: "≥ 2.0 مكافئ/لتر", en: "≥ 2.0 eq/L" } },
      { label: { ar: "السعة الوزنية", en: "Gravimetric capacity" }, value: { ar: "≥ 4.5 مكافئ/كغ (جاف)", en: "≥ 4.5 eq/kg (dry)" } },
      { label: { ar: "حجم الحبيبات", en: "Particle size" }, value: { ar: "0.3–1.2 ملم", en: "0.3–1.2 mm" } },
      { label: { ar: "ثبات الحبيبات", en: "Bead integrity" }, value: { ar: "≥ 95%", en: "≥ 95%" } },
      { label: { ar: "الاستخدام", en: "Application" }, value: { ar: "تليين المياه", en: "Water softening" } },
      { label: { ar: "المعيار المذكور على العبوة", en: "Standard (per packaging)" }, value: { ar: "NSF/ANSI/CAN 61", en: "NSF/ANSI/CAN 61" } },
      { label: { ar: "صافي الوزن", en: "Net weight" }, value: { ar: "25 كغ", en: "25 kg" } },
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
