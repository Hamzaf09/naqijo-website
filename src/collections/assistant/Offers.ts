import type { CollectionConfig } from "payload";
import { GROUP, approvalProps, auditFields, knowledgeAccess, tenantField } from "./shared";

/**
 * Campaign offers. Prices are NEVER changed by the system — only edited here
 * by staff and approved (published) by an administrator.
 */
export const Offers: CollectionConfig = {
  slug: "offers",
  admin: {
    useAsTitle: "key",
    defaultColumns: ["key", "priceJOD", "state", "_status", "updatedAt"],
    group: GROUP,
    description:
      "Campaign offers the assistant may quote. Change Status to Paused/Inactive and publish to stop quoting an offer instantly — no code change.",
  },
  access: knowledgeAccess,
  ...approvalProps,
  fields: [
    tenantField,
    { name: "key", type: "text", required: true, unique: true, index: true, admin: { description: "Stable id, e.g. filter-maintenance." } },
    { name: "title", type: "text", required: true, localized: true },
    { name: "kind", type: "select", defaultValue: "product", options: ["product", "maintenance"] },
    { name: "priceJOD", type: "number", required: true, min: 0 },
    {
      // NOT named "status": Payload derives the draft enum from `_status`, and a field
      // called `status` collides with it (enum_offers_status) on Postgres.
      name: "state",
      label: "Status",
      type: "select",
      defaultValue: "active",
      index: true,
      options: [
        { label: "Active", value: "active" },
        { label: "Paused", value: "paused" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    {
      name: "scope",
      type: "textarea",
      localized: true,
      admin: { description: "APPROVED scope: what exactly is included. Leave EMPTY if unconfirmed — the assistant will then refer the question to sales." },
    },
    {
      name: "installationIncluded",
      type: "select",
      defaultValue: "unknown",
      options: [
        { label: "Not included", value: "no" },
        { label: "Included", value: "yes" },
        { label: "Unknown / not confirmed", value: "unknown" },
      ],
    },
    { name: "installationNote", type: "textarea", localized: true, admin: { description: "Approved installation terms/charges, if any." } },
    { name: "warrantyText", type: "textarea", localized: true, admin: { description: "Approved warranty wording. Empty = no warranty claims allowed." } },
    { name: "accessoriesText", type: "textarea", localized: true, admin: { description: "Approved accessories included. Empty = none promised." } },
    { name: "installmentsAllowed", type: "checkbox", defaultValue: false },
    {
      type: "row",
      fields: [
        { name: "startsAt", type: "date" },
        { name: "endsAt", type: "date" },
      ],
    },
    ...auditFields,
  ],
};
