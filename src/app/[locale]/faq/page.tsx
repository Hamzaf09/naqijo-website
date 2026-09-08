import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { requireLocale } from "@/i18n/routing";
import { Container, Section } from "@/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { Reveal } from "@/components/motion/reveal";
import { getFaqs } from "@/data/faqs";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { faqPageSchema } from "@/lib/schema";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  const meta = {
    ar: {
      title: "أسئلة شائعة حول فلاتر ومعالجة المياه",
      description:
        "إجابات عن أكثر الأسئلة شيوعاً حول فلاتر المياه وتنقيتها وصيانتها والضمانات وخدمات نقي الرابية في الأردن.",
    },
    en: {
      title: "Water Filtration & Treatment FAQs",
      description:
        "Answers to common questions about water filters, purification, maintenance, warranties and Naqi Al Rabia services in Jordan.",
    },
  }[locale];
  return pageMetadata({ locale, path: "/faq", title: meta.title, description: meta.description });
}

const content = {
  ar: {
    eyebrow: "الأسئلة الشائعة",
    title: "أسئلةٌ نسمعها كثيراً.",
    lead: "إجاباتٌ واضحة عن أكثر ما يسأل عنه عملاؤنا. لم تجد ما تبحث عنه؟ تواصل معنا مباشرة.",
    items: [
      { q: "هل يشمل الفحص الأولي رسوماً؟", a: "لا. نقدّم فحصاً مجانياً لجودة المياه واحتياجك قبل التوصية بأي حل، دون أي التزام." },
      { q: "هل أنتم مورّد فلاتر فقط؟", a: "لا. نقي الرابية جهةٌ هندسية واحدة تتولّى منظومة البيت كاملة — مياه وطاقة وتشطيبات وعزل وصيانة." },
      { q: "كم تمتدّ الضمانات؟", a: "تختلف حسب النظام، وتصل إلى خمس سنوات، مع صيانةٍ دورية بعد التركيب." },
      { q: "هل تقدّمون صيانة بعد التركيب؟", a: "نعم. نوفّر عقود صيانة دورية وزيارات مجدولة ودعماً فنّياً لا يختفي بعد التسليم." },
      { q: "كيف أبدأ؟", a: "احجز استشارة مجانية عبر صفحة التواصل، وسيتابع معك فريقنا مباشرةً عبر واتساب أو البريد." },
      { q: "أين تقدّمون خدماتكم؟", a: "نخدم عمّان ومحيطها، ونتوسّع لتغطية مناطق أوسع في الأردن. تواصل معنا لتأكيد منطقتك." },
      { q: "ما هو فلتر التناضح العكسي (RO)؟", a: "أنظمة التناضح العكسي (Reverse Osmosis أو RO، وتُعرف بفلتر آر أو) تعتمد على مراحل تنقية متعددة تشمل غشاءً (ممبرين)، وتُستخدم عادةً لإنتاج مياه شربٍ معالجة في المطبخ." },
      { q: "ما الفرق بين فلتر RO والفلتر العادي؟", a: "الفلاتر العادية تحجز الشوائب وتحسّن الطعم والرائحة عبر وسائط ترشيح، بينما يضيف نظام RO مرحلة الغشاء (ممبرين). الفلترة العادية خطوةٌ أساسية، وRO خطوةٌ أعمق مخصّصة لمياه الشرب." },
      { q: "ما هو السوفتنر (جهاز تليين المياه)؟", a: "جهاز معالجة عسر المياه، ويُعرف بالإنجليزية Water Softener وباسم «سوفتنر» في السوق، يعالج عسر المياه والكلس ضمن الاستخدام المناسب للنظام، لحماية الأنابيب والسخانات." },
      { q: "متى أحتاج إلى جهاز تليين مياه؟", a: "إذا لاحظت ترسّبات الكلس على الصنابير والسخانات أو صعوبة رغوة الصابون، فقد يكون من المفيد فحص عسر مياهك. الفحص هو ما يحدّد الحاجة الفعلية والحجم المناسب." },
      { q: "كم مرحلة يحتاج فلتر المياه؟ وهل فلتر 7 مراحل مناسب للمنزل؟", a: "يختلف عدد المراحل بين الأنظمة، وتتوفر طُرز متعددة المراحل تشمل أنظمة بسبع مراحل. العدد المناسب يعتمد على جودة مياهك واحتياجك، ونوصي به بعد الفحص." },
      { q: "متى يجب تغيير شمعات الفلتر (الكارتردج)؟", a: "تعتمد فترات الاستبدال على الاستخدام وجودة المياه ونوع النظام، لذا لا يوجد جدولٌ ثابت يناسب الجميع. نوضّح لك الجدول المناسب لنظامك ضمن الصيانة." },
      { q: "ما هو الفلتر المركزي وما الفرق بينه وبين فلتر الشرب؟", a: "الفلتر المركزي («سنترال فلتر») يعالج المياه الداخلة إلى المنزل بالكامل لخدمة كل الصنابير، بينما يعالج فلتر الشرب نقطة استخدامٍ واحدة عادةً في المطبخ. وكثيرٌ من المنازل يجمع بينهما." },
    ],
    ctaTitle: "ما زال لديك سؤال؟",
    ctaSub: "تواصل معنا وسنجيبك مباشرة.",
  },
  en: {
    eyebrow: "FAQ",
    title: "Questions we hear a lot.",
    lead: "Clear answers to what our clients ask most. Didn't find what you need? Reach us directly.",
    items: [
      { q: "Is the initial assessment charged?", a: "No. We offer a free water-quality and needs assessment before recommending any solution, with no obligation." },
      { q: "Are you only a filter supplier?", a: "No. NaqiJo is a single engineering partner for the whole home — water, energy, finishing, protection and maintenance." },
      { q: "How long are the warranties?", a: "They vary by system, up to five years, with scheduled maintenance after installation." },
      { q: "Do you provide maintenance after install?", a: "Yes. We offer scheduled maintenance contracts, planned visits and support that never disappears after handover." },
      { q: "How do I start?", a: "Book a free consultation on the contact page, and our team follows up directly via WhatsApp or email." },
      { q: "Where do you operate?", a: "We serve Amman and its surroundings, expanding across Jordan. Contact us to confirm your area." },
      { q: "What is a reverse-osmosis (RO) filter?", a: "Reverse-osmosis systems (RO, «فلتر آر أو» in local usage) use multiple purification stages including a membrane, and are typically used to produce treated drinking water at the kitchen." },
      { q: "What's the difference between an RO filter and an ordinary filter?", a: "Ordinary filters capture sediment and improve taste and odor through filter media, while an RO system adds a membrane stage. Ordinary filtration is a foundational step; RO is a deeper stage aimed at drinking water." },
      { q: "What is a water softener?", a: "A water softener — «سوفتنر» in local usage — treats hard water and limescale when correctly specified for your home, helping protect pipes and heaters." },
      { q: "When do I need a water softener?", a: "If you notice limescale on taps and heaters, or that soap doesn't lather easily, it may be worth testing your water hardness. Testing determines the actual need and the right size." },
      { q: "How many stages does a water filter need? Is a seven-stage filter right for a home?", a: "Stage counts differ between systems, and multi-stage models — including seven-stage — are available. The right number depends on your water quality and needs; we recommend it after an assessment." },
      { q: "When should filter cartridges be replaced?", a: "Replacement intervals depend on usage, water quality, and the filter system, so there's no single schedule that fits everyone. We explain the right schedule for your system as part of maintenance." },
      { q: "What is central filtration, and how does it differ from a drinking-water filter?", a: "A central filter («سنترال فلتر») treats the water entering the whole home to serve every tap, while a drinking-water filter treats a single point of use, usually the kitchen. Many homes combine both." },
    ],
    ctaTitle: "Still have a question?",
    ctaSub: "Reach out and we'll answer directly.",
  },
};

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  setRequestLocale(locale);
  const c = content[locale];

  // FAQ manager (CMS collection) drives the list; static copy is the fallback.
  const cmsFaqs = await getFaqs();
  const items =
    cmsFaqs.length > 0
      ? cmsFaqs.map((f) => ({ q: f.question[locale], a: f.answer[locale] }))
      : c.items;

  return (
    <>
      <JsonLd data={faqPageSchema(items.map((i) => ({ question: i.q, answer: i.a })))} />
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} locale={locale} />

      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            {items.map((item, i) => (
              <Reveal key={item.q} as="div">
                <details className="group border-b border-border py-6" {...(i === 0 ? { open: true } : {})}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                    <span className="flex items-start gap-3 font-display text-xl font-bold text-fg">
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full rounded-tr-none bg-gold" />
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className="relative mt-1 size-5 shrink-0 text-primary before:absolute before:inset-x-0 before:top-1/2 before:h-px before:-translate-y-1/2 before:bg-current after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-current after:transition-transform group-open:after:scale-y-0"
                    />
                  </summary>
                  <p className="mt-4 max-w-[60ch] ps-6 leading-relaxed text-fg-muted">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand eyebrow={locale === "ar" ? "تواصل" : "Reach us"} title={c.ctaTitle} subtitle={c.ctaSub} locale={locale} />
    </>
  );
}
