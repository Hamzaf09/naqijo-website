import type { CollectionConfig } from "payload";
import { anyone } from "../access/authenticated";
import { canDelete, canWrite } from "../access/roles";
import { formatSlug } from "../lib/payload/format-slug";

/**
 * Product categories. A category with a `parent` set is a SUBCATEGORY, so the
 * whole Category → Subcategory hierarchy lives in one normalized collection.
 */
export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "parent", "status", "order", "updatedAt"],
    group: "Catalog",
  },
  access: {
    read: anyone,
    create: canWrite,
    update: canWrite,
    delete: canDelete,
  },
  fields: [
    { name: "name", type: "text", localized: true, required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      hooks: { beforeValidate: [formatSlug("name")] },
      admin: {
        description: "URL key, e.g. central-filtration. Auto-filled from the name.",
      },
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
      admin: {
        description: "Set a parent to make this a subcategory.",
        position: "sidebar",
      },
      filterOptions: ({ id }) => ({ id: { not_equals: id } }),
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower numbers show first." },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "published",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};
