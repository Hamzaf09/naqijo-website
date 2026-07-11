/**
 * Phase 3 seed — populates the Homepage global from the static homepage
 * content, linking the already-uploaded brand photos from the Media library.
 * Idempotent: skips if the global is already populated.
 *
 * Run:  set -a; . ./.env; set +a; npx tsx src/scripts/seed-phase3.ts
 */
import { getPayload } from "payload";

import config from "../payload.config";
import { approvedImages, type ApprovedImageKey } from "../config/images";
import { homeContent } from "../content/home";
import { productsSection } from "../content/products-section";

async function mediaIdByKey(
  payload: Awaited<ReturnType<typeof getPayload>>,
  key: ApprovedImageKey,
): Promise<number | null> {
  const fname = approvedImages[key].src.split("/").pop() as string;
  const res = await payload.find({
    collection: "media",
    where: { filename: { equals: fname } },
    limit: 1,
  });
  return res.totalDocs > 0 ? (res.docs[0].id as number) : null;
}

async function seed() {
  const payload = await getPayload({ config });

  const existing = await payload.findGlobal({ slug: "homepage", locale: "ar" });
  if (existing?.heroTitleTop) {
    payload.logger.info("Homepage global already seeded, skipping.");
    process.exit(0);
  }

  const a = homeContent.ar;
  const e = homeContent.en;

  const heroImage = await mediaIdByKey(payload, "heroLifestyle");
  const solutionImageIds: (number | null)[] = [];
  for (const item of a.solutions.items) {
    solutionImageIds.push(await mediaIdByKey(payload, item.image));
  }

  // ── Arabic (default locale) — creates the array rows ──
  const created = await payload.updateGlobal({
    slug: "homepage",
    locale: "ar",
    data: {
      heroEyebrow: a.hero.eyebrow,
      heroTitleTop: a.hero.titleTop,
      heroTitleAccent: a.hero.titleAccent,
      heroSubtitle: a.hero.subtitle,
      heroImage,
      heroPrimaryLabel: a.hero.primary,
      heroPrimaryHref: "/contact",
      heroSecondaryLabel: a.hero.secondary,
      heroSecondaryHref: "/services",
      about: { eyebrow: a.intro.eyebrow, title: a.intro.title, body: a.intro.body },
      why: {
        eyebrow: a.why.eyebrow,
        title: a.why.title,
        pillars: a.why.pillars.map((p) => ({ title: p.t, description: p.d })),
      },
      solutions: {
        eyebrow: a.solutions.eyebrow,
        title: a.solutions.title,
        items: a.solutions.items.map((it, i) => ({
          eyebrow: it.eyebrow,
          title: it.title,
          description: it.desc,
          bullets: it.bullets.map((text) => ({ text })),
          image: solutionImageIds[i],
          href: it.href,
          ctaLabel: it.cta,
        })),
      },
      featuredProducts: {
        eyebrow: productsSection.ar.eyebrow,
        title: productsSection.ar.title,
        subtitle: productsSection.ar.subtitle,
        exploreLabel: productsSection.ar.cta,
        viewAllLabel: productsSection.ar.viewAll,
      },
      featuredProject: {
        eyebrow: a.featured.eyebrow,
        title: a.featured.title,
        subtitle: a.featured.desc,
        ctaLabel: a.featured.cta,
      },
      process: {
        eyebrow: a.process.eyebrow,
        title: a.process.title,
        steps: a.process.steps.map((s) => ({ title: s.t, description: s.d })),
      },
      testimonials: {
        eyebrow: a.testimonials.eyebrow,
        title: a.testimonials.title,
        items: a.testimonials.items.map((t) => ({ quote: t.q, name: t.n, role: t.r })),
      },
      stats: {
        eyebrow: a.stats.eyebrow,
        items: a.stats.items.map((s) => ({ value: s.v, label: s.l })),
      },
      cta: {
        eyebrow: a.cta.eyebrow,
        title: a.cta.title,
        subtitle: a.cta.subtitle,
        whatsappText: a.cta.whatsapp,
      },
    },
  });

  // ── English — reuse the row ids so localized array fields align ──
  await payload.updateGlobal({
    slug: "homepage",
    locale: "en",
    data: {
      heroEyebrow: e.hero.eyebrow,
      heroTitleTop: e.hero.titleTop,
      heroTitleAccent: e.hero.titleAccent,
      heroSubtitle: e.hero.subtitle,
      heroPrimaryLabel: e.hero.primary,
      heroSecondaryLabel: e.hero.secondary,
      about: { eyebrow: e.intro.eyebrow, title: e.intro.title, body: e.intro.body },
      why: {
        eyebrow: e.why.eyebrow,
        title: e.why.title,
        pillars: (created.why?.pillars || []).map((row, i) => ({
          id: row.id,
          title: e.why.pillars[i].t,
          description: e.why.pillars[i].d,
        })),
      },
      solutions: {
        eyebrow: e.solutions.eyebrow,
        title: e.solutions.title,
        items: (created.solutions?.items || []).map((row, i) => ({
          id: row.id,
          eyebrow: e.solutions.items[i].eyebrow,
          title: e.solutions.items[i].title,
          description: e.solutions.items[i].desc,
          bullets: (row.bullets || []).map((b, j) => ({
            id: b.id,
            text: e.solutions.items[i].bullets[j],
          })),
          ctaLabel: e.solutions.items[i].cta,
        })),
      },
      featuredProducts: {
        eyebrow: productsSection.en.eyebrow,
        title: productsSection.en.title,
        subtitle: productsSection.en.subtitle,
        exploreLabel: productsSection.en.cta,
        viewAllLabel: productsSection.en.viewAll,
      },
      featuredProject: {
        eyebrow: e.featured.eyebrow,
        title: e.featured.title,
        subtitle: e.featured.desc,
        ctaLabel: e.featured.cta,
      },
      process: {
        eyebrow: e.process.eyebrow,
        title: e.process.title,
        steps: (created.process?.steps || []).map((row, i) => ({
          id: row.id,
          title: e.process.steps[i].t,
          description: e.process.steps[i].d,
        })),
      },
      testimonials: {
        eyebrow: e.testimonials.eyebrow,
        title: e.testimonials.title,
        items: (created.testimonials?.items || []).map((row, i) => ({
          id: row.id,
          quote: e.testimonials.items[i].q,
          name: e.testimonials.items[i].n,
          role: e.testimonials.items[i].r,
        })),
      },
      stats: {
        eyebrow: e.stats.eyebrow,
        items: (created.stats?.items || []).map((row, i) => ({
          id: row.id,
          value: e.stats.items[i].v,
          label: e.stats.items[i].l,
        })),
      },
      cta: {
        eyebrow: e.cta.eyebrow,
        title: e.cta.title,
        subtitle: e.cta.subtitle,
        whatsappText: e.cta.whatsapp,
      },
    },
  });

  payload.logger.info("Homepage global seeded (ar + en).");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
