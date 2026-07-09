import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { Container, Section } from "@/ui/container";
import { H2, H3 } from "@/ui/typography";
import { PageHero } from "@/components/site/page-hero";
import { Eyebrow } from "@/components/site/eyebrow";
import { CtaBand } from "@/components/site/cta-band";
import { Reveal, RevealGroup } from "@/components/motion/reveal";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("consultation") };
}

const content = {
  ar: {
    eyebrow: "الاستشارة الهندسية",
    title: "قرارٌ صائب يبدأ برأيٍ هندسي.",
    lead: "قبل أي التزام، نجلس معك ونفحص احتياجك ونصمّم الحل الأنسب لبيتك — برأيٍ هندسي محايد لا يبيعك ما لا تحتاجه.",
    overviewLabel: "لماذا الاستشارة",
    overview: "الاستشارة الهندسية هي نقطة البداية الصحيحة. نزورك، نفحص جودة مياهك ومساحتك واستهلاكك، ونضع بين يديك خطةً واضحة بالمواصفات والتكلفة والضمانات — لتقرّر وأنت مطمئن.",
    getLabel: "ماذا تتضمّن",
    get: [
      { t: "زيارة وفحص", d: "فحص ميداني لجودة المياه والمساحة والاحتياج." },
      { t: "تقرير هندسي", d: "توصية واضحة بالحل الأنسب والبدائل الممكنة." },
      { t: "خطة وتكلفة", d: "مواصفات وتكلفة وضمانات دون مفاجآت لاحقة." },
      { t: "رأيٌ محايد", d: "نصيحةٌ تخدم بيتك، لا نبيعك ما لا تحتاجه." },
    ],
    ctaTitle: "احجز استشارتك المجانية.",
    ctaSub: "سيصلك فريقنا بخطةٍ هندسية واضحة خلال 48 ساعة.",
  },
  en: {
    eyebrow: "Engineering consultation",
    title: "A sound decision starts with an engineer's view.",
    lead: "Before any commitment, we sit with you, assess your needs, and design the right solution for your home — with neutral engineering advice that never sells you what you don't need.",
    overviewLabel: "Why a consultation",
    overview: "An engineering consultation is the right starting point. We visit, test your water quality, space and consumption, and hand you a clear plan with specs, cost and warranties — so you decide with confidence.",
    getLabel: "What it includes",
    get: [
      { t: "Visit & assessment", d: "An on-site check of water quality, space and needs." },
      { t: "Engineering report", d: "A clear recommendation of the best solution and alternatives." },
      { t: "Plan & cost", d: "Specs, cost and warranties with no later surprises." },
      { t: "Neutral advice", d: "Guidance that serves your home — never overselling." },
    ],
    ctaTitle: "Book your free consultation.",
    ctaSub: "Our team will reach you with a clear engineering plan within 48 hours.",
  },
};

export default async function ConsultationPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = content[locale];

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} image="engineeringConsultation" locale={locale} />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <Eyebrow>{c.overviewLabel}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05} className="lg:col-span-8">
              <p className="font-text text-[1.2rem] leading-[1.9] text-fg">{c.overview}</p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section className="bg-bg-subtle">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>{c.getLabel}</Eyebrow>
            <H2 className="mt-6">{locale === "ar" ? "وضوحٌ من أول لقاء." : "Clarity from the first meeting."}</H2>
          </div>
          <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {c.get.map((g) => (
              <Reveal key={g.t} as="div" className="bg-surface p-8">
                <span aria-hidden className="block size-2 rounded-full rounded-tr-none bg-gold" />
                <H3 className="mt-6">{g.t}</H3>
                <p className="mt-3 text-[1.075rem] leading-relaxed text-fg-muted">{g.d}</p>
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <CtaBand eyebrow={locale === "ar" ? "ابدأ الآن" : "Start now"} title={c.ctaTitle} subtitle={c.ctaSub} locale={locale} />
    </>
  );
}
