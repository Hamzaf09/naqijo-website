import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { LegalPage } from "@/components/site/legal-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("terms") };
}

const content = {
  ar: {
    eyebrow: "قانوني",
    title: "الشروط والأحكام",
    updated: "آخر تحديث: 2026",
    sections: [
      { h: "قبول الشروط", p: "باستخدامك موقع نقي الرابية، فإنك توافق على هذه الشروط والأحكام. إن لم توافق عليها، يُرجى عدم استخدام الموقع." },
      { h: "طبيعة الموقع", p: "هذا الموقع منصّة تعريفية وتسويقية لخدمات نقي الرابية. لا يتضمّن الموقع أي عمليات دفع إلكتروني أو سلّة شراء أو إتمام طلبٍ عبر الإنترنت؛ بل يجمع معلوماتك لتُكمل التواصل عبر واتساب أو البريد." },
      { h: "استخدام المحتوى", p: "جميع النصوص والصور والعلامات والتصاميم في هذا الموقع مملوكة لنقي الرابية، ولا يجوز نسخها أو إعادة استخدامها دون إذنٍ مسبق." },
      { h: "دقّة المعلومات", p: "نحرص على تقديم معلوماتٍ دقيقة، لكن المحتوى قد يُحدَّث دون إشعار. تُحدَّد تفاصيل أي خدمة والتكلفة والضمانات ضمن عرضٍ رسمي بعد الاستشارة." },
      { h: "حدود المسؤولية", p: "لا تتحمّل نقي الرابية مسؤولية أي أضرار ناتجة عن استخدام الموقع بما يخالف الغرض منه." },
      { h: "التواصل معنا", p: "لأي استفسار حول هذه الشروط، تواصل معنا عبر info@naqijo.com." },
    ],
  },
  en: {
    eyebrow: "Legal",
    title: "Terms & Conditions",
    updated: "Last updated: 2026",
    sections: [
      { h: "Acceptance of terms", p: "By using the NaqiJo website, you agree to these terms and conditions. If you do not agree, please do not use the site." },
      { h: "Nature of the site", p: "This site is an informational and marketing platform for NaqiJo's services. It includes no online payment, shopping cart, or online order completion; it collects your details so you can continue the conversation via WhatsApp or email." },
      { h: "Use of content", p: "All text, images, marks and designs on this site are owned by NaqiJo and may not be copied or reused without prior permission." },
      { h: "Accuracy of information", p: "We strive to provide accurate information, but content may be updated without notice. The details, cost and warranties of any service are defined in a formal offer after consultation." },
      { h: "Limitation of liability", p: "NaqiJo is not liable for any damages resulting from use of the site contrary to its intended purpose." },
      { h: "Contact us", p: "For any inquiry about these terms, contact us at info@naqijo.com." },
    ],
  },
};

export default async function TermsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage {...content[locale]} />;
}
