import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { requireLocale, routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { Container, Section } from "@/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ProductCard } from "@/components/site/product-card";
import { CtaBand } from "@/components/site/cta-band";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { getProductsByCategory } from "@/data/products";
import { getCategoryContent, categoryContent } from "@/content/product-categories";
import { getCategoryLabel } from "@/data/products.static";
import { approvedImages } from "@/config/images";

export const dynamicParams = false;
export const revalidate = 300;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    Object.keys(categoryContent).map((category) => ({ locale, category })),
  );
}

/** Contextual guide links per category (created in the guides section). */
const categoryGuides: Record<string, string[]> = {
  "drinking-water": ["choosing-a-water-filter", "reverse-osmosis-vs-filtration"],
  "water-softening": ["hard-water-and-water-softeners"],
  "central-filtration": ["choosing-a-water-filter"],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale: requestedLocale, category } = await params;
  const locale = requireLocale(requestedLocale);
  const c = getCategoryContent(category);
  if (!c) return {};
  return pageMetadata({
    locale,
    path: `/products/category/${category}`,
    title: c.metaTitle[locale],
    description: c.metaDescription[locale],
    image: { url: approvedImages[c.image].src, alt: c.title[locale] },
  });
}

export default async function ProductCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale: requestedLocale, category } = await params;
  const locale = requireLocale(requestedLocale);
  setRequestLocale(locale);

  const content = getCategoryContent(category);
  if (!content) notFound();

  const products = await getProductsByCategory(category);
  const label = getCategoryLabel(category)?.[locale] ?? content.title[locale];
  const guides = categoryGuides[category] ?? [];

  const home = locale === "ar" ? "الرئيسية" : "Home";
  const productsLabel = locale === "ar" ? "المنتجات" : "Products";
  const crumbs = [
    { label: home, href: "/" },
    { label: productsLabel, href: "/products" },
    { label: content.title[locale] },
  ];
  const breadcrumbLd = breadcrumbSchema(
    [
      { name: home, path: "/" },
      { name: productsLabel, path: "/products" },
      { name: content.title[locale], path: `/products/category/${category}` },
    ],
    locale,
  );

  return (
    <>
      <JsonLd data={breadcrumbLd} />

      <section className="pt-10 sm:pt-14">
        <Container>
          <Breadcrumbs items={crumbs} />
        </Container>
      </section>

      <PageHero
        eyebrow={label}
        title={content.title[locale]}
        lead={content.lead[locale]}
        image={content.image}
        locale={locale}
      />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              {content.intro.map((p, i) => (
                <p
                  key={i}
                  className="font-text text-[1.15rem] leading-[1.95] text-fg [&:not(:first-child)]:mt-5"
                >
                  {p[locale]}
                </p>
              ))}

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[1.02rem]">
                <Link href="/services/water" className="font-medium text-primary hover:text-[var(--primary-hover)]">
                  {locale === "ar" ? "حلول المياه ←" : "Water solutions →"}
                </Link>
                <Link href="/consultation" className="font-medium text-primary hover:text-[var(--primary-hover)]">
                  {locale === "ar" ? "استشارة هندسية مجانية ←" : "Free engineering consultation →"}
                </Link>
                <Link href="/maintenance" className="font-medium text-primary hover:text-[var(--primary-hover)]">
                  {locale === "ar" ? "الصيانة ←" : "Maintenance →"}
                </Link>
              </div>

              {guides.length > 0 ? (
                <div className="mt-6 text-[1.02rem] text-fg-muted">
                  <span className="me-2">{locale === "ar" ? "اقرأ أيضاً:" : "Read also:"}</span>
                  {guides.map((g, i) => (
                    <span key={g}>
                      {i > 0 ? <span className="mx-2 text-border-strong">·</span> : null}
                      <Link href={`/guides/${g}`} className="text-primary hover:text-[var(--primary-hover)]">
                        {guideTitles[g]?.[locale] ?? g}
                      </Link>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {products.length > 0 ? (
            <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {products.map((p, i) => (
                <Reveal key={p.slug} as="div">
                  <ProductCard product={p} locale={locale} priority={i < 3} />
                </Reveal>
              ))}
            </RevealGroup>
          ) : null}

          <div className="mt-12">
            <Link href="/products" className="font-medium text-primary hover:text-[var(--primary-hover)]">
              {locale === "ar" ? "→ تصفّح كل المنتجات" : "→ Browse all products"}
            </Link>
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow={locale === "ar" ? "غير متأكد؟" : "Not sure?"}
        title={
          locale === "ar"
            ? "لنوصي بالحل الأنسب لمنزلك."
            : "Let's recommend the right solution for your home."
        }
        subtitle={
          locale === "ar"
            ? "احجز استشارة مجانية ونبدأ بفحص جودة مياهك."
            : "Book a free consultation and we'll start by assessing your water quality."
        }
        locale={locale}
      />
    </>
  );
}

/** Short, human titles for the contextual guide links above. */
const guideTitles: Record<string, Record<string, string>> = {
  "choosing-a-water-filter": {
    ar: "كيف تختار فلتر مياه مناسب",
    en: "How to choose a water filter",
  },
  "reverse-osmosis-vs-filtration": {
    ar: "التناضح العكسي RO مقابل الأنظمة الأخرى",
    en: "Reverse osmosis vs other systems",
  },
  "hard-water-and-water-softeners": {
    ar: "عسر المياه وأجهزة التليين (سوفتنر)",
    en: "Hard water and water softeners",
  },
};
