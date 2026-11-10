import type { CollectionConfig } from "payload";
import { GROUP, approvalProps, auditFields, knowledgeAccess, tenantField } from "./shared";

export const KNOWLEDGE_CATEGORIES = [
  { label: "Company & contact", value: "company" },
  { label: "Product / category", value: "product" },
  { label: "Prices & promotions", value: "price" },
  { label: "Maintenance service & scope", value: "maintenance" },
  { label: "Installation policy", value: "installation" },
  { label: "Warranty policy", value: "warranty" },
  { label: "Service coverage & delivery areas", value: "coverage" },
  { label: "FAQ", value: "faq" },
  { label: "Booking procedure", value: "booking" },
  { label: "Escalation procedure", value: "escalation" },
] as const;

/**
 * The assistant's ONLY source of company facts. Drafts are invisible to the
 * assistant; only the latest PUBLISHED (admin-approved) version is used.
 */
export const KnowledgeEntries: CollectionConfig = {
  slug: "knowledge-entries",
  labels: { singular: "Knowledge entry", plural: "Knowledge base" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "availability", "_status", "updatedAt"],
    group: GROUP,
    description:
      "Everything the AI assistant may tell customers. Save as Draft to propose; an administrator Publishes to approve. Missing facts are never guessed.",
  },
  access: knowledgeAccess,
  ...approvalProps,
  fields: [
    tenantField,
    { name: "category", type: "select", required: true, index: true, options: [...KNOWLEDGE_CATEGORIES] },
    { name: "title", type: "text", required: true, localized: true },
    { name: "content", type: "textarea", required: true, localized: true, admin: { description: "Approved wording. Include prices/terms only if verified." } },
    {
      name: "keywords",
      type: "textarea",
      localized: true,
      admin: { description: "Extra search words / synonyms, one per line (Arabic & English, dialect terms)." },
    },
    {
      name: "availability",
      type: "select",
      defaultValue: "n/a",
      options: [
        { label: "Not applicable", value: "n/a" },
        { label: "Unconfirmed — never state it is available", value: "unconfirmed" },
        { label: "Confirmed available", value: "available" },
        { label: "Not available", value: "unavailable" },
      ],
      admin: { position: "sidebar", description: "For products/services: what the company has confirmed." },
    },
    {
      name: "alwaysInclude",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar", description: "Always given to the assistant (keep these few and short)." },
    },
    { name: "source", type: "text", admin: { description: "Who/what verified this (e.g. 'Owner, 2026-10-09')." } },
    ...auditFields,
  ],
};
