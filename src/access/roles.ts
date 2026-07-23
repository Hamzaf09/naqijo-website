import type { Access, ClientUser, FieldAccess } from "payload";

/**
 * Role-based access control.
 *
 *  - super-admin / admin  → full control incl. users, settings, deletes
 *  - editor               → create/edit/delete content + media
 *  - content-manager      → create/edit content + media (no deletes)
 *  - viewer               → read-only admin access
 */
export type Role = "super-admin" | "admin" | "editor" | "content-manager" | "viewer";

type AnyUser = (ClientUser & { role?: Role }) | null | undefined;

const roleOf = (user: AnyUser): Role | null => (user?.role as Role) ?? null;

export const isAdminRole = (user: AnyUser): boolean => {
  const r = roleOf(user);
  return r === "super-admin" || r === "admin";
};

const isWriterRole = (user: AnyUser): boolean => {
  const r = roleOf(user);
  return r === "super-admin" || r === "admin" || r === "editor" || r === "content-manager";
};

const isDeleterRole = (user: AnyUser): boolean => {
  const r = roleOf(user);
  return r === "super-admin" || r === "admin" || r === "editor";
};

/** Admins only (user management, site settings, destructive config). */
export const isAdmin: Access = ({ req }) => isAdminRole(req.user as AnyUser);

/** Anyone who may author content: admin, editor, or content manager. */
export const canWrite: Access = ({ req }) => isWriterRole(req.user as AnyUser);

/** Anyone who may delete content: admin or editor. */
export const canDelete: Access = ({ req }) => isDeleterRole(req.user as AnyUser);

/** Field-level admin gate (e.g. changing a user's role). */
export const isAdminField: FieldAccess = ({ req }) => isAdminRole(req.user as AnyUser);

/** Users may read/update themselves; admins may manage everyone. */
export const isAdminOrSelf: Access = ({ req, id }) => {
  if (isAdminRole(req.user as AnyUser)) return true;
  return req.user?.id === id;
};
