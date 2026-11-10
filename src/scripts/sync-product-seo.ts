/**
 * One-off: copy the dedicated SEO title/description that exist on static
 * products (products.static.ts) into the matching CMS products, only where the
 * CMS value is still empty. Idempotent and never overwrites admin edits.
 *
 * Run:  set -a; . ./.env; set +a; npx tsx src/scripts/sync-product-seo.ts
 */
import { getPayload } from "payload";

import config from "../payload.config";
import { products as staticProducts } from "../data/products.static";

async function main() {
  const payload = await getPayload({ config });

  for (const p of staticProducts) {
    if (!p.seoTitle && !p.seoDescription) continue;

    const found = await payload.find({
      collection: "products",
      where: { slug: { equals: p.slug } },
      locale: "ar",
      limit: 1,
      depth: 0,
    });
    const doc = found.docs[0];
    if (!doc) {
      payload.logger.warn(`SEO sync: product not in CMS, skipped: ${p.slug}`);
      continue;
    }
    if (doc.seo?.metaTitle || doc.seo?.metaDescription) {
      payload.logger.info(`SEO sync: already set, skipped: ${p.slug}`);
      continue;
    }

    for (const locale of ["ar", "en"] as const) {
      await payload.update({
        collection: "products",
        id: doc.id,
        locale,
        data: {
          seo: {
            metaTitle: p.seoTitle?.[locale],
            metaDescription: p.seoDescription?.[locale],
          },
        },
      });
    }
    payload.logger.info(`SEO sync: updated ${p.slug}`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
