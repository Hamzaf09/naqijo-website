import { headers } from "next/headers";
import { isInboxRole } from "@/access/roles";
import { getPayloadClient } from "@/lib/payload/client";
import { InboxApp } from "./InboxApp";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await headers() });

  if (!user || !isInboxRole(user as never)) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold text-navy">صندوق المحادثات — نقي الرابية</h1>
        <p className="text-fg-muted">
          {user ? "حسابك لا يملك صلاحية الوصول إلى صندوق المحادثات (المبيعات / الدعم الفني / الإدارة)." : "سجّل الدخول بحساب الفريق للمتابعة."}
        </p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Payload admin lives outside the app router */}
        <a
          href="/admin/login?redirect=/inbox"
          className="rounded-lg bg-naqi-blue px-5 py-2.5 font-semibold text-white hover:bg-blue-deep"
        >
          تسجيل الدخول
        </a>
      </main>
    );
  }

  return (
    <InboxApp
      me={{ id: Number(user.id), name: (user as { name?: string }).name ?? user.email ?? "", role: (user as { role?: string }).role ?? "" }}
    />
  );
}
