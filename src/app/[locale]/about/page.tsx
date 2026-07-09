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
  return { title: t("about") };
}

const content = {
  ar: {
    eyebrow: "من نحن",
    title: "من حيٍّ يعلو المدينة، وُلد وعدٌ بالنقاء.",
    lead: "من قلب عمّان، ومن حي الرابية الذي يعلو المدينة، وُلدت علامة تحمل في اسمها وعدها: «نقي».",
    storyLabel: "قصتنا",
    story:
      "بدأت الشركة من قناعة بسيطة — أن الماء النقي ليس رفاهية بل حقٌّ لكل بيت أردني — ثم توسّعت هذه القناعة لتشمل البيت كله: بنيته التحتية، وطاقته، وأنظمته، وراحة من يسكنه. اليوم تقدّم نقي الرابية حلولاً متكاملة تجمع بين هندسة المياه والطاقة المستدامة والبنية التحتية السكنية، بمعايير هندسية دقيقة وخدمة إنسانية قريبة.",
    mvv: [
      { t: "رسالتنا", d: "تقديم حلول سكنية وتجارية متكاملة ترتقي بجودة الحياة، عبر مياه نقية وتقنيات مستدامة وتميّز هندسي وخدمات مهنية موثوقة." },
      { t: "رؤيتنا", d: "أن نكون العلامة الأولى في الأردن والمنطقة في الحلول المتكاملة للمياه والطاقة والبنية السكنية، وأن يقترن اسم «نقي» بالثقة كما يقترن الماء بالحياة." },
    ],
    valuesLabel: "قيمنا",
    valuesTitle: "عشر قيمٍ تحكم كل قرار.",
    values: ["النقاء", "الثقة", "الجودة", "الاحترافية", "الصحة", "الاستدامة", "الابتكار", "الأمان", "الاعتمادية", "خدمة العملاء"],
    equationLabel: "معادلتنا",
    equation: "دقة المهندس + نقاء الماء + قرب الجار = نقي الرابية",
    ctaTitle: "لنرتقِ ببيتك معاً.",
    ctaSub: "تعرّف أكثر على حلولنا أو احجز استشارة مجانية.",
  },
  en: {
    eyebrow: "About us",
    title: "From a hill above the city, a promise of purity was born.",
    lead: "From the heart of Amman, from Al-Rabia — the height that rises above the city — a brand was born carrying its promise in its name: “Naqi” (pure).",
    storyLabel: "Our story",
    story:
      "The company began from a simple conviction — that pure water is not a luxury but a right for every Jordanian home — and that conviction grew to embrace the whole home: its infrastructure, its energy, its systems, and the comfort of those who live in it. Today NaqiJo delivers integrated solutions combining water engineering, sustainable energy, and residential infrastructure — with exacting engineering standards and close, human service.",
    mvv: [
      { t: "Our mission", d: "To deliver integrated residential and commercial solutions that elevate quality of life — through pure water, sustainable technology, engineering excellence, and trustworthy professional service." },
      { t: "Our vision", d: "To be the leading brand in Jordan and the region for integrated water, energy, and residential solutions — so the name “Naqi” is tied to trust as water is tied to life." },
    ],
    valuesLabel: "Our values",
    valuesTitle: "Ten values that govern every decision.",
    values: ["Purity", "Trust", "Quality", "Professionalism", "Health", "Sustainability", "Innovation", "Safety", "Reliability", "Customer service"],
    equationLabel: "Our equation",
    equation: "An engineer's precision + water's purity + a neighbour's closeness = NaqiJo",
    ctaTitle: "Let's elevate your home, together.",
    ctaSub: "Learn more about our solutions, or book a free consultation.",
  },
};

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = content[locale];

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} image="familyLifestyle" locale={locale} />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <Eyebrow>{c.storyLabel}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05} className="lg:col-span-8">
              <p className="font-text text-[1.2rem] leading-[1.9] text-fg">{c.story}</p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section className="bg-bg-subtle">
        <Container>
          <RevealGroup className="grid gap-8 md:grid-cols-2">
            {c.mvv.map((m) => (
              <Reveal key={m.t} as="div" className="rounded-[var(--radius-xl)] border border-border bg-surface p-9">
                <span aria-hidden className="block size-2 rounded-full rounded-tr-none bg-gold" />
                <H3 className="mt-6">{m.t}</H3>
                <p className="mt-4 leading-relaxed text-fg-muted">{m.d}</p>
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>{c.valuesLabel}</Eyebrow>
            <H2 className="mt-6">{c.valuesTitle}</H2>
          </div>
          <RevealGroup className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-xl)] border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
            {c.values.map((v) => (
              <Reveal key={v} as="div" className="flex items-center gap-3 bg-surface p-6">
                <span aria-hidden className="size-1.5 shrink-0 rounded-full rounded-tr-none bg-gold" />
                <span className="font-medium text-fg">{v}</span>
              </Reveal>
            ))}
          </RevealGroup>

          <Reveal className="mt-16">
            <div className="rounded-[var(--radius-xl)] bg-navy px-8 py-14 text-center text-white">
              <Eyebrow tone="onDark" className="justify-center">{c.equationLabel}</Eyebrow>
              <p className="mt-6 font-display text-[clamp(1.6rem,3vw,2.5rem)] font-extrabold leading-snug">
                {c.equation}
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CtaBand eyebrow={locale === "ar" ? "لنبدأ" : "Let's begin"} title={c.ctaTitle} subtitle={c.ctaSub} locale={locale} image="brandClosing" />
    </>
  );
}
