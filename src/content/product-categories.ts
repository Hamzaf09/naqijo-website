import type { Locale } from "@/i18n/routing";
import type { ApprovedImageKey } from "@/config/images";

/**
 * SEO copy for the indexable product-category landing pages
 * (`/[locale]/products/category/[category]`). One entry per category key in
 * `products.static.ts`. Each page owns a specific commercial search intent;
 * the broad `/products` catalog remains the hub.
 *
 * Market terminology (English technical term + common Jordanian transliteration)
 * is introduced ONCE, naturally, per concept — not stuffed. Nothing here claims
 * a capability a product doesn't have; copy stays general where products vary.
 */

type L = Record<Locale, string>;

export interface CategoryContent {
  key: string;
  image: ApprovedImageKey;
  title: L; // page H1
  metaTitle: L;
  metaDescription: L;
  lead: L; // hero lead sentence
  intro: L[]; // body paragraphs (semantic, terminology-aware)
}

export const categoryContent: Record<string, CategoryContent> = {
  "drinking-water": {
    key: "drinking-water",
    image: "underSinkSystem",
    title: {
      ar: "أنظمة تنقية مياه الشرب",
      en: "Drinking-Water Purification Systems",
    },
    metaTitle: {
      ar: "فلاتر مياه الشرب وأنظمة التناضح العكسي RO",
      en: "Drinking Water Filters & Reverse Osmosis (RO) Systems",
    },
    metaDescription: {
      ar: "أنظمة تنقية مياه الشرب من نقي الرابية: فلاتر متعددة المراحل وأنظمة التناضح العكسي (RO) للمنازل في عمّان والأردن.",
      en: "Naqi Al Rabia drinking-water purification: multi-stage filters and reverse-osmosis (RO) systems for homes in Amman and Jordan.",
    },
    lead: {
      ar: "ماءُ شربٍ نقي من صنبورك مباشرة، عبر أنظمة تنقية مصمّمة حسب جودة مياهك واحتياج أسرتك.",
      en: "Pure drinking water straight from your tap, through purification systems matched to your water quality and household needs.",
    },
    intro: [
      {
        ar: "تُعنى هذه الفئة بأنظمة تنقية مياه الشرب المنزلية، وأشهرها أنظمة التناضح العكسي (Reverse Osmosis)، والمعروفة في السوق المحلي باسم RO أو «فلتر آر أو». تعتمد هذه الأنظمة على مراحل تنقية متعددة لإنتاج مياه شربٍ معالجة، وتتوفر بتصاميم مختلفة تشمل الأنظمة ذات الخزان والأنظمة بدون خزان (Tankless / «تانك ليس»).",
        en: "This category covers home drinking-water purification systems — most commonly reverse osmosis (RO), which the local market also calls «آر أو». These systems use multiple purification stages to produce treated drinking water, and come in both tank and tankless designs.",
      },
      {
        ar: "تختلف عدد المراحل من نظامٍ لآخر (مثل فلاتر متعددة المراحل وبعض الطُرز بسبع مراحل «فلتر 7 مراحل»)، لذا نبدأ دائماً بفحص جودة مياهك ثم نوصي بالنظام الأنسب. تصفّح المنتجات أدناه، وإن لم تكن متأكداً فاحجز استشارة هندسية مجانية.",
        en: "Stage counts differ between systems (multi-stage filters, including some seven-stage models), so we start by assessing your water quality and then recommend the right system. Browse the products below, or book a free engineering consultation if you're unsure.",
      },
    ],
  },
  "water-softening": {
    key: "water-softening",
    image: "wholeHouseSystem",
    title: {
      ar: "أجهزة معالجة عسر المياه",
      en: "Water Softening Systems",
    },
    metaTitle: {
      ar: "معالجة عسر المياه وإزالة الكلس (Water Softener / سوفتنر)",
      en: "Water Softeners & Hard-Water Treatment",
    },
    metaDescription: {
      ar: "أجهزة معالجة عسر المياه (Water Softener / سوفتنر) من نقي الرابية لتقليل الكلس وحماية سخانات وأنابيب منزلك في عمّان والأردن.",
      en: "Naqi Al Rabia water softeners for hard-water and limescale treatment — protecting your home's heaters and plumbing across Amman and Jordan.",
    },
    lead: {
      ar: "عالِج عسر المياه والكلس قبل أن يضرّ بسخاناتك وأنابيبك وأجهزتك.",
      en: "Treat hard water and limescale before it damages your heaters, plumbing and appliances.",
    },
    intro: [
      {
        ar: "جهاز معالجة عسر المياه، المعروف بالإنجليزية باسم Water Softener وباسم «سوفتنر» في الاستخدام المتداول، يساعد على معالجة مشكلة عسر المياه ضمن الاستخدام المناسب للنظام. عسر المياه هو ارتفاع نسبة الأملاح المعدنية التي تترسّب على شكل «كلس» داخل الأنابيب والسخانات والصنابير.",
        en: "A water softener — «سوفتنر» in local usage — helps address hard-water problems when correctly specified for your home. Hard water carries a high level of dissolved minerals that build up as limescale inside pipes, heaters and taps.",
      },
      {
        ar: "معالجة عسر المياه تطيل عمر أجهزتك وتحسّن أداء أنظمة التسخين. نبدأ بفحص عسر مياهك ثم نوصي بالحلّ المناسب لحجم منزلك واستهلاكك.",
        en: "Softening extends the life of your appliances and improves heating performance. We start by testing your water hardness, then recommend a solution sized to your home and usage.",
      },
    ],
  },
  "central-filtration": {
    key: "central-filtration",
    image: "wholeHouseSystem",
    title: {
      ar: "أنظمة الفلترة المركزية للمنزل",
      en: "Central Whole-Home Filtration",
    },
    metaTitle: {
      ar: "فلتر مياه مركزي للمنزل (Central Filter / سنترال فلتر)",
      en: "Central Water Filtration Systems for the Whole Home",
    },
    metaDescription: {
      ar: "أنظمة الفلترة المركزية (سنترال فلتر) من نقي الرابية تعالج المياه الداخلة إلى المنزل بالكامل — لكل صنبورٍ وطابق في عمّان والأردن.",
      en: "Naqi Al Rabia central (whole-home) filtration treats the water entering your entire home — every tap and floor — across Amman and Jordan.",
    },
    lead: {
      ar: "مياهٌ أنظف في كل صنبورٍ بالمنزل، من نقطة الدخول وحتى آخر طابق.",
      en: "Cleaner water at every tap in the home, from the point of entry to the top floor.",
    },
    intro: [
      {
        ar: "الفلترة المركزية، أو «سنترال فلتر» (Central Filter) كما تُعرف في السوق، تعالج المياه عند نقطة دخولها إلى المنزل بحيث تخدم كل الصنابير والطوابق دفعةً واحدة — لا نقطة استخدامٍ واحدة فقط. تحمي هذه الأنظمة أنابيبك وأجهزتك وتحسّن جودة المياه في الاستحمام والغسيل.",
        en: "Central filtration — a «سنترال فلتر» in local terms — treats water where it enters the home, so every tap and floor is served at once rather than a single point of use. It protects your plumbing and appliances and improves water for bathing and laundry.",
      },
      {
        ar: "غالباً ما تُدمج الفلترة المركزية مع معالجة عسر المياه للحصول على منظومةٍ متكاملة. نصمّم المنظومة بعد فحص جودة مياهك ومساحة منزلك.",
        en: "Central filtration is often paired with water softening for a complete system. We design the setup after assessing your water quality and the size of your home.",
      },
    ],
  },
  "water-dispensers": {
    key: "water-dispensers",
    image: "crystalWater",
    title: {
      ar: "برادات وموزعات المياه",
      en: "Water Dispensers & Coolers",
    },
    metaTitle: {
      ar: "برادات وموزعات المياه الساخنة والباردة",
      en: "Hot & Cold Water Dispensers and Coolers",
    },
    metaDescription: {
      ar: "برادات وموزعات مياه ساخنة وباردة من نقي الرابية للمنازل والمكاتب في عمّان والأردن، مع خيار الدمج مع أنظمة التنقية.",
      en: "Naqi Al Rabia hot and cold water dispensers and coolers for homes and offices in Amman and Jordan, with the option to pair with purification systems.",
    },
    lead: {
      ar: "مياهٌ ساخنة وباردة جاهزة عند الطلب، للمنزل والمكتب.",
      en: "Hot and cold water on demand, for the home and the office.",
    },
    intro: [
      {
        ar: "توفّر برادات وموزّعات المياه (Water Dispensers / Coolers) مياهاً ساخنة وباردة جاهزة للاستخدام، وتناسب المنازل والمكاتب ومناطق الضيافة. يمكن استخدامها مستقلةً أو دمجها مع نظام تنقيةٍ لتزويدها بمياهٍ معالجة مباشرة.",
        en: "Water dispensers and coolers provide ready hot and cold water and suit homes, offices and hospitality areas. They can be used on their own or connected to a purification system so they draw treated water directly.",
      },
    ],
  },
  "filter-cartridges": {
    key: "filter-cartridges",
    image: "premiumInstallation",
    title: {
      ar: "شمعات الفلاتر وقطع الغيار",
      en: "Filter Cartridges & Replacement Parts",
    },
    metaTitle: {
      ar: "شمعات وخراطيش فلاتر المياه البديلة (Cartridge / كارتردج)",
      en: "Replacement Water-Filter Cartridges & Accessories",
    },
    metaDescription: {
      ar: "شمعات وخراطيش فلاتر المياه البديلة (كارتردج) وقطع الغيار من نقي الرابية للحفاظ على أداء نظامك في عمّان والأردن.",
      en: "Naqi Al Rabia replacement water-filter cartridges and accessories to keep your system performing, across Amman and Jordan.",
    },
    lead: {
      ar: "حافِظ على أداء نظامك بالشمعات وقطع الغيار الصحيحة، في مواعيدها.",
      en: "Keep your system performing with the right cartridges and parts, changed on time.",
    },
    intro: [
      {
        ar: "شمعات الفلاتر — أو «الكارتردج» (Cartridge) كما تُعرف في السوق — هي الأجزاء القابلة للاستبدال التي تقوم بعملية الترشيح داخل نظامك. استبدالها في مواعيدها المنتظمة هو ما يحافظ على جودة المياه وأداء الجهاز على المدى الطويل.",
        en: "Filter cartridges — «كارتردج» in local usage — are the replaceable elements that do the filtering inside your system. Changing them on schedule is what preserves water quality and long-term performance.",
      },
      {
        ar: "اختيار الشمعة المناسبة يعتمد على نوع نظامك وعدد مراحله. إن لم تكن متأكداً من القطعة المطلوبة، يسعدنا مساعدتك عبر خدمة الصيانة.",
        en: "The right cartridge depends on your system type and its number of stages. If you're unsure which part you need, our maintenance service is glad to help.",
      },
    ],
  },
  "water-pumps": {
    key: "water-pumps",
    image: "premiumInstallation",
    title: {
      ar: "مضخات المياه ومضخات تقوية الضغط",
      en: "Water Pumps & Pressure Boosters",
    },
    metaTitle: {
      ar: "مضخات المياه ومضخات تقوية الضغط (Booster Pump / بمب ضغط)",
      en: "Water Pumps & Booster Pumps for Home Water Pressure",
    },
    metaDescription: {
      ar: "مضخات المياه ومضخات تقوية الضغط (بمب ضغط / Booster Pump) من نقي الرابية لتحسين ضغط المياه في المنازل بعمّان والأردن.",
      en: "Naqi Al Rabia water pumps and pressure-boosting booster pumps to improve household water pressure across Amman and Jordan.",
    },
    lead: {
      ar: "ضغطُ مياهٍ ثابت في كل صنبور، حتى في الطوابق العليا.",
      en: "Steady water pressure at every tap, even on the upper floors.",
    },
    intro: [
      {
        ar: "مضخات تقوية الضغط، والمعروفة باسم Booster Pump وباسم «بمب» أو «بمب ضغط» في السوق المحلي، تُستخدم لرفع ضغط المياه داخل المنزل عندما يكون الضغط ضعيفاً أو غير ثابت — وهو أمرٌ شائع في المباني متعددة الطوابق.",
        en: "Booster pumps — «بمب» or «بمب ضغط» in local usage — raise household water pressure when it is weak or inconsistent, a common issue in multi-storey buildings.",
      },
      {
        ar: "تحسين الضغط يساعد أيضاً أنظمة التنقية على العمل بكفاءتها المصمّمة. نوصي بالمضخة المناسبة بعد فهم وضع منزلك.",
        en: "Better pressure also helps purification systems run at their intended efficiency. We recommend the right pump after understanding your home's setup.",
      },
    ],
  },
  "air-purification": {
    key: "air-purification",
    image: "familyLifestyle",
    title: {
      ar: "أجهزة تنقية الهواء",
      en: "Air Purification",
    },
    metaTitle: {
      ar: "أجهزة تنقية الهواء المنزلية",
      en: "Home Air Purifiers",
    },
    metaDescription: {
      ar: "أجهزة تنقية الهواء المنزلية من نقي الرابية، امتداداً لعنايتنا بجودة الماء والهواء في منزلك بعمّان والأردن.",
      en: "Naqi Al Rabia home air purifiers — extending our care for water and air quality in your home across Amman and Jordan.",
    },
    lead: {
      ar: "هواءٌ أنقى في مساحاتك، امتداداً لعنايتنا بجودة الحياة في منزلك.",
      en: "Cleaner air in your spaces, extending our care for the quality of life in your home.",
    },
    intro: [
      {
        ar: "إلى جانب حلول المياه، نوفّر أجهزة تنقية الهواء المنزلية التي تساعد على تحسين جودة الهواء الداخلي ضمن الاستخدام المناسب للجهاز. تصفّح المنتجات المتاحة أدناه.",
        en: "Alongside our water solutions, we offer home air purifiers that help improve indoor air quality when used as intended. Browse the available products below.",
      },
    ],
  },
};

export function getCategoryContent(key: string): CategoryContent | undefined {
  return categoryContent[key];
}
