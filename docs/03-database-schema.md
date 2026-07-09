# Naqi Al Rabia — Database Schema

**Document:** 03 · Database Schema (Prisma / PostgreSQL)
**Status:** Draft for approval
**Last updated:** 2026-07-09

---

## 1. Design Principles

- **PostgreSQL + Prisma**, migration-driven (`prisma migrate`).
- **i18n via translation tables**: every user-facing entity has a `*Translation` child keyed by `(parentId, locale)` holding localized `title/slug/body/SEO`. This gives per-locale slugs & SEO, avoids JSON sprawl, and keeps queries indexable. Enum `Locale { ar, en }`.
- **CMS-ready from P1**: `Page`/`Section`/`Menu`/`Setting`/`Seo` exist in P1 (seeded), edited in P2.
- **Soft delete + audit**: `deletedAt`, `createdAt`, `updatedAt`, `createdById`, plus a central `AuditLog`.
- **AI-ready seams**: `embedding` vector columns (pgvector) and `aiHistory` relations are declared but optional/nullable — no rework to activate.
- **UUID/cuid PKs**, explicit indexes on foreign keys, slugs, status, and locale.

> The block below is the canonical schema (abbreviated comments). Phase tags in comments: **[P1]/[P2]/[P3]**.

## 2. Prisma Schema

