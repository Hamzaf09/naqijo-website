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
  {
    slug: "seven-stage-water-filters",
    image: "underSinkSystem",
    datePublished: AUTHORED,
    dateModified: AUTHORED,
    title: {
      ar: "فلتر المياه ذو 7 مراحل: كم مرحلة تحتاج فعلاً؟",
      en: "7-Stage Water Filters: How Many Stages Do You Really Need?",
    },
    description: {
      ar: "ماذا تعني «المراحل» في فلتر المياه، والفرق بين فلتر 5 و7 مراحل، ودور الغشاء (ممبرين) — وكيف تختار العدد المناسب لمنزلك دون مبالغة.",
      en: "What «stages» mean in a water filter, the difference between 5-stage and 7-stage («فلتر 7 مراحل»), the membrane's role, and how to choose the right count for your home without overpaying.",
    },
    sections: [
      {
        heading: { ar: "ماذا تعني «المراحل» في فلتر المياه؟", en: "What do «stages» mean in a water filter?" },
        body: [
          {
            ar: "«المراحل» هي عدد خطوات المعالجة التي يمرّ بها الماء داخل النظام قبل أن تشربه. كل مرحلة تؤدّي وظيفة مختلفة، مثل حجز الشوائب الكبيرة أولاً ثم التنقية الأدق. عبارة «فلتر 7 مراحل» أو «فلتر سبع مراحل» شائعة في السوق للإشارة إلى الأنظمة متعددة المراحل.",
            en: "«Stages» are the number of treatment steps water passes through before you drink it. Each stage does a different job — capturing larger particles first, then finer purification. The market phrase «فلتر 7 مراحل» (seven-stage filter) refers to these multi-stage systems.",
          },
        ],
      },
      {
        heading: { ar: "ماذا تفعل المراحل المختلفة؟", en: "What do the different stages do?" },
        body: [
          {
            ar: "تختلف تركيبة المراحل بين الأنظمة، لكنها عموماً تبدأ بمراحل ترشيبٍ أولية لحجز الرواسب، ثم مراحل كربونية لتحسين الطعم والرائحة. في أنظمة التناضح العكسي (RO) تأتي مرحلة الغشاء (ممبرين)، وقد تتبعها مراحل إضافية مثل الكربون النهائي، أو مرحلة تعقيمٍ بالأشعة فوق البنفسجية (UV) في بعض الطُرز.",
            en: "Stage make-up varies between systems, but generally starts with pre-filtration stages that capture sediment, followed by carbon stages that improve taste and odor. In reverse-osmosis (RO) systems the membrane («ممبرين») stage follows, and some models add further stages such as a post-carbon stage or a UV sterilization stage.",
          },
        ],
      },
      {
        heading: { ar: "هل «الأكثر مراحلَ» أفضل دائماً؟", en: "Are more stages always better?" },
        body: [
          {
            ar: "ليس بالضرورة. عدد المراحل الأعلى لا يعني تلقائياً جودةً أعلى؛ فالمهم هو ملاءمة المراحل لجودة مياهك واحتياجك. مرحلةٌ إضافية بلا سببٍ واضح قد تزيد التكلفة والصيانة دون فائدة ملموسة. لذلك نبدأ بفحص جودة المياه ثم نوصي بالعدد المناسب.",
            en: "Not necessarily. A higher stage count doesn't automatically mean higher quality; what matters is that the stages match your water quality and needs. An extra stage with no clear purpose can add cost and maintenance without a tangible benefit. That's why we assess your water quality first, then recommend the right count.",
          },
        ],
      },
      {
        heading: { ar: "دور الغشاء (ممبرين)", en: "The role of the membrane" },
        body: [
          {
            ar: "في أنظمة التناضح العكسي، الغشاء (Membrane / «ممبرين») هو المرحلة المميّزة التي تفصل نظام RO عن الفلترة البسيطة. مثل بقية المراحل، يحتاج الغشاء إلى استبدالٍ في وقته للحفاظ على أداء النظام.",
            en: "In reverse-osmosis systems, the membrane («ممبرين») is the distinguishing stage that separates an RO system from simple filtration. Like the other stages, the membrane needs timely replacement to keep the system performing.",
          },
        ],
      },
      {
        heading: { ar: "ما الذي يناسب منزلك؟", en: "What suits your home?" },
        body: [
          {
            ar: "العدد الأنسب من المراحل يعتمد على جودة مياهك وعدد أفراد المنزل واستهلاككم، لا على الرقم الأكبر. تتوفر أنظمة بتصاميم مختلفة، بخزانٍ أو بدون خزان (Tankless / «تانك ليس»). الأفضل أن تبدأ بفحصٍ ثم قرار.",
            en: "The right number of stages depends on your water quality, household size and usage — not on the biggest number. Systems come in different designs, with a tank or tankless («تانك ليس»). It's best to start with an assessment, then decide.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { ar: "هل فلتر 7 مراحل ضروري للمنزل؟", en: "Is a 7-stage filter necessary for a home?" },
        a: {
          ar: "ليس بالضرورة. المناسب يعتمد على جودة مياهك واحتياجك، وقد يكفي عددٌ أقل من المراحل أو يلزم أكثر. الفحص هو ما يحدّد ذلك.",
          en: "Not necessarily. The right choice depends on your water quality and needs — fewer stages may be enough, or more may be warranted. An assessment is what decides.",
        },
      },
      {
        q: { ar: "ما الفرق بين فلتر 5 مراحل و7 مراحل؟", en: "What's the difference between a 5-stage and a 7-stage filter?" },
        a: {
          ar: "الفرق هو عدد خطوات المعالجة الإضافية. المراحل الإضافية قد تضيف وظائف مثل كربونٍ نهائي أو تعقيم، لكن قيمتها تعتمد على حالتك، لا على الرقم وحده.",
          en: "The difference is the number of extra treatment steps. Additional stages may add functions such as a post-carbon or sterilization step, but their value depends on your situation, not the number alone.",
        },
      },
    ],
    related: [
      { href: "/products/category/drinking-water", label: { ar: "أنظمة مياه الشرب", en: "Drinking-water systems" } },
      { href: "/guides/choosing-a-water-filter", label: { ar: "كيف تختار فلتر مياه", en: "How to choose a water filter" } },
      { href: "/guides/reverse-osmosis-vs-filtration", label: { ar: "التناضح العكسي RO مقابل الأنظمة الأخرى", en: "RO vs other systems" } },
      { href: "/consultation", label: { ar: "استشارة هندسية مجانية", en: "Free engineering consultation" } },
    ],
  },
  {
    slug: "central-vs-drinking-water-filter",
    image: "wholeHouseSystem",
    datePublished: AUTHORED,
    dateModified: AUTHORED,
    title: {
      ar: "الفلتر المركزي أم فلتر مياه الشرب؟ وهل تحتاج فلترة مركزية للمنزل؟",
      en: "Central Filtration vs a Drinking-Water Filter: Do You Need a Whole-Home System?",
    },
    description: {
      ar: "الفرق بين الفلتر المركزي («سنترال فلتر») وفلتر مياه الشرب، وما الذي يعالجه كلٌّ منهما، ومتى تحتاج فلترة مركزية للمنزل ومتى يكفي فلتر الشرب.",
      en: "The difference between central filtration («سنترال فلتر») and a drinking-water filter, what each addresses, and when you need a whole-home system versus when a drinking-water filter is enough.",
    },
    sections: [
      {
        heading: { ar: "الفرق الأساسي", en: "The core difference" },
        body: [
          {
            ar: "الفلتر المركزي، أو «سنترال فلتر» (Central Filter)، يعالج المياه عند نقطة دخولها إلى المنزل فيخدم كل الصنابير والطوابق. أما فلتر مياه الشرب فيعالج نقطة استخدامٍ واحدة، عادةً صنبور المطبخ. باختصار: الأول للمنزل كله، والثاني لمياه الشرب تحديداً.",
            en: "Central filtration — a «سنترال فلتر» — treats water at the point it enters the home, serving every tap and floor. A drinking-water filter treats a single point of use, usually the kitchen tap. In short: the first is for the whole home, the second is specifically for drinking water.",
          },
        ],
      },
      {
        heading: { ar: "ماذا يعالج كلٌّ منهما؟", en: "What does each one address?" },
        body: [
          {
            ar: "تهدف الفلترة المركزية عادةً إلى تحسين المياه العامة في المنزل وحماية الأنابيب والأجهزة من الرواسب، وغالباً ما تُدمج مع معالجة عسر المياه. أما فلتر الشرب (ومنه أنظمة التناضح العكسي RO) فيركّز على إنتاج مياه شربٍ معالجة في المطبخ.",
            en: "Central filtration typically aims to improve the home's general water and protect pipes and appliances from sediment, and is often paired with water softening. A drinking-water filter (including reverse-osmosis / RO systems) focuses on producing treated drinking water at the kitchen.",
          },
        ],
      },
      {
        heading: { ar: "متى تحتاج فلترة مركزية؟", en: "When do you need central filtration?" },
        body: [
          {
            ar: "إن كانت مشكلتك تشمل المنزل كله — كالرواسب على الصنابير أو الكلس في السخانات أو أثر المياه على الغسيل والاستحمام — فقد تكون الفلترة المركزية هي الأساس المناسب.",
            en: "If your issue spans the whole home — sediment on taps, limescale in heaters, or the effect of water on laundry and bathing — central filtration may be the right foundation.",
          },
        ],
      },
      {
        heading: { ar: "متى يكفي فلتر الشرب؟", en: "When is a drinking-water filter enough?" },
        body: [
          {
            ar: "إن كان همّك الأساسي هو جودة مياه الشرب في المطبخ فقط، فقد يكفي نظام شربٍ مخصّص دون الحاجة إلى فلترة مركزية. القرار يعتمد على مشكلتك ونتيجة فحص المياه.",
            en: "If your main concern is only kitchen drinking-water quality, a dedicated drinking-water system may be enough without central filtration. The decision depends on your problem and the water-test result.",
          },
        ],
      },
      {
        heading: { ar: "الجمع بين الاثنين", en: "Combining both" },
        body: [
          {
            ar: "كثيرٌ من المنازل يجمع بين فلترة مركزية للحماية العامة ونظام شربٍ مخصّص في المطبخ، للحصول على منظومةٍ متكاملة. نصمّم التركيبة المناسبة بعد الفحص.",
            en: "Many homes combine central filtration for general protection with a dedicated drinking-water system at the kitchen, for a complete setup. We design the right combination after an assessment.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { ar: "هل يمكنني تركيب الاثنين معاً؟", en: "Can I install both together?" },
        a: {
          ar: "نعم، من الشائع الجمع بين فلترة مركزية للمنزل ونظام شربٍ في المطبخ، بحسب احتياج البيت ونتيجة الفحص.",
          en: "Yes — it's common to combine central filtration for the home with a kitchen drinking-water system, depending on the home's needs and the assessment.",
        },
      },
      {
        q: { ar: "هل يجعل الفلتر المركزي مياه الصنبور صالحةً للشرب؟", en: "Does a central filter make tap water drinkable?" },
        a: {
          ar: "الفلترة المركزية تحسّن المياه العامة في المنزل، لكن مياه الشرب عادةً ما تُعالَج عبر نظامٍ مخصّص في المطبخ. نوضّح لك الأنسب بعد فحص مياهك.",
          en: "Central filtration improves the home's general water, but drinking water is usually treated through a dedicated kitchen system. We explain what's best after assessing your water.",
        },
      },
    ],
    related: [
      { href: "/products/category/central-filtration", label: { ar: "الفلترة المركزية", en: "Central filtration" } },
      { href: "/products/category/drinking-water", label: { ar: "أنظمة مياه الشرب", en: "Drinking-water systems" } },
      { href: "/guides/choosing-a-water-filter", label: { ar: "كيف تختار فلتر مياه", en: "How to choose a water filter" } },
      { href: "/consultation", label: { ar: "استشارة هندسية مجانية", en: "Free engineering consultation" } },
    ],
  },
  {
    slug: "water-filter-maintenance-signs",
    image: "premiumInstallation",
    datePublished: AUTHORED,
    dateModified: AUTHORED,
    title: {
      ar: "كيف تعرف أن فلتر المياه يحتاج صيانة؟ (تغيير الشمعات والممبرين)",
      en: "How to Know Your Water Filter Needs Maintenance (Cartridge & Membrane Replacement)",
    },
    description: {
      ar: "علاماتٌ عملية على حاجة فلتر المياه للصيانة، ودور شمعات الفلتر («الكارتردج») والغشاء («ممبرين»)، وما الذي يحدّد موعد الاستبدال — دون جداول ثابتة.",
      en: "Practical signs your water filter needs servicing, the role of cartridges («الكارتردج») and the membrane («ممبرين»), and what determines replacement timing — without fixed schedules.",
    },
    sections: [
      {
        heading: { ar: "لماذا الصيانة مهمة؟", en: "Why maintenance matters" },
        body: [
          {
            ar: "أي نظام تنقية يعتمد على أجزاءٍ قابلة للاستبدال تؤدّي عملها مع مرور الوقت. الصيانة في وقتها تحافظ على جودة المياه وأداء الجهاز، وتؤجيلها لفترةٍ طويلة قد يقلّل الأداء.",
            en: "Every purification system relies on replaceable parts that do their job over time. Timely maintenance preserves water quality and system performance; delaying it for too long can reduce performance.",
          },
        ],
      },
      {
        heading: { ar: "علاماتٌ شائعة على حاجة الفلتر للصيانة", en: "Common signs your filter needs service" },
        body: [
          {
            ar: "قد تلاحظ بعض المؤشرات التي ترتبط عادةً بحاجة النظام إلى صيانةٍ أو استبدال:",
            en: "You may notice indicators that are commonly associated with a system needing service or replacement:",
          },
        ],
        bullets: [
          { ar: "تغيّر في طعم الماء أو رائحته", en: "A change in the water's taste or smell" },
          { ar: "انخفاض ملحوظ في تدفّق الماء", en: "A noticeable drop in water flow" },
          { ar: "مرور وقتٍ طويل منذ آخر استبدالٍ للشمعات", en: "A long time since the cartridges were last replaced" },
          { ar: "أصواتٌ أو تسريباتٌ غير معتادة من النظام", en: "Unusual sounds or leaks from the system" },
        ],
      },
      {
        heading: { ar: "شمعات الفلتر (الكارتردج)", en: "Filter cartridges" },
        body: [
          {
            ar: "شمعات الفلتر، أو «الكارتردج» (Cartridge)، هي الأجزاء التي تقوم بالترشيح وتُستبدل دورياً. اختيار الشمعة الصحيحة يعتمد على نوع نظامك وعدد مراحله.",
            en: "Filter cartridges — «كارتردج» — are the elements that do the filtering and are replaced periodically. Choosing the right cartridge depends on your system type and stage count.",
          },
        ],
      },
      {
        heading: { ar: "غشاء التناضح العكسي (ممبرين)", en: "The reverse-osmosis membrane" },
        body: [
          {
            ar: "في أنظمة التناضح العكسي (RO)، يحتاج الغشاء (Membrane / «ممبرين») إلى استبدالٍ في وقته أيضاً، وهو جزءٌ أساسي في أداء النظام. عادةً ما يختلف موعد استبدال الغشاء عن مواعيد الشمعات.",
            en: "In reverse-osmosis (RO) systems, the membrane («ممبرين») also needs timely replacement and is central to performance. Its replacement timing usually differs from that of the cartridges.",
          },
        ],
      },
      {
        heading: { ar: "ما الذي يحدّد موعد الاستبدال؟", en: "What determines replacement timing?" },
        body: [
          {
            ar: "تعتمد فترات الاستبدال على الاستخدام وجودة المياه ونوع النظام وعدد مراحله، لذلك لا يوجد جدولٌ واحد يناسب جميع المنازل. نوضّح لك الجدول المناسب لنظامك ضمن الصيانة الدورية.",
            en: "Replacement intervals depend on usage, water quality, and the system type and its stages, so there's no single schedule that fits every home. We explain the right schedule for your system as part of scheduled maintenance.",
          },
        ],
      },
      {
        heading: { ar: "عقود الصيانة الدورية", en: "Scheduled maintenance contracts" },
        body: [
          {
            ar: "لتجنّب نسيان المواعيد، نوفّر عقود صيانة دورية وزياراتٍ مجدولة تشمل فحص النظام واستبدال الأجزاء في وقتها.",
            en: "To avoid missing service dates, we offer scheduled maintenance contracts and planned visits that include checking the system and replacing parts on time.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { ar: "كل كم يجب تغيير شمعات الفلتر؟", en: "How often should filter cartridges be changed?" },
        a: {
          ar: "تعتمد الفترة على الاستخدام وجودة المياه ونوع النظام، فلا يوجد جدولٌ ثابت يناسب الجميع. نحدّد لك الجدول المناسب لنظامك ضمن الصيانة.",
          en: "It depends on usage, water quality, and the system type, so there's no single schedule that fits everyone. We set the right schedule for your system as part of maintenance.",
        },
      },
      {
        q: { ar: "كيف أعرف أن الغشاء (ممبرين) يحتاج إلى استبدال؟", en: "How do I know the membrane needs replacing?" },
        a: {
          ar: "غالباً ما ترتبط الحاجة إلى استبدال الغشاء بتغيّر أداء النظام مع الوقت. فحص النظام ضمن الصيانة هو أدقّ طريقة لتحديد ذلك.",
          en: "The need to replace the membrane is usually linked to a change in the system's performance over time. Checking the system during maintenance is the most accurate way to determine it.",
        },
      },
    ],
    related: [
      { href: "/maintenance", label: { ar: "الصيانة الوقائية", en: "Preventive maintenance" } },
      { href: "/products/category/filter-cartridges", label: { ar: "شمعات الفلاتر وقطع الغيار", en: "Filter cartridges & parts" } },
      { href: "/products/category/drinking-water", label: { ar: "أنظمة مياه الشرب", en: "Drinking-water systems" } },
      { href: "/consultation", label: { ar: "استشارة هندسية مجانية", en: "Free engineering consultation" } },
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
