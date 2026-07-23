/**
 * Phase 4 seed — migrates the homepage testimonials and the FAQ page content
 * into their new collections. Idempotent: skips when docs already exist.
 *
 * Run:  set -a; . ./.env; set +a; npx tsx src/scripts/seed-phase4.ts
 */
import { getPayload } from "payload";

import config from "../payload.config";
import { homeContent } from "../content/home";

/** FAQ content mirrored from src/app/[locale]/faq/page.tsx (the static source). */
const faqSeed: { ar: { q: string; a: string }[]; en: { q: string; a: string }[]; categories: string[] } = {
  ar: [
    { q: "هل يشمل الفحص الأولي رسوماً؟", a: "لا. نقدّم فحصاً مجانياً لجودة المياه واحتياجك قبل التوصية بأي حل، دون أي التزام." },
    { q: "هل أنتم مورّد فلاتر فقط؟", a: "لا. نقي الرابية جهةٌ هندسية واحدة تتولّى منظومة البيت كاملة — مياه وطاقة وتشطيبات وعزل وصيانة." },
    { q: "كم تمتدّ الضمانات؟", a: "تختلف حسب النظام، وتصل إلى خمس سنوات، مع صيانةٍ دورية بعد التركيب." },
    { q: "هل تقدّمون صيانة بعد التركيب؟", a: "نعم. نوفّر عقود صيانة دورية وزيارات مجدولة ودعماً فنّياً لا يختفي بعد التسليم." },
    { q: "كيف أبدأ؟", a: "احجز استشارة مجانية عبر صفحة التواصل، وسيتابع معك فريقنا مباشرةً عبر واتساب أو البريد." },
    { q: "أين تقدّمون خدماتكم؟", a: "نخدم عمّان ومحيطها، ونتوسّع لتغطية مناطق أوسع في الأردن. تواصل معنا لتأكيد منطقتك." },
  ],
  en: [
    { q: "Is the initial assessment charged?", a: "No. We offer a free water-quality and needs assessment before recommending any solution, with no obligation." },
    { q: "Are you only a filter supplier?", a: "No. NaqiJo is a single engineering partner for the whole home — water, energy, finishing, protection and maintenance." },
    { q: "How long are the warranties?", a: "They vary by system, up to five years, with scheduled maintenance after installation." },
    { q: "Do you provide maintenance after install?", a: "Yes. We offer scheduled maintenance contracts, planned visits and support that never disappears after handover." },
    { q: "How do I start?", a: "Book a free consultation on the contact page, and our team follows up directly via WhatsApp or email." },
    { q: "Where do you operate?", a: "We serve Amman and its surroundings, expanding across Jordan. Contact us to confirm your area." },
  ],
  categories: ["general", "general", "warranty", "maintenance", "general", "general"],
};

async function seed() {
  const payload = await getPayload({ config });

  // ── Testimonials (from the homepage static content) ──
  const existingT = await payload.count({ collection: "testimonials" });
  if (existingT.totalDocs > 0) {
    payload.logger.info("Testimonials exist, skipping.");
  } else {
    const ar = homeContent.ar.testimonials.items;
    const en = homeContent.en.testimonials.items;
    for (const [i, item] of ar.entries()) {
      const created = await payload.create({
        collection: "testimonials",
        locale: "ar",
        data: {
          _status: "published",
          featured: true,
          order: i,
          rating: 5,
          customerName: item.n,
          jobTitle: item.r,
          quote: item.q,
        },
      });
      await payload.update({
        collection: "testimonials",
        id: created.id,
        locale: "en",
        data: {
          customerName: en[i].n,
          jobTitle: en[i].r,
          quote: en[i].q,
        },
      });
      payload.logger.info(`Seeded testimonial: ${item.n}`);
    }
  }

  // ── FAQs (from the FAQ page static content) ──
  const existingF = await payload.count({ collection: "faqs" });
  if (existingF.totalDocs > 0) {
    payload.logger.info("FAQs exist, skipping.");
  } else {
    for (const [i, item] of faqSeed.ar.entries()) {
      const created = await payload.create({
        collection: "faqs",
        locale: "ar",
        data: {
          _status: "published",
          order: i,
          category: faqSeed.categories[i] as "general",
          question: item.q,
          answer: item.a,
        },
      });
      await payload.update({
        collection: "faqs",
        id: created.id,
        locale: "en",
        data: { question: faqSeed.en[i].q, answer: faqSeed.en[i].a },
      });
      payload.logger.info(`Seeded FAQ ${i + 1}`);
    }
  }

  payload.logger.info("Phase 4 seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
