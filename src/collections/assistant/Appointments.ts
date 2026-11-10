import { APIError } from "payload";
import type { CollectionConfig } from "payload";
import { isInboxRole } from "../../access/roles";
import { GROUP, inboxAccess, tenantField } from "./shared";

export const Appointments: CollectionConfig = {
  slug: "appointments",
  admin: { useAsTitle: "kind", defaultColumns: ["kind", "status", "requestedWindow", "scheduledFor", "confirmedBy"], group: GROUP },
  access: inboxAccess,
  hooks: {
    beforeChange: [
      ({ data, req, originalDoc }) => {
        const status = data.status ?? originalDoc?.status;
        // The AI can only REQUEST appointments. Confirming needs a signed-in staff member and a date.
        if ((status === "confirmed" || status === "completed") && originalDoc?.status !== status) {
          if (!req.user || !isInboxRole(req.user as never)) {
            throw new APIError("Only inbox staff can confirm an appointment.", 403);
          }
          const scheduledFor = data.scheduledFor ?? originalDoc?.scheduledFor;
          if (!scheduledFor) throw new APIError("A confirmed appointment needs a scheduled date/time.", 400);
          data.confirmedBy = req.user.id;
          data.confirmedAt = new Date().toISOString();
        }
        return data;
      },
    ],
  },
  fields: [
    tenantField,
    { name: "conversation", type: "relationship", relationTo: "conversations", required: true, index: true },
    { name: "lead", type: "relationship", relationTo: "leads" },
    { name: "customer", type: "relationship", relationTo: "customers" },
    { name: "kind", type: "select", defaultValue: "maintenance", options: ["maintenance", "installation", "consultation", "inspection"] },
    {
      name: "status",
      type: "select",
      defaultValue: "requested",
      index: true,
      options: ["requested", "confirmed", "completed", "cancelled"],
    },
    { name: "requestedWindow", type: "text", admin: { description: "What the customer asked for (free text)." } },
    { name: "scheduledFor", type: "date", admin: { date: { pickerAppearance: "dayAndTime" } } },
    { name: "address", type: "text" },
    { name: "details", type: "textarea" },
    { name: "confirmedBy", type: "relationship", relationTo: "users", admin: { readOnly: true } },
    { name: "confirmedAt", type: "date", admin: { readOnly: true } },
  ],
};
