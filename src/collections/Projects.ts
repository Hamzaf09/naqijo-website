import type { CollectionConfig } from "payload";
import { anyone } from "../access/authenticated";
import { canDelete, canWrite } from "../access/roles";
import { auditFields, auditStamp } from "../lib/payload/audit";
import { seoGroup, slugField } from "../lib/payload/fields";

/**
 * Projects / case studies. Drives /projects, /projects/[slug] and the homepage
 * featured project. Localized, with drafts + versions + preview.
 */
export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "_status", "featured", "order", "updatedAt"],
    group: "Content",
    preview: (doc) =>
      typeof doc?.slug === "string" ? `/ar/projects/${doc.slug}` : null,
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
      admin: { position: "sidebar", description: "Show on the homepage." },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower numbers show first." },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "General",
          fields: [
            { name: "title", type: "text", localized: true, required: true },
            slugField("title"),
            {
              type: "row",
              fields: [
                {
                  name: "category",
                  type: "text",
                  localized: true,
                  admin: { width: "50%", description: "e.g. Residential villa." },
                },
                {
                  name: "location",
                  type: "text",
                  localized: true,
                  admin: { width: "50%" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "completionDate",
                  type: "date",
                  admin: {
                    width: "50%",
                    date: { pickerAppearance: "monthOnly", displayFormat: "MMM yyyy" },
                  },
                },
                {
                  name: "clientName",
                  type: "text",
                  admin: { width: "50%", description: "Optional." },
                },
              ],
            },
          ],
        },
        {
          label: "Story",
          fields: [
            {
              name: "shortDescription",
              type: "textarea",
              localized: true,
              required: true,
              admin: { description: "Summary shown in listings and the hero." },
            },
            { name: "challenge", type: "textarea", localized: true },
            { name: "solution", type: "textarea", localized: true },
            { name: "outcome", type: "textarea", localized: true },
            {
              name: "scope",
              type: "array",
              labels: { singular: "Scope item", plural: "Scope" },
              fields: [
                { name: "item", type: "text", localized: true, required: true },
              ],
            },
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
        { label: "SEO", fields: [seoGroup] },
      ],
    },
    ...auditFields,
  ],
};
