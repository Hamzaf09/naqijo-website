import type { CollectionConfig } from "payload";
import { anyone } from "../access/authenticated";
import { canDelete, canWrite } from "../access/roles";
import { auditFields, auditStamp } from "../lib/payload/audit";
import { seoGroup, slugField } from "../lib/payload/fields";

/**
 * Services (water, kitchen, solar, protection…). Drives /services and
 * /services/[slug]. All localized, with drafts + versions + preview.
 */
export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "_status", "featured", "order", "updatedAt"],
    group: "Content",
    preview: (doc) =>
      typeof doc?.slug === "string" ? `/ar/services/${doc.slug}` : null,
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
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower numbers show first." },
    },
    { name: "icon", type: "text", admin: { position: "sidebar", description: "Optional icon name." } },
    {
      type: "tabs",
      tabs: [
        {
          label: "General",
          fields: [
            {
              name: "name",
              type: "text",
              localized: true,
              required: true,
              admin: { description: "Short label, e.g. Water Solutions." },
            },
            {
              name: "headline",
              type: "text",
              localized: true,
              required: true,
              admin: { description: "The large title on the page." },
            },
            slugField("name"),
          ],
        },
        {
          label: "Descriptions",
          fields: [
            {
              name: "shortDescription",
              type: "textarea",
              localized: true,
              required: true,
            },
            { name: "fullDescription", type: "richText", localized: true },
          ],
        },
        {
          label: "Images",
          fields: [
            { name: "heroImage", type: "upload", relationTo: "media" },
            {
              name: "gallery",
              type: "upload",
              relationTo: "media",
              hasMany: true,
              admin: { description: "Unlimited. Drag to reorder." },
            },
          ],
        },
        {
          label: "Features",
          fields: [
            {
              name: "features",
              type: "array",
              labels: { singular: "Feature", plural: "Features" },
              fields: [
                { name: "title", type: "text", localized: true, required: true },
                { name: "description", type: "text", localized: true },
              ],
            },
          ],
        },
        {
          label: "Process",
          fields: [
            {
              name: "process",
              type: "array",
              labels: { singular: "Step", plural: "Steps" },
              fields: [
                { name: "step", type: "text", localized: true, required: true },
              ],
            },
          ],
        },
        { label: "SEO", fields: [seoGroup] },
      ],
    },
    ...auditFields,
  ],
};
