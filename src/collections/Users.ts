import type { CollectionConfig } from "payload";
import { isAdmin, isAdminField, isAdminOrSelf } from "../access/roles";

/**
 * CMS users. Payload provides auth, sessions, and the login UI.
 * Roles: Administrator (full control incl. users/settings), Editor
 * (create/edit/delete content), Content Manager (create/edit content),
 * Viewer (read-only admin access). Only admins manage users or change roles.
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "role"],
    group: "Admin",
  },
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text" },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "viewer",
      options: [
        { label: "Super Admin", value: "super-admin" },
        { label: "Administrator", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Content Manager", value: "content-manager" },
        { label: "Viewer", value: "viewer" },
      ],
      access: { update: isAdminField },
      admin: { position: "sidebar" },
    },
  ],
};
