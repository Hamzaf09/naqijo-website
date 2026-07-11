import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { requireLocale } from "@/i18n/routing";
import { Container, Section } from "@/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { ProductsCatalog } from "@/components/site/products-catalog";
import { getAllProducts, getProductCategories } from "@/data/products";

const content = {
  ar: {
    eyebrow: "منتجاتنا",
    title: "منتجاتٌ هندسية لمياهٍ أنقى.",
    lead: "مجموعةٌ مختارة من أنظمة معالجة المياه، صُمّمت للأداء الموثوق والجودة طويلة الأمد. تصفّح المنتجات، أو ابحث حسب الفئة.",
    ctaTitle: "لست متأكداً أيّ نظام يناسب بيتك؟",
    ctaSub: "احجز استشارة مجانية وسنوصي بالحل الأنسب بعد فحص احتياجك.",
  },
  en: {
    eyebrow: "Our products",
    title: "Engineering products for purer water.",
    lead: "A curated range of water-treatment systems, built for reliable performance and long-term quality. Browse everything, or filter by category.",
    ctaTitle: "Not sure which system fits your home?",
    ctaSub: "Book a free consultation and we'll recommend the right solution after assessing your needs.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  const c = content[locale];
  return { title: c.eyebrow, description: c.lead };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  setRequestLocale(locale);
  const c = content[locale];
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getProductCategories(),
  ]);

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} locale={locale} />

      <Section>
        <Container>
          <ProductsCatalog
            products={products}
            categories={categories}
            locale={locale}
          />
        </Container>
      </Section>

      <CtaBand
        eyebrow={locale === "ar" ? "استشارة مجانية" : "Free consultation"}
        title={c.ctaTitle}
        subtitle={c.ctaSub}
        locale={locale}
      />
    </>
  );
}
