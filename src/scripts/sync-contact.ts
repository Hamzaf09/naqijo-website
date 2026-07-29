/**
 * Push the canonical contact facts from src/config/site.ts into the Payload
 * Settings global (the single source of truth every page reads). Use this to
 * update an ALREADY-seeded database — e.g. production — without touching any
 * other content. Idempotent: safe to run repeatedly.
 *
 * Run:  set -a; . ./.env; set +a; npx tsx src/scripts/sync-contact.ts
 * (Or on the deployed DB with the production env loaded.)
 */
import { getPayload } from "payload";

import config from "../payload.config";
import { siteConfig } from "../config/site";

async function syncContact() {
  const payload = await getPayload({ config });

  // Locale-neutral fields (phones, whatsapp, email).
  await payload.updateGlobal({
    slug: "settings",
    data: {
      phones: siteConfig.phones.map((number) => ({ number })),
      whatsapp: siteConfig.whatsapp,
      email: siteConfig.email,
    },
  });

  // Localized fields — write each locale explicitly.
  for (const locale of ["ar", "en"] as const) {
    await payload.updateGlobal({
      slug: "settings",
      locale,
      data: {
        address: siteConfig.address[locale],
        workingHours: siteConfig.hours[locale],
      },
    });
  }

  payload.logger.info(
    `Contact synced → WhatsApp ${siteConfig.whatsapp}, phones [${siteConfig.phones.join(", ")}], ${siteConfig.email}`,
  );
  process.exit(0);
}

syncContact().catch((err) => {
  console.error(err);
  process.exit(1);
});
