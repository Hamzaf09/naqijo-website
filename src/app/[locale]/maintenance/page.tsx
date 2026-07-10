import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { requireLocale } from "@/i18n/routing";
import { Container, Section } from "@/ui/container";
import { H2, H3 } from "@/ui/typography";
import { PageHero } from "@/components/site/page-hero";
import { Eyebrow } from "@/components/site/eyebrow";
import { CtaBand } from "@/components/site/cta-band";
import { Reveal, RevealGroup } from "@/components/motion/reveal";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("maintenance") };
}

const content = {
  ar: {
    eyebrow: "الصيانة الوقائية",
    title: "خدمةٌ لا تنتهي عند التسليم.",
    lead: "الاعتمادية جوهر عملنا. عقود صيانة دورية، زيارات مجدولة، ودعمٌ فنّي يبقى معك — لأن ما نركّبه، نبقى مسؤولين عنه.",
    overviewLabel: "لماذا الصيانة الوقائية",
    overview: "الأنظمة الجيّدة تحتاج رعايةً منتظمة لتبقى بأفضل أداء. نقدّم صيانةً دورية تسبق الأعطال، مع تقارير واضحة واستبدالٍ للفلاتر في مواعيدها — فتطمئن أنّ بيتك بأيدٍ أمينة على مدار العام.",
    plansLabel: "خدماتنا",
    plans: [
      { t: "عقود سنوية", d: "خطط صيانة دورية تبدأ سنوياً وتُفصَّل حسب أنظمتك." },
      { t: "زيارات مجدولة", d: "مواعيد منتظمة كل ثلاثة أشهر أو حسب الحاجة." },
      { t: "دعم فنّي", d: "خطٌّ مباشر مع فريقنا لأي طارئ." },
      { t: "تقارير موثّقة", d: "توثيقٌ لكل زيارة وحالة النظام قبل وبعد." },
    ],
    ctaTitle: "لنبقِ نظامك بأفضل حال.",
    ctaSub: "اطلب صيانة أو عقداً دورياً وسنتواصل معك مباشرة.",
  },
  en: {
    eyebrow: "Preventive maintenance",
    title: "Service that doesn't end at handover.",
    lead: "Reliability is the core of our work. Scheduled maintenance contracts, planned visits, and technical support that stays with you — because what we install, we remain responsible for.",
    overviewLabel: "Why preventive maintenance",
    overview: "Good systems need regular care to stay at their best. We provide scheduled maintenance that precedes failures, with clear reports and on-time filter changes — so you're assured your home is in trustworthy hands all year.",
    plansLabel: "Our services",
    plans: [
      { t: "Annual contracts", d: "Scheduled maintenance plans starting yearly, tailored to your systems." },
      { t: "Planned visits", d: "Regular visits every three months, or as needed." },
      { t: "Technical support", d: "A direct line to our team for any issue." },
      { t: "Documented reports", d: "Documentation of each visit and system status, before and after." },
    ],
    ctaTitle: "Let's keep your system at its best.",
    ctaSub: "Request maintenance or a scheduled contract and we'll follow up directly.",
  },
};

export default async function MaintenancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  setRequestLocale(locale);
  const c = content[locale];

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} image="premiumInstallation" locale={locale} />

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
            <Eyebrow>{c.plansLabel}</Eyebrow>
            <H2 className="mt-6">{locale === "ar" ? "اعتماديةٌ لا تغيب." : "Reliability that never disappears."}</H2>
          </div>
          <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {c.plans.map((p) => (
              <Reveal key={p.t} as="div" className="bg-surface p-8">
                <span aria-hidden className="block size-2 rounded-full rounded-tr-none bg-gold" />
                <H3 className="mt-6">{p.t}</H3>
                <p className="mt-3 text-[1.075rem] leading-relaxed text-fg-muted">{p.d}</p>
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <CtaBand eyebrow={locale === "ar" ? "اطلب صيانة" : "Request maintenance"} title={c.ctaTitle} subtitle={c.ctaSub} locale={locale} image="premiumInstallation" />
    </>
  );
}
