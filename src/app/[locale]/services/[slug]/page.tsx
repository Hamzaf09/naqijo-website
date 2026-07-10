import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { requireLocale, routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Container, Section } from "@/ui/container";
import { H2, H3 } from "@/ui/typography";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { Eyebrow } from "@/components/site/eyebrow";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { services, serviceSlugs } from "@/content/services";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    serviceSlugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: requestedLocale, slug } = await params;
  const locale = requireLocale(requestedLocale);
  const s = services[locale][slug];
  return s ? { title: s.title, description: s.lead } : {};
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: requestedLocale, slug } = await params;
  const locale = requireLocale(requestedLocale);
  setRequestLocale(locale);
  const s = services[locale][slug];
  if (!s) notFound();

  return (
    <>
      <PageHero eyebrow={s.eyebrow} title={s.title} lead={s.lead} image={s.image} locale={locale} />

      {/* Overview */}
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <Eyebrow>{locale === "ar" ? "نظرة عامة" : "Overview"}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05} className="lg:col-span-8">
              <p className="font-text text-[1.2rem] leading-[1.9] text-fg">{s.overview}</p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Features */}
      <Section className="bg-bg-subtle">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>{locale === "ar" ? "ما نقدّمه" : "What we deliver"}</Eyebrow>
            <H2 className="mt-6">{locale === "ar" ? "تفاصيلٌ تصنع الفرق." : "Details that make the difference."}</H2>
          </div>
          <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-border bg-border sm:grid-cols-2">
            {s.features.map((f) => (
              <Reveal key={f.t} as="div" className="bg-surface p-8 lg:p-9">
                <span aria-hidden className="block size-2 rounded-full rounded-tr-none bg-gold" />
                <H3 className="mt-6">{f.t}</H3>
                <p className="mt-3 text-[1.075rem] leading-relaxed text-fg-muted">{f.d}</p>
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Process */}
      <Section>
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>{locale === "ar" ? "كيف نعمل" : "How we work"}</Eyebrow>
            <H2 className="mt-6">{locale === "ar" ? "من الفكرة إلى الاطمئنان." : "From idea to peace of mind."}</H2>
          </div>
          <RevealGroup className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {s.process.map((step, i) => (
              <Reveal key={step} as="div" className="border-t border-border-strong pt-6">
                <span className="font-display text-3xl font-bold text-gold">
                  {locale === "ar" ? ["01", "02", "03", "04"][i] : `0${i + 1}`}
                </span>
                <H3 className="mt-4">{step}</H3>
              </Reveal>
            ))}
          </RevealGroup>

          <div className="mt-16">
            <Link href="/services" className="font-medium text-primary hover:text-[var(--primary-hover)]">
              {locale === "ar" ? "→ كل الحلول" : "→ All solutions"}
            </Link>
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow={locale === "ar" ? "جاهز؟" : "Ready?"}
        title={locale === "ar" ? "لنصمّم الحل الأنسب لبيتك." : "Let's design the right solution for your home."}
        subtitle={locale === "ar" ? "استشارةٌ مجانية وخطةٌ هندسية واضحة خلال 48 ساعة." : "A free consultation and a clear engineering plan within 48 hours."}
        locale={locale}
        image={s.image}
      />
    </>
  );
}
