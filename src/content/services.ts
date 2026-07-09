import type { ApprovedImageKey } from "@/config/images";
import type { Locale } from "@/i18n/routing";

export interface ServiceDetail {
  slug: string;
  index: string;
  image: ApprovedImageKey;
  eyebrow: string;
  title: string;
  lead: string;
  overview: string;
  features: { t: string; d: string }[];
  process: string[];
}

type ServiceMap = Record<string, ServiceDetail>;

export const services: Record<Locale, ServiceMap> = {
  ar: {
    water: {
      slug: "water",
      index: "01",
      image: "crystalWater",
      eyebrow: "حلول المياه",
      title: "مياهٌ نقية في كل صنبور",
      lead: "أنظمة فلترة وتناضح عكسي وتنقية مركزية، مصمّمة هندسياً حسب جودة مياهك واحتياج أسرتك — لتشرب وتطبخ وتغتسل بماءٍ تثق به.",
      overview:
        "نبدأ بفحصٍ مجاني لجودة مياهك، ثم نصمّم منظومة تنقية تناسب بيتك تماماً — من فلاتر تحت الحوض والتناضح العكسي إلى أنظمة التنقية المركزية التي تخدم كل الطوابق. معدّاتٌ معتمدة، تركيبٌ نظيف، وصيانةٌ دورية تضمن أداءً ثابتاً على مدى السنوات.",
      features: [
        { t: "تناضح عكسي (RO)", d: "تنقية متعددة المراحل لأنقى مياه شرب في المنزل." },
        { t: "تنقية مركزية", d: "منظومة للمنزل كله تحمي أنظمتك وصحتك معاً." },
        { t: "فحص وتحليل", d: "فحص مجاني لجودة المياه قبل التوصية بأي حل." },
        { t: "صيانة دورية", d: "استبدال الفلاتر ومتابعة الأداء في مواعيد منتظمة." },
      ],
      process: ["فحص جودة المياه", "تصميم المنظومة", "تركيب احترافي", "صيانة دورية"],
    },
    kitchen: {
      slug: "kitchen",
      index: "02",
      image: "luxuryKitchen",
      eyebrow: "تشطيبات المطابخ",
      title: "تشطيباتٌ تليق بقلب البيت",
      lead: "تصميم وتنفيذ تشطيبات المطابخ بخاماتٍ راقية ودقةٍ هندسية، متكاملة مع أنظمة المياه والتنقية.",
      overview:
        "المطبخ قلب البيت، ونحن نتعامل معه بعقلية المهندس وذوق المصمّم. من التخطيط والخامات إلى دمج أنظمة تنقية المياه بأناقة، ننفّذ تشطيباتٍ تجمع الجمال والوظيفة، بمواعيد تُحترم وتنفيذٍ نظيف.",
      features: [
        { t: "تصميم متكامل", d: "تخطيط دقيق يوازن الجمال والوظيفة." },
        { t: "خاماتٌ راقية", d: "مواد معتمدة تدوم وتليق بالمساحة." },
        { t: "تكامل مع المياه", d: "دمج أنيق لأنظمة التنقية ضمن التصميم." },
        { t: "تنفيذٌ نظيف", d: "فريق منظّم ومواعيد واضحة حتى التسليم." },
      ],
      process: ["استشارة وتصميم", "اختيار الخامات", "التنفيذ", "التسليم والمتابعة"],
    },
    solar: {
      slug: "solar",
      index: "03",
      image: "solarEnergy",
      eyebrow: "الطاقة الشمسية",
      title: "طاقةٌ أذكى من شمس الأردن",
      lead: "أنظمة طاقة شمسية وتسخين شمسي توفّر فاتورتك وتمنح بيتك استقلالاً أنظف وأدوم.",
      overview:
        "نصمّم أنظمة الطاقة الشمسية حسب استهلاكك ومساحة سطحك، بمعدّاتٍ معتمدة وضماناتٍ واضحة. من الأنظمة الكهروضوئية إلى السخانات الشمسية، نمنح بيتك طاقةً أنظف وفاتورةً أخف، مع صيانةٍ ومتابعة.",
      features: [
        { t: "أنظمة كهروضوئية", d: "توليد كهرباء نظيفة تخفّض فاتورتك." },
        { t: "تسخين شمسي", d: "سخّانات موفّرة لماءٍ ساخن طوال العام." },
        { t: "تصميم مدروس", d: "حسب استهلاكك ومساحة السطح المتاحة." },
        { t: "ضمان ومتابعة", d: "ضمانات واضحة وصيانة دورية للأداء." },
      ],
      process: ["دراسة الاستهلاك", "تصميم النظام", "التركيب والربط", "صيانة ومتابعة"],
    },
    protection: {
      slug: "protection",
      index: "04",
      image: "roofWaterproofing",
      eyebrow: "عزل وحماية الأسطح",
      title: "عزلٌ يحمي بيتك لسنوات",
      lead: "عزل وحماية الأسطح بمعايير دقيقة تحمي استثمارك من تسرّب الماء وحرارة الصيف.",
      overview:
        "العزل الجيّد يحمي بيتك من الرطوبة والحرارة ويطيل عمر بنيته. نستخدم موادَّ معتمدة وننفّذ بمعايير دقيقة تضمن حمايةً تمتدّ لسنوات، مع فحصٍ للسطح وتوصيةٍ بالحل الأنسب.",
      features: [
        { t: "عزل مائي", d: "حماية من التسرّب والرطوبة عبر الفصول." },
        { t: "عزل حراري", d: "تخفيف حرارة الصيف وتوفير الطاقة." },
        { t: "مواد معتمدة", d: "خامات موثوقة وتنفيذ بمعايير دقيقة." },
        { t: "حماية ممتدة", d: "أداءٌ يدوم لسنوات مع ضمان." },
      ],
      process: ["فحص السطح", "تجهيز وتحضير", "تنفيذ العزل", "فحص وضمان"],
    },
  },
  en: {
    water: {
      slug: "water",
      index: "01",
      image: "crystalWater",
      eyebrow: "Water Solutions",
      title: "Pure water at every tap",
      lead: "Filtration, reverse osmosis and whole-house treatment, engineered to your water quality and your family's needs — so you drink, cook and bathe in water you trust.",
      overview:
        "We start with a free water-quality test, then design a purification system tailored to your home — from under-sink RO to whole-house central treatment serving every floor. Certified equipment, clean installation, and scheduled maintenance for years of steady performance.",
      features: [
        { t: "Reverse osmosis (RO)", d: "Multi-stage purification for the purest drinking water." },
        { t: "Central treatment", d: "A whole-home system protecting your health and appliances." },
        { t: "Test & analysis", d: "A free water-quality test before any recommendation." },
        { t: "Scheduled maintenance", d: "Filter changes and performance checks on time." },
      ],
      process: ["Water test", "System design", "Premium install", "Scheduled maintenance"],
    },
    kitchen: {
      slug: "kitchen",
      index: "02",
      image: "luxuryKitchen",
      eyebrow: "Kitchen Finishing",
      title: "Finishing worthy of the home's heart",
      lead: "Designing and executing kitchen finishes in refined materials and engineering precision, integrated with your water and purification systems.",
      overview:
        "The kitchen is the heart of the home, and we treat it with an engineer's mind and a designer's eye. From planning and materials to elegantly integrating water purification, we deliver finishes that marry beauty and function — on schedule, cleanly executed.",
      features: [
        { t: "Integrated design", d: "Precise planning that balances beauty and function." },
        { t: "Refined materials", d: "Certified materials that last and elevate the space." },
        { t: "Water integration", d: "Elegant integration of purification into the design." },
        { t: "Clean execution", d: "An organized team and clear timelines to handover." },
      ],
      process: ["Consult & design", "Material selection", "Execution", "Handover & follow-up"],
    },
    solar: {
      slug: "solar",
      index: "03",
      image: "solarEnergy",
      eyebrow: "Solar Energy",
      title: "Smarter energy from Jordan's sun",
      lead: "Solar power and solar heating systems that cut your bills and give your home cleaner, lasting independence.",
      overview:
        "We design solar systems around your consumption and roof area, with certified equipment and clear warranties. From photovoltaic systems to solar heaters, we give your home cleaner energy and a lighter bill — with maintenance and follow-up.",
      features: [
        { t: "Photovoltaic systems", d: "Clean generation that lowers your bill." },
        { t: "Solar heating", d: "Efficient heaters for hot water year-round." },
        { t: "Considered design", d: "Sized to your consumption and available roof." },
        { t: "Warranty & follow-up", d: "Clear warranties and scheduled maintenance." },
      ],
      process: ["Consumption study", "System design", "Install & connect", "Maintain & follow-up"],
    },
    protection: {
      slug: "protection",
      index: "04",
      image: "roofWaterproofing",
      eyebrow: "Roof Protection",
      title: "Waterproofing that protects for years",
      lead: "Roof waterproofing and protection to exact standards, shielding your investment from leaks and summer heat.",
      overview:
        "Good insulation protects your home from moisture and heat and extends the life of its structure. We use certified materials and execute to exact standards for protection that lasts years, with a roof inspection and the right recommendation.",
      features: [
        { t: "Waterproofing", d: "Protection from leaks and moisture through the seasons." },
        { t: "Thermal insulation", d: "Reduces summer heat and saves energy." },
        { t: "Certified materials", d: "Trusted materials, precise execution." },
        { t: "Extended protection", d: "Performance that lasts for years, with warranty." },
      ],
      process: ["Roof inspection", "Prep & priming", "Insulation work", "Inspection & warranty"],
    },
  },
};

export const serviceSlugs = ["water", "kitchen", "solar", "protection"] as const;
