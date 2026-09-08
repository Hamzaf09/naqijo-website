import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { requireLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { pageMetadata, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { serviceSchema, breadcrumbSchema } from "@/lib/schema";
import { Container, Section } from "@/ui/container";
import { H2, H3 } from "@/ui/typography";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Eyebrow } from "@/components/site/eyebrow";
import { CtaBand } from "@/components/site/cta-band";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { getAllProjects } from "@/data/projects";
import { approvedImages } from "@/config/images";

export const revalidate = 300;

const COMMERCIAL_PROJECT_SLUGS = ["commercial-tower", "restaurant-jabal"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  const meta = {
    ar: {
      title: "معالجة المياه للشركات والمطاعم والفنادق",
      description:
        "حلول معالجة وتنقية المياه للبيئات التجارية من نقي الرابية: الشركات والمطاعم والفنادق والمنشآت في عمّان والأردن، مع صيانة واستشارة هندسية.",
    },
    en: {
      title: "Commercial Water Treatment for Businesses",
      description:
        "Naqi Al Rabia water treatment and purification solutions for commercial environments — companies, restaurants, hotels and facilities in Amman and Jordan, with maintenance and engineering consultation.",
    },
  }[locale];
  return pageMetadata({
    locale,
    path: "/commercial-water-treatment",
    title: meta.title,
    description: meta.description,
    image: { url: approvedImages.engineeringConsultation.src, alt: meta.title },
  });
}

export default async function CommercialWaterTreatmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  setRequestLocale(locale);

  const allProjects = await getAllProjects();
  const projects = COMMERCIAL_PROJECT_SLUGS.map((s) => allProjects.find((p) => p.slug === s)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  const home = locale === "ar" ? "الرئيسية" : "Home";
  const pageLabel = locale === "ar" ? "معالجة المياه للشركات" : "Commercial Water Treatment";
  const url = absoluteUrl(`/${locale}/commercial-water-treatment`);

  const serviceLd = serviceSchema({
    name: locale === "ar" ? "معالجة المياه للبيئات التجارية" : "Commercial water treatment",
    description:
      locale === "ar"
        ? "حلول تنقية ومعالجة المياه للشركات والمطاعم والفنادق والمنشآت التجارية."
        : "Water purification and treatment solutions for companies, restaurants, hotels and commercial facilities.",
    url,
    image: approvedImages.engineeringConsultation.src,
  });
  const breadcrumbLd = breadcrumbSchema(
    [
      { name: home, path: "/" },
      { name: pageLabel, path: "/commercial-water-treatment" },
    ],
    locale,
  );

  const environments = {
    ar: ["الشركات والمكاتب", "المطاعم", "الفنادق", "المنشآت التجارية"],
    en: ["Companies & offices", "Restaurants", "Hotels", "Commercial facilities"],
  }[locale];

  const areas = {
    ar: [
      { t: "تنقية المياه", d: "أنظمة تنقية مصمّمة لبيئات العمل حسب جودة المياه والاستهلاك." },
      { t: "فلترة المياه", d: "فلترة مركزية ونقاط استخدام بحسب طبيعة المنشأة." },
      { t: "معالجة المياه", d: "معالجة عسر المياه والترسّبات لحماية المعدّات والأنابيب." },
      { t: "الصيانة", d: "عقود صيانة دورية تحافظ على استمرارية التشغيل." },
      { t: "الاستشارة الهندسية", d: "فحصٌ وتوصية قبل أي قرار، دون بيعٍ زائد." },
    ],
    en: [
      { t: "Water purification", d: "Purification systems designed for work environments by water quality and demand." },
      { t: "Water filtration", d: "Central and point-of-use filtration matched to the facility." },
      { t: "Water treatment", d: "Hard-water and sediment treatment to protect equipment and plumbing." },
      { t: "Maintenance", d: "Scheduled maintenance contracts that keep operations running." },
      { t: "Engineering consultation", d: "Assessment and recommendation before any decision — no overselling." },
    ],
  }[locale];

  return (
    <>
      <JsonLd data={[serviceLd, breadcrumbLd]} />

      <section className="pt-10 sm:pt-14">
        <Container>
          <Breadcrumbs items={[{ label: home, href: "/" }, { label: pageLabel }]} />
        </Container>
      </section>

      <PageHero
        eyebrow={locale === "ar" ? "حلول تجارية" : "Commercial solutions"}
        title={
          locale === "ar"
            ? "معالجة المياه للبيئات التجارية"
            : "Water treatment for commercial environments"
        }
        lead={
          locale === "ar"
            ? "حلول تنقية ومعالجة مياه للشركات والمطاعم والفنادق والمنشآت — مصمّمة هندسياً بعد فحص احتياج المنشأة، لا حلولٌ جاهزة."
            : "Water purification and treatment for companies, restaurants, hotels and facilities — engineered after assessing each site's needs, not off-the-shelf."
        }
        image="engineeringConsultation"
        locale={locale}
      />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <Eyebrow>{locale === "ar" ? "البيئات التي نخدمها" : "Environments we serve"}</Eyebrow>
            </Reveal>
            <div className="lg:col-span-8">
              <Reveal>
                <p className="font-text text-[1.2rem] leading-[1.9] text-fg">
                  {locale === "ar"
                    ? "نقدّم حلول معالجة وتنقية المياه للبيئات التجارية المختلفة، ونصمّم كل حلٍّ بعد فهم طبيعة المنشأة واحتياجها من المياه:"
                    : "We provide water treatment and purification solutions for a range of commercial environments, designing each after understanding the facility and its water needs:"}
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {environments.map((e) => (
                    <li key={e} className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-fg">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full rounded-tr-none bg-gold" />
                      <span className="leading-relaxed">{e}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-bg-subtle">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>{locale === "ar" ? "مجالات الحلول" : "Solution areas"}</Eyebrow>
            <H2 className="mt-6">{locale === "ar" ? "منظومةٌ واحدة، مسؤوليةٌ واحدة." : "One system, one point of accountability."}</H2>
          </div>
          <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((a) => (
              <Reveal key={a.t} as="div" className="bg-surface p-8">
                <span aria-hidden className="block size-2 rounded-full rounded-tr-none bg-gold" />
                <H3 className="mt-6">{a.t}</H3>
                <p className="mt-3 text-[1.075rem] leading-relaxed text-fg-muted">{a.d}</p>
              </Reveal>
            ))}
          </RevealGroup>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[1.02rem]">
            <Link href="/services/water" className="font-medium text-primary hover:text-[var(--primary-hover)]">
              {locale === "ar" ? "حلول المياه ←" : "Water solutions →"}
            </Link>
            <Link href="/consultation" className="font-medium text-primary hover:text-[var(--primary-hover)]">
              {locale === "ar" ? "استشارة هندسية ←" : "Engineering consultation →"}
            </Link>
            <Link href="/maintenance" className="font-medium text-primary hover:text-[var(--primary-hover)]">
              {locale === "ar" ? "الصيانة ←" : "Maintenance →"}
            </Link>
          </div>
        </Container>
      </Section>

      {projects.length > 0 ? (
        <Section>
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <H2>{locale === "ar" ? "من مشاريعنا التجارية" : "From our commercial projects"}</H2>
              <Link href="/projects" className="font-medium text-primary hover:text-[var(--primary-hover)]">
                {locale === "ar" ? "كل المشاريع ←" : "All projects →"}
              </Link>
            </div>
            <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:gap-8">
              {projects.map((p) => (
                <Reveal key={p.slug} as="div">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="group block rounded-[var(--radius-lg)] border border-border bg-surface p-8 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
                  >
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
                      {p.category[locale]}
                    </span>
                    <H3 className="mt-3 transition-colors group-hover:text-primary">{p.title[locale]}</H3>
                    <p className="mt-2 text-fg-muted">
                      {p.location[locale]}
                      {p.year ? ` · ${p.year}` : ""}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </RevealGroup>
          </Container>
        </Section>
      ) : null}

      <CtaBand
        eyebrow={locale === "ar" ? "لمنشأتك" : "For your facility"}
        title={locale === "ar" ? "لنصمّم حلاً يناسب عملك." : "Let's design a solution that fits your business."}
        subtitle={
          locale === "ar"
            ? "احجز استشارة هندسية ونبدأ بفحص احتياج منشأتك."
            : "Book an engineering consultation and we'll start by assessing your facility's needs."
        }
        locale={locale}
      />
    </>
  );
}
