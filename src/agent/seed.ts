import type { Payload } from "payload";
import { siteConfig } from "@/config/site";

/**
 * Initial approved knowledge. ONLY facts the company has already supplied are
 * published (identity, contact details, the two campaign offers, the list of
 * product categories as UNCONFIRMED-availability stubs, maintenance procedure).
 * Everything else (prices, specs, warranty, installation terms, coverage
 * details…) is deliberately absent until the company supplies and approves it —
 * see docs/agent/missing-company-information.md.
 */

type L = { ar: string; en: string };
interface Entry {
  key: string;
  category: "company" | "product" | "price" | "maintenance" | "installation" | "warranty" | "coverage" | "faq" | "booking" | "escalation";
  title: L;
  content: L;
  keywords?: L;
  availability?: "n/a" | "unconfirmed" | "available" | "unavailable";
  alwaysInclude?: boolean;
}

const PRODUCT_CATEGORIES: { title: L; keywords: L }[] = [
  { title: { ar: "فلاتر التناضح العكسي سبع مراحل", en: "Seven-stage reverse osmosis water filters" }, keywords: { ar: "فلتر ro اسموزيس 7 مراحل سبع مراحل تحلية", en: "ro reverse osmosis 7 stage seven stage" } },
  { title: { ar: "أنظمة الفلترة التقليدية والرقمية", en: "Traditional and digital filtration systems" }, keywords: { ar: "فلتر تقليدي فلتر ديجيتال رقمي", en: "traditional digital filter" } },
  { title: { ar: "أنظمة التناضح العكسي بدون خزان", en: "Tankless reverse osmosis systems" }, keywords: { ar: "بدون خزان تانكلس", en: "tankless no tank" } },
  { title: { ar: "محطات فلترة للبيت كامل", en: "Whole-home filtration stations" }, keywords: { ar: "محطة فلترة بيت كامل فلتر مركزي", en: "whole home whole house central station" } },
  { title: { ar: "الفلاتر المركزية والجامبو", en: "Central and jumbo filters" }, keywords: { ar: "فلتر مركزي جامبو", en: "central jumbo" } },
  { title: { ar: "مليّنات المياه للمنازل", en: "Home water softeners" }, keywords: { ar: "مليّن سوفتنر كلس عسر الماء", en: "softener limescale hard water" } },
  { title: { ar: "برادات المياه وموزّعات ساخن/بارد", en: "Water coolers and hot/cold dispensers" }, keywords: { ar: "برادة كولر موزع ماء ساخن بارد", en: "cooler dispenser hot cold" } },
  { title: { ar: "الشمعات وطقم الفلاتر البديلة", en: "Replacement cartridges and filter sets" }, keywords: { ar: "شمعات فلاتر بديلة طقم تبديل", en: "cartridge replacement filter set" } },
  { title: { ar: "مضخات رفع ضغط المياه", en: "Water booster pumps" }, keywords: { ar: "بوستر مضخة ضغط مويه", en: "booster pump pressure" } },
  { title: { ar: "أنظمة التناضح العكسي مع أشعة UV", en: "RO systems with UV treatment" }, keywords: { ar: "uv اشعة فوق بنفسجية تعقيم", en: "uv ultraviolet sterilization" } },
  { title: { ar: "منقّيات الهواء", en: "Air purifiers" }, keywords: { ar: "منقي هواء تنقية الهواء", en: "air purifier" } },
];

