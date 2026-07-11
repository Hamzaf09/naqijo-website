import type { CollectionConfig } from "payload";
import { authenticated } from "../access/authenticated";

/** CMS users (admins/editors). Payload provides auth, sessions, and the login UI. */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "role"],
    group: "Admin",
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text" },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "admin",
      options: [
        { label: "Super Admin", value: "super-admin" },
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};
