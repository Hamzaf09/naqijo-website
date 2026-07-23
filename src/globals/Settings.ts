import type { GlobalConfig } from "payload";
import { anyone } from "../access/authenticated";
import { isAdmin } from "../access/roles";

/**
 * Global site settings — identity, contact facts, social, footer, default SEO
 * and analytics. Read by the footer, layout metadata and contact surfaces so a
 * non-technical admin can change them without touching code.
 */
export const Settings: GlobalConfig = {
  slug: "settings",
  admin: { group: "Configuration" },
  access: { read: anyone, update: isAdmin },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Identity",
          fields: [
            { name: "siteName", type: "text", localized: true },
            { name: "logo", type: "upload", relationTo: "media" },
            { name: "favicon", type: "upload", relationTo: "media" },
          ],
        },
        {
          label: "Contact",
          fields: [
            {
              name: "phones",
              type: "array",
              labels: { singular: "Phone", plural: "Phones" },
              fields: [{ name: "number", type: "text", required: true }],
            },
            { name: "whatsapp", type: "text", admin: { description: "e.g. +962792300005" } },
            { name: "email", type: "text" },
            { name: "address", type: "textarea", localized: true },
            { name: "workingHours", type: "text", localized: true },
            { name: "mapUrl", type: "text", admin: { description: "Google Maps link." } },
          ],
        },
        {
          label: "Social",
          fields: [
            { name: "facebook", type: "text" },
            { name: "instagram", type: "text" },
            { name: "youtube", type: "text" },
            { name: "linkedin", type: "text" },
            { name: "twitter", type: "text" },
          ],
        },
        {
          label: "Footer",
          fields: [
            { name: "footerTagline", type: "textarea", localized: true },
            { name: "copyright", type: "text", localized: true },
          ],
        },
        {
          label: "SEO & Analytics",
          fields: [
            {
              name: "defaultSeo",
              type: "group",
              fields: [
                { name: "metaTitle", type: "text", localized: true },
                { name: "metaDescription", type: "textarea", localized: true },
                { name: "ogImage", type: "upload", relationTo: "media" },
              ],
            },
            { name: "googleAnalyticsId", type: "text", admin: { description: "e.g. G-XXXXXXX" } },
            { name: "gtmId", type: "text", admin: { description: "e.g. GTM-XXXXXX" } },
          ],
        },
      ],
    },
  ],
};
