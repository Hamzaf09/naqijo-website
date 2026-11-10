"use client";

import { useCallback, useEffect, useState } from "react";
import { api, CHANNEL_COLOR, CHANNEL_LABEL, dateTime, post, REASON_LABEL, type Detail } from "./lib";

/* ───────────────────────── Integration status ───────────────────────── */
interface Status {
  graphVersion: string;
  instagramMode: string;
  ai: { provider: string; model: string; keyConfigured: boolean };
  notifications: { email: boolean; webhook: boolean };
  cronConfigured: boolean;
  channels: {
    channel: string; configured: boolean; missing: string[]; webhookUrl: string; lastEventAt: string | null;
    lastError: { at: string; status: string; message?: string } | null; errors24h: number; failedMessages: number; retrying: number;
    connection: { ok: boolean; detail: string } | null;
  }[];
  failedMessages: { id: number; conversation: number; channel: string; status: string; error?: string; errorCode?: string; attempts?: number; at: string }[];
}

const Pill = ({ ok, children }: { ok: boolean; children: React.ReactNode }) => (
  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${ok ? "bg-[#e3f6ea] text-success" : "bg-[#fde8e4] text-danger"}`}>{children}</span>
);

export function StatusView() {
  const [s, setS] = useState<Status | null>(null);
  const [checking, setChecking] = useState(false);
  const load = useCallback(async (live: boolean) => {
    setChecking(live);
    const r = await api<Status>(`/api/inbox/status${live ? "?check=1" : ""}`);
    if (r.ok) setS(r.data);
    setChecking(false);
  }, []);
  useEffect(() => {
    let alive = true;
    api<Status>("/api/inbox/status").then((r) => alive && r.ok && setS(r.data));
    return () => { alive = false; };
  }, []);
  if (!s) return <p className="p-6 text-fg-muted">جارٍ التحميل…</p>;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 overflow-y-auto p-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold text-navy">الحالة والتكامل</h2>
        <button onClick={() => load(true)} disabled={checking} className="rounded-md bg-naqi-blue px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{checking ? "جارٍ الفحص…" : "فحص الاتصال الفعلي مع Meta"}</button>
        <span className="text-xs text-fg-muted" dir="ltr">Graph API {s.graphVersion}</span>
      </div>
      <p className="text-sm text-fg-muted">«مضبوط» يعني أن المتغيرات موجودة فقط. القناة لا تُعتبر تعمل حتى ينجح الفحص الفعلي وتصل رسالة حقيقية من الهاتف (انظر خطة الاختبار).</p>

      <div className="grid gap-4 md:grid-cols-3">
        {s.channels.map((c) => (
          <div key={c.channel} className="space-y-2 rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2"><span className={`rounded px-2 py-0.5 text-sm font-semibold ${CHANNEL_COLOR[c.channel]}`}>{CHANNEL_LABEL[c.channel]}</span><Pill ok={c.configured}>{c.configured ? "مضبوط" : "غير مضبوط"}</Pill></div>
            {!c.configured && <p className="text-xs text-danger" dir="ltr">Missing: {c.missing.join(", ")}</p>}
            <p className="break-all text-xs text-fg-muted" dir="ltr">Webhook: {c.webhookUrl}</p>
            <p className="text-sm">آخر حدث وارد: <b>{c.lastEventAt ? dateTime(c.lastEventAt) : "لم يصل أي حدث بعد"}</b></p>
            <p className="text-sm">أخطاء آخر 24 ساعة: <b className={c.errors24h ? "text-danger" : ""}>{c.errors24h}</b></p>
            <p className="text-sm">رسائل فاشلة: <b className={c.failedMessages ? "text-danger" : ""}>{c.failedMessages}</b> · قيد إعادة المحاولة: <b>{c.retrying}</b></p>
            {c.lastError && <p className="rounded bg-[#fde8e4] p-2 text-xs text-danger" dir="auto">{c.lastError.status}: {c.lastError.message} ({dateTime(c.lastError.at)})</p>}
            {c.connection && <p className={`rounded p-2 text-xs ${c.connection.ok ? "bg-[#e3f6ea] text-success" : "bg-[#fde8e4] text-danger"}`} dir="auto">{c.connection.ok ? "اتصال ناجح: " : "فشل الاتصال: "}{c.connection.detail}</p>}
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4 text-sm"><h3 className="mb-1 font-bold">المساعد الذكي</h3><p dir="ltr">{s.ai.provider} · {s.ai.model}</p><Pill ok={s.ai.provider === "anthropic" ? s.ai.keyConfigured : false}>{s.ai.provider === "anthropic" ? (s.ai.keyConfigured ? "مفتاح API موجود" : "المفتاح ناقص") : "وضع القواعد (بدون نموذج لغوي)"}</Pill></div>
        <div className="rounded-xl border border-border bg-surface p-4 text-sm"><h3 className="mb-1 font-bold">إشعار الفريق عند التحويل</h3><div className="flex gap-2"><Pill ok={s.notifications.email}>بريد</Pill><Pill ok={s.notifications.webhook}>Webhook</Pill></div>{!s.notifications.email && !s.notifications.webhook && <p className="mt-1 text-xs text-danger">لا توجد قناة إشعار — التحويلات تظهر في الصندوق فقط.</p>}</div>
        <div className="rounded-xl border border-border bg-surface p-4 text-sm"><h3 className="mb-1 font-bold">المهام الدورية (إعادة المحاولة)</h3><Pill ok={s.cronConfigured}>{s.cronConfigured ? "AGENT_CRON_SECRET مضبوط" : "غير مضبوط"}</Pill><p className="mt-1 text-xs text-fg-muted" dir="ltr">GET /api/agent/jobs (every minute)</p></div>
      </div>

      <div className="rounded-xl border border-border bg-surface">
        <h3 className="border-b border-border p-4 font-bold">رسائل فاشلة أو محجوبة (آخر 20)</h3>
        {s.failedMessages.length ? (
          <table className="w-full text-sm"><thead className="text-xs text-fg-muted"><tr><th className="p-2 text-start">القناة</th><th className="p-2 text-start">الحالة</th><th className="p-2 text-start">الخطأ</th><th className="p-2 text-start">محاولات</th><th className="p-2 text-start">الوقت</th></tr></thead>
            <tbody>{s.failedMessages.map((m) => (
              <tr key={m.id} className="border-t border-border"><td className="p-2">{CHANNEL_LABEL[m.channel]}</td><td className="p-2">{m.status === "failed" ? "فشل" : "محجوبة"}</td><td className="p-2" dir="auto">{m.error} {m.errorCode && `(${m.errorCode})`}</td><td className="p-2">{m.attempts}</td><td className="p-2">{dateTime(m.at)}</td></tr>
            ))}</tbody></table>
        ) : <p className="p-4 text-sm text-fg-muted">لا توجد رسائل فاشلة.</p>}
      </div>
    </div>
  );
}

/* ───────────────────────── Analytics ───────────────────────── */
interface An {
  rangeDays: number;
  conversations: { total: number; byChannel: Record<string, number> };
  handling: { aiOnly: number; humanInvolved: number; awaitingReply: number };
  responseSeconds: { averageFirstReply: number | null; averageFirstHumanReply: number | null; sample: number };
  escalation: { conversationsWithHandoff: number; rate: number | null; byReason: Record<string, number> };
  inquiries: { product: number; maintenance: number };
  leads: { total: number; qualified: number };
  appointments: { requested: number; confirmed: number };
  sales: { verifiedSales: number; verifiedLost: number; conversionRate: number | null; note: string };
  delivery: { failedMessages: number; retrying: number; integrationErrors: number };
}
const Card = ({ title, value, sub }: { title: string; value: React.ReactNode; sub?: string }) => (
  <div className="rounded-xl border border-border bg-surface p-4"><p className="text-xs text-fg-muted">{title}</p><p className="mt-1 text-2xl font-bold text-navy">{value}</p>{sub && <p className="mt-1 text-xs text-fg-subtle">{sub}</p>}</div>
);
const dur = (s: number | null) => (s === null ? "—" : s < 90 ? `${s} ث` : `${Math.round(s / 60)} د`);

export function AnalyticsView() {
  const [days, setDays] = useState(30);
  const [a, setA] = useState<An | null>(null);
  useEffect(() => {
    let alive = true;
    api<An>(`/api/inbox/analytics?days=${days}`).then((r) => alive && r.ok && setA(r.data));
    return () => { alive = false; };
  }, [days]);
  if (!a) return <p className="p-6 text-fg-muted">جارٍ التحميل…</p>;
  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 overflow-y-auto p-5">
      <div className="flex items-center gap-3"><h2 className="text-xl font-bold text-navy">التحليلات</h2>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="rounded-md border border-border bg-bg px-2 py-1.5 text-sm"><option value={7}>آخر 7 أيام</option><option value={30}>آخر 30 يومًا</option><option value={90}>آخر 90 يومًا</option></select></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="المحادثات" value={a.conversations.total} sub={Object.entries(a.conversations.byChannel).filter(([, n]) => n).map(([k, n]) => `${CHANNEL_LABEL[k]} ${n}`).join(" · ") || "—"} />
        <Card title="تعامل معها المساعد فقط" value={a.handling.aiOnly} sub={`بمشاركة موظف: ${a.handling.humanInvolved} · بلا رد: ${a.handling.awaitingReply}`} />
        <Card title="متوسط أول رد" value={dur(a.responseSeconds.averageFirstReply)} sub={`أول رد بشري: ${dur(a.responseSeconds.averageFirstHumanReply)} (عيّنة ${a.responseSeconds.sample})`} />
        <Card title="نسبة التحويل لموظف" value={a.escalation.rate === null ? "—" : `${Math.round(a.escalation.rate * 100)}%`} sub={`${a.escalation.conversationsWithHandoff} محادثة`} />
        <Card title="استفسارات منتجات (عملاء محتملون)" value={a.inquiries.product} />
        <Card title="طلبات صيانة" value={a.inquiries.maintenance} />
        <Card title="عملاء مؤهَّلون" value={a.leads.qualified} sub={`من ${a.leads.total} عميل محتمل`} />
        <Card title="مواعيد مؤكدة (بتأكيد موظف)" value={a.appointments.confirmed} sub={`إجمالي الطلبات: ${a.appointments.requested}`} />
        <Card title="مبيعات موثّقة" value={a.sales.verifiedSales} sub={a.sales.conversionRate === null ? "لا توجد نتائج موثّقة بعد" : `معدل التحويل ${Math.round(a.sales.conversionRate * 100)}%`} />
        <Card title="رسائل فاشلة" value={a.delivery.failedMessages} sub={`قيد إعادة المحاولة ${a.delivery.retrying}`} />
        <Card title="أخطاء التكامل" value={a.delivery.integrationErrors} />
      </div>
      <p className="rounded-md bg-dew p-3 text-sm text-navy">{a.sales.note} المواعيد المؤكدة هي التي أكّدها موظف فقط؛ طلبات المواعيد لا تُحسب كمؤكدة.</p>
      {Object.keys(a.escalation.byReason).length > 0 && (
        <div className="rounded-xl border border-border bg-surface p-4"><h3 className="mb-2 font-bold">أسباب التحويل</h3>
          <ul className="grid gap-1 text-sm sm:grid-cols-2">{Object.entries(a.escalation.byReason).sort((x, y) => y[1] - x[1]).map(([k, n]) => <li key={k} className="flex justify-between"><span>{REASON_LABEL[k] ?? k}</span><b>{n}</b></li>)}</ul></div>
      )}
    </div>
  );
}

/* ───────────────────────── Simulator ───────────────────────── */
export function SimulatorView({ onOpen }: { onOpen: (id: number) => void }) {
  const [customerId, setCustomerId] = useState("tester-1");
  const [text, setText] = useState("");
  const [convId, setConvId] = useState<number | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const reload = useCallback(async (id: number) => {
    const r = await api<Detail>(`/api/inbox/conversations/${id}`);
    if (r.ok) setDetail(r.data);
  }, []);

  const send = async () => {
    if (!text.trim()) return;
    setBusy(true);
    setErr(null);
    const r = await post<{ conversationId?: number; error?: string }>("/api/inbox/simulate", { text, customerId, name: "عميل تجريبي" });
    setBusy(false);
    if (!r.ok || !r.data.conversationId) return setErr(r.data.error === "simulator_disabled" ? "المحاكي معطّل في هذه البيئة." : "تعذّر التنفيذ");
    setText("");
    setConvId(r.data.conversationId);
    await reload(r.data.conversationId);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 overflow-y-auto p-5">
      <h2 className="text-xl font-bold text-navy">محاكي المحادثة</h2>
      <p className="rounded-md bg-[#fff1d6] p-3 text-sm text-fg">يمرّر رسالتك عبر نفس محرك المساعد (القواعد، قاعدة المعرفة المعتمدة، الحواجز، التحويل) <b>بدون</b> الاتصال بـ Meta. هذا اختبار للمنطق وليس اختبارًا لقناة حقيقية.</p>
      <label className="flex items-center gap-2 text-sm">معرّف العميل التجريبي <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} dir="ltr" className="rounded-md border border-border bg-bg px-2 py-1.5" /> <span className="text-xs text-fg-muted">(غيّره لبدء محادثة جديدة)</span></label>
      <div className="min-h-[260px] space-y-2 rounded-xl border border-border bg-surface p-3">
        {detail?.messages.map((m) => (
          <div key={m.id} className={`flex ${m.direction === "outbound" ? "justify-end" : "justify-start"}`}>
            <p className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${m.direction === "outbound" ? "bg-dew" : "bg-cloud"}`}>{m.text}</p>
          </div>
        )) ?? <p className="text-sm text-fg-muted">اكتب رسالة لبدء المحادثة. جرّب: «بكم الفلتر سبع مراحل؟» أو «بدي أحكي مع موظف».</p>}
      </div>
      {err && <p className="text-sm text-danger">{err}</p>}
      <div className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="رسالة العميل…" className="flex-1 rounded-lg border border-border bg-bg px-3 py-2" />
        <button onClick={send} disabled={busy || !text.trim()} className="rounded-lg bg-naqi-blue px-5 py-2 font-semibold text-white disabled:opacity-50">{busy ? "…" : "إرسال"}</button>
        {convId && <button onClick={() => onOpen(convId)} className="rounded-lg border border-border px-4 py-2 text-sm">فتح في الصندوق</button>}
      </div>
    </div>
  );
}
