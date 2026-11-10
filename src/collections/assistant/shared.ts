import { APIError } from "payload";
import type { Access, CollectionBeforeChangeHook, CollectionConfig, Field } from "payload";
import { canAuthorKnowledge, inboxStaff, isAdmin, isApproverRole } from "../../access/roles";
import { auditFields, auditStamp } from "../../lib/payload/audit";

export const GROUP = "Assistant";

/** Conversation data holds customer PII → inbox roles only; deletion is admin-only. */
export const inboxAccess: NonNullable<CollectionConfig["access"]> = {
  read: inboxStaff,
  create: inboxStaff,
  update: inboxStaff,
  delete: isAdmin,
};

export const tenantField: Field = {
  name: "tenant",
  type: "text",
  defaultValue: "naqijo",
  index: true,
  admin: { position: "sidebar", readOnly: true },
};

const anyStaff: Access = ({ req }) => Boolean(req.user);

/** Knowledge-base style access: anyone signed in can read, authors draft, only admins delete. */
export const knowledgeAccess: NonNullable<CollectionConfig["access"]> = {
  read: anyStaff,
  create: canAuthorKnowledge,
  update: canAuthorKnowledge,
  delete: isAdmin,
};

/**
 * Approval workflow: authors save DRAFTS; only an administrator can PUBLISH.
 * The assistant reads exclusively the latest PUBLISHED version, so edits never
 * reach customers until approved. (Seeds/scripts run without a user and are trusted.)
 */
export const requireApproverToPublish: CollectionBeforeChangeHook = ({ data, req }) => {
  if (data._status === "published" && req.user && !isApproverRole(req.user as never)) {
    throw new APIError("Only an administrator can approve (publish) this item.", 403);
  }
  return data;
};

export const approvalProps = {
  versions: { drafts: { autosave: false }, maxPerDoc: 30 },
  hooks: { beforeChange: [requireApproverToPublish, auditStamp] },
} satisfies Partial<CollectionConfig>;

export { auditFields };