const ENTRIES: Entry[] = [
  {
    key: "company-intro",
    category: "company",
    alwaysInclude: true,
    title: { ar: "نبذة عن الشركة", en: "About the company" },
    content: {
      ar: "نقي الرابية للمياه والطاقة (NAQI Al Rabieh) شركة أردنية متخصصة بحلول فلترة ومعالجة المياه وخدمات التركيب والصيانة المرتبطة بها. نخدم عمّان والمناطق المحيطة.",
      en: "NAQI Al Rabieh (نقي الرابية للمياه والطاقة) is a Jordanian company specialising in water filtration and treatment solutions and the related installation and maintenance services. We serve Amman and the surrounding areas.",
    },
  },
  {
    key: "company-contact",
    category: "company",
    alwaysInclude: true,
    title: { ar: "بيانات التواصل المعتمدة", en: "Verified contact details" },
    content: {
      ar: `واتساب الاستشارات: ${siteConfig.whatsapp}. هاتف المكتب: ${siteConfig.phoneSecondary}. البريد: ${siteConfig.email}. العنوان: ${siteConfig.address.ar}. ${siteConfig.hours.ar}.`,
      en: `Consultation WhatsApp: ${siteConfig.whatsapp}. Office phone: ${siteConfig.phoneSecondary}. Email: ${siteConfig.email}. Address: ${siteConfig.address.en}. ${siteConfig.hours.en}.`,
    },
    keywords: { ar: "رقم هاتف تواصل عنوان موقع وين مكتب دوام ساعات ايميل", en: "phone number contact address location where office hours email" },
  },
  {
    key: "coverage-general",
    category: "coverage",
    title: { ar: "مناطق الخدمة", en: "Service areas" },
    content: {
      ar: "سوقنا الأساسي عمّان والمناطق المحيطة. توفر الخدمة في كل منطقة بالتحديد بيتأكد منه الفريق بعد معرفة المنطقة.",
      en: "Our main market is Amman and surrounding areas. Availability of service in a specific neighbourhood is confirmed by the team once we know the area.",
    },
    keywords: { ar: "منطقة مناطق تغطية توصيل بتوصلوا بتخدموا", en: "area areas coverage delivery do you serve" },
  },
  {
    key: "maintenance-filters",
    category: "maintenance",
    availability: "available",
    title: { ar: "صيانة الفلاتر وتبديل الشمعات", en: "Filter maintenance and cartridge replacement" },
    content: {
      ar: "نوفر صيانة فلاتر المياه وتبديل الشمعات (الفلاتر البديلة) وفحص أنظمة الفلترة ومتابعة مشاكل ضغط وجودة المياه. تفاصيل ما تشمله كل زيارة وأسعارها تحددها الشركة وتؤكدها لك.",
      en: "We provide water filter maintenance and cartridge replacement, inspection of filtration systems and follow-up of water pressure and quality problems. What each visit includes and its price are set and confirmed by the company.",
    },
    keywords: { ar: "صيانة تغيير شمعات تبديل فلاتر فحص ضغط ضعيف مشكلة", en: "maintenance cartridge replace inspection pressure problem" },
  },
  {
    key: "booking-procedure",
    category: "booking",
    title: { ar: "إجراء حجز الصيانة والمواعيد", en: "Maintenance booking procedure" },
    content: {
      ar: "لطلب صيانة أو موعد: بنسجل نوع الجهاز، الماركة إن عرفتها، وصف المشكلة، المنطقة، والوقت المفضل. بعدها الفريق المختص بيتواصل معك ويثبّت الموعد. الموعد ما بصير مؤكد إلا بعد تأكيد الفريق.",
      en: "To request maintenance or a visit we record the equipment type, brand if known, a description of the problem, your area and preferred time. Our team then contacts you to set the appointment. An appointment is not confirmed until the team confirms it.",
    },
    keywords: { ar: "حجز موعد زيارة فني كيف احجز", en: "book appointment visit technician how to book" },
  },
  {
    key: "escalation-procedure",
    category: "escalation",
    title: { ar: "تحويل المحادثة للفريق", en: "Escalating to the team" },
    content: {
      ar: "الشكاوى وطلبات الخصم ومسائل الضمان وتأكيد المواعيد والاستفسارات اللي ما عندنا لها معلومات معتمدة بتتحول لفريق نقي الرابية، وبيتواصل معك أحد المختصين.",
      en: "Complaints, discount requests, warranty matters, appointment confirmations and questions without approved information are passed to the NAQI Al Rabieh team, and a specialist follows up with you.",
    },
  },
  ...PRODUCT_CATEGORIES.map<Entry>((p, i) => ({
    key: `product-category-${i + 1}`,
    category: "product",
    availability: "unconfirmed",
    title: p.title,
    keywords: p.keywords,
    content: {
      ar: `${p.title.ar} — فئة ضمن كتالوج نقي الرابية. المواصفات والأسعار والتوفر الحالي بيأكدها فريق المبيعات.`,
      en: `${p.title.en} — a category in the NAQI Al Rabieh catalogue. Specifications, prices and current availability are confirmed by the sales team.`,
    },
  })),
];

const OFFERS = [
  {
    key: "filter-maintenance",
    kind: "maintenance" as const,
    title: { ar: "عرض صيانة الفلتر", en: "Filter maintenance offer" },
    priceJOD: 35,
    installationIncluded: "unknown" as const,
  },
  {
    key: "traditional-seven-stage-filter",
    kind: "product" as const,
    title: { ar: "فلتر نقي التقليدي سبع مراحل", en: "Traditional NAQI Seven-Stage Filter" },
    priceJOD: 160,
    installationIncluded: "no" as const,
  },
];

/** Idempotent: existing entries/offers (matched by title / key) are left untouched. */
export async function seedAgentKnowledge(payload: Payload): Promise<{ entries: number; offers: number }> {
  let entries = 0;
  for (const e of ENTRIES) {
    const exists = await payload.find({
      collection: "knowledge-entries",
      where: { source: { equals: `seed:${e.key}` } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      draft: true,
    });
    if (exists.docs[0]) continue;
    const created = await payload.create({
      collection: "knowledge-entries",
      overrideAccess: true,
      locale: "ar",
      draft: false,
      data: {
        category: e.category,
        title: e.title.ar,
        content: e.content.ar,
        keywords: e.keywords?.ar,
        availability: e.availability ?? "n/a",
        alwaysInclude: Boolean(e.alwaysInclude),
        source: `seed:${e.key}`,
        _status: "published",
      },
    });
    await payload.update({
      collection: "knowledge-entries",
      id: created.id,
      overrideAccess: true,
      locale: "en",
      draft: false,
      data: { title: e.title.en, content: e.content.en, keywords: e.keywords?.en, _status: "published" },
    });
    entries++;
  }

  let offers = 0;
  for (const o of OFFERS) {
    const exists = await payload.find({ collection: "offers", where: { key: { equals: o.key } }, limit: 1, depth: 0, overrideAccess: true, draft: true });
    if (exists.docs[0]) continue;
    const created = await payload.create({
      collection: "offers",
      overrideAccess: true,
      locale: "ar",
      draft: false,
      data: { key: o.key, kind: o.kind, title: o.title.ar, priceJOD: o.priceJOD, state: "active", installationIncluded: o.installationIncluded, _status: "published" },
    });
    await payload.update({ collection: "offers", id: created.id, overrideAccess: true, locale: "en", draft: false, data: { title: o.title.en, _status: "published" } });
    offers++;
  }
  return { entries, offers };
}
