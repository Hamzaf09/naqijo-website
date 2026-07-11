import type { Field } from "payload";
import { formatSlug } from "./format-slug";

/** Reusable localized SEO group, consistent across collections. */
export const seoGroup: Field = {
  name: "seo",
  type: "group",
  label: "SEO",
  fields: [
    { name: "metaTitle", type: "text", localized: true },
    { name: "metaDescription", type: "textarea", localized: true },
    { name: "keywords", type: "text", localized: true },
    { name: "ogImage", type: "upload", relationTo: "media" },
  ],
};

/** Reusable slug field that auto-fills from a fallback field (default `name`). */
export const slugField = (fallback = "name"): Field => ({
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  hooks: { beforeValidate: [formatSlug(fallback)] },
  admin: {
    description: "URL segment. Auto-filled from the name — keep it stable.",
  },
});
