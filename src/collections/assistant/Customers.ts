import type { CollectionConfig } from "payload";
import { GROUP, inboxAccess, tenantField } from "./shared";

export const Customers: CollectionConfig = {
  slug: "customers",
  admin: { useAsTitle: "displayName", defaultColumns: ["displayName", "name", "phone", "area", "consentStatus"], group: GROUP },
  access: inboxAccess,
  fields: [
    tenantField,
    {
      name: "identityKey",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { readOnly: true, description: "channel:platform-user-id" },
    },
    { name: "channel", type: "select", options: ["whatsapp", "messenger", "instagram", "test"] },
    { name: "displayName", type: "text", admin: { description: "Profile name supplied by the platform." } },
    {
      type: "row",
      fields: [
        { name: "name", type: "text", admin: { description: "Stored only after the customer consented." } },
        { name: "phone", type: "text" },
      ],
    },
    { name: "area", type: "text" },
    { name: "address", type: "text" },
    {
      name: "consentStatus",
      type: "select",
      defaultValue: "unknown",
      options: [
        { label: "Not asked", value: "unknown" },
        { label: "Asked — awaiting answer", value: "requested" },
        { label: "Granted", value: "granted" },
        { label: "Declined", value: "declined" },
      ],
    },
    { name: "consentAt", type: "date" },
    { name: "optedOut", type: "checkbox", defaultValue: false },
    { name: "notes", type: "textarea" },
  ],
};
