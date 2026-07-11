import type { CollectionConfig } from "payload";
import { anyone, authenticated } from "../access/authenticated";
import { formatSlug } from "../lib/payload/format-slug";

/**
 * Products — the flagship collection. A tabbed editor (not one giant form)
 * with native Draft/Published + version history + live preview. All localized
 * (ar/en). Everything the public product page shows is edited here.
 */
export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: [
      "name",
      "category",
      "subcategory",
      "_status",
      "featured",
      "showOnHomepage",
      "order",
      "updatedAt",
    ],
    group: "Catalog",
    preview: (doc) =>
      typeof doc?.slug === "string" ? `/ar/products/${doc.slug}` : null,
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    drafts: { autosave: false },
    maxPerDoc: 20,
  },
  fields: [
    // ── Sidebar quick controls ────────────────────────────────
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
    {
      name: "showOnHomepage",
      type: "checkbox",
      label: "Show on homepage",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Eligible for the homepage Featured section.",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower numbers show first." },
    },
    {
      name: "availability",
      type: "select",
      defaultValue: "available",
      options: [
        { label: "Available", value: "available" },
        { label: "On order", value: "on-order" },
        { label: "Out of stock", value: "out-of-stock" },
      ],
      admin: { position: "sidebar" },
    },

    // ── Tabbed editor ─────────────────────────────────────────
    {
      type: "tabs",
      tabs: [
        {
          label: "General",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "name",
                  type: "text",
                  localized: true,
                  required: true,
                  admin: { width: "70%" },
                },
                { name: "sku", type: "text", admin: { width: "30%" } },
              ],
            },
            {
              name: "slug",
              type: "text",
              required: true,
              unique: true,
              index: true,
              hooks: { beforeValidate: [formatSlug("name")] },
              admin: {
                description:
                  "URL segment, e.g. central-filter-jumbo. Auto-filled from the English name.",
              },
            },
            {
              type: "row",
              fields: [
                {
                  name: "category",
                  type: "relationship",
                  relationTo: "categories",
                  admin: { width: "50%" },
                  filterOptions: () => ({ parent: { exists: false } }),
                },
                {
                  name: "subcategory",
                  type: "relationship",
                  relationTo: "categories",
                  admin: {
                    width: "50%",
                    description: "Optional — a child of the category.",
                  },
                  filterOptions: () => ({ parent: { exists: true } }),
                },
              ],
            },
          ],
        },
        {
          label: "Descriptions",
          fields: [
            {
              name: "shortDescription",
              type: "textarea",
              localized: true,
              required: true,
              admin: { description: "One or two sentences for cards and hero." },
            },
            {
              name: "fullDescription",
              type: "richText",
              localized: true,
              admin: { description: "Rich text — the main product write-up." },
            },
          ],
        },
        {
          label: "Images",
          fields: [
            {
              name: "mainImage",
              type: "upload",
              relationTo: "media",
              required: true,
              admin: { description: "Primary product image (transparent PNG ok)." },
            },
            {
              name: "gallery",
              type: "upload",
              relationTo: "media",
              hasMany: true,
              admin: { description: "Unlimited. Drag to reorder." },
            },
          ],
        },
        {
          label: "Specifications",
          fields: [
            {
              name: "specs",
              type: "array",
              labels: { singular: "Specification", plural: "Specifications" },
              admin: { description: "e.g. Pressure → 6 Bar, Stages → 7." },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "label",
                      type: "text",
                      localized: true,
                      required: true,
                      admin: { width: "40%" },
                    },
                    {
                      name: "value",
                      type: "text",
                      localized: true,
                      required: true,
                      admin: { width: "40%" },
                    },
                    { name: "unit", type: "text", admin: { width: "20%" } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Features",
          fields: [
            {
              name: "features",
              type: "array",
              labels: { singular: "Feature", plural: "Features" },
              admin: { description: "Bullet list, e.g. Removes chlorine." },
              fields: [
                { name: "text", type: "text", localized: true, required: true },
              ],
            },
          ],
        },
        {
          label: "What's Included",
          fields: [
            {
              name: "included",
              type: "array",
              labels: { singular: "Item", plural: "Items" },
              admin: { description: "e.g. Filter, Installation kit, Manual." },
              fields: [
                { name: "item", type: "text", localized: true, required: true },
              ],
            },
          ],
        },
        {
          label: "Downloads",
          fields: [
            {
              name: "downloads",
              type: "array",
              labels: { singular: "Download", plural: "Downloads" },
              admin: { description: "PDF catalog, manual, warranty, certificates." },
              fields: [
                {
                  name: "label",
                  type: "text",
                  localized: true,
                  required: true,
                },
                {
                  name: "file",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: "Related",
          fields: [
            {
              name: "relatedProducts",
              type: "relationship",
              relationTo: "products",
              hasMany: true,
              admin: {
                description:
                  "Leave empty to auto-show 4 products from the same category.",
              },
              filterOptions: ({ id }) => ({ id: { not_equals: id } }),
            },
          ],
        },
        {
          label: "FAQ",
          fields: [
            {
              name: "faqs",
              type: "array",
              labels: { singular: "Question", plural: "Questions" },
              admin: { description: "Product-specific questions and answers." },
              fields: [
                { name: "question", type: "text", localized: true, required: true },
                { name: "answer", type: "textarea", localized: true, required: true },
              ],
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            {
              name: "seo",
              type: "group",
              label: "SEO",
              fields: [
                { name: "metaTitle", type: "text", localized: true },
                { name: "metaDescription", type: "textarea", localized: true },
                { name: "keywords", type: "text", localized: true },
                { name: "ogImage", type: "upload", relationTo: "media" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
