import type { GlobalConfig } from "payload";
import { anyone } from "../access/authenticated";
import { canWrite } from "../access/roles";

/** Small helper: a localized section header (eyebrow + title [+ subtitle]). */
const sectionHeader = (withSubtitle = false) => [
  { name: "eyebrow", type: "text" as const, localized: true },
  { name: "title", type: "text" as const, localized: true },
  ...(withSubtitle
    ? [{ name: "subtitle", type: "textarea" as const, localized: true }]
    : []),
];

/**
 * Homepage content global. EVERY homepage section is editable here so nothing
 * on the homepage is hardcoded. Featured products/projects come live from their
 * collections; this holds the hero and all editorial copy.
 */
export const Homepage: GlobalConfig = {
  slug: "homepage",
  admin: { group: "Content" },
  access: { read: anyone, update: canWrite },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            { name: "heroEyebrow", type: "text", localized: true },
            { name: "heroTitleTop", type: "text", localized: true },
            { name: "heroTitleAccent", type: "text", localized: true },
            { name: "heroSubtitle", type: "textarea", localized: true },
            { name: "heroImage", type: "upload", relationTo: "media" },
            {
              name: "heroVideo",
              type: "upload",
              relationTo: "media",
              admin: { description: "Optional background video." },
            },
            {
              type: "row",
              fields: [
                { name: "heroPrimaryLabel", type: "text", localized: true, admin: { width: "50%" } },
                { name: "heroPrimaryHref", type: "text", admin: { width: "50%" } },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "heroSecondaryLabel", type: "text", localized: true, admin: { width: "50%" } },
                { name: "heroSecondaryHref", type: "text", admin: { width: "50%" } },
              ],
            },
          ],
        },
        {
          label: "About",
          fields: [
            { name: "about", type: "group", fields: [
              { name: "eyebrow", type: "text", localized: true },
              { name: "title", type: "text", localized: true },
              { name: "body", type: "textarea", localized: true },
            ] },
          ],
        },
        {
          label: "Why",
          fields: [
            { name: "why", type: "group", fields: [
              ...sectionHeader(),
              { name: "pillars", type: "array", fields: [
                { name: "title", type: "text", localized: true, required: true },
                { name: "description", type: "textarea", localized: true },
              ] },
            ] },
          ],
        },
        {
          label: "Solutions",
          fields: [
            { name: "solutions", type: "group", fields: [
              ...sectionHeader(),
              { name: "items", type: "array", fields: [
                { name: "eyebrow", type: "text", localized: true },
                { name: "title", type: "text", localized: true, required: true },
                { name: "description", type: "textarea", localized: true },
                { name: "bullets", type: "array", fields: [
                  { name: "text", type: "text", localized: true, required: true },
                ] },
                { name: "image", type: "upload", relationTo: "media" },
                { name: "href", type: "text" },
                { name: "ctaLabel", type: "text", localized: true },
              ] },
            ] },
          ],
        },
        {
          label: "Featured Products",
          fields: [
            { name: "featuredProducts", type: "group", fields: [
              ...sectionHeader(true),
              { name: "exploreLabel", type: "text", localized: true },
              { name: "viewAllLabel", type: "text", localized: true },
            ] },
          ],
        },
        {
          label: "Featured Project",
          fields: [
            { name: "featuredProject", type: "group", fields: [
              ...sectionHeader(true),
              { name: "ctaLabel", type: "text", localized: true },
            ] },
          ],
        },
        {
          label: "Process",
          fields: [
            { name: "process", type: "group", fields: [
              ...sectionHeader(),
              { name: "steps", type: "array", fields: [
                { name: "title", type: "text", localized: true, required: true },
                { name: "description", type: "textarea", localized: true },
              ] },
            ] },
          ],
        },
        {
          label: "Testimonials",
          fields: [
            { name: "testimonials", type: "group", fields: [
              ...sectionHeader(),
              { name: "items", type: "array", fields: [
                { name: "quote", type: "textarea", localized: true, required: true },
                { name: "name", type: "text", localized: true, required: true },
                { name: "role", type: "text", localized: true },
              ] },
            ] },
          ],
        },
        {
          label: "Stats",
          fields: [
            { name: "stats", type: "group", fields: [
              { name: "eyebrow", type: "text", localized: true },
              { name: "items", type: "array", fields: [
                { name: "value", type: "text", localized: true, required: true },
                { name: "label", type: "text", localized: true, required: true },
              ] },
            ] },
          ],
        },
        {
          label: "Contact CTA",
          fields: [
            { name: "cta", type: "group", fields: [
              ...sectionHeader(true),
              { name: "whatsappText", type: "textarea", localized: true },
            ] },
          ],
        },
      ],
    },
  ],
};
