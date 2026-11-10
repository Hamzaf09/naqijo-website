import type { CollectionConfig } from "payload";
import { HANDOFF_REASONS } from "../../agent/types";
import { GROUP, inboxAccess, tenantField } from "./shared";

export const Handoffs: CollectionConfig = {
  slug: "handoffs",
  admin: { useAsTitle: "reason", defaultColumns: ["reason", "status", "notifyStatus", "createdAt"], group: GROUP },
  access: inboxAccess,
  fields: [
    tenantField,
    { name: "conversation", type: "relationship", relationTo: "conversations", required: true, index: true },
    { name: "lead", type: "relationship", relationTo: "leads" },
    { name: "reason", type: "select", required: true, options: [...HANDOFF_REASONS] },
    { name: "status", type: "select", defaultValue: "open", index: true, options: ["open", "claimed", "resolved"] },
    { name: "summary", type: "json", admin: { description: "Structured escalation summary." } },
    { name: "summaryText", type: "textarea" },
    { name: "recommendedAction", type: "text" },
    { name: "unansweredQuestion", type: "text" },
    {
      name: "notifyStatus",
      type: "select",
      defaultValue: "pending",
      options: ["pending", "sent", "partial", "failed", "not_configured"],
    },
    { name: "notifyDetail", type: "textarea" },
    { name: "notifiedAt", type: "date" },
    { name: "assignedTo", type: "relationship", relationTo: "users" },
    { name: "resolvedAt", type: "date" },
    { name: "resolvedBy", type: "relationship", relationTo: "users" },
  ],
};
