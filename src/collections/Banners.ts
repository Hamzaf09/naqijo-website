import type { CollectionConfig } from "payload";
import { anyone } from "../access/authenticated";
import { canDelete, canWrite } from "../access/roles";
import { auditFields, auditStamp } from "../lib/payload/audit";

/**
 * Promotional banners with scheduling. `getActiveBanners()` in the data layer
 * returns only published banners inside their schedule window; the frontend
 * renders them wherever a banner slot is designed in a future iteration.
 */
export const Banners: CollectionConfig = {
  slug: "banners",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "_status", "startDate", "endDate", "order", "updatedAt"],
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
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower numbers show first." },
    },
    {
      type: "row",
      fields: [
        {
          name: "startDate",
          type: "date",
          admin: {
            width: "50%",
            description: "Optional — banner activates at this time.",
            date: { pickerAppearance: "dayAndTime" },
          },
        },
        {
          name: "endDate",
          type: "date",
          admin: {
            width: "50%",
            description: "Optional — banner deactivates at this time.",
            date: { pickerAppearance: "dayAndTime" },
          },
        },
      ],
    },
    { name: "title", type: "text", localized: true, required: true },
    { name: "subtitle", type: "textarea", localized: true },
    {
      type: "row",
      fields: [
        { name: "ctaLabel", type: "text", localized: true, admin: { width: "50%" } },
        { name: "link", type: "text", admin: { width: "50%" } },
      ],
    },
    { name: "desktopImage", type: "upload", relationTo: "media" },
    {
      name: "mobileImage",
      type: "upload",
      relationTo: "media",
      admin: { description: "Optional — falls back to the desktop image." },
    },
    ...auditFields,
  ],
};
