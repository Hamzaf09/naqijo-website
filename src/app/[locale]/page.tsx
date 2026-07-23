import { setRequestLocale } from "next-intl/server";
import { Star, BadgeCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { requireLocale } from "@/i18n/routing";
import { Container, Section } from "@/ui/container";
import { H2, H3, Lead } from "@/ui/typography";
import { buttonVariants } from "@/ui/button";
import { Eyebrow } from "@/components/site/eyebrow";
import { BrandImage } from "@/components/media/brand-image";
import { HomeHero } from "@/components/site/home-hero";
import { FeaturedProducts } from "@/components/site/featured-products";
import { SolutionRow } from "@/components/site/solution-row";
import { CtaBand } from "@/components/site/cta-band";
import { Reveal, RevealGroup, RevealImage } from "@/components/motion/reveal";
import { getHomepage } from "@/data/homepage";
import { getFeaturedProducts } from "@/data/products";
import { getFeaturedProjects } from "@/data/projects";
import { getFeaturedTestimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  setRequestLocale(locale);

  // Everything below is CMS-driven: the Homepage global holds the hero and all
  // editorial copy; featured products/projects come from their collections.
  const [home, featuredProducts, featuredProjects, featuredTestimonials] =
    await Promise.all([
      getHomepage(),
      getFeaturedProducts(),
      getFeaturedProjects(1),
      getFeaturedTestimonials(3),
    ]);
  const featuredProject = featuredProjects[0] ?? null;
  // Testimonials collection drives the section; global copy is the fallback.
  const testimonialItems =
    featuredTestimonials.length > 0 ? featuredTestimonials : home.testimonials.items;

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <HomeHero
        locale={locale}
        content={{
          eyebrow: home.hero.eyebrow[locale],
          titleTop: home.hero.titleTop[locale],
          titleAccent: home.hero.titleAccent[locale],
          subtitle: home.hero.subtitle[locale],
          primary: home.hero.primaryLabel[locale],
          primaryHref: home.hero.primaryHref,
          secondary: home.hero.secondaryLabel[locale],
          secondaryHref: home.hero.secondaryHref,
          image: home.hero.image
            ? { src: home.hero.image.src, alt: home.hero.image.alt[locale] }
            : { src: "", alt: "" },
        }}
      />

      {/* ---------------- ABOUT / INTRO STATEMENT ---------------- */}
      <Section className="relative overflow-hidden">
        {/* subtle engineering blueprint texture (fades out — never competes with text) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 end-0 hidden w-[45%] opacity-70 lg:block"
          style={{
            backgroundImage:
              "radial-gradient(var(--border-strong) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage:
              "radial-gradient(130% 130% at 100% 30%, #000 0%, transparent 62%)",
            WebkitMaskImage:
              "radial-gradient(130% 130% at 100% 30%, #000 0%, transparent 62%)",
          }}
        />
        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <Eyebrow>{home.about.eyebrow[locale]}</Eyebrow>
              <H2 className="mt-6 max-w-[14ch]">{home.about.title[locale]}</H2>
              <span aria-hidden className="mt-8 block h-0.5 w-16 bg-gold" />
            </Reveal>
            <Reveal delay={0.05} className="lg:col-span-7 lg:pt-2">
              <p className="font-text text-[1.25rem] leading-[2] text-fg">
                {home.about.body[locale]}
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------------- WHY NAQIJO ---------------- */}
      <Section className="bg-bg-subtle">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>{home.why.eyebrow[locale]}</Eyebrow>
            <H2 className="mt-6">{home.why.title[locale]}</H2>
          </div>
          <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {home.why.pillars.map((p) => (
              <Reveal
                key={p.title[locale]}
                as="div"
                className="group/cell relative bg-surface p-8 transition-[background-color,box-shadow] duration-300 hover:z-10 hover:bg-bg-blue/40 hover:shadow-[var(--shadow-md)] lg:p-9"
              >
                <span
                  aria-hidden
                  className="block size-2 rounded-full rounded-tr-none bg-gold transition-transform duration-300 group-hover/cell:scale-150"
                />
                <H3 className="mt-6 transition-colors duration-300 group-hover/cell:text-primary">
                  {p.title[locale]}
                </H3>
                <p className="mt-3 text-[1.075rem] leading-relaxed text-fg-muted">
                  {p.description[locale]}
                </p>
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ---------------- SOLUTIONS ---------------- */}
      <Section>
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>{home.solutions.eyebrow[locale]}</Eyebrow>
            <H2 className="mt-6">{home.solutions.title[locale]}</H2>
          </div>
          <div className="mt-16 space-y-24 lg:space-y-32">
            {home.solutions.items.map((s, i) => (
              <SolutionRow
                key={s.href + i}
                index={String(i + 1).padStart(2, "0")}
                eyebrow={s.eyebrow[locale]}
                title={s.title[locale]}
                description={s.description[locale]}
                bullets={s.bullets.map((b) => b[locale])}
                media={
                  s.image ? { src: s.image.src, alt: s.image.alt[locale] } : null
                }
                href={s.href}
                ctaLabel={s.ctaLabel[locale]}
                locale={locale}
                flip={i % 2 === 1}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------------- FEATURED PRODUCTS ---------------- */}
      <FeaturedProducts
        products={featuredProducts}
        copy={{
          eyebrow: home.featuredProducts.eyebrow[locale],
          title: home.featuredProducts.title[locale],
          subtitle: home.featuredProducts.subtitle[locale],
          cta: home.featuredProducts.exploreLabel[locale],
          viewAll: home.featuredProducts.viewAllLabel[locale],
        }}
        locale={locale}
      />

      {/* ---------------- FEATURED PROJECT ---------------- */}
      <Section>
        <Container>
          <Reveal>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-xl">
                <Eyebrow>{home.featuredProject.eyebrow[locale]}</Eyebrow>
                <H2 className="mt-6">
                  {featuredProject
                    ? featuredProject.title[locale]
                    : home.featuredProject.title[locale]}
                </H2>
                <Lead className="mt-5 max-w-[44ch]">
                  {featuredProject
                    ? featuredProject.shortDescription[locale]
                    : home.featuredProject.subtitle[locale]}
                </Lead>
              </div>
              <Link
                href="/projects"
                className={cn(buttonVariants({ variant: "outline", size: "md" }))}
              >
                {home.featuredProject.ctaLabel[locale]}
              </Link>
            </div>
          </Reveal>
          <RevealImage>
            {featuredProject ? (
              <Link href={`/projects/${featuredProject.slug}`} className="group block">
                <BrandImage
                  media={
                    featuredProject.heroImage
                      ? {
                          src: featuredProject.heroImage.src,
                          alt: featuredProject.heroImage.alt[locale],
                        }
                      : null
                  }
                  image={featuredProject.heroImage ? undefined : "featuredProject"}
                  locale={locale}
                  ratio="21/9"
                  signature
                  sizes="(max-width: 1320px) 100vw, 1320px"
                  className="shadow-[var(--shadow-lg)] transition-transform duration-500 group-hover:scale-[1.005]"
                />
              </Link>
            ) : (
              <BrandImage
                image="featuredProject"
                locale={locale}
                ratio="21/9"
                signature
                sizes="(max-width: 1320px) 100vw, 1320px"
                className="shadow-[var(--shadow-lg)]"
              />
            )}
          </RevealImage>
        </Container>
      </Section>

      {/* ---------------- ENGINEERING PROCESS ---------------- */}
      <Section>
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>{home.process.eyebrow[locale]}</Eyebrow>
            <H2 className="mt-6">{home.process.title[locale]}</H2>
          </div>
          <RevealGroup className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {home.process.steps.map((s, i) => (
              <Reveal
                key={s.title[locale]}
                as="div"
                className="relative border-t border-border pt-7"
              >
                <span aria-hidden className="absolute inset-x-0 -top-px h-px bg-border-strong" />
                <span aria-hidden className="absolute -top-px start-0 h-0.5 w-12 bg-gold" />
                <span className="font-display text-4xl font-extrabold text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <H3 className="mt-5">{s.title[locale]}</H3>
                <p className="mt-3 text-[1.075rem] leading-relaxed text-fg-muted">
                  {s.description[locale]}
                </p>
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <Section className="bg-bg-subtle">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>{home.testimonials.eyebrow[locale]}</Eyebrow>
            <H2 className="mt-6">{home.testimonials.title[locale]}</H2>
          </div>
          <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonialItems.map((tst) => {
              const name = tst.name[locale];
              const initials = name
                .split(/\s+/)
                .filter((w) => /\p{L}/u.test(w))
                .slice(0, 2)
                .map((w) => [...w][0])
                .join("");
              return (
                <Reveal
                  key={name}
                  as="div"
                  className="flex flex-col rounded-[var(--radius-xl)] border border-border bg-surface p-8 shadow-[var(--shadow-xs)] transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[var(--shadow-lg)] lg:p-9"
                >
                  <div className="flex items-center gap-1 text-gold" aria-label="5 / 5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-[1.05rem] fill-current" aria-hidden />
                    ))}
                  </div>
                  <p className="mt-5 flex-1 font-text text-[1.15rem] leading-[1.9] text-fg">
                    {tst.quote[locale]}
                  </p>
                  <div className="mt-8 flex items-center gap-3.5 border-t border-border pt-6">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-bg-blue font-semibold text-primary">
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 font-semibold text-fg">
                        {name}
                        <BadgeCheck className="size-4 shrink-0 text-primary" aria-label={locale === "ar" ? "عميل موثّق" : "verified"} />
                      </p>
                      <p className="text-sm text-fg-muted">{tst.role[locale]}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </RevealGroup>
        </Container>
      </Section>

      {/* ---------------- STATISTICS ---------------- */}
      <section className="bg-navy text-white">
        <Container>
          <div className="py-20 lg:py-24">
            <Eyebrow tone="onDark">{home.stats.eyebrow[locale]}</Eyebrow>
            <RevealGroup className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {home.stats.items.map((s) => (
                <Reveal key={s.label[locale]} as="div">
                  <div className="font-display text-[clamp(2.75rem,5.5vw,4.25rem)] font-extrabold leading-none text-white">
                    {s.value[locale]}
                  </div>
                  <div className="mt-5 h-px w-12 bg-gold" />
                  <div className="mt-5 text-[1.05rem] font-medium text-white/85">
                    {s.label[locale]}
                  </div>
                </Reveal>
              ))}
            </RevealGroup>
          </div>
        </Container>
      </section>

      {/* ---------------- CONTACT CTA ---------------- */}
      <CtaBand
        eyebrow={home.cta.eyebrow[locale]}
        title={home.cta.title[locale]}
        subtitle={home.cta.subtitle[locale]}
        locale={locale}
        whatsappText={home.cta.whatsappText[locale]}
      />
    </>
  );
}