```prisma
// datasource + generator
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // extensions = [pgvector]  // enable when AI features activate
}

generator client {
  provider = "prisma-client-js"
}

// ─────────────────────────── ENUMS ───────────────────────────
enum Locale        { ar en }
enum Theme         { light dark system }
enum Role          { SUPER_ADMIN ADMIN EDITOR CRM_AGENT TECHNICIAN CUSTOMER }
enum ContentStatus { DRAFT PUBLISHED ARCHIVED SCHEDULED }
enum ProductStatus { DRAFT ACTIVE ARCHIVED }
enum MediaType     { IMAGE VIDEO DOCUMENT }
enum RequestType   { INSTALLATION MAINTENANCE CONTACT }
enum RequestStatus { NEW ASSIGNED IN_PROGRESS COMPLETED CANCELLED }
enum Urgency       { LOW NORMAL HIGH CRITICAL }
enum SectionType   { HERO INTRO SERVICES PRODUCTS STATS PROJECTS TESTIMONIALS PARTNERS WHY_US ARTICLES FAQ CONTACT CTA RICH_TEXT GALLERY }
enum AuthProvider  { CREDENTIALS GOOGLE APPLE }

// ─────────────────────── IDENTITY & AUTH [P2] ───────────────────────
model User {
  id            String     @id @default(cuid())
  email         String     @unique
  phone         String?    @unique
  name          String?
  passwordHash  String?
  role          Role       @default(EDITOR)
  provider      AuthProvider @default(CREDENTIALS)
  providerId    String?
  isActive      Boolean    @default(true)
  lastLoginAt   DateTime?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  deletedAt     DateTime?

  sessions          Session[]
  authoredArticles  Article[]        @relation("ArticleAuthor")
  assignedTickets   MaintenanceTicket[] @relation("TechnicianTickets")
  crmNotes          CustomerNote[]
  auditLogs         AuditLog[]
  @@index([role])
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  refreshToken String   @unique
  userAgent    String?
  ip           String?
  expiresAt    DateTime
  createdAt    DateTime @default(now())
  @@index([userId])
}

// ─────────────────────── MEDIA LIBRARY [P1 model, P2 UI] ───────────────────────
model MediaFolder {
  id        String   @id @default(cuid())
  name      String
  parentId  String?
  parent    MediaFolder?  @relation("FolderTree", fields: [parentId], references: [id])
  children  MediaFolder[] @relation("FolderTree")
  assets    MediaAsset[]
  createdAt DateTime @default(now())
}

model MediaAsset {
  id          String     @id @default(cuid())
  type        MediaType  @default(IMAGE)
  storageKey  String     // Supabase Storage key
  url         String
  width       Int?
  height      Int?
  sizeBytes   Int?
  mimeType    String?
  blurData    String?    // LQIP
  folderId    String?
  folder      MediaFolder? @relation(fields: [folderId], references: [id])
  altText     MediaAltText[]
  createdById String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  deletedAt   DateTime?
  @@index([type])
  @@index([folderId])
}

model MediaAltText {
  id       String  @id @default(cuid())
  assetId  String
  asset    MediaAsset @relation(fields: [assetId], references: [id], onDelete: Cascade)
  locale   Locale
  alt      String
  @@unique([assetId, locale])
}

// ─────────────────────── SEO (shared) ───────────────────────
model SeoMeta {
  id             String  @id @default(cuid())
  locale         Locale
  title          String?
  description    String?
  keywords       String?
  canonicalUrl   String?
  ogImageId      String?
  noindex        Boolean @default(false)
  structuredData Json?
  // polymorphic owner (one of):
  pageId     String?  @unique
  productId  String?
  projectId  String?
  articleId  String?
  serviceId  String?
  @@unique([productId, locale])
  @@unique([projectId, locale])
  @@unique([articleId, locale])
  @@unique([serviceId, locale])
}

// ─────────────────────── CMS: PAGES / SECTIONS [P1 seed, P2 edit] ───────────────────────
model Page {
  id        String   @id @default(cuid())
  key       String   @unique   // "home","about","contact",...
  status    ContentStatus @default(PUBLISHED)
  sections  Section[]
  seo       SeoMeta[]
  translations PageTranslation[]
  updatedAt DateTime @updatedAt
}
model PageTranslation {
  id     String @id @default(cuid())
  pageId String
  page   Page   @relation(fields: [pageId], references: [id], onDelete: Cascade)
  locale Locale
  title  String
  slug   String
  @@unique([pageId, locale])
  @@unique([locale, slug])
}

model Section {
  id        String      @id @default(cuid())
  pageId    String
  page      Page        @relation(fields: [pageId], references: [id], onDelete: Cascade)
  type      SectionType
  order     Int
  isVisible Boolean     @default(true)
  config    Json?       // block-specific settings (references ids, layout opts)
  translations SectionTranslation[]
  @@index([pageId, order])
}
model SectionTranslation {
  id        String  @id @default(cuid())
  sectionId String
  section   Section @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  locale    Locale
  heading   String?
  subheading String?
  body      String?
  ctaLabel  String?
  ctaHref   String?
  @@unique([sectionId, locale])
}

// ─────────────────────── NAVIGATION & SETTINGS ───────────────────────
model Menu {
  id     String     @id @default(cuid())
  key    String     @unique // "header","footer-company",...
  items  MenuItem[]
}
model MenuItem {
  id       String  @id @default(cuid())
  menuId   String
  menu     Menu    @relation(fields: [menuId], references: [id], onDelete: Cascade)
  parentId String?
  parent   MenuItem?  @relation("MenuTree", fields: [parentId], references: [id])
  children MenuItem[] @relation("MenuTree")
  order    Int
  href     String?
  translations MenuItemTranslation[]
  @@index([menuId, order])
}
model MenuItemTranslation {
  id         String   @id @default(cuid())
  menuItemId String
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id], onDelete: Cascade)
  locale     Locale
  label      String
  @@unique([menuItemId, locale])
}

model Setting {
  id     String @id @default(cuid())
  group  String // "identity","contact","social","integrations","features"
  key    String
  value  Json
  @@unique([group, key])
}

// ─────────────────────── SERVICES ───────────────────────
model Service {
  id        String  @id @default(cuid())
  icon      String?
  order     Int      @default(0)
  status    ContentStatus @default(PUBLISHED)
  coverId   String?
  translations ServiceTranslation[]
  seo       SeoMeta[]
  products  Product[] @relation("ServiceProducts")
  projects  Project[] @relation("ServiceProjects")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
model ServiceTranslation {
  id        String  @id @default(cuid())
  serviceId String
  service   Service @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  locale    Locale
  name      String
  slug      String
  summary   String?
  body      String?
  @@unique([serviceId, locale])
  @@unique([locale, slug])
}

// ─────────────────────── PRODUCTS ───────────────────────
model ProductCategory {
  id           String @id @default(cuid())
  parentId     String?
  parent       ProductCategory?  @relation("CatTree", fields: [parentId], references: [id])
  children     ProductCategory[] @relation("CatTree")
  order        Int    @default(0)
  translations ProductCategoryTranslation[]
  products     Product[]
}
model ProductCategoryTranslation {
  id         String @id @default(cuid())
  categoryId String
  category   ProductCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  locale     Locale
  name       String
  slug       String
  @@unique([categoryId, locale])
  @@unique([locale, slug])
}

model Product {
  id          String        @id @default(cuid())
  categoryId  String?
  category    ProductCategory? @relation(fields: [categoryId], references: [id])
  status      ProductStatus @default(DRAFT)
  price       Decimal?      @db.Decimal(12,2)
  currency    String?       @default("JOD")
  warrantyMonths Int?
  order       Int           @default(0)
  services    Service[]     @relation("ServiceProducts")
  media       ProductMedia[]
  specs       ProductSpec[]
  downloads   ProductDownload[]
  translations ProductTranslation[]
  seo         SeoMeta[]
  relatedTo   Product[]     @relation("RelatedProducts")
  relatedFrom Product[]     @relation("RelatedProducts")
  embedding   Unsupported("vector(1536)")? // AI-ready (pgvector), nullable
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  deletedAt   DateTime?
  @@index([status])
  @@index([categoryId])
}
model ProductTranslation {
  id          String  @id @default(cuid())
  productId   String
  product     Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  locale      Locale
  name        String
  slug        String
  shortDesc   String?
  description String?
  @@unique([productId, locale])
  @@unique([locale, slug])
}
model ProductMedia {
  id        String @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  assetId   String
  order     Int    @default(0)
  isCover   Boolean @default(false)
  @@index([productId, order])
}
model ProductSpec {
  id        String @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  groupKey  String?          // e.g. "capacity","dimensions"
  order     Int     @default(0)
  translations ProductSpecTranslation[]
}
model ProductSpecTranslation {
  id      String @id @default(cuid())
  specId  String
  spec    ProductSpec @relation(fields: [specId], references: [id], onDelete: Cascade)
  locale  Locale
  label   String
  value   String
  unit    String?
  @@unique([specId, locale])
}
model ProductDownload {
  id        String @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  assetId   String            // MediaAsset (DOCUMENT)
  translations ProductDownloadTranslation[]
}
model ProductDownloadTranslation {
  id         String @id @default(cuid())
  downloadId String
  download   ProductDownload @relation(fields: [downloadId], references: [id], onDelete: Cascade)
  locale     Locale
  label      String
  @@unique([downloadId, locale])
}

// ─────────────────────── PROJECTS ───────────────────────
model Project {
  id        String  @id @default(cuid())
  status    ContentStatus @default(PUBLISHED)
  location  String?
  sector    String?
  year      Int?
  coverId   String?
  order     Int     @default(0)
  services  Service[] @relation("ServiceProjects")
  media     ProjectMedia[]
  translations ProjectTranslation[]
  seo       SeoMeta[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
model ProjectTranslation {
  id        String @id @default(cuid())
  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  locale    Locale
  title     String
  slug      String
  summary   String?
  challenge String?
  solution  String?
  outcome   String?
  @@unique([projectId, locale])
  @@unique([locale, slug])
}
model ProjectMedia {
  id        String @id @default(cuid())
  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assetId   String
  order     Int    @default(0)
  @@index([projectId, order])
}

// ─────────────────────── BLOG ───────────────────────
model Article {
  id            String @id @default(cuid())
  authorId      String?
  author        User?  @relation("ArticleAuthor", fields: [authorId], references: [id])
  status        ContentStatus @default(DRAFT)
  publishedAt   DateTime?
  coverId       String?
  readingMinutes Int?
  categories    ArticleCategory[] @relation("ArticleCategories")
  tags          ArticleTag[]      @relation("ArticleTags")
  translations  ArticleTranslation[]
  seo           SeoMeta[]
  relatedTo     Article[] @relation("RelatedArticles")
  relatedFrom   Article[] @relation("RelatedArticles")
  embedding     Unsupported("vector(1536)")? // AI-ready
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  @@index([status, publishedAt])
}
model ArticleTranslation {
  id        String @id @default(cuid())
  articleId String
  article   Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  locale    Locale
  title     String
  slug      String
  excerpt   String?
  body      String   // rich text / MDX
  @@unique([articleId, locale])
  @@unique([locale, slug])
}
model ArticleCategory {
  id       String @id @default(cuid())
  articles Article[] @relation("ArticleCategories")
  translations ArticleCategoryTranslation[]
}
model ArticleCategoryTranslation {
  id         String @id @default(cuid())
  categoryId String
  category   ArticleCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  locale     Locale
  name       String
  slug       String
  @@unique([categoryId, locale])
  @@unique([locale, slug])
}
model ArticleTag {
  id       String @id @default(cuid())
  articles Article[] @relation("ArticleTags")
  translations ArticleTagTranslation[]
}
model ArticleTagTranslation {
  id     String @id @default(cuid())
  tagId  String
  tag    ArticleTag @relation(fields: [tagId], references: [id], onDelete: Cascade)
  locale Locale
  name   String
  slug   String
  @@unique([tagId, locale])
  @@unique([locale, slug])
}

// ─────────────────────── FAQ / TESTIMONIALS / PARTNERS / STATS ───────────────────────
model Faq {
  id        String @id @default(cuid())
  category  String?
  order     Int    @default(0)
  status    ContentStatus @default(PUBLISHED)
  translations FaqTranslation[]
}
model FaqTranslation {
  id     String @id @default(cuid())
  faqId  String
  faq    Faq    @relation(fields: [faqId], references: [id], onDelete: Cascade)
  locale Locale
  question String
  answer   String
  @@unique([faqId, locale])
}
model Testimonial {
  id        String @id @default(cuid())
  avatarId  String?
  rating    Int?
  order     Int    @default(0)
  status    ContentStatus @default(PUBLISHED)
  translations TestimonialTranslation[]
}
model TestimonialTranslation {
  id            String @id @default(cuid())
  testimonialId String
  testimonial   Testimonial @relation(fields: [testimonialId], references: [id], onDelete: Cascade)
  locale        Locale
  authorName    String
  authorRole    String?
  quote         String
  @@unique([testimonialId, locale])
}
model Partner {
  id     String @id @default(cuid())
  logoId String?
  url    String?
  order  Int    @default(0)
  name   String
}
model Stat {
  id     String @id @default(cuid())
  icon   String?
  value  Int
  suffix String?
  order  Int    @default(0)
  translations StatTranslation[]
}
model StatTranslation {
  id     String @id @default(cuid())
  statId String
  stat   Stat   @relation(fields: [statId], references: [id], onDelete: Cascade)
  locale Locale
  label  String
  @@unique([statId, locale])
}

// ─────────────────────── REQUESTS / LEADS [P1 capture → P3 CRM] ───────────────────────
model ServiceRequest {
  id          String       @id @default(cuid())
  type        RequestType
  status      RequestStatus @default(NEW)
  urgency     Urgency?     @default(NORMAL)
  name        String
  email       String?
  phone       String
  locale      Locale       @default(ar)
  address     String?
  city        String?
  geoLat      Float?
  geoLng      Float?
  productId   String?
  productRef  Product?     @relation(fields: [productId], references: [id])
  serialNo    String?
  message     String?
  attachments RequestAttachment[]
  customerId  String?      // linked when converted [P3]
  customer    Customer?    @relation(fields: [customerId], references: [id])
  ticket      MaintenanceTicket?
  createdAt   DateTime     @default(now())
  @@index([type, status])
  @@index([phone])
}
model RequestAttachment {
  id        String @id @default(cuid())
  requestId String
  request   ServiceRequest @relation(fields: [requestId], references: [id], onDelete: Cascade)
  assetId   String
}

// ─────────────────────── CRM [P3] ───────────────────────
model Customer {
  id         String   @id @default(cuid())
  name       String
  email      String?  @unique
  phone      String   @unique
  address    String?
  city       String?
  tags       String[]
  requests   ServiceRequest[]
  orders     Order[]
  tickets    MaintenanceTicket[]
  invoices   Invoice[]
  notes      CustomerNote[]
  aiHistory  Json?    // AI-ready seam
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  @@index([phone])
}
model CustomerNote {
  id         String   @id @default(cuid())
  customerId String
  customer   Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  authorId   String?
  author     User?    @relation(fields: [authorId], references: [id])
  body       String
  createdAt  DateTime @default(now())
}
model Order {
  id         String   @id @default(cuid())
  customerId String
  customer   Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  total      Decimal  @db.Decimal(12,2)
  currency   String   @default("JOD")
  status     String   @default("PENDING")
  createdAt  DateTime @default(now())
}
model Invoice {
  id         String   @id @default(cuid())
  customerId String
  customer   Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  number     String   @unique
  amount     Decimal  @db.Decimal(12,2)
  currency   String   @default("JOD")
  issuedAt   DateTime @default(now())
  dueAt      DateTime?
  status     String   @default("UNPAID")
  fileAssetId String?
}

// ─────────────────────── MAINTENANCE WORKFLOW [P3] ───────────────────────
model MaintenanceTicket {
  id           String        @id @default(cuid())
  requestId    String?       @unique
  request      ServiceRequest? @relation(fields: [requestId], references: [id])
  customerId   String?
  customer     Customer?     @relation(fields: [customerId], references: [id])
  technicianId String?
  technician   User?         @relation("TechnicianTickets", fields: [technicianId], references: [id])
  status       RequestStatus @default(NEW)
  scheduledAt  DateTime?
  completedAt  DateTime?
  nextServiceAt DateTime?
  report       String?
  photos       MaintenancePhoto[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  @@index([status])
  @@index([technicianId])
}
model MaintenancePhoto {
  id        String @id @default(cuid())
  ticketId  String
  ticket    MaintenanceTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  assetId   String
  phase     String // "BEFORE" | "AFTER"
  createdAt DateTime @default(now())
}

// ─────────────────────── AUDIT ───────────────────────
model AuditLog {
  id        String   @id @default(cuid())
  actorId   String?
  actor     User?    @relation(fields: [actorId], references: [id])
  action    String   // "product.update", "auth.login", ...
  entity    String?
  entityId  String?
  metadata  Json?
  ip        String?
  createdAt DateTime @default(now())
  @@index([entity, entityId])
  @@index([actorId])
}
```

## 3. i18n Query Pattern

Fetch entity + `translations where locale = current`; fall back to `ar` if a translation is missing (with a completeness warning surfaced in CMS, P2). Localized slugs are unique per `(locale, slug)`.

## 4. Indexing & Performance

FK indexes throughout; composite indexes on `(status, publishedAt)`, `(pageId, order)`, `(locale, slug)`; `phone` indexed for lead dedupe. Read paths use RSC + cached queries; heavy lists paginate.

## 5. Storage

Binaries live in **Supabase Storage**; DB stores keys/URLs + metadata (`MediaAsset`). Uploads via signed URLs; server generates WebP/AVIF + responsive variants + LQIP `blurData` (P2 pipeline; P1 stores fields).

## 6. Seeding (P1)

A `prisma/seed.ts` seeds: locales, default `Page`/`Section` blocks for every public page, header/footer `Menu`s, `Setting` groups, and **placeholder** services/products/projects/articles/FAQs/testimonials/partners/stats (clearly flagged) so the public site renders fully before real content arrives.

## 7. Migration Strategy

`prisma migrate dev` in development, `prisma migrate deploy` in CI/CD. pgvector extension + `embedding` columns stay dormant until AI features are switched on — no destructive change required.
