import path from "path";
import { fileURLToPath } from "url";

import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";

import { importExportPlugin } from "@payloadcms/plugin-import-export";
import { searchPlugin } from "@payloadcms/plugin-search";

import { getServerURL } from "./lib/env";
import { buildEmailAdapter } from "./lib/payload/email";
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Products } from "./collections/Products";
import { Services } from "./collections/Services";
import { Projects } from "./collections/Projects";
import { Testimonials } from "./collections/Testimonials";
import { Faqs } from "./collections/Faqs";
import { Banners } from "./collections/Banners";
import { Posts } from "./collections/Posts";
import { Settings } from "./globals/Settings";
import { Homepage } from "./globals/Homepage";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const isProduction = process.env.NODE_ENV === "production";
const serverURL = getServerURL();

const databaseURI = process.env.DATABASE_URI || "file:./naqijo.db";
const usePostgres = databaseURI.startsWith("postgres");

/**
 * PAYLOAD_SECRET is mandatory in production (it signs auth JWTs + cookies).
 * A build with an empty secret would silently issue forgeable tokens, so we
 * fail fast. In dev we fall back to a fixed, clearly non-secret value.
 */
const secret = process.env.PAYLOAD_SECRET;
if (!secret && isProduction) {
  throw new Error(
    "PAYLOAD_SECRET is required in production. Set it to a long random string (e.g. `openssl rand -hex 32`).",
  );
}

/**
 * Adapter-aware database: production points DATABASE_URI at Supabase Postgres;
 * local development falls back to a SQLite file so no DB server is needed. The
 * collections (the real schema) are identical across both.
 *
 * Postgres runs with `push: false` and migration files — production NEVER
 * auto-creates tables; schema changes ship as committed migrations applied via
 * `payload migrate`. SQLite dev uses push for a zero-setup local loop.
 */
const db = usePostgres
  ? postgresAdapter({
      pool: { connectionString: databaseURI },
      push: false,
      migrationDir: path.resolve(dirname, "migrations"),
    })
  : sqliteAdapter({ client: { url: databaseURI } });

/** Supabase Storage (S3-compatible) is enabled only when its env is present. */
const storagePlugins =
  process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.S3_BUCKET,
          acl: "public-read",
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
  // Set an absolute serverURL only in production (correct email/preview links).
  // In dev it stays undefined so Payload emits RELATIVE media URLs, which
  // next/image loads same-origin — Next 16 blocks optimizing localhost/private
  // upstreams, so an absolute dev URL would break image optimization.
  serverURL: isProduction ? serverURL : undefined,
  cors: [serverURL],
  csrf: [serverURL],
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: " — NaqiJo CMS",
    },
    components: {
      beforeDashboard: ["/components/admin/BeforeDashboard#BeforeDashboard"],
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Products,
    Services,
    Projects,
    Testimonials,
    Faqs,
    Banners,
    Posts,
  ],
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
  email: buildEmailAdapter(),
  logger: { options: { level: process.env.LOG_LEVEL || "info" } },
  plugins: [
    ...storagePlugins,
    // CSV/JSON export + bulk CSV import on the catalog & content collections.
    importExportPlugin({
      collections: [
        { slug: "products" },
        { slug: "categories" },
        { slug: "services" },
        { slug: "projects" },
        { slug: "testimonials" },
        { slug: "faqs" },
        { slug: "posts" },
      ],
    }),
    // Unified search index across all public content (admin "Search Results"
    // collection + queryable API for a future frontend search).
    searchPlugin({
      collections: ["products", "services", "projects", "testimonials", "faqs", "posts"],
      defaultPriorities: { products: 10, services: 20, projects: 30, posts: 40 },
      beforeSync: ({ originalDoc, searchDoc }) => ({
        ...searchDoc,
        title:
          originalDoc?.name ||
          originalDoc?.title ||
          originalDoc?.customerName ||
          originalDoc?.question ||
          searchDoc.title,
      }),
    }),
  ],
  secret: secret || "dev-only-insecure-secret-change-me",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
