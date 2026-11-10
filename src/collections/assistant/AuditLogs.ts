import type { CollectionConfig } from "payload";
import { isAdmin } from "../../access/roles";
import { GROUP, tenantField } from "./shared";

/** Append-only trail of staff/AI/system actions on customer conversations. */
export const AuditLogs: CollectionConfig = {
  slug: "audit-logs",
  labels: { singular: "Audit log", plural: "Audit logs" },
  admin: { useAsTitle: "action", defaultColumns: ["action", "actorType", "actor", "entity", "createdAt"], group: GROUP },
  access: { read: isAdmin, create: () => false, update: () => false, delete: () => false },
  fields: [
    tenantField,
    { name: "action", type: "text", required: true, index: true },
    { name: "actorType", type: "select", options: ["staff", "ai", "system", "webhook"], required: true },
    { name: "actor", type: "relationship", relationTo: "users" },
    { name: "entity", type: "text" },
    { name: "entityId", type: "text", index: true },
    { name: "detail", type: "json" },
  ],
};
