import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "lexical";
import { requireLocale, routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Container, Section } from "@/ui/container";
import { H2, H3 } from "@/ui/typography";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { Eyebrow } from "@/components/site/eyebrow";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { getServiceBySlug, getServiceSlugs } from "@/data/services";

export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: requestedLocale, slug } = await params;
  const locale = requireLocale(requestedLocale);
  const s = await getServiceBySlug(slug);
  return s
    ? { title: s.headline[locale], description: s.shortDescription[locale] }
    : {};
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: requestedLocale, slug } = await params;
  const locale = requireLocale(requestedLocale);
  setRequestLocale(locale);
  const s = await getServiceBySlug(slug);
  if (!s) notFound();

  const overview = s.fullDescription?.[locale] as
    | SerializedEditorState
    | undefined;

  return (
    <>
      <PageHero
        eyebrow={s.name[locale]}
        title={s.headline[locale]}
        lead={s.shortDescription[locale]}
        media={
          s.heroImage
            ? { src: s.heroImage.src, alt: s.heroImage.alt[locale] }
            : null
        }
        locale={locale}
      />

      {/* Overview */}
      {overview ? (
        <Section>
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-4">
                <Eyebrow>{locale === "ar" ? "نظرة عامة" : "Overview"}</Eyebrow>
              </Reveal>
              <Reveal
                delay={0.05}
                className="prose-naqi font-text text-[1.2rem] leading-[1.9] text-fg lg:col-span-8 [&_p]:mb-4"
              >
                <RichText data={overview} />
              </Reveal>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Features */}
      {s.features.length > 0 ? (
        <Section className="bg-bg-subtle">
          <Container>
            <div className="max-w-2xl">
              <Eyebrow>{locale === "ar" ? "ما نقدّمه" : "What we deliver"}</Eyebrow>
              <H2 className="mt-6">
                {locale === "ar" ? "تفاصيلٌ تصنع الفرق." : "Details that make the difference."}
              </H2>
            </div>
            <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-border bg-border sm:grid-cols-2">
              {s.features.map((f, i) => (
                <Reveal key={i} as="div" className="bg-surface p-8 lg:p-9">
                  <span aria-hidden className="block size-2 rounded-full rounded-tr-none bg-gold" />
                  <H3 className="mt-6">{f.title[locale]}</H3>
                  <p className="mt-3 text-[1.075rem] leading-relaxed text-fg-muted">
                    {f.description[locale]}
                  </p>
                </Reveal>
              ))}
            </RevealGroup>
          </Container>
        </Section>
      ) : null}

      {/* Process */}
      {s.process.length > 0 ? (
        <Section>
          <Container>
            <div className="max-w-2xl">
              <Eyebrow>{locale === "ar" ? "كيف نعمل" : "How we work"}</Eyebrow>
              <H2 className="mt-6">
                {locale === "ar" ? "من الفكرة إلى الاطمئنان." : "From idea to peace of mind."}
              </H2>
            </div>
            <RevealGroup className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {s.process.map((step, i) => (
                <Reveal key={i} as="div" className="border-t border-border-strong pt-6">
                  <span className="font-display text-3xl font-bold text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <H3 className="mt-4">{step[locale]}</H3>
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
      ) : null}

      <CtaBand
        eyebrow={locale === "ar" ? "جاهز؟" : "Ready?"}
        title={locale === "ar" ? "لنصمّم الحل الأنسب لبيتك." : "Let's design the right solution for your home."}
        subtitle={locale === "ar" ? "استشارةٌ مجانية وخطةٌ هندسية واضحة خلال 48 ساعة." : "A free consultation and a clear engineering plan within 48 hours."}
        locale={locale}
        media={
          s.heroImage
            ? { src: s.heroImage.src, alt: s.heroImage.alt[locale] }
            : undefined
        }
      />
    </>
  );
}
