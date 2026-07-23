import type { CollectionConfig } from "payload";
import { anyone } from "../access/authenticated";
import { canDelete, canWrite } from "../access/roles";
import { auditFields, auditStamp } from "../lib/payload/audit";

/**
 * FAQ manager. The public FAQ page consumes published entries, grouped and
 * ordered here. Unlimited questions, categorized.
 */
export const Faqs: CollectionConfig = {
  slug: "faqs",
  labels: { singular: "FAQ", plural: "FAQs" },
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "category", "_status", "order", "updatedAt"],
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
      name: "category",
      type: "select",
      defaultValue: "general",
      options: [
        { label: "General", value: "general" },
        { label: "Products", value: "products" },
        { label: "Services", value: "services" },
        { label: "Maintenance", value: "maintenance" },
        { label: "Warranty", value: "warranty" },
      ],
      admin: { position: "sidebar" },
    },
    { name: "question", type: "text", localized: true, required: true },
    { name: "answer", type: "textarea", localized: true, required: true },
    ...auditFields,
  ],
};
