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
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
