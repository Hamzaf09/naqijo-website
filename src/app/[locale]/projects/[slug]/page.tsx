import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { requireLocale, routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Container, Section } from "@/ui/container";
import { Display, H2, Lead } from "@/ui/typography";
import { Eyebrow } from "@/components/site/eyebrow";
import { BrandImage } from "@/components/media/brand-image";
import { CtaBand } from "@/components/site/cta-band";
import { Reveal } from "@/components/motion/reveal";
import { projects, projectSlugs } from "@/content/projects";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projectSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: requestedLocale, slug } = await params;
  const locale = requireLocale(requestedLocale);
  const p = projects[locale][slug];
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: requestedLocale, slug } = await params;
  const locale = requireLocale(requestedLocale);
  setRequestLocale(locale);
  const p = projects[locale][slug];
  if (!p) notFound();

  const blocks = [
    { t: locale === "ar" ? "التحدّي" : "The challenge", d: p.challenge },
    { t: locale === "ar" ? "الحل الهندسي" : "The engineering solution", d: p.solution },
    { t: locale === "ar" ? "الأثر" : "The outcome", d: p.outcome },
  ];

  return (
    <>
      <Section className="pt-16 sm:pt-20">
        <Container>
          <div className="max-w-4xl">
            <Reveal>
              <Eyebrow>{p.category}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <Display className="mt-7">{p.title}</Display>
            </Reveal>
            <Reveal delay={0.1}>
              <Lead className="mt-8 max-w-[52ch]">{p.summary}</Lead>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm text-fg-muted">
                <span>{p.location}</span>
                <span>{p.year}</span>
                <span>{p.scope.join(locale === "ar" ? " · " : " · ")}</span>
              </div>
            </Reveal>
          </div>
        </Container>
        <Reveal delay={0.1} className="mt-14">
          <Container>
            <BrandImage image={p.image} locale={locale} ratio="21/9" priority signature className="shadow-[var(--shadow-lg)]" sizes="(max-width: 1320px) 100vw, 1320px" />
          </Container>
        </Reveal>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-3xl space-y-14">
            {blocks.map((b) => (
              <Reveal key={b.t} as="div">
                <H2 className="text-[clamp(1.5rem,2.4vw,2rem)]">{b.t}</H2>
                <p className="mt-5 font-text text-[1.2rem] leading-[1.9] text-fg">{b.d}</p>
              </Reveal>
            ))}
            <div className="border-t border-border pt-10">
              <Link href="/projects" className="font-medium text-primary hover:text-[var(--primary-hover)]">
                {locale === "ar" ? "→ كل المشاريع" : "→ All projects"}
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow={locale === "ar" ? "لنبدأ" : "Let's begin"}
        title={locale === "ar" ? "لنهندس بيتك القادم." : "Let's engineer your next home."}
        subtitle={locale === "ar" ? "استشارةٌ مجانية وخطةٌ واضحة خلال 48 ساعة." : "A free consultation and a clear plan within 48 hours."}
        locale={locale}
      />
    </>
  );
}
