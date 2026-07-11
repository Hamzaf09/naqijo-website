/**
 * Seed the CMS from the existing static product data so the migration is
 * faithful (same 3 products, bilingual, same images). Idempotent: safe to
 * re-run — it skips records that already exist.
 *
 * Run:  set -a; . ./.env; set +a; npx tsx src/scripts/seed.ts
 */
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";

import config from "../payload.config";
import { products as staticProducts, productCategories } from "../data/products.static";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const publicDir = path.resolve(dirname, "../../public");

/** Wrap a plain string into a minimal Lexical rich-text state. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function richText(text: string): any {
  const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      children: paragraphs.map((p) => ({
        type: "paragraph",
        version: 1,
        format: "",
        indent: 0,
        direction: "ltr" as const,
        textFormat: 0,
        children: [
          {
            type: "text",
            version: 1,
            detail: 0,
            format: 0,
            mode: "normal" as const,
            style: "",
            text: p,
          },
        ],
      })),
    },
  };
}

async function seed() {
  const payload = await getPayload({ config });

  // ── First admin user ──────────────────────────────────────
  const users = await payload.find({ collection: "users", limit: 1 });
  if (users.totalDocs === 0) {
    const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe!2026";
    await payload.create({
      collection: "users",
      data: {
        email: process.env.SEED_ADMIN_EMAIL || "admin@naqijo.com",
        password,
        name: "NaqiJo Admin",
        role: "super-admin",
      },
    });
    payload.logger.info(`Created admin user (password: ${password})`);
  }

  // ── Categories ────────────────────────────────────────────
  const categoryIdByKey: Record<string, number> = {};
  for (const [i, cat] of productCategories.entries()) {
    const existing = await payload.find({
      collection: "categories",
      where: { slug: { equals: cat.key } },
      limit: 1,
    });
    if (existing.totalDocs > 0) {
      categoryIdByKey[cat.key] = existing.docs[0].id;
      continue;
    }
    const created = await payload.create({
      collection: "categories",
      locale: "ar",
      data: { name: cat.label.ar, slug: cat.key, order: i, status: "published" },
    });
    await payload.update({
      collection: "categories",
      id: created.id,
      locale: "en",
      data: { name: cat.label.en },
    });
    categoryIdByKey[cat.key] = created.id;
    payload.logger.info(`Seeded category: ${cat.key}`);
  }

  // ── Products ──────────────────────────────────────────────
  for (const [i, p] of staticProducts.entries()) {
    const existing = await payload.find({
      collection: "products",
      where: { slug: { equals: p.slug } },
      limit: 1,
    });
    if (existing.totalDocs > 0) {
      payload.logger.info(`Product exists, skipping: ${p.slug}`);
      continue;
    }

    // Upload the main image into the media library.
    const media = await payload.create({
      collection: "media",
      locale: "ar",
      data: { alt: p.image.alt.ar },
      filePath: path.join(publicDir, p.image.src),
    });
    await payload.update({
      collection: "media",
      id: media.id,
      locale: "en",
      data: { alt: p.image.alt.en },
    });

    // Create in Arabic (default locale), publish, feature.
    const created = await payload.create({
      collection: "products",
      locale: "ar",
      data: {
        _status: "published",
        slug: p.slug,
        featured: true,
        showOnHomepage: true,
        order: i,
        name: p.name.ar,
        category: categoryIdByKey[p.categoryKey],
        shortDescription: p.shortDescription.ar,
        fullDescription: richText(p.fullDescription.ar),
        mainImage: media.id,
        specs: p.specs.map((s) => ({ label: s.label.ar, value: s.value.ar })),
        features: p.features.map((f) => ({ text: f.ar })),
      },
    });

    // Fill English locale, reusing array row ids so localized subfields align.
    await payload.update({
      collection: "products",
      id: created.id,
      locale: "en",
      data: {
        name: p.name.en,
        shortDescription: p.shortDescription.en,
        fullDescription: richText(p.fullDescription.en),
        specs: (created.specs || []).map((row, idx) => ({
          id: row.id,
          label: p.specs[idx].label.en,
          value: p.specs[idx].value.en,
        })),
        features: (created.features || []).map((row, idx) => ({
          id: row.id,
          text: p.features[idx].en,
        })),
      },
    });
    payload.logger.info(`Seeded product: ${p.slug}`);
  }

  payload.logger.info("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
