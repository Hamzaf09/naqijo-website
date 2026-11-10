import type { CollectionConfig } from "payload";
import { GROUP, inboxAccess, tenantField } from "./shared";

/** Questions the assistant could not answer from approved data — a to-do list for the knowledge base. */
export const KnowledgeGaps: CollectionConfig = {
  slug: "knowledge-gaps",
  labels: { singular: "Knowledge gap", plural: "Knowledge gaps" },
  admin: { useAsTitle: "question", defaultColumns: ["question", "count", "status", "lastSeenAt"], group: GROUP },
  access: inboxAccess,
  fields: [
    tenantField,
    { name: "question", type: "text", required: true },
    { name: "normalizedKey", type: "text", required: true, unique: true, index: true },
    { name: "count", type: "number", defaultValue: 1 },
    { name: "status", type: "select", defaultValue: "open", options: ["open", "answered", "ignored"], index: true },
    { name: "lastConversation", type: "relationship", relationTo: "conversations" },
    { name: "lastSeenAt", type: "date" },
    { name: "resolvedBy", type: "relationship", relationTo: "knowledge-entries" },
  ],
};
