/**
 * Seeds the AI assistant's initial APPROVED knowledge (company identity,
 * verified contact details, the two campaign offers, product-category stubs
 * with unconfirmed availability). Idempotent.
 *
 * Run:  set -a; . ./.env; set +a; npx tsx src/scripts/seed-agent.ts
 */
import { getPayload } from "payload";

import config from "../payload.config";
import { seedAgentKnowledge } from "../agent/seed";

async function main() {
  const payload = await getPayload({ config });
  const r = await seedAgentKnowledge(payload);
  payload.logger.info(`Assistant knowledge seeded: ${r.entries} entries, ${r.offers} offers.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
