import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { requireLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { Container, Section } from "@/ui/container";
import { H2, H3 } from "@/ui/typography";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Eyebrow } from "@/components/site/eyebrow";
import { CtaBand } from "@/components/site/cta-band";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { getSettings } from "@/data/settings";

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
      title: "فلاتر مياه عمّان — تنقية ومعالجة المياه",
      description:
        "نقي الرابية للمياه والطاقة في عمّان: فلاتر مياه، أنظمة تناضح عكسي RO، فلترة مركزية، ومعالجة عسر المياه (سوفتنر) للمنازل والشركات. استشارة وفحص مجاني.",
    },
    en: {
      title: "Water Filters in Amman — Purification & Treatment",
      description:
        "Naqi Al Rabia Water & Energy in Amman: water filters, reverse-osmosis (RO) systems, central filtration, and water softening for homes and businesses. Free consultation and assessment.",
    },
  }[locale];
  return pageMetadata({ locale, path: "/water-filters-amman", title: meta.title, description: meta.description });
}

export default async function WaterFiltersAmmanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  setRequestLocale(locale);
  const settings = await getSettings();

  const home = locale === "ar" ? "الرئيسية" : "Home";
  const pageLabel = locale === "ar" ? "فلاتر مياه عمّان" : "Water Filters Amman";

  const breadcrumbLd = breadcrumbSchema(
    [
      { name: home, path: "/" },
      { name: pageLabel, path: "/water-filters-amman" },
    ],
    locale,
  );

  const solutions = {
    ar: [
      { t: "تنقية مياه الشرب (RO)", d: "أنظمة تناضح عكسي «آر أو» ومراحل تنقية متعددة لمياه شربٍ من صنبور مطبخك.", href: "/products/category/drinking-water" },
      { t: "الفلترة المركزية", d: "«سنترال فلتر» يعالج المياه الداخلة إلى المنزل بالكامل، لكل صنبورٍ وطابق.", href: "/products/category/central-filtration" },
      { t: "معالجة عسر المياه (سوفتنر)", d: "أجهزة معالجة الكلس وعسر المياه لحماية سخاناتك وأنابيبك.", href: "/products/category/water-softening" },
      { t: "الصيانة الوقائية", d: "عقود صيانة واستبدال شمعات في مواعيدها للحفاظ على أداء نظامك.", href: "/maintenance" },
    ],
    en: [
      { t: "Drinking-water purification (RO)", d: "Reverse-osmosis («آر أو») and multi-stage systems for drinking water at your kitchen tap.", href: "/products/category/drinking-water" },
      { t: "Central filtration", d: "A «سنترال فلتر» treating the water entering the whole home — every tap and floor.", href: "/products/category/central-filtration" },
      { t: "Water softening", d: "Softeners to treat limescale and hard water, protecting your heaters and plumbing.", href: "/products/category/water-softening" },
      { t: "Preventive maintenance", d: "Service contracts and on-time cartridge changes to keep your system performing.", href: "/maintenance" },
    ],
  }[locale];

  return (
    <>
      <JsonLd data={breadcrumbLd} />

      <section className="pt-10 sm:pt-14">
        <Container>
          <Breadcrumbs items={[{ label: home, href: "/" }, { label: pageLabel }]} />
        </Container>
      </section>

      <PageHero
        eyebrow={locale === "ar" ? "خدماتنا في عمّان" : "Serving Amman"}
        title={locale === "ar" ? "فلاتر وتنقية ومعالجة المياه في عمّان" : "Water filters, purification & treatment in Amman"}
        lead={
          locale === "ar"
            ? "نقي الرابية للمياه والطاقة، ومقرّها في عمّان منذ 2005، تصمّم حلول تنقية ومعالجة المياه للمنازل والشركات — بفحصٍ هندسي أولاً، ثم التوصية بالحل الأنسب."
            : "Naqi Al Rabia Water & Energy, based in Amman since 2005, designs water purification and treatment solutions for homes and businesses — engineering assessment first, then the right recommendation."
        }
        image="crystalWater"
        locale={locale}
      />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <Eyebrow>{locale === "ar" ? "لماذا نقي الرابية في عمّان" : "Why Naqi Al Rabia in Amman"}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05} className="lg:col-span-8">
              <p className="font-text text-[1.2rem] leading-[1.9] text-fg">
                {locale === "ar"
                  ? "نبدأ كل مشروعٍ في عمّان بفحص جودة مياهك ومساحتك واستهلاكك، ثم نوصي بالنظام المناسب — سواء كان فلتر مياه شربٍ للمطبخ، أو فلترة مركزية للمنزل كله، أو معالجة عسر المياه. لا نبيعك ما لا تحتاجه، ونبقى مسؤولين عمّا نركّبه عبر الصيانة الدورية."
                  : "We start every project in Amman by assessing your water quality, space and usage, then recommend the right system — whether a kitchen drinking-water filter, central whole-home filtration, or water softening. We never oversell, and we stay accountable for what we install through scheduled maintenance."}
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section className="bg-bg-subtle">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>{locale === "ar" ? "حلولنا في عمّان" : "Our solutions in Amman"}</Eyebrow>
            <H2 className="mt-6">{locale === "ar" ? "حلٌّ لكل احتياج." : "A solution for every need."}</H2>
          </div>
          <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-border bg-border sm:grid-cols-2">
            {solutions.map((s) => (
              <Reveal key={s.href} as="div" className="bg-surface p-8 lg:p-9">
                <span aria-hidden className="block size-2 rounded-full rounded-tr-none bg-gold" />
                <H3 className="mt-6">{s.t}</H3>
                <p className="mt-3 text-[1.075rem] leading-relaxed text-fg-muted">{s.d}</p>
                <Link href={s.href} className="mt-5 inline-flex font-medium text-primary hover:text-[var(--primary-hover)]">
                  {locale === "ar" ? "التفاصيل ←" : "Learn more →"}
                </Link>
              </Reveal>
            ))}
          </RevealGroup>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[1.02rem]">
            <Link href="/products" className="font-medium text-primary hover:text-[var(--primary-hover)]">
              {locale === "ar" ? "كل المنتجات ←" : "All products →"}
            </Link>
            <Link href="/consultation" className="font-medium text-primary hover:text-[var(--primary-hover)]">
              {locale === "ar" ? "استشارة هندسية مجانية ←" : "Free engineering consultation →"}
            </Link>
            <Link href="/guides/choosing-a-water-filter" className="font-medium text-primary hover:text-[var(--primary-hover)]">
              {locale === "ar" ? "كيف تختار فلتر مياه ←" : "How to choose a filter →"}
            </Link>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <Eyebrow>{locale === "ar" ? "منطقة الخدمة" : "Service area"}</Eyebrow>
            </Reveal>
            <div className="lg:col-span-8">
              <Reveal>
                <p className="font-text text-[1.2rem] leading-[1.9] text-fg">
                  {locale === "ar"
                    ? "مقرّنا في عمّان، ونخدم المنازل والشركات في أنحاء المدينة. للتواصل المباشر أو حجز فحصٍ واستشارة:"
                    : "We're based in Amman and serve homes and businesses across the city. To reach us directly or book an assessment and consultation:"}
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <dl className="mt-6 space-y-4 text-[1.05rem]">
                  <div className="flex flex-wrap gap-x-3">
                    <dt className="text-fg-subtle">{locale === "ar" ? "العنوان:" : "Address:"}</dt>
                    <dd className="text-fg">{settings.address[locale]}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-3" dir="ltr">
                    <dt className="text-fg-subtle">{locale === "ar" ? ":الهاتف" : "Phone:"}</dt>
                    <dd>
                      <a href={`tel:${settings.phones[0]}`} className="text-fg hover:text-primary">
                        {settings.phones[0]?.replace("+962", "+962 ")}
                      </a>
                    </dd>
                  </div>
                  <div className="flex flex-wrap gap-x-3" dir="ltr">
                    <dt className="text-fg-subtle">{locale === "ar" ? ":البريد" : "Email:"}</dt>
                    <dd>
                      <a href={`mailto:${settings.email}`} className="text-fg hover:text-primary">
                        {settings.email}
                      </a>
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow={locale === "ar" ? "في عمّان؟" : "In Amman?"}
        title={locale === "ar" ? "لنبدأ بفحصٍ مجاني لمياهك." : "Let's start with a free water assessment."}
        subtitle={
          locale === "ar"
            ? "تواصل معنا وسيصلك فريقنا الهندسي بخطةٍ واضحة."
            : "Get in touch and our engineering team will follow up with a clear plan."
        }
        locale={locale}
      />
    </>
  );
}
