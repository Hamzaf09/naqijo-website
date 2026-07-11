import path from "path";
import { fileURLToPath } from "url";

import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Products } from "./collections/Products";
import { Services } from "./collections/Services";
import { Projects } from "./collections/Projects";
import { Settings } from "./globals/Settings";
import { Homepage } from "./globals/Homepage";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const databaseURI = process.env.DATABASE_URI || "file:./naqijo.db";
const usePostgres = databaseURI.startsWith("postgres");

/**
 * Adapter-aware database: production points DATABASE_URI at Supabase Postgres;
 * local development falls back to a SQLite file so no DB server is needed. The
 * collections (the real schema) are identical across both.
 */
const db = usePostgres
  ? postgresAdapter({ pool: { connectionString: databaseURI } })
  : sqliteAdapter({ client: { url: databaseURI } });

/** Supabase Storage (S3-compatible) is enabled only when its env is present. */
const storagePlugins =
  process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.S3_BUCKET,
          config: {
            endpoint: process.env.S3_ENDPOINT,
            region: process.env.S3_REGION || "us-east-1",
            forcePathStyle: true,
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
            },
          },
        }),
      ]
    : [];

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: " — NaqiJo CMS",
    },
  },
  collections: [Users, Media, Categories, Products, Services, Projects],
  globals: [Settings, Homepage],
  localization: {
    locales: [
      { label: "العربية", code: "ar" },
      { label: "English", code: "en" },
    ],
    defaultLocale: "ar",
    fallback: true,
  },
  editor: lexicalEditor(),
  db,
  sharp,
  plugins: [...storagePlugins],
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
