import type { CollectionConfig } from "payload";
import { isAdmin } from "../../access/roles";
import { GROUP, inboxAccess, tenantField } from "./shared";

/** One row per webhook delivery / verification attempt — powers integration monitoring. */
export const WebhookEvents: CollectionConfig = {
  slug: "webhook-events",
  labels: { singular: "Webhook event", plural: "Webhook events" },
  admin: { useAsTitle: "status", defaultColumns: ["channel", "status", "messageCount", "statusCount", "createdAt"], group: GROUP },
  access: { ...inboxAccess, read: inboxAccess.read, delete: isAdmin },
  fields: [
    tenantField,
    { name: "channel", type: "select", options: ["whatsapp", "messenger", "instagram"], required: true, index: true },
    {
      name: "status",
      type: "select",
      required: true,
      index: true,
      options: ["verification", "processed", "ignored", "invalid_signature", "bad_request", "error"],
    },
    { name: "messageCount", type: "number", defaultValue: 0 },
    { name: "statusCount", type: "number", defaultValue: 0 },
    { name: "duplicateCount", type: "number", defaultValue: 0 },
    { name: "error", type: "textarea" },
  ],
};
