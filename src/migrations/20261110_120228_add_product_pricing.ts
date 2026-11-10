import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_pricing_currency" AS ENUM('JOD', 'USD');
  CREATE TYPE "public"."enum__products_v_version_pricing_currency" AS ENUM('JOD', 'USD');
  ALTER TABLE "products" ADD COLUMN "pricing_amount" numeric;
  ALTER TABLE "products" ADD COLUMN "pricing_currency" "enum_products_pricing_currency" DEFAULT 'JOD';
  ALTER TABLE "products" ADD COLUMN "pricing_starting_from" boolean DEFAULT false;
  ALTER TABLE "_products_v" ADD COLUMN "version_pricing_amount" numeric;
  ALTER TABLE "_products_v" ADD COLUMN "version_pricing_currency" "enum__products_v_version_pricing_currency" DEFAULT 'JOD';
  ALTER TABLE "_products_v" ADD COLUMN "version_pricing_starting_from" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" DROP COLUMN "pricing_amount";
  ALTER TABLE "products" DROP COLUMN "pricing_currency";
  ALTER TABLE "products" DROP COLUMN "pricing_starting_from";
  ALTER TABLE "_products_v" DROP COLUMN "version_pricing_amount";
  ALTER TABLE "_products_v" DROP COLUMN "version_pricing_currency";
  ALTER TABLE "_products_v" DROP COLUMN "version_pricing_starting_from";
  DROP TYPE "public"."enum_products_pricing_currency";
  DROP TYPE "public"."enum__products_v_version_pricing_currency";`)
}
