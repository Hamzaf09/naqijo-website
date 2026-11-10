import { APIError } from "payload";
import type { CollectionConfig } from "payload";
import { GROUP, inboxAccess, tenantField } from "./shared";

export const Leads: CollectionConfig = {
  slug: "leads",
  admin: { useAsTitle: "productInterest", defaultColumns: ["productInterest", "kind", "stage", "qualified", "area", "updatedAt"], group: GROUP },
  access: inboxAccess,
  hooks: {
    beforeChange: [
      ({ data, req, originalDoc }) => {
        // A lead can only be reported as won/sold with human-verified evidence.
        const stage = data.stage ?? originalDoc?.stage;
        if (stage === "won") {
          const v = { ...(originalDoc?.verified ?? {}), ...(data.verified ?? {}) };
          if (!v.evidence || (!v.verifiedBy && !req.user)) {
            throw new APIError("A lead can be marked 'won' only with verification evidence (invoice / order reference).", 400);
          }
          data.verified = { ...v, verifiedBy: v.verifiedBy ?? req.user?.id, verifiedAt: v.verifiedAt ?? new Date().toISOString() };
        }
        return data;
      },
    ],
  },
  fields: [
    tenantField,
    { name: "conversation", type: "relationship", relationTo: "conversations", required: true, index: true },
    { name: "customer", type: "relationship", relationTo: "customers" },
    { name: "kind", type: "select", defaultValue: "sales", options: ["sales", "maintenance"], index: true },
    {
      name: "stage",
      type: "select",
      defaultValue: "new",
      index: true,
      options: ["new", "qualifying", "qualified", "handed-off", "won", "lost"],
    },
    { name: "qualified", type: "checkbox", defaultValue: false, index: true },
    { name: "qualifiedAt", type: "date" },
    { name: "productInterest", type: "text" },
    { name: "area", type: "text" },
    { name: "homeType", type: "text" },
    { name: "existingSystem", type: "text" },
    { name: "problem", type: "textarea" },
    { name: "budget", type: "text" },
    { name: "equipmentType", type: "text" },
    { name: "brandModel", type: "text" },
    { name: "preferredTime", type: "text" },
    { name: "address", type: "text" },
    { name: "offerKey", type: "text", admin: { description: "Campaign offer the customer asked about, if any." } },
    { name: "assignedTo", type: "relationship", relationTo: "users" },
    {
      name: "verified",
      type: "group",
      admin: { description: "Filled by staff. Analytics counts a sale only when evidence is recorded here." },
      fields: [
        { name: "evidence", type: "text", admin: { description: "Invoice / order / receipt reference." } },
        { name: "amountJOD", type: "number" },
        { name: "verifiedBy", type: "relationship", relationTo: "users" },
        { name: "verifiedAt", type: "date" },
      ],
    },
  ],
};
