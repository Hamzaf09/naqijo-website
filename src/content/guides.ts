import type { Locale } from "@/i18n/routing";
import type { ApprovedImageKey } from "@/config/images";

/**
 * Static knowledge-base guides. Fully repo-sourced — no Payload, no database —
 * so they build even when DATABASE_URI is unavailable. Content is factually
 * conservative: no medical claims, no contaminant-removal percentages, and no
 * unverified local water-quality figures. Market terminology (English term +
 * Jordanian transliteration) is introduced naturally, once per concept.
 *
 * Dates are the real authoring date; keep dateModified truthful when editing.
 */

type L = Record<Locale, string>;

export interface GuideSection {
  heading: L;
  body: L[];
  bullets?: L[];
}

export interface GuideFaq {
  q: L;
  a: L;
}

export interface GuideRelatedLink {
  href: string;
  label: L;
}

export interface Guide {
  slug: string;
  image: ApprovedImageKey;
  datePublished: string; // ISO date
  dateModified: string; // ISO date
  title: L;
  description: L; // meta description + hero lead
  sections: GuideSection[];
  faqs?: GuideFaq[];
  related: GuideRelatedLink[];
}

const AUTHORED = "2026-09-08";

export const guides: Guide[] = [
  {
    slug: "choosing-a-water-filter",
    image: "underSinkSystem",
    datePublished: AUTHORED,
    dateModified: AUTHORED,
    title: {
      ar: "كيف تختار فلتر مياه مناسب لمنزلك؟",
      en: "How to Choose the Right Water Filter for Your Home",
    },
    description: {
      ar: "دليلٌ عملي لاختيار فلتر المياه المناسب: من تحديد المشكلة إلى الفرق بين تنقية مياه الشرب والفلترة المركزية ومتى تفكّر في نظام التناضح العكسي RO.",
      en: "A practical guide to choosing the right water filter — from defining the problem to drinking-water vs whole-home filtration and when to consider a reverse-osmosis (RO) system.",
    },
    sections: [
      {
        heading: { ar: "ابدأ بالمشكلة، لا بالجهاز", en: "Start with the problem, not the device" },
        body: [
          {
            ar: "قبل اختيار أي فلتر، حدّد ما الذي تريد معالجته: هل هدفك مياه شربٍ أنقى في المطبخ؟ أم حماية المنزل كله من الترسّبات والكلس؟ أم تحسين طعم المياه ورائحتها؟ تحديد المشكلة أولاً يوفّر عليك شراء نظامٍ لا يناسب احتياجك.",
            en: "Before choosing any filter, define what you're trying to solve: purer drinking water in the kitchen? Protecting the whole home from sediment and limescale? Improving taste and odor? Naming the problem first stops you from buying a system that doesn't match your need.",
          },
        ],
      },
      {
        heading: { ar: "مياه الشرب أم المنزل كله؟", en: "Drinking water or the whole home?" },
        body: [
          {
            ar: "أنظمة مياه الشرب (مثل فلاتر تحت الحوض وأنظمة التناضح العكسي) تعالج نقطة استخدامٍ واحدة — عادةً صنبور المطبخ. أما الفلترة المركزية، أو «سنترال فلتر»، فتعالج المياه عند دخولها للمنزل لتخدم كل الصنابير والطوابق. كثيرٌ من المنازل يجمع بين الاثنين: فلترة مركزية للحماية العامة، ونظام شربٍ مخصّص في المطبخ.",
            en: "Drinking-water systems (like under-sink filters and reverse-osmosis units) treat a single point of use — usually the kitchen tap. Central filtration — a «سنترال فلتر» — treats water as it enters the home to serve every tap and floor. Many homes combine both: central filtration for general protection, and a dedicated drinking-water system at the kitchen.",
          },
        ],
      },
      {
        heading: { ar: "حجم الأسرة والاستهلاك", en: "Household size and usage" },
        body: [
          {
            ar: "كلما زاد عدد أفراد المنزل زاد استهلاك المياه اليومي، وهو ما يؤثّر على حجم النظام المناسب ومعدّل استبدال الشمعات. الأسرة الكبيرة قد تحتاج إلى نظامٍ بسعة أعلى أو صيانةٍ أكثر تكراراً.",
            en: "The more people in the home, the higher the daily water use — which affects the right system size and how often cartridges need changing. A larger household may need a higher-capacity system or more frequent maintenance.",
          },
        ],
      },
      {
        heading: { ar: "المساحة المتاحة والتركيب", en: "Available space and installation" },
        body: [
          {
            ar: "بعض الأنظمة تحتاج مساحةً أسفل الحوض أو خزاناً صغيراً، بينما توفّر الأنظمة بدون خزان (Tankless / «تانك ليس») حلاً أصغر حجماً. تأكّد من ملاءمة المساحة قبل الشراء، فالتركيب النظيف جزءٌ من جودة الحل.",
            en: "Some systems need under-sink space or a small storage tank, while tankless designs («تانك ليس») offer a more compact option. Confirm the space fits before buying — clean installation is part of a good solution.",
          },
        ],
      },
      {
        heading: { ar: "الصيانة قبل الشراء", en: "Consider maintenance before buying" },
        body: [
          {
            ar: "أي فلتر يحتاج إلى استبدال شمعاته («الكارتردج») في مواعيد منتظمة للحفاظ على أدائه. عند المقارنة بين الأنظمة، اسأل عن جدول الصيانة وتوفّر قطع الغيار — لا عن سعر الشراء وحده.",
            en: "Every filter needs its cartridges replaced on a regular schedule to keep performing. When comparing systems, ask about the maintenance schedule and parts availability — not just the purchase price.",
          },
        ],
      },
      {
        heading: { ar: "متى تفكّر في التناضح العكسي RO؟", en: "When to consider reverse osmosis (RO)?" },
        body: [
          {
            ar: "أنظمة التناضح العكسي (Reverse Osmosis أو RO، وتُعرف بـ «فلتر آر أو») تعتمد على مراحل تنقية متعددة وتُستخدم عادةً لإنتاج مياه شربٍ معالجة. قد تكون مناسبة عندما يكون تحسين مياه الشرب هو الأولوية. الاختيار النهائي يعتمد على نتيجة فحص جودة مياهك.",
            en: "Reverse-osmosis systems (RO, «فلتر آر أو») use multiple purification stages and are typically used to produce treated drinking water. They can be a good fit when improving drinking water is the priority. The final choice depends on the result of your water-quality assessment.",
          },
        ],
      },
      {
        heading: { ar: "متى تكون الفلترة المركزية مناسبة؟", en: "When central filtration makes sense" },
        body: [
          {
            ar: "إن كانت مشكلتك تشمل المنزل كله — كالترسّبات على الصنابير أو الكلس في السخانات — فقد تكون الفلترة المركزية، وغالباً مع معالجة عسر المياه، هي الأساس الذي تُبنى عليه بقية الحلول.",
            en: "If your issue spans the whole home — sediment on taps or limescale in heaters — central filtration, often paired with water softening, may be the foundation the rest of your solutions build on.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { ar: "هل أحتاج إلى فحص مياه قبل الاختيار؟", en: "Do I need a water test before choosing?" },
        a: {
          ar: "نعم، الفحص هو أفضل طريقة لاختيار النظام المناسب بدل التخمين. نقدّم فحصاً مجانياً لجودة المياه ضمن الاستشارة الهندسية.",
          en: "Yes — testing is the best way to choose the right system rather than guessing. We provide a free water-quality assessment as part of the engineering consultation.",
        },
      },
      {
        q: { ar: "هل يمكن الجمع بين أكثر من نظام؟", en: "Can I combine more than one system?" },
        a: {
          ar: "نعم، من الشائع دمج فلترة مركزية للحماية العامة مع نظام شربٍ مخصّص في المطبخ، بحسب احتياج المنزل.",
          en: "Yes — it's common to combine central filtration for general protection with a dedicated drinking-water system at the kitchen, depending on the home's needs.",
        },
      },
    ],
    related: [
      { href: "/products/category/drinking-water", label: { ar: "أنظمة مياه الشرب", en: "Drinking-water systems" } },
      { href: "/products/category/central-filtration", label: { ar: "الفلترة المركزية", en: "Central filtration" } },
      { href: "/consultation", label: { ar: "استشارة هندسية مجانية", en: "Free engineering consultation" } },
    ],
  },
  {
    slug: "reverse-osmosis-vs-filtration",
    image: "crystalWater",
    datePublished: AUTHORED,
    dateModified: AUTHORED,
    title: {
      ar: "ما الفرق بين التناضح العكسي RO وأنظمة تنقية المياه الأخرى؟",
      en: "Reverse Osmosis vs Other Water Filtration Systems",
    },
    description: {
      ar: "شرحٌ واضح للتناضح العكسي (Reverse Osmosis / RO / فلتر آر أو) وكيف يختلف مفهومياً عن أساليب الفلترة الأخرى، ومتى يكون كل حلٍّ أنسب.",
      en: "A clear explanation of reverse osmosis (RO, «فلتر آر أو») and how it conceptually differs from other filtration approaches — and when each solution fits.",
    },
    sections: [
      {
        heading: { ar: "ما هو التناضح العكسي (RO)؟", en: "What is reverse osmosis (RO)?" },
        body: [
          {
            ar: "التناضح العكسي (Reverse Osmosis)، والمعروف اختصاراً باسم RO أو «فلتر آر أو» في السوق المحلي، هو أسلوبٌ لمعالجة المياه يمرّر الماء عبر مراحل متعددة تشمل غشاءً خاصاً (Membrane / «ممبرين»). يُستخدم عادةً في أنظمة مخصّصة لمياه الشرب.",
            en: "Reverse osmosis (RO, «فلتر آر أو») is a water-treatment approach that passes water through multiple stages, including a specialized membrane («ممبرين»). It is typically used in systems dedicated to drinking water.",
          },
        ],
      },
      {
        heading: { ar: "كيف يختلف مفهومياً عن الفلترة العادية؟", en: "How it differs from ordinary filtration" },
        body: [
          {
            ar: "الفلاتر التقليدية تعمل غالباً على حجز الشوائب والجسيمات وتحسين الطعم والرائحة عبر وسائط ترشيح. أما التناضح العكسي فيضيف مرحلة الغشاء التي تميّزه عن الفلترة البسيطة. الفكرة العملية: الفلترة العادية خطوةٌ أساسية، وRO خطوةٌ أعمق مخصّصة لمياه الشرب.",
            en: "Conventional filters mostly capture sediment and particles and improve taste and odor through filter media. Reverse osmosis adds the membrane stage that sets it apart from simple filtration. In practical terms: ordinary filtration is a foundational step, while RO is a deeper stage aimed at drinking water.",
          },
        ],
      },
      {
        heading: { ar: "استخدامات مياه الشرب", en: "Drinking-water use cases" },
        body: [
          {
            ar: "عندما يكون تحسين مياه الشرب في المطبخ هو الهدف الأساسي، غالباً ما يكون نظام RO خياراً مطروحاً. تتوفر أنظمة RO بتصاميم مختلفة، بخزانٍ أو بدون خزان (Tankless).",
            en: "When the main goal is improving kitchen drinking water, an RO system is often a candidate. RO systems come in different designs, with a tank or tankless.",
          },
        ],
      },
      {
        heading: { ar: "متى يكون حلٌّ آخر أنسب؟", en: "When another solution may fit better" },
        body: [
          {
            ar: "إن كانت مشكلتك تتعلق بالكلس وعسر المياه على مستوى المنزل، فقد تكون معالجة عسر المياه («سوفتنر») أو الفلترة المركزية أنسب من التركيز على مياه الشرب وحدها. لا يوجد حلٌّ واحد يناسب الجميع؛ الاختيار يعتمد على مشكلتك ونتيجة الفحص.",
            en: "If your problem is limescale and hard water across the home, water softening (a «سوفتنر») or central filtration may fit better than focusing on drinking water alone. There is no one-size-fits-all answer; the choice depends on your problem and the test result.",
          },
        ],
      },
      {
        heading: { ar: "الصيانة", en: "Maintenance" },
        body: [
          {
            ar: "مثل أي نظام تنقية، تحتاج أنظمة RO إلى استبدال الشمعات والغشاء في مواعيدها للحفاظ على الأداء. اسأل دائماً عن جدول الصيانة قبل الشراء.",
            en: "Like any purification system, RO systems need their cartridges and membrane replaced on schedule to maintain performance. Always ask about the maintenance schedule before buying.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { ar: "هل RO أفضل دائماً من الفلاتر الأخرى؟", en: "Is RO always better than other filters?" },
        a: {
          ar: "ليس بالضرورة؛ الأفضل هو ما يناسب مشكلتك. RO مخصّص عادةً لمياه الشرب، بينما تعالج حلولٌ أخرى مشكلات المنزل الكامل مثل الكلس.",
          en: "Not necessarily — the best system is the one that matches your problem. RO is usually aimed at drinking water, while other solutions address whole-home issues such as limescale.",
        },
      },
    ],
    related: [
      { href: "/products/category/drinking-water", label: { ar: "أنظمة مياه الشرب", en: "Drinking-water systems" } },
      { href: "/consultation", label: { ar: "استشارة هندسية مجانية", en: "Free engineering consultation" } },
    ],
  },
  {
    slug: "hard-water-and-water-softeners",
    image: "wholeHouseSystem",
    datePublished: AUTHORED,
    dateModified: AUTHORED,
    title: {
      ar: "مشكلة عسر المياه والكلس: متى تحتاج إلى جهاز تليين المياه؟",
      en: "Hard Water and Limescale: When Do You Need a Water Softener?",
    },
    description: {
      ar: "ما هو عسر المياه والكلس، وعلاماته المنزلية الشائعة، وماذا يفعل جهاز تليين المياه (Water Softener / سوفتنر)، ومتى تفكّر فيه.",
      en: "What hard water and limescale are, their common household signs, what a water softener («سوفتنر») does, and when to consider one.",
    },
    sections: [
      {
        heading: { ar: "ما معنى عسر المياه؟", en: "What does hard water mean?" },
        body: [
          {
            ar: "عسر المياه يعني ارتفاع نسبة الأملاح المعدنية الذائبة في الماء، خصوصاً الكالسيوم والمغنيسيوم. كلما زادت هذه الأملاح زاد «عسر» الماء واحتمال تكوّن الترسّبات.",
            en: "Hard water means a high level of dissolved minerals — mainly calcium and magnesium. The more of these minerals present, the 'harder' the water and the more likely it is to leave deposits.",
          },
        ],
      },
      {
        heading: { ar: "ما هو الكلس؟", en: "What is limescale?" },
        body: [
          {
            ar: "الكلس هو الترسّبات المعدنية التي يتركها الماء العسِر على الأسطح والأنابيب والسخانات مع مرور الوقت. تراكمه قد يقلّل كفاءة أنظمة التسخين ويؤثّر على عمر الأجهزة.",
            en: "Limescale is the mineral deposit that hard water leaves on surfaces, pipes and heaters over time. Its build-up can reduce heating efficiency and affect appliance lifespan.",
          },
        ],
      },
      {
        heading: { ar: "علامات منزلية شائعة", en: "Common household signs" },
        body: [
          {
            ar: "قد تلاحظ بعض العلامات التي ترتبط عادةً بعسر المياه:",
            en: "You may notice signs that are commonly associated with hard water:",
          },
        ],
        bullets: [
          { ar: "ترسّبات بيضاء على الصنابير ورؤوس الدش", en: "White deposits on taps and shower heads" },
          { ar: "بقع على الأواني والزجاج بعد الغسيل", en: "Spots on dishes and glassware after washing" },
          { ar: "شعورٌ بأن الصابون لا يرغّي بسهولة", en: "A sense that soap doesn't lather easily" },
          { ar: "تراكم الكلس داخل الغلاية أو السخان", en: "Limescale build-up inside the kettle or heater" },
        ],
      },
      {
        heading: { ar: "الأجهزة والسباكة", en: "Appliances and plumbing" },
        body: [
          {
            ar: "الأجهزة التي تسخّن الماء — كالسخانات والغسّالات — هي الأكثر تأثّراً بالكلس. معالجة عسر المياه تهدف إلى تقليل هذا الأثر والحفاظ على أداء منظومتك.",
            en: "Appliances that heat water — like heaters and washing machines — are the most affected by limescale. Water softening aims to reduce this effect and preserve your system's performance.",
          },
        ],
      },
      {
        heading: { ar: "ماذا يفعل جهاز تليين المياه؟", en: "What does a water softener do?" },
        body: [
          {
            ar: "جهاز تليين المياه، المعروف بالإنجليزية باسم Water Softener وباسم «سوفتنر» في الاستخدام المتداول، يعالج عسر المياه ضمن الاستخدام المناسب للنظام، بهدف تقليل الترسّبات وحماية الأنابيب والأجهزة.",
            en: "A water softener — «سوفتنر» in local usage — treats hard water when correctly specified, with the goal of reducing deposits and protecting pipes and appliances.",
          },
        ],
      },
      {
        heading: { ar: "متى تفكّر في جهاز؟", en: "When to consider one" },
        body: [
          {
            ar: "إن كنت تلاحظ عدداً من العلامات أعلاه، فقد يكون من المفيد فحص عسر مياهك. الفحص هو ما يحدّد ما إذا كنت تحتاج فعلاً إلى معالجة، وأي حجمٍ يناسب منزلك.",
            en: "If you notice several of the signs above, it may be worth testing your water hardness. Testing is what determines whether you actually need treatment, and what size suits your home.",
          },
        ],
      },
      {
        heading: { ar: "الصيانة", en: "Maintenance" },
        body: [
          {
            ar: "أنظمة معالجة عسر المياه تحتاج إلى متابعةٍ دورية لتبقى فعّالة. نوضّح لك جدول الصيانة المناسب عند التركيب.",
            en: "Water-softening systems need periodic servicing to stay effective. We explain the appropriate maintenance schedule at installation.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { ar: "كيف أعرف إن كان الماء عندي عسِراً؟", en: "How do I know if my water is hard?" },
        a: {
          ar: "أفضل طريقة هي فحص عسر المياه. نقدّم فحصاً لجودة المياه ضمن الاستشارة قبل التوصية بأي حل.",
          en: "The best way is a hardness test. We provide a water-quality assessment as part of the consultation before recommending any solution.",
        },
      },
    ],
    related: [
      { href: "/products/category/water-softening", label: { ar: "أجهزة معالجة عسر المياه", en: "Water softening systems" } },
      { href: "/consultation", label: { ar: "استشارة هندسية مجانية", en: "Free engineering consultation" } },
      { href: "/maintenance", label: { ar: "الصيانة الوقائية", en: "Preventive maintenance" } },
    ],
  },
];

export function getAllGuides(): Guide[] {
  return guides;
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export const guideSlugs = guides.map((g) => g.slug);
