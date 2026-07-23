import type { CollectionConfig } from "payload";
import { anyone } from "../access/authenticated";
import { canDelete, canWrite } from "../access/roles";
import { auditFields, auditStamp } from "../lib/payload/audit";
import { seoGroup, slugField } from "../lib/payload/fields";

/**
 * Blog posts. Managed in the admin now (rich text, cover, tags, SEO, drafts);
 * the public blog pages arrive in a later phase — nothing on the current
 * frontend changes.
 */
export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "_status", "publishedAt", "updatedAt"],
    group: "Content",
  },
  access: {
    read: anyone,
    create: canWrite,
    update: canWrite,
    delete: canDelete,
  },
  versions: { drafts: { autosave: false }, maxPerDoc: 20 },
  hooks: { beforeChange: [auditStamp] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "General",
          fields: [
            { name: "title", type: "text", localized: true, required: true },
            slugField("title"),
            { name: "excerpt", type: "textarea", localized: true },
            {
              name: "tags",
              type: "array",
              fields: [{ name: "tag", type: "text", localized: true, required: true }],
            },
          ],
        },
        {
          label: "Content",
          fields: [{ name: "content", type: "richText", localized: true }],
        },
        {
          label: "Images",
          fields: [
            { name: "coverImage", type: "upload", relationTo: "media" },
            { name: "gallery", type: "upload", relationTo: "media", hasMany: true },
          ],
        },
        { label: "SEO", fields: [seoGroup] },
      ],
    },
    ...auditFields,
  ],
};
