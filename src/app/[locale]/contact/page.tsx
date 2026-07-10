import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { requireLocale } from "@/i18n/routing";
import { Container, Section } from "@/ui/container";
import { Display, Lead } from "@/ui/typography";
import { Eyebrow } from "@/components/site/eyebrow";
import { RequestFlow } from "@/components/site/request-flow";
import { Reveal } from "@/components/motion/reveal";
import { siteConfig } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("contact") };
}

const dicts = {
  ar: {
    eyebrow: "تواصل معنا",
    title: "لنبدأ رحلة بيتك.",
    lead: "أخبرنا بما تحتاجه، وسيتواصل معك فريقنا الهندسي مباشرةً عبر واتساب أو البريد — دون التزام.",
    detailsTitle: "معلومات التواصل",
    addressLabel: "العنوان",
    phoneLabel: "الهاتف",
    emailLabel: "البريد",
    hoursLabel: "أوقات الخدمة",
    flow: {
      steps: ["نوع الطلب", "معلومات العقار", "معلوماتك"],
      intentLabel: "ما الذي تحتاجه؟",
      intents: [
        { value: "purchase", t: "شراء وتركيب", d: "نظام مياه أو طاقة أو تشطيب جديد." },
        { value: "maintenance", t: "صيانة", d: "صيانة أو دعم لنظامٍ قائم." },
        { value: "consultation", t: "استشارة هندسية", d: "رأيٌ هندسي قبل القرار." },
      ],
      propTypeLabel: "نوع العقار",
      propTypes: [
        { value: "villa", label: "فيلا" },
        { value: "apartment", label: "شقة" },
        { value: "commercial", label: "مبنى تجاري" },
        { value: "restaurant", label: "مطعم" },
        { value: "office", label: "مكتب" },
      ],
      cityLabel: "المدينة / المنطقة",
      cityPlaceholder: "عمّان، خلدا…",
      notesLabel: "تفاصيل إضافية",
      notesPlaceholder: "أخبرنا عن احتياجك…",
      nameLabel: "الاسم الكامل",
      namePlaceholder: "مثال: أحمد الخطيب",
      phoneLabel: "رقم الهاتف",
      emailLabel: "البريد الإلكتروني",
      emailOptional: "(اختياري)",
      back: "رجوع",
      next: "التالي",
      finishTitle: "كيف تحبّ أن نكمل؟",
      finishHint: "سنستلم معلوماتك ونتابع معك مباشرةً.",
      whatsapp: "المتابعة عبر واتساب",
      email: "المتابعة عبر البريد",
      required: "هذا الحقل مطلوب",
    },
  },
  en: {
    eyebrow: "Contact us",
    title: "Let's begin your home's journey.",
    lead: "Tell us what you need, and our engineering team will follow up directly via WhatsApp or email — with no obligation.",
    detailsTitle: "Contact details",
    addressLabel: "Address",
    phoneLabel: "Phone",
    emailLabel: "Email",
    hoursLabel: "Service hours",
    flow: {
      steps: ["Request type", "Property info", "Your details"],
      intentLabel: "What do you need?",
      intents: [
        { value: "purchase", t: "Purchase & install", d: "A new water, energy or finishing system." },
        { value: "maintenance", t: "Maintenance", d: "Service or support for an existing system." },
        { value: "consultation", t: "Consultation", d: "Engineering advice before you decide." },
      ],
      propTypeLabel: "Property type",
      propTypes: [
        { value: "villa", label: "Villa" },
        { value: "apartment", label: "Apartment" },
        { value: "commercial", label: "Commercial building" },
        { value: "restaurant", label: "Restaurant" },
        { value: "office", label: "Office" },
      ],
      cityLabel: "City / area",
      cityPlaceholder: "Amman, Khalda…",
      notesLabel: "Additional details",
      notesPlaceholder: "Tell us about your need…",
      nameLabel: "Full name",
      namePlaceholder: "e.g. Ahmad Al-Khatib",
      phoneLabel: "Phone number",
      emailLabel: "Email",
      emailOptional: "(optional)",
      back: "Back",
      next: "Next",
      finishTitle: "How would you like to continue?",
      finishHint: "We'll receive your details and follow up directly.",
      whatsapp: "Continue via WhatsApp",
      email: "Continue via Email",
      required: "This field is required",
    },
  },
};

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  setRequestLocale(locale);
  const d = dicts[locale];

  return (
    <Section className="pt-16 sm:pt-20">
      <Container>
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow>{d.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <Display className="mt-7">{d.title}</Display>
          </Reveal>
          <Reveal delay={0.1}>
            <Lead className="mt-8 max-w-[54ch]">{d.lead}</Lead>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          {/* Details */}
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                {d.detailsTitle}
              </h2>
              <dl className="mt-8 space-y-8">
                <div>
                  <dt className="text-sm text-fg-subtle">{d.addressLabel}</dt>
                  <dd className="mt-2 leading-relaxed text-fg">{siteConfig.address[locale]}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-subtle">{d.phoneLabel}</dt>
                  <dd className="mt-2 space-y-1" dir="ltr">
                    {siteConfig.phones.map((p) => (
                      <div key={p}>
                        <a href={`tel:${p}`} className="text-fg hover:text-primary">
                          {p.replace("+962", "+962 ")}
                        </a>
                      </div>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-subtle">{d.emailLabel}</dt>
                  <dd className="mt-2" dir="ltr">
                    <a href={`mailto:${siteConfig.email}`} className="text-fg hover:text-primary">
                      {siteConfig.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-subtle">{d.hoursLabel}</dt>
                  <dd className="mt-2 text-fg">{siteConfig.hours[locale]}</dd>
                </div>
              </dl>
            </div>
          </Reveal>

          {/* Flow */}
          <Reveal delay={0.05}>
            <RequestFlow dict={d.flow} locale={locale} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
