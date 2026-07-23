import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { requireLocale } from "@/i18n/routing";
import { Container, Section } from "@/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { Reveal } from "@/components/motion/reveal";
import { getFaqs } from "@/data/faqs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("faq") };
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
