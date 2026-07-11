import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { requireLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Container, Section } from "@/ui/container";
import { H3 } from "@/ui/typography";
import { PageHero } from "@/components/site/page-hero";
import { BrandImage } from "@/components/media/brand-image";
import { CtaBand } from "@/components/site/cta-band";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { getAllProjects } from "@/data/projects";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("projects") };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  setRequestLocale(locale);
  const projectsList = await getAllProjects();

  return (
    <>
      <PageHero
        eyebrow={locale === "ar" ? "المشاريع" : "Projects"}
        title={locale === "ar" ? "بيوتٌ ومنشآت، هندسناها بنقاء." : "Homes and spaces, engineered with purity."}
        lead={locale === "ar" ? "كل مشروعٍ قصةٌ هندسية — من التحدّي إلى الحل إلى الأثر الذي يدوم." : "Every project is an engineering story — from challenge to solution to lasting impact."}
        locale={locale}
      />

      <Section>
        <Container>
          <RevealGroup className="grid gap-x-8 gap-y-16 sm:grid-cols-2">
            {projectsList.map((p, i) => (
              <Reveal key={p.slug} as="div" className={i % 3 === 0 ? "sm:col-span-2" : ""}>
                <Link href={`/projects/${p.slug}`} className="group block">
                  <BrandImage
                    media={
                      p.heroImage
                        ? { src: p.heroImage.src, alt: p.heroImage.alt[locale] }
                        : null
                    }
                    locale={locale}
                    ratio={i % 3 === 0 ? "21/9" : "4/3"}
                    signature
                    className="transition-transform duration-500 group-hover:scale-[1.01]"
                    sizes="(max-width: 640px) 100vw, 640px"
                  />
                  <div className="mt-6 flex items-start justify-between gap-6">
                    <div>
                      <span className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
                        {p.category[locale]}
                      </span>
                      <H3 className="mt-3 transition-colors group-hover:text-primary">{p.title[locale]}</H3>
                      <p className="mt-2 text-fg-muted">
                        {p.location[locale]}
                        {p.year ? ` · ${p.year}` : ""}
                      </p>
                    </div>
                    <span aria-hidden className="mt-2 text-xl text-gold transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1">←</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <CtaBand
        eyebrow={locale === "ar" ? "مشروعك القادم" : "Your next project"}
        title={locale === "ar" ? "بيتك يستحق القصة ذاتها." : "Your home deserves the same story."}
        subtitle={locale === "ar" ? "احجز استشارة مجانية ولنبدأ التصميم." : "Book a free consultation and let's start designing."}
        locale={locale}
        image="featuredProject"
      />
    </>
  );
}
