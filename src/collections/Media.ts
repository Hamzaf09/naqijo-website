import type { CollectionConfig } from "payload";
import { anyone } from "../access/authenticated";
import { canDelete, canWrite } from "../access/roles";

/**
 * Central media library. Uploads are auto-converted to WebP (alpha/transparency
 * preserved) and resized into responsive variants. In production the files are
 * stored in Supabase Storage via the S3 plugin; locally they live on disk.
 */
export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Library",
    // Admin list search matches filename, alt text, and caption.
    listSearchableFields: ["filename", "alt", "caption"],
  },
  // Enable the media-library folders feature (create/organize into folders).
  folders: true,
  access: {
    read: anyone,
    create: canWrite,
    update: canWrite,
    delete: canDelete,
  },
  upload: {
    mimeTypes: ["image/*", "application/pdf"],
    focalPoint: true,
    crop: true,
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768 },
      { name: "feature", width: 1400 },
      { name: "og", width: 1200, height: 630, position: "centre" },
    ],
    // Automatic WebP conversion for the main image. WebP keeps the alpha
    // channel, so transparent product PNGs stay transparent.
    formatOptions: { format: "webp", options: { quality: 82 } },
  },
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
      admin: { description: "Describe the image for accessibility and SEO." },
    },
    { name: "caption", type: "text", localized: true },
  ],
};
