import type { ApprovedImageKey } from "@/config/images";
import type { Locale } from "@/i18n/routing";

interface SolutionItem {
  index: string;
  eyebrow: string;
  title: string;
  desc: string;
  bullets: string[];
  image: ApprovedImageKey;
  href: string;
  cta: string;
}

interface HomeContent {
  hero: {
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    subtitle: string;
    primary: string;
    secondary: string;
  };
  intro: { eyebrow: string; title: string; body: string };
  why: { eyebrow: string; title: string; pillars: { t: string; d: string }[] };
  solutions: { eyebrow: string; title: string; items: SolutionItem[] };
  featured: { eyebrow: string; title: string; desc: string; cta: string };
  process: { eyebrow: string; title: string; steps: { n: string; t: string; d: string }[] };
  testimonials: { eyebrow: string; title: string; items: { q: string; n: string; r: string }[] };
  stats: { eyebrow: string; items: { v: string; l: string }[] };
  cta: { eyebrow: string; title: string; subtitle: string; whatsapp: string };
}

export const homeContent: Record<Locale, HomeContent> = {
  ar: {
    hero: {
      eyebrow: "الشريك الهندسي الموثوق للبيت",
      titleTop: "بيتٌ نقيّ،",
      titleAccent: "يرتقي بالهندسة.",
      subtitle:
        "من تنقية المياه إلى الطاقة الشمسية والتشطيبات والعزل والصيانة — نقي الرابية شريكك الهندسي الواحد لبيتٍ أكثر نقاءً وراحةً وقيمة.",
      primary: "احجز استشارة مجانية",
      secondary: "استكشف الحلول",
    },
    intro: {
      eyebrow: "حلولٌ متكاملة من مصدرٍ واحد",
      title: "لا نبيع منتجاً، بل نرفع مستوى بيتك.",
      body: "نتولّى منظومة البيت كاملة — ماءً وطاقةً وبنيةً — بعقلية مهندسٍ وقلب جار. حلٌّ واحد، جهةٌ واحدة، ومسؤوليةٌ واحدة تمتدّ من أول استشارة إلى آخر زيارة صيانة، لتعيش راحةً لا تنقطع.",
    },
    why: {
      eyebrow: "لماذا نقي الرابية",
      title: "دقّةٌ هندسية، بثقةٍ عائلية.",
      pillars: [
        { t: "نقاءٌ لا يُساوَم", d: "معدّات معتمدة ومعايير دقيقة — لأن ما يدخل بيتك يمسّ صحة عائلتك." },
        { t: "حلٌّ متكامل", d: "مياه وطاقة وتشطيبات وعزل وصيانة، من مصدرٍ واحدٍ مسؤول." },
        { t: "ضمانٌ يمتدّ", d: "ضمانات تصل إلى خمس سنوات وصيانة دورية لا تغيب بعد التسليم." },
        { t: "خبرةٌ تُثبِت نفسها", d: "سبعة عشر عاماً من الثقة، ومئات البيوت الأردنية." },
      ],
    },
    solutions: {
      eyebrow: "حلولنا",
      title: "أربع منظومات، لبيتٍ واحدٍ يرتقي.",
      items: [
        {
          index: "01",
          eyebrow: "المياه",
          title: "مياهٌ نقية في كل صنبور",
          desc: "أنظمة فلترة وتناضح عكسي وتنقية مركزية للمنزل كله، مصمّمة حسب جودة مياهك واحتياج أسرتك.",
          bullets: ["فلترة منزلية وتناضح عكسي (RO)", "أنظمة تنقية مركزية لكل الطوابق", "فحص جودة المياه قبل التركيب"],
          image: "crystalWater",
          href: "/services/water",
          cta: "اكتشف حلول المياه",
        },
        {
          index: "02",
          eyebrow: "المطابخ",
          title: "تشطيباتٌ تليق بقلب البيت",
          desc: "تصميم وتنفيذ تشطيبات المطابخ بخاماتٍ راقية ودقةٍ هندسية، متكاملة مع أنظمة المياه.",
          bullets: ["تصميم وتنفيذ متكامل", "خاماتٌ راقية وتفاصيل دقيقة", "تكامل مع أنظمة التنقية"],
          image: "luxuryKitchen",
          href: "/services/kitchen",
          cta: "اكتشف تشطيبات المطابخ",
        },
        {
          index: "03",
          eyebrow: "الطاقة",
          title: "طاقةٌ أذكى من شمس الأردن",
          desc: "أنظمة طاقة شمسية وتسخين شمسي توفّر فاتورتك وتمنح بيتك استقلالاً أنظف وأدوم.",
          bullets: ["أنظمة كهروضوئية للمنازل", "سخّانات شمسية موفّرة", "تصميم حسب استهلاكك"],
          image: "solarEnergy",
          href: "/services/solar",
          cta: "اكتشف الطاقة الشمسية",
        },
        {
          index: "04",
          eyebrow: "الحماية",
          title: "عزلٌ يحمي بيتك لسنوات",
          desc: "عزل وحماية الأسطح بمعايير دقيقة تحمي استثمارك من تسرّب الماء وحرارة الصيف.",
          bullets: ["عزل مائي وحراري للأسطح", "مواد معتمدة وتنفيذ دقيق", "حماية تمتد لسنوات"],
          image: "roofWaterproofing",
          href: "/services/protection",
          cta: "اكتشف حلول العزل",
        },
      ],
    },
    featured: {
      eyebrow: "مشروع مميّز",
      title: "فيلا سكنية متكاملة — عمّان",
      desc: "منظومة مياه وطاقة متكاملة لفيلا عائلية، من التصميم الهندسي إلى التشغيل والصيانة.",
      cta: "شاهد المشاريع",
    },
    process: {
      eyebrow: "كيف نعمل",
      title: "رحلةٌ هندسية، من الفكرة إلى الاطمئنان.",
      steps: [
        { n: "01", t: "استشارة وفحص", d: "نزورك، نفحص مياهك واحتياجك، ونصمّم الحل الأنسب." },
        { n: "02", t: "تصميم هندسي", d: "مخطط واضح بالمواصفات والضمانات والتكلفة، دون مفاجآت." },
        { n: "03", t: "تركيب احترافي", d: "فريق مؤهّل ينفّذ بمعايير دقيقة ومواعيد تُحترم." },
        { n: "04", t: "صيانة دائمة", d: "صيانة دورية ودعم فنّي لا يختفي بعد التسليم." },
      ],
    },
    testimonials: {
      eyebrow: "يثقون بنا",
      title: "بيوتٌ تشهد بالفرق.",
      items: [
        { q: "فرقٌ واضح في طعم الماء ونقائه من أول يوم، وتركيبٌ نظيفٌ واحترافي.", n: "أم أحمد", r: "عبدون، عمّان" },
        { q: "وفّرت فاتورة الكهرباء بشكل ملموس بعد نظام الطاقة الشمسية، ومتابعة ممتازة.", n: "م. خالد", r: "دابوق" },
        { q: "تعاملٌ راقٍ ومواعيد دقيقة، وصيانة تأتي قبل أن أطلبها.", n: "السيدة رنا", r: "خلدا" },
      ],
    },
    stats: {
      eyebrow: "أرقامٌ تبني الثقة",
      items: [
        { v: "+17", l: "عاماً من الخبرة" },
        { v: "+456", l: "عميلٌ موثوق" },
        { v: "5 سنوات", l: "ضمانٌ يمتد" },
        { v: "24/7", l: "دعمٌ لا يغيب" },
      ],
    },
    cta: {
      eyebrow: "ابدأ الآن",
      title: "بيتك يستحق ماءً نقياً وطاقةً أذكى.",
      subtitle: "احجز استشارةً مجانية، وسيصلك فريقنا بخطةٍ هندسية واضحة خلال 48 ساعة.",
      whatsapp: "مرحباً نقي الرابية، أودّ حجز استشارة مجانية.",
    },
  },

  en: {
    hero: {
      eyebrow: "The trusted engineering partner for your home",
      titleTop: "A purer home,",
      titleAccent: "engineered to rise.",
      subtitle:
        "From water purification to solar energy, kitchen finishing, waterproofing and maintenance — NaqiJo is your single engineering partner for a home that feels purer, calmer, and worth more.",
      primary: "Book a free consultation",
      secondary: "Explore solutions",
    },
    intro: {
      eyebrow: "Integrated solutions, one source",
      title: "We don't sell a product. We elevate your home.",
      body: "We take on the home's whole system — water, energy, and infrastructure — with an engineer's mind and a neighbour's heart. One solution, one accountable partner, from the first consultation to the last maintenance visit — so your comfort never breaks.",
    },
    why: {
      eyebrow: "Why NaqiJo",
      title: "Engineering precision, family trust.",
      pillars: [
        { t: "Uncompromising purity", d: "Certified equipment and exact standards — because what enters your home touches your family's health." },
        { t: "One integrated solution", d: "Water, energy, finishing, waterproofing and maintenance — from one accountable source." },
        { t: "A warranty that lasts", d: "Warranties up to five years and scheduled maintenance that never disappears after handover." },
        { t: "Proven experience", d: "Seventeen years of trust, and hundreds of Jordanian homes." },
      ],
    },
    solutions: {
      eyebrow: "Our solutions",
      title: "Four systems, for one home that rises.",
      items: [
        {
          index: "01",
          eyebrow: "Water",
          title: "Pure water at every tap",
          desc: "Filtration, reverse osmosis and whole-house treatment, engineered to your water quality and your family's needs.",
          bullets: ["Home filtration & reverse osmosis (RO)", "Whole-house central treatment", "Free water-quality test before install"],
          image: "crystalWater",
          href: "/services/water",
          cta: "Explore water solutions",
        },
        {
          index: "02",
          eyebrow: "Kitchens",
          title: "Finishing worthy of the home's heart",
          desc: "Designing and executing kitchen finishes in refined materials and engineering precision, integrated with your water systems.",
          bullets: ["End-to-end design & execution", "Refined materials, fine detail", "Integrated with purification"],
          image: "luxuryKitchen",
          href: "/services/kitchen",
          cta: "Explore kitchen finishing",
        },
        {
          index: "03",
          eyebrow: "Energy",
          title: "Smarter energy from Jordan's sun",
          desc: "Solar power and solar heating systems that cut your bills and give your home cleaner, lasting independence.",
          bullets: ["Photovoltaic systems for homes", "Efficient solar water heaters", "Designed to your consumption"],
          image: "solarEnergy",
          href: "/services/solar",
          cta: "Explore solar energy",
        },
        {
          index: "04",
          eyebrow: "Protection",
          title: "Waterproofing that protects for years",
          desc: "Roof waterproofing and protection to exact standards, shielding your investment from leaks and summer heat.",
          bullets: ["Water & thermal roof insulation", "Certified materials, precise work", "Protection that lasts years"],
          image: "roofWaterproofing",
          href: "/services/protection",
          cta: "Explore protection",
        },
      ],
    },
    featured: {
      eyebrow: "Featured project",
      title: "An integrated residential villa — Amman",
      desc: "A complete water and energy system for a family villa — from engineering design to operation and maintenance.",
      cta: "See projects",
    },
    process: {
      eyebrow: "How we work",
      title: "An engineering journey, from idea to peace of mind.",
      steps: [
        { n: "01", t: "Consult & test", d: "We visit, test your water and needs, and design the right solution." },
        { n: "02", t: "Engineering design", d: "A clear plan with specs, warranties and cost — no surprises." },
        { n: "03", t: "Premium install", d: "A qualified team executes to exact standards, on schedule." },
        { n: "04", t: "Lasting maintenance", d: "Scheduled maintenance and support that never vanishes after handover." },
      ],
    },
    testimonials: {
      eyebrow: "Trusted by homes",
      title: "Homes that testify to the difference.",
      items: [
        { q: "A clear difference in the taste and purity of the water from day one — clean, professional installation.", n: "Um Ahmad", r: "Abdoun, Amman" },
        { q: "My electricity bill dropped noticeably after the solar system, with excellent follow-up.", n: "Eng. Khaled", r: "Dabouq" },
        { q: "Refined service and precise timing — maintenance arrives before I even ask.", n: "Mrs. Rana", r: "Khalda" },
      ],
    },
    stats: {
      eyebrow: "Numbers that build trust",
      items: [
        { v: "17+", l: "Years of experience" },
        { v: "456+", l: "Trusted clients" },
        { v: "5 years", l: "Extended warranty" },
        { v: "24/7", l: "Support that stays" },
      ],
    },
    cta: {
      eyebrow: "Start now",
      title: "Your home deserves purer water and smarter energy.",
      subtitle: "Book a free consultation, and our team will reach you with a clear engineering plan within 48 hours.",
      whatsapp: "Hello NaqiJo, I'd like to book a free consultation.",
    },
  },
};
