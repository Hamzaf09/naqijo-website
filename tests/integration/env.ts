// Must be imported BEFORE anything that loads payload.config.
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve(__dirname, "../../.test-db");
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir, { recursive: true });

Object.assign(process.env, {
  // TEST_DATABASE_URI=postgres://… runs the same suite against a migrated Postgres database.
  DATABASE_URI: process.env.TEST_DATABASE_URI || `file:${path.join(dir, "agent.db")}`,
  PAYLOAD_SECRET: "test-secret-not-for-production",
  NEXT_PUBLIC_SERVER_URL: "http://localhost:3000",
  LOG_LEVEL: "error",
  AI_PROVIDER: "rules",
  WHATSAPP_PHONE_NUMBER_ID: "100200300",
  WHATSAPP_ACCESS_TOKEN: "wa-token",
  WHATSAPP_VERIFY_TOKEN: "wa-verify",
  META_APP_SECRET: "app-secret",
  MESSENGER_PAGE_ID: "555666",
  MESSENGER_PAGE_ACCESS_TOKEN: "page-token",
  MESSENGER_VERIFY_TOKEN: "m-verify",
  INSTAGRAM_ACCOUNT_ID: "17841400000",
  INSTAGRAM_ACCESS_TOKEN: "ig-token",
  INSTAGRAM_VERIFY_TOKEN: "ig-verify",
});
