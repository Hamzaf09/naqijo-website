import type { CollectionBeforeChangeHook, Field } from "payload";

/**
 * Audit trail shared by all content collections: who created, last updated,
 * and last published a document, and when it was last published. Full change
 * history lives in Payload's version history (drafts + versions).
 */
export const auditFields: Field[] = [
  {
    name: "createdBy",
    type: "relationship",
    relationTo: "users",
    admin: { position: "sidebar", readOnly: true },
  },
  {
    name: "updatedBy",
    type: "relationship",
    relationTo: "users",
    admin: { position: "sidebar", readOnly: true },
  },
  {
    name: "publishedBy",
    type: "relationship",
    relationTo: "users",
    admin: { position: "sidebar", readOnly: true },
  },
  {
    name: "publishedAt",
    type: "date",
    admin: { position: "sidebar", readOnly: true },
  },
];

/** beforeChange hook that stamps the audit fields from the acting user. */
export const auditStamp: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  const userId = req.user?.id;
  if (!userId) return data;

  data.updatedBy = userId;
  if (operation === "create" && !data.createdBy) data.createdBy = userId;
  if (data._status === "published") {
    data.publishedBy = userId;
    data.publishedAt = new Date().toISOString();
  }
  return data;
};
