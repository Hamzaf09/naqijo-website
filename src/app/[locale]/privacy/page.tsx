import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { requireLocale } from "@/i18n/routing";
import { LegalPage } from "@/components/site/legal-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("privacy") };
}

const content = {
  ar: {
    eyebrow: "قانوني",
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: 2026",
    sections: [
      { h: "مقدمة", p: "تحترم نقي الرابية خصوصيتك. توضّح هذه السياسة أنواع المعلومات التي نجمعها عند استخدامك لموقعنا، وكيفية استخدامها وحمايتها." },
      { h: "المعلومات التي نجمعها", p: "نجمع المعلومات التي تزوّدنا بها طوعاً عبر نماذج الموقع — مثل الاسم ورقم الهاتف والبريد الإلكتروني وتفاصيل طلبك — بهدف التواصل معك وتقديم الاستشارة أو الخدمة المطلوبة." },
      { h: "كيفية استخدام المعلومات", p: "نستخدم معلوماتك للردّ على طلبك ومتابعته وتقديم الخدمة الهندسية المناسبة. لا نبيع معلوماتك ولا نشاركها مع أطراف ثالثة لأغراض تسويقية." },
      { h: "المتابعة عبر واتساب والبريد", p: "عند اختيارك المتابعة عبر واتساب أو البريد الإلكتروني، تُرسَل معلومات طلبك عبر القناة التي تختارها لتسهيل التواصل المباشر مع فريقنا." },
      { h: "حماية البيانات والاحتفاظ بها", p: "نتّخذ إجراءات معقولة لحماية معلوماتك، ونحتفظ بها للمدة اللازمة لخدمتك أو بحسب ما يقتضيه القانون." },
      { h: "التواصل معنا", p: "لأي استفسار حول الخصوصية، تواصل معنا عبر info@naqijo.com." },
    ],
  },
  en: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    updated: "Last updated: 2026",
    sections: [
      { h: "Introduction", p: "NaqiJo respects your privacy. This policy explains the types of information we collect when you use our website, and how we use and protect it." },
      { h: "Information we collect", p: "We collect information you voluntarily provide through the site's forms — such as your name, phone, email and request details — in order to contact you and provide the consultation or service you request." },
      { h: "How we use information", p: "We use your information to respond to and follow up on your request and to provide the appropriate engineering service. We do not sell your information or share it with third parties for marketing purposes." },
      { h: "Continuing via WhatsApp or email", p: "When you choose to continue via WhatsApp or email, your request details are sent through the channel you select to enable direct communication with our team." },
      { h: "Data protection and retention", p: "We take reasonable measures to protect your information and retain it only as long as needed to serve you or as required by law." },
      { h: "Contact us", p: "For any privacy inquiry, contact us at info@naqijo.com." },
    ],
  },
};

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requireLocale(requestedLocale);
  setRequestLocale(locale);
  return <LegalPage {...content[locale]} />;
}
