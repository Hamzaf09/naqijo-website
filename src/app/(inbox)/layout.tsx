import type { Metadata } from "next";
import { alexandria } from "@/fonts/alexandria";
import "../globals.css";

export const metadata: Metadata = {
  title: "صندوق نقي الرابية",
  robots: { index: false, follow: false },
};

/** Staff-only dashboard shell (Arabic, RTL). Not part of the public localized site. */
export default function InboxLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={alexandria.variable}>
      <body className="min-h-dvh bg-bg-subtle font-sans text-fg antialiased">{children}</body>
    </html>
  );
}
