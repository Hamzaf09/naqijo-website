import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Container, Section } from "@/ui/container";
import { H3 } from "@/ui/typography";
import { PageHero } from "@/components/site/page-hero";
import { SolutionRow } from "@/components/site/solution-row";
import { CtaBand } from "@/components/site/cta-band";
import { Reveal } from "@/components/motion/reveal";
import { services, serviceSlugs } from "@/content/services";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("services") };
}

const extras = {
  ar: [
    { key: "maintenance", href: "/maintenance", t: "الصيانة الوقائية", d: "عقود صيانة دورية ودعمٌ فنّي لا يختفي بعد التسليم." },
    { key: "consultation", href: "/consultation", t: "الاستشارة الهندسية", d: "رأيٌ هندسي محايد يصمّم الحل الأنسب لبيتك قبل أي التزام." },
  ],
  en: [
    { key: "maintenance", href: "/maintenance", t: "Preventive maintenance", d: "Scheduled maintenance contracts and support that never vanishes." },
    { key: "consultation", href: "/consultation", t: "Engineering consultation", d: "Neutral engineering advice that designs the right solution before any commitment." },
  ],
};

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  setRequestLocale(locale);
  const list = services[locale];

  return (
    <>
      <PageHero
        eyebrow={locale === "ar" ? "حلولنا" : "Our solutions"}
        title={locale === "ar" ? "حلولٌ هندسية متكاملة، لا خدماتٌ متفرّقة." : "Integrated engineering solutions — not scattered services."}
        lead={
          locale === "ar"
            ? "نتعامل مع بيتك كمنظومةٍ واحدة: ماءٌ نقي، طاقةٌ ذكية، تشطيباتٌ راقية، وحمايةٌ تدوم — من مصدرٍ واحدٍ مسؤول."
            : "We treat your home as one system: pure water, smart energy, refined finishing, and lasting protection — from one accountable source."
        }
        image="engineeringConsultation"
        locale={locale}
      />

      <Section>
        <Container>
          <div className="space-y-24 lg:space-y-32">
            {serviceSlugs.map((slug, i) => {
              const s = list[slug];
              return (
                <SolutionRow
                  key={slug}
                  index={s.index}
                  eyebrow={s.eyebrow}
                  title={s.title}
                  description={s.lead}
                  bullets={s.features.slice(0, 3).map((f) => f.t)}
                  image={s.image}
                  href={`/services/${slug}`}
                  ctaLabel={locale === "ar" ? "التفاصيل الكاملة" : "Full details"}
                  locale={locale}
                  flip={i % 2 === 1}
                />
              );
            })}
          </div>

          <div className="mt-24 grid gap-6 border-t border-border pt-16 sm:grid-cols-2">
            {extras[locale].map((e) => (
              <Reveal key={e.key} as="div">
                <Link
                  href={e.href}
                  className="group block rounded-[var(--radius-lg)] border border-border bg-surface p-8 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
                >
                  <span aria-hidden className="block size-2 rounded-full rounded-tr-none bg-gold" />
                  <H3 className="mt-6">{e.t}</H3>
                  <p className="mt-3 text-[1.075rem] leading-relaxed text-fg-muted">{e.d}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-medium text-primary">
                    {locale === "ar" ? "اعرف المزيد ←" : "Learn more ←"}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow={locale === "ar" ? "لنبدأ" : "Let's begin"}
        title={locale === "ar" ? "حلٌّ واحد، لبيتٍ يرتقي." : "One solution, for a home that rises."}
        subtitle={locale === "ar" ? "احجز استشارة مجانية ودع فريقنا يصمّم الحل الأنسب لك." : "Book a free consultation and let our team design the right solution for you."}
        locale={locale}
      />
    </>
  );
}
