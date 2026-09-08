import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { requireLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { Container, Section } from "@/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaBand } from "@/components/site/cta-band";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { getAllGuides } from "@/data/guides";
import { approvedImages } from "@/config/images";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  const meta = {
    ar: {
      title: "أدلة ونصائح المياه",
      description:
        "أدلة عملية من نقي الرابية حول اختيار فلاتر المياه، والتناضح العكسي RO، ومعالجة عسر المياه — بلغةٍ واضحة للمستخدم في الأردن.",
    },
    en: {
      title: "Water Guides & Advice",
      description:
        "Practical guides from Naqi Al Rabia on choosing water filters, reverse osmosis (RO), and hard-water treatment — in clear language for users in Jordan.",
    },
  }[locale];
  return pageMetadata({ locale, path: "/guides", title: meta.title, description: meta.description });
}

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  setRequestLocale(locale);

  const guides = await getAllGuides();
  const home = locale === "ar" ? "الرئيسية" : "Home";
  const guidesLabel = locale === "ar" ? "الأدلة" : "Guides";

  const breadcrumbLd = breadcrumbSchema(
    [
      { name: home, path: "/" },
      { name: guidesLabel, path: "/guides" },
    ],
    locale,
  );

  return (
    <>
      <JsonLd data={breadcrumbLd} />

      <section className="pt-10 sm:pt-14">
        <Container>
          <Breadcrumbs items={[{ label: home, href: "/" }, { label: guidesLabel }]} />
        </Container>
      </section>

      <PageHero
        eyebrow={locale === "ar" ? "أدلة ونصائح" : "Guides & advice"}
        title={locale === "ar" ? "افهم خياراتك قبل أن تقرّر." : "Understand your options before you decide."}
        lead={
          locale === "ar"
            ? "أدلةٌ عملية تشرح مصطلحات المياه وتساعدك على اختيار الحل المناسب — دون مبالغات ولا مصطلحاتٍ معقّدة."
            : "Practical guides that explain water terminology and help you choose the right solution — no hype, no jargon."
        }
        locale={locale}
      />

      <Section>
        <Container>
          <RevealGroup className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g, i) => (
              <Reveal key={g.slug} as="div">
                <Link
                  href={`/guides/${g.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface shadow-[var(--shadow-xs)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lg)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-bg-subtle">
                    <Image
                      src={approvedImages[g.image].src}
                      alt={g.title[locale]}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      priority={i < 3}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 lg:p-7">
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
                      {locale === "ar" ? "دليل" : "Guide"}
                    </span>
                    <h2 className="mt-3 font-display text-xl font-bold leading-snug text-fg transition-colors group-hover:text-primary">
                      {g.title[locale]}
                    </h2>
                    <p className="mt-3 line-clamp-3 flex-1 text-[1.02rem] leading-relaxed text-fg-muted">
                      {g.description[locale]}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 font-semibold text-primary">
                      {locale === "ar" ? "اقرأ الدليل" : "Read the guide"}
                      <span aria-hidden className="transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1">
                        ←
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <CtaBand
        eyebrow={locale === "ar" ? "لا تزال متردّداً؟" : "Still deciding?"}
        title={locale === "ar" ? "دع مهندساً يجيب عن أسئلتك." : "Let an engineer answer your questions."}
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
