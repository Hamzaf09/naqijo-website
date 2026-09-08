import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { requireLocale, routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { pageMetadata, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { articleSchema, breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { Container, Section } from "@/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { H2 } from "@/ui/typography";
import { Eyebrow } from "@/components/site/eyebrow";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaBand } from "@/components/site/cta-band";
import { Reveal } from "@/components/motion/reveal";
import { getAllGuides, getGuideBySlug } from "@/data/guides";
import { approvedImages } from "@/config/images";

export const dynamicParams = false;
export const revalidate = 300;

export async function generateStaticParams() {
  const guides = await getAllGuides();
  return routing.locales.flatMap((locale) =>
    guides.map((g) => ({ locale, slug: g.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: requestedLocale, slug } = await params;
  const locale = requireLocale(requestedLocale);
  const g = await getGuideBySlug(slug);
  if (!g) return {};
  return pageMetadata({
    locale,
    path: `/guides/${slug}`,
    title: g.title[locale],
    description: g.description[locale],
    image: { url: approvedImages[g.image].src, alt: g.title[locale] },
    type: "article",
  });
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: requestedLocale, slug } = await params;
  const locale = requireLocale(requestedLocale);
  setRequestLocale(locale);

  const g = await getGuideBySlug(slug);
  if (!g) notFound();

  const home = locale === "ar" ? "الرئيسية" : "Home";
  const guidesLabel = locale === "ar" ? "الأدلة" : "Guides";
  const url = absoluteUrl(`/${locale}/guides/${slug}`);

  const articleLd = articleSchema({
    headline: g.title[locale],
    description: g.description[locale],
    url,
    locale,
    datePublished: g.datePublished,
    dateModified: g.dateModified,
    image: approvedImages[g.image].src,
  });
  const breadcrumbLd = breadcrumbSchema(
    [
      { name: home, path: "/" },
      { name: guidesLabel, path: "/guides" },
      { name: g.title[locale], path: `/guides/${slug}` },
    ],
    locale,
  );
  const schemas: object[] = [articleLd, breadcrumbLd];
  if (g.faqs && g.faqs.length > 0) {
    schemas.push(
      faqPageSchema(g.faqs.map((f) => ({ question: f.q[locale], answer: f.a[locale] }))),
    );
  }

  return (
    <>
      <JsonLd data={schemas} />

      <section className="pt-10 sm:pt-14">
        <Container>
          <Breadcrumbs
            items={[
              { label: home, href: "/" },
              { label: guidesLabel, href: "/guides" },
              { label: g.title[locale] },
            ]}
          />
        </Container>
      </section>

      <PageHero
        eyebrow={locale === "ar" ? "دليل" : "Guide"}
        title={g.title[locale]}
        lead={g.description[locale]}
        image={g.image}
        locale={locale}
      />

      <Section>
        <Container>
          <article className="mx-auto max-w-3xl">
            {g.sections.map((s, i) => (
              <Reveal key={i} as="section" className={i > 0 ? "mt-12" : ""}>
                <H2 className="text-[clamp(1.5rem,2.4vw,2rem)]">{s.heading[locale]}</H2>
                {s.body.map((p, j) => (
                  <p key={j} className="mt-5 font-text text-[1.15rem] leading-[1.95] text-fg">
                    {p[locale]}
                  </p>
                ))}
                {s.bullets && s.bullets.length > 0 ? (
                  <ul className="mt-5 space-y-3">
                    {s.bullets.map((b, k) => (
                      <li key={k} className="flex items-start gap-3 text-fg">
                        <span
                          aria-hidden
                          className="mt-2.5 size-1.5 shrink-0 rounded-full rounded-tr-none bg-gold"
                        />
                        <span className="text-[1.1rem] leading-relaxed">{b[locale]}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Reveal>
            ))}

            {g.faqs && g.faqs.length > 0 ? (
              <div className="mt-16">
                <Eyebrow>{locale === "ar" ? "أسئلة شائعة" : "Frequently asked"}</Eyebrow>
                <div className="mt-6">
                  {g.faqs.map((f, i) => (
                    <details key={i} className="group border-b border-border py-6" {...(i === 0 ? { open: true } : {})}>
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                        <span className="flex items-start gap-3 font-display text-xl font-bold text-fg">
                          <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full rounded-tr-none bg-gold" />
                          {f.q[locale]}
                        </span>
                      </summary>
                      <p className="mt-4 max-w-[60ch] ps-6 leading-relaxed text-fg-muted">{f.a[locale]}</p>
                    </details>
                  ))}
                </div>
              </div>
            ) : null}

            {g.related.length > 0 ? (
              <div className="mt-14 border-t border-border pt-8">
                <Eyebrow>{locale === "ar" ? "روابط ذات صلة" : "Related"}</Eyebrow>
                <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                  {g.related.map((r) => (
                    <li key={r.href}>
                      <Link href={r.href} className="font-medium text-primary hover:text-[var(--primary-hover)]">
                        {r.label[locale]}
                        <span aria-hidden className="ms-1">{locale === "ar" ? "←" : "→"}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>
        </Container>
      </Section>

      <CtaBand
        eyebrow={locale === "ar" ? "جاهز للخطوة التالية؟" : "Ready for the next step?"}
        title={locale === "ar" ? "لنصمّم الحل الأنسب لمنزلك." : "Let's design the right solution for your home."}
        subtitle={
          locale === "ar"
            ? "استشارةٌ مجانية تبدأ بفحص جودة مياهك."
            : "A free consultation that starts with assessing your water quality."
        }
        locale={locale}
      />
    </>
  );
}
