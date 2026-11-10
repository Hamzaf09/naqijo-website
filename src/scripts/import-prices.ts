/**
 * Import product prices from data/product-prices.csv into the CMS.
 *
 * Columns: row, slug, name_ar, name_en, price, currency, starting_from
 *  - price: a number (e.g. 450). Leave EMPTY to leave the product's price untouched.
 *  - currency: JOD or USD (default JOD)
 *  - starting_from: yes / no
 * Only `slug` is used to find the product; the name columns are for reading.
 *
 * Run:  set -a; . ./.env; set +a; npx tsx src/scripts/import-prices.ts
 */
import fs from "fs";
import path from "path";
import { getPayload } from "payload";

import config from "../payload.config";

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else cell += ch;
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    if (row.some((c) => c.trim() !== "")) rows.push(row);
  }
  return rows;
}

async function main() {
  const file = path.resolve(process.cwd(), "data/product-prices.csv");
  const text = fs.readFileSync(file, "utf8").replace(/^﻿/, "");
  const [header, ...data] = parseCsv(text);
  const col = (name: string) => header.map((h) => h.trim()).indexOf(name);
  const iSlug = col("slug");
  const iPrice = col("price");
  const iCur = col("currency");
  const iFrom = col("starting_from");
  if (iSlug < 0 || iPrice < 0) throw new Error("CSV must have `slug` and `price` columns.");

  const payload = await getPayload({ config });
  let updated = 0;
  let skipped = 0;

  for (const r of data) {
    const slug = (r[iSlug] ?? "").trim();
    const rawPrice = (r[iPrice] ?? "").trim().replace(/,/g, "");
    if (!slug) continue;
    if (rawPrice === "") {
      skipped++;
      continue;
    }
    const amount = Number(rawPrice);
    if (!Number.isFinite(amount) || amount <= 0) {
      payload.logger.warn(`Invalid price "${rawPrice}" for ${slug} — skipped.`);
      skipped++;
      continue;
    }
    const currency = (r[iCur] ?? "JOD").trim().toUpperCase() === "USD" ? "USD" : "JOD";
    const startingFrom = /^(yes|y|true|1|نعم)$/i.test((r[iFrom] ?? "").trim());

    const found = await payload.find({
      collection: "products",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });
    const doc = found.docs[0];
    if (!doc) {
      payload.logger.warn(`Product not found: ${slug}`);
      skipped++;
      continue;
    }
    await payload.update({
      collection: "products",
      id: doc.id,
      data: { pricing: { amount, currency, startingFrom } },
    });
    payload.logger.info(`Price set: ${slug} = ${amount} ${currency}${startingFrom ? " (from)" : ""}`);
    updated++;
  }

  payload.logger.info(`Done. Updated ${updated}, skipped ${skipped}.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
