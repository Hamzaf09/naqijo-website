/**
 * Phase 2 seed — migrates Services, Projects and the Settings global from the
 * existing static content, uploading the approved brand photos into the Media
 * library. Idempotent: skips records that already exist.
 *
 * Run:  set -a; . ./.env; set +a; npx tsx src/scripts/seed-phase2.ts
 */
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";

import config from "../payload.config";
import { approvedImages, type ApprovedImageKey } from "../config/images";
import { services, serviceSlugs } from "../content/services";
import { projects, projectSlugs } from "../content/projects";
import { siteConfig } from "../config/site";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const publicDir = path.resolve(dirname, "../../public");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function richText(text: string): any {
  const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: paragraphs.map((p) => ({
        type: "paragraph",
        version: 1,
        format: "",
        indent: 0,
        direction: "ltr",
        textFormat: 0,
        children: [
          { type: "text", version: 1, detail: 0, format: 0, mode: "normal", style: "", text: p },
        ],
      })),
    },
  };
}

async function seed() {
  const payload = await getPayload({ config });

  // ── Upload approved brand photos into Media (dedupe by filename) ──
  const mediaIdByKey: Partial<Record<ApprovedImageKey, number>> = {};
  for (const key of Object.keys(approvedImages) as ApprovedImageKey[]) {
    const img = approvedImages[key];
    const fname = path.basename(img.src);
    const existing = await payload.find({
      collection: "media",
      where: { filename: { equals: fname } },
      limit: 1,
    });
    if (existing.totalDocs > 0) {
      mediaIdByKey[key] = existing.docs[0].id as number;
      continue;
    }
    const created = await payload.create({
      collection: "media",
      locale: "ar",
      data: { alt: img.alt.ar },
      filePath: path.join(publicDir, img.src),
    });
    await payload.update({
      collection: "media",
      id: created.id,
      locale: "en",
      data: { alt: img.alt.en },
    });
    mediaIdByKey[key] = created.id as number;
    payload.logger.info(`Uploaded media: ${fname}`);
  }

  // ── Services ──
  for (const [i, slug] of serviceSlugs.entries()) {
    const exists = await payload.find({
      collection: "services",
      where: { slug: { equals: slug } },
      limit: 1,
    });
    if (exists.totalDocs > 0) {
      payload.logger.info(`Service exists, skipping: ${slug}`);
      continue;
    }
    const ar = services.ar[slug];
    const en = services.en[slug];
    const created = await payload.create({
      collection: "services",
      locale: "ar",
      data: {
        _status: "published",
        slug,
        order: i + 1,
        featured: i < 2,
        name: ar.eyebrow,
        headline: ar.title,
        shortDescription: ar.lead,
        fullDescription: richText(ar.overview),
        heroImage: mediaIdByKey[ar.image] ?? null,
        features: ar.features.map((f) => ({ title: f.t, description: f.d })),
        process: ar.process.map((step) => ({ step })),
      },
    });
    await payload.update({
      collection: "services",
      id: created.id,
      locale: "en",
      data: {
        name: en.eyebrow,
        headline: en.title,
        shortDescription: en.lead,
        fullDescription: richText(en.overview),
        features: (created.features || []).map((row, idx) => ({
          id: row.id,
          title: en.features[idx].t,
          description: en.features[idx].d,
        })),
        process: (created.process || []).map((row, idx) => ({
          id: row.id,
          step: en.process[idx],
        })),
      },
    });
    payload.logger.info(`Seeded service: ${slug}`);
  }

  // ── Projects ──
  for (const [i, slug] of projectSlugs.entries()) {
    const exists = await payload.find({
      collection: "projects",
      where: { slug: { equals: slug } },
      limit: 1,
    });
    if (exists.totalDocs > 0) {
      payload.logger.info(`Project exists, skipping: ${slug}`);
      continue;
    }
    const ar = projects.ar[slug];
    const en = projects.en[slug];
    const created = await payload.create({
      collection: "projects",
      locale: "ar",
      data: {
        _status: "published",
        slug,
        order: i,
        featured: i === 0,
        title: ar.title,
        category: ar.category,
        location: ar.location,
        completionDate: new Date(`${ar.year}-01-01`).toISOString(),
        shortDescription: ar.summary,
        challenge: ar.challenge,
        solution: ar.solution,
        outcome: ar.outcome,
        scope: ar.scope.map((item) => ({ item })),
        heroImage: mediaIdByKey[ar.image] ?? null,
      },
    });
    await payload.update({
      collection: "projects",
      id: created.id,
      locale: "en",
      data: {
        title: en.title,
        category: en.category,
        location: en.location,
        shortDescription: en.summary,
        challenge: en.challenge,
        solution: en.solution,
        outcome: en.outcome,
        scope: (created.scope || []).map((row, idx) => ({
          id: row.id,
          item: en.scope[idx],
        })),
      },
    });
    payload.logger.info(`Seeded project: ${slug}`);
  }

  // ── Settings global ──
  const year = new Date().getFullYear();
  await payload.updateGlobal({
    slug: "settings",
    locale: "ar",
    data: {
      siteName: siteConfig.brand.ar,
      phones: siteConfig.phones.map((number) => ({ number })),
      whatsapp: siteConfig.whatsapp,
      email: siteConfig.email,
      address: siteConfig.address.ar,
      workingHours: siteConfig.hours.ar,
      facebook: siteConfig.social.facebook,
      instagram: siteConfig.social.instagram,
      youtube: siteConfig.social.youtube,
      linkedin: siteConfig.social.linkedin,
      copyright: `© ${year} نقي الرابية. جميع الحقوق محفوظة.`,
    },
  });
  await payload.updateGlobal({
    slug: "settings",
    locale: "en",
    data: {
      siteName: siteConfig.brand.en,
      address: siteConfig.address.en,
      workingHours: siteConfig.hours.en,
      copyright: `© ${year} NaqiJo. All rights reserved.`,
    },
  });
  payload.logger.info("Seeded settings global.");

  payload.logger.info("Phase 2 seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
