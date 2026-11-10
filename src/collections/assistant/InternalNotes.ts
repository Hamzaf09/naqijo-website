import type { CollectionConfig } from "payload";
import { GROUP, inboxAccess, tenantField } from "./shared";

export const InternalNotes: CollectionConfig = {
  slug: "internal-notes",
  labels: { singular: "Internal note", plural: "Internal notes" },
  admin: { useAsTitle: "body", defaultColumns: ["conversation", "author", "createdAt"], group: GROUP },
  access: inboxAccess,
  fields: [
    tenantField,
    { name: "conversation", type: "relationship", relationTo: "conversations", required: true, index: true },
    { name: "author", type: "relationship", relationTo: "users" },
    { name: "body", type: "textarea", required: true },
  ],
};
