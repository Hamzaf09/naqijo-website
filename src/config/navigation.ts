/**
 * Navigation structure. Labels resolve from next-intl `nav` messages by key.
 * Service solutions map to /services/[slug] (single-service pages), except
 * maintenance & consultation which have dedicated top-level pages.
 */

export interface NavItem {
  key: string;
  href: string;
}

export const mainNav: NavItem[] = [
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "products", href: "/#products" },
  { key: "projects", href: "/projects" },
  { key: "consultation", href: "/consultation" },
  { key: "contact", href: "/contact" },
];

export const footerNav: Record<string, NavItem[]> = {
  solutions: [
    { key: "water", href: "/services/water" },
    { key: "kitchen", href: "/services/kitchen" },
    { key: "solar", href: "/services/solar" },
    { key: "protection", href: "/services/protection" },
  ],
  company: [
    { key: "about", href: "/about" },
    { key: "projects", href: "/projects" },
    { key: "consultation", href: "/consultation" },
    { key: "faq", href: "/faq" },
  ],
  support: [
    { key: "maintenance", href: "/maintenance" },
    { key: "contact", href: "/contact" },
  ],
  legal: [
    { key: "privacy", href: "/privacy" },
    { key: "terms", href: "/terms" },
  ],
};
