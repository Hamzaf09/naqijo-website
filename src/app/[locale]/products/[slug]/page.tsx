import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "lexical";
import { requireLocale, routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Container, Section } from "@/ui/container";
import { Display, H2 } from "@/ui/typography";
import { Eyebrow } from "@/components/site/eyebrow";
import { ProductCard } from "@/components/site/product-card";
import { CtaBand } from "@/components/site/cta-band";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { buttonVariants } from "@/ui/button";
import { getSettings } from "@/data/settings";
import { availabilityLabels } from "@/data/product-types";
import {
  getProductBySlug,
  getProductSlugs,
  getRelatedProducts,
} from "@/data/products";
import { cn } from "@/lib/utils";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
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
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const title = product.seoTitle?.[locale] || product.name[locale];
  const description =
    product.seoDescription?.[locale] || product.shortDescription[locale];
  return { title, description };
}

const t = {
  ar: {
    breadcrumbHome: "الرئيسية",
    breadcrumbProducts: "المنتجات",
    consultation: "احجز استشارة مجانية",
    whatsapp: "تواصل عبر واتساب",
    whatsappText: (name: string) => `مرحباً، أرغب بالاستفسار عن ${name}.`,
    overview: "نظرة عامة",
    specs: "المواصفات الفنية",
    included: "ما الذي يتضمّنه",
    downloads: "التحميلات",
    faq: "الأسئلة الشائعة",
    related: "منتجات ذات صلة",
    back: "كل المنتجات",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbProducts: "Products",
    consultation: "Request free consultation",
    whatsapp: "Contact via WhatsApp",
    whatsappText: (name: string) => `Hi, I'd like to ask about the ${name}.`,
    overview: "Overview",
    specs: "Technical specifications",
    included: "What's included",
    downloads: "Downloads",
    faq: "Frequently asked questions",
    related: "Related products",
    back: "All products",
  },
} as const;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: requestedLocale, slug } = await params;
  const locale = requireLocale(requestedLocale);
  setRequestLocale(locale);

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const c = t[locale];
  const category = product.categoryLabel;
  const availability = availabilityLabels[product.availability][locale];
  const gallery = [product.image, ...product.gallery];
  const related = await getRelatedProducts(slug, 3);
  const fullDescription = product.fullDescription?.[locale] as
    | SerializedEditorState
    | undefined;

  const settings = await getSettings();
  const wa = `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    c.whatsappText(product.name[locale]),
  )}`;

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="pt-10 sm:pt-14">
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm text-fg-subtle">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition-colors hover:text-fg">
                  {c.breadcrumbHome}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/products" className="transition-colors hover:text-fg">
                  {c.breadcrumbProducts}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-fg-muted">{product.name[locale]}</li>
            </ol>
          </nav>

          <div className="mt-10 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Product imagery */}
            <Reveal>
              <div className="relative aspect-square overflow-hidden rounded-[var(--radius-2xl)] bg-bg-subtle shadow-[var(--shadow-md)] lg:aspect-[4/3]">
                {product.image.src ? (
                  <Image
                    src={product.image.src}
                    alt={product.image.alt[locale]}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 620px"
                    className="object-contain p-10 lg:p-14"
                  />
                ) : null}
              </div>
              {gallery.length > 1 ? (
                <ul className="mt-4 grid grid-cols-4 gap-4">
                  {gallery.map((img, i) => (
                    <li
                      key={i}
                      className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg-subtle"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt[locale]}
                        fill
                        sizes="140px"
                        className="object-contain p-3"
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>

            {/* Product summary */}
            <Reveal delay={0.05} className="lg:pt-4">
              {category ? <Eyebrow>{category[locale]}</Eyebrow> : null}
              <Display className="mt-6 text-[clamp(2.1rem,4vw,3.25rem)]">
                {product.name[locale]}
              </Display>

              <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-bg-blue px-3.5 py-1.5 text-sm font-medium text-primary">
                <span aria-hidden className="size-2 rounded-full bg-primary" />
                {availability}
              </span>

              <p className="mt-6 max-w-[46ch] text-[1.2rem] leading-relaxed text-fg-muted">
                {product.shortDescription[locale]}
              </p>

              {product.features.length > 0 ? (
                <ul className="mt-8 space-y-3">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-fg">
                      <span
                        aria-hidden
                        className="mt-2.5 size-1.5 shrink-0 rounded-full rounded-tr-none bg-gold"
                      />
                      <span className="text-[1.1rem] leading-relaxed">{f[locale]}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className={cn(buttonVariants({ variant: "gold", size: "lg" }))}
                >
                  {c.consultation}
                </Link>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                >
                  {c.whatsapp}
                </a>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------- OVERVIEW + SPECS ---------------- */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Eyebrow>{c.overview}</Eyebrow>
              {fullDescription ? (
                <div className="prose-naqi mt-6 max-w-none font-text text-[1.2rem] leading-[1.95] text-fg [&_a]:text-primary [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_li]:my-1 [&_ol]:my-4 [&_ol]:ps-6 [&_p]:mb-4 [&_ul]:my-4 [&_ul]:ps-6">
                  <RichText data={fullDescription} />
                </div>
              ) : null}

              {product.included.length > 0 ? (
                <div className="mt-12">
                  <Eyebrow>{c.included}</Eyebrow>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {product.included.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-fg"
                      >
                        <span
                          aria-hidden
                          className="mt-2 size-1.5 shrink-0 rounded-full rounded-tr-none bg-gold"
                        />
                        <span className="leading-relaxed">{item[locale]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {product.downloads.length > 0 ? (
                <div className="mt-12">
                  <Eyebrow>{c.downloads}</Eyebrow>
                  <ul className="mt-6 space-y-3">
                    {product.downloads.map((d, i) => (
                      <li key={i}>
                        <a
                          href={d.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border bg-surface px-5 py-4 text-fg transition-colors hover:border-primary hover:text-primary"
                        >
                          <span className="font-medium">{d.label[locale]}</span>
                          <span aria-hidden>↓</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {product.specs.length > 0 ? (
              <div className="lg:col-span-5">
                <Eyebrow>{c.specs}</Eyebrow>
                <dl className="mt-6 overflow-hidden rounded-[var(--radius-xl)] border border-border">
                  {product.specs.map((spec, i) => (
                    <div
                      key={i}
                      className={cn(
                        "grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-2 sm:gap-6",
                        i % 2 === 1 ? "bg-bg-subtle" : "bg-surface",
                      )}
                    >
                      <dt className="font-medium text-fg-muted">{spec.label[locale]}</dt>
                      <dd className="font-semibold text-fg">
                        {spec.value[locale]}
                        {spec.unit ? ` ${spec.unit}` : ""}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>
        </Container>
      </Section>

      {/* ---------------- FAQ ---------------- */}
      {product.faqs.length > 0 ? (
        <Section className="bg-bg-subtle">
          <Container>
            <div className="mx-auto max-w-3xl">
              <Eyebrow>{c.faq}</Eyebrow>
              <div className="mt-8">
                {product.faqs.map((item, i) => (
                  <details
                    key={i}
                    className="group border-b border-border py-6"
                    {...(i === 0 ? { open: true } : {})}
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                      <span className="flex items-start gap-3 font-display text-xl font-bold text-fg">
                        <span
                          aria-hidden
                          className="mt-2.5 size-1.5 shrink-0 rounded-full rounded-tr-none bg-gold"
                        />
                        {item.question[locale]}
                      </span>
                    </summary>
                    <p className="mt-4 max-w-[60ch] ps-6 leading-relaxed text-fg-muted">
                      {item.answer[locale]}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* ---------------- RELATED ---------------- */}
      {related.length > 0 ? (
        <Section>
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <H2>{c.related}</H2>
              <Link
                href="/products"
                className="font-medium text-primary transition-colors hover:text-[var(--primary-hover)]"
              >
                {locale === "ar" ? `← ${c.back}` : `${c.back} →`}
              </Link>
            </div>
            <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {related.map((p) => (
                <Reveal key={p.slug} as="div">
                  <ProductCard product={p} locale={locale} />
                </Reveal>
              ))}
            </RevealGroup>
          </Container>
        </Section>
      ) : null}

      <CtaBand
        eyebrow={locale === "ar" ? "جاهز؟" : "Ready?"}
        title={
          locale === "ar"
            ? "لنصمّم الحل الأنسب لبيتك."
            : "Let's design the right solution for your home."
        }
        subtitle={
          locale === "ar"
            ? "استشارةٌ مجانية وخطةٌ هندسية واضحة خلال 48 ساعة."
            : "A free consultation and a clear engineering plan within 48 hours."
        }
        locale={locale}
      />
    </>
  );
}
