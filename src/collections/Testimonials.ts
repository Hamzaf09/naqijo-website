import type { CollectionConfig } from "payload";
import { anyone } from "../access/authenticated";
import { canDelete, canWrite } from "../access/roles";
import { auditFields, auditStamp } from "../lib/payload/audit";

/**
 * Customer testimonials. Featured + published entries drive the homepage
 * testimonials section automatically (design unchanged — same card layout).
 */
export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    useAsTitle: "customerName",
    defaultColumns: ["customerName", "rating", "_status", "featured", "order", "updatedAt"],
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
      type: "row",
      fields: [
        {
          name: "customerName",
          type: "text",
          localized: true,
          required: true,
          admin: { width: "50%" },
        },
        { name: "company", type: "text", localized: true, admin: { width: "50%" } },
      ],
    },
    {
      name: "jobTitle",
      type: "text",
      localized: true,
      admin: { description: "e.g. Homeowner — Abdoun, Amman." },
    },
    { name: "photo", type: "upload", relationTo: "media" },
    {
      name: "rating",
      type: "number",
      min: 1,
      max: 5,
      defaultValue: 5,
      required: true,
    },
    { name: "quote", type: "textarea", localized: true, required: true },
    ...auditFields,
  ],
};
