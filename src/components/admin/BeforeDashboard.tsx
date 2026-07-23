import React from "react";
import type { ServerProps } from "payload";

import packageInfo from "../../../package.json";

/**
 * Admin dashboard home — rendered above the collection cards so editors land
 * on an overview, not a bare collection list. Server component: it queries
 * counts + recent activity through the Payload local API.
 */

const CONTENT = [
  { slug: "products", label: "Products" },
  { slug: "services", label: "Services" },
  { slug: "projects", label: "Projects" },
  { slug: "posts", label: "Blog Posts" },
  { slug: "testimonials", label: "Testimonials" },
  { slug: "faqs", label: "FAQs" },
] as const;

const QUICK_ACTIONS = [
  { href: "/admin/collections/products/create", label: "+ Add Product" },
  { href: "/admin/collections/projects/create", label: "+ Add Project" },
  { href: "/admin/collections/services/create", label: "+ Add Service" },
  { href: "/admin/collections/posts/create", label: "+ Create Blog Post" },
] as const;

type RecentDoc = {
  id: number | string;
  collection: string;
  label: string;
  title: string;
  updatedAt: string;
};

const titleOf = (doc: Record<string, unknown>): string => {
  for (const key of ["name", "title", "customerName", "question", "filename"]) {
    const v = doc[key];
    if (typeof v === "string" && v.trim()) return v;
  }
  return `#${doc.id}`;
};

const fmtDate = (iso: string): string =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

/* Shared styles (inline — the admin ships no extra CSS file). */
const card: React.CSSProperties = {
  background: "var(--theme-elevation-50)",
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: "8px",
  padding: "1.25rem",
};
const h2: React.CSSProperties = {
  margin: "0 0 0.75rem",
  fontSize: "0.8rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--theme-elevation-500)",
};
const listLink: React.CSSProperties = {
  color: "var(--theme-text)",
  textDecoration: "none",
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
  padding: "0.4rem 0",
  borderBottom: "1px solid var(--theme-elevation-100)",
  fontSize: "0.9rem",
};
const muted: React.CSSProperties = {
  color: "var(--theme-elevation-500)",
  whiteSpace: "nowrap",
  fontSize: "0.8rem",
};

export async function BeforeDashboard(props: ServerProps) {
  const { payload, user } = props;

  const counts: Record<string, number> = {};
  await Promise.all(
    [...CONTENT.map((c) => c.slug), "media" as const].map(async (slug) => {
      try {
        const res = await payload.count({ collection: slug });
        counts[slug] = res.totalDocs;
      } catch {
        counts[slug] = 0;
      }
    }),
  );

  const recentOf = async (slug: string, label: string, limit: number): Promise<RecentDoc[]> => {
    try {
      const res = await payload.find({
        collection: slug as "products",
        locale: "ar",
        sort: "-updatedAt",
        limit,
        depth: 0,
      });
      return (res.docs as unknown as Record<string, unknown>[]).map((doc) => ({
        id: doc.id as number,
        collection: slug,
        label,
        title: titleOf(doc),
        updatedAt: String(doc.updatedAt ?? ""),
      }));
    } catch {
      return [];
    }
  };

  const [latestProducts, latestProjects, latestPosts, ...restRecents] = await Promise.all([
    recentOf("products", "Product", 4),
    recentOf("projects", "Project", 4),
    recentOf("posts", "Blog Post", 4),
    recentOf("services", "Service", 3),
    recentOf("testimonials", "Testimonial", 3),
    recentOf("faqs", "FAQ", 3),
  ]);

  // "Recent updates": everything merged, newest first.
  const recentUpdates = [...latestProducts, ...latestProjects, ...latestPosts, ...restRecents.flat()]
    .filter((d) => d.updatedAt)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 8);

  const dbKind = (process.env.DATABASE_URI || "").startsWith("postgres")
    ? "Postgres (Supabase)"
    : "SQLite (local dev)";

  const latestLists: { heading: string; items: RecentDoc[] }[] = [
    { heading: "Latest Products", items: latestProducts },
    { heading: "Latest Projects", items: latestProjects },
    { heading: "Latest Blog Posts", items: latestPosts },
  ];

  return (
    <div style={{ marginBottom: "2.5rem", display: "grid", gap: "1.25rem" }}>
      {/* Greeting + system status */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "0.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.6rem" }}>
          {`Welcome back${user?.name ? `, ${user.name}` : ""}`}
        </h1>
        <span style={{ ...muted }}>
          {`v${packageInfo.version} · ${dbKind} · DB connected · ${counts.media ?? 0} media files`}
        </span>
      </div>

      {/* Stat tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem" }}>
        {CONTENT.map((c) => (
          <a
            key={c.slug}
            href={`/admin/collections/${c.slug}`}
            style={{ ...card, textDecoration: "none", color: "var(--theme-text)" }}
          >
            <div style={{ fontSize: "1.9rem", fontWeight: 700, lineHeight: 1 }}>
              {counts[c.slug] ?? 0}
            </div>
            <div style={{ ...muted, marginTop: "0.4rem" }}>{c.label}</div>
          </a>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
        {QUICK_ACTIONS.map((a) => (
          <a
            key={a.href}
            href={a.href}
            style={{
              background: "var(--theme-elevation-800)",
              color: "var(--theme-elevation-0)",
              borderRadius: "6px",
              padding: "0.55rem 1rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {a.label}
          </a>
        ))}
      </div>

      {/* Latest lists + recent activity */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
        {latestLists.map((list) => (
          <div key={list.heading} style={card}>
            <h2 style={h2}>{list.heading}</h2>
            {list.items.length === 0 ? (
              <p style={{ ...muted, margin: 0 }}>Nothing yet.</p>
            ) : (
              list.items.map((d) => (
                <a key={`${d.collection}-${d.id}`} href={`/admin/collections/${d.collection}/${d.id}`} style={listLink}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.title}</span>
                  <span style={muted}>{fmtDate(d.updatedAt)}</span>
                </a>
              ))
            )}
          </div>
        ))}

        <div style={card}>
          <h2 style={h2}>Recent Activity</h2>
          {recentUpdates.map((d) => (
            <a key={`${d.collection}-${d.id}-r`} href={`/admin/collections/${d.collection}/${d.id}`} style={listLink}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                <span style={{ ...muted, marginInlineEnd: "0.4rem" }}>{d.label}</span>
                {d.title}
              </span>
              <span style={muted}>{fmtDate(d.updatedAt)}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
