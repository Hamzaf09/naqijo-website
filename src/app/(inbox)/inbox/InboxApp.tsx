"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnalyticsView, SimulatorView, StatusView } from "./Views";
import { Thread } from "./Thread";
import { SidePanel } from "./SidePanel";
import { api, CHANNEL_COLOR, CHANNEL_LABEL, MODE_COLOR, MODE_LABEL, STATUS_LABEL, timeAgo, type ConvRow, type Detail } from "./lib";

type Tab = "inbox" | "status" | "analytics" | "simulator";
const POLL_MS = 5000;

export function InboxApp({ me }: { me: { id: number; name: string; role: string } }) {
  const [tab, setTab] = useState<Tab>("inbox");
  const [rows, setRows] = useState<ConvRow[]>([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [filters, setFilters] = useState({ channel: "all", status: "all", mode: "all", assigned: "all", unread: false, needsHuman: false, q: "" });
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const selectedRef = useRef<number | null>(null);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  const loadList = useCallback(async () => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) if (v && v !== "all") sp.set(k, v === true ? "1" : String(v));
    const r = await api<{ docs: ConvRow[]; totalDocs: number }>(`/api/inbox/conversations?${sp}`);
    if (!r.ok) return setError(r.status === 401 ? "انتهت الجلسة — أعد تسجيل الدخول." : "تعذّر تحميل المحادثات.");
    setError(null);
    setRows(r.data.docs);
    setTotal(r.data.totalDocs);
  }, [filters]);

  const loadDetail = useCallback(async (id: number) => {
    const r = await api<Detail>(`/api/inbox/conversations/${id}`);
    if (r.ok && selectedRef.current === id) setDetail(r.data);
  }, []);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      if (!alive || document.hidden) return;
      await loadList();
      if (selectedRef.current) await loadDetail(selectedRef.current);
    };
    void tick();
    const t = setInterval(tick, POLL_MS);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [loadList, loadDetail]);

  const open = async (id: number) => {
    selectedRef.current = id;
    setSelected(id);
    setDetail(null);
    await loadDetail(id);
    await api(`/api/inbox/conversations/${id}`, { method: "POST", body: JSON.stringify({ action: "seen" }) });
    void loadList();
  };
  const refresh = async () => {
    if (selected) await loadDetail(selected);
    await loadList();
  };

  const unreadTotal = rows.reduce((n, r) => n + (r.unreadCount > 0 ? 1 : 0), 0);
  const needs = rows.filter((r) => r.needsHuman).length;

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b border-border bg-navy px-4 py-2.5 text-white">
        <span className="font-bold">نقي الرابية · صندوق المحادثات</span>
        <nav className="flex gap-1 text-sm">
          {([
            ["inbox", `المحادثات${unreadTotal ? ` (${unreadTotal})` : ""}`],
            ["status", "الحالة والتكامل"],
            ["analytics", "التحليلات"],
            ["simulator", "المحاكي"],
          ] as [Tab, string][]).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} className={`rounded-md px-3 py-1.5 ${tab === k ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`}>
              {label}
            </button>
          ))}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/admin/collections/knowledge-entries" className="rounded-md px-3 py-1.5 hover:bg-white/10">قاعدة المعرفة ↗</a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/admin/collections/offers" className="rounded-md px-3 py-1.5 hover:bg-white/10">العروض ↗</a>
        </nav>
        <span className="ms-auto text-xs text-white/80">
          {needs > 0 && <b className="me-3 rounded bg-gold px-2 py-0.5 text-navy">{needs} تحتاج موظفًا</b>}
          {me.name}
        </span>
      </header>

      {error && <div className="bg-[#fde8e4] px-4 py-2 text-sm text-danger">{error}</div>}

      {tab === "status" && <StatusView />}
      {tab === "analytics" && <AnalyticsView />}
      {tab === "simulator" && <SimulatorView onOpen={(id) => { setTab("inbox"); void open(id); }} />}

      {tab === "inbox" && (
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[340px_1fr_340px]">
          {/* list */}
          <aside className={`flex min-h-0 flex-col border-e border-border bg-surface ${selected ? "hidden lg:flex" : "flex"}`}>
            <div className="space-y-2 border-b border-border p-3">
              <form onSubmit={(e) => { e.preventDefault(); setFilters((f) => ({ ...f, q: query })); }}>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث بالاسم أو الرقم أو نص الرسالة…" className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm" />
              </form>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Select value={filters.channel} onChange={(v) => setFilters({ ...filters, channel: v })} options={[["all", "كل القنوات"], ["whatsapp", "واتساب"], ["messenger", "ماسنجر"], ["instagram", "إنستغرام"], ["test", "المحاكي"]]} />
                <Select value={filters.status} onChange={(v) => setFilters({ ...filters, status: v })} options={[["all", "كل الحالات"], ["open", "مفتوحة"], ["pending", "بانتظار موظف"], ["resolved", "تم الحل"]]} />
                <Select value={filters.mode} onChange={(v) => setFilters({ ...filters, mode: v })} options={[["all", "كل الأوضاع"], ["ai", "المساعد الآلي"], ["human", "موظف"], ["paused", "متوقف"]]} />
                <Select value={filters.assigned} onChange={(v) => setFilters({ ...filters, assigned: v })} options={[["all", "كل الموظفين"], ["me", "المسندة لي"], ["none", "غير مسندة"]]} />
              </div>
              <div className="flex gap-4 text-xs">
                <label className="flex items-center gap-1"><input type="checkbox" checked={filters.unread} onChange={(e) => setFilters({ ...filters, unread: e.target.checked })} /> غير مقروءة</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={filters.needsHuman} onChange={(e) => setFilters({ ...filters, needsHuman: e.target.checked })} /> تحتاج موظفًا</label>
                <span className="ms-auto text-fg-muted">{total} محادثة</span>
              </div>
            </div>
            <ul className="min-h-0 flex-1 divide-y divide-border overflow-y-auto">
              {rows.map((r) => (
                <li key={r.id}>
                  <button onClick={() => open(r.id)} className={`w-full px-3 py-3 text-start hover:bg-bg-subtle ${selected === r.id ? "bg-dew" : ""}`}>
                    <div className="flex items-center gap-2">
                      {r.unreadCount > 0 && <span className="h-2 w-2 shrink-0 rounded-full bg-naqi-blue" aria-label="غير مقروء" />}
                      <span className={`truncate font-semibold ${r.unreadCount ? "text-navy" : ""}`}>{r.customerName || "عميل"}</span>
                      <span className="ms-auto shrink-0 text-xs text-fg-subtle">{timeAgo(r.lastMessageAt)}</span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-fg-muted">{r.lastMessagePreview}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className={`rounded px-1.5 py-0.5 ${CHANNEL_COLOR[r.channel]}`}>{CHANNEL_LABEL[r.channel]}</span>
                      <span className={`rounded px-1.5 py-0.5 ${MODE_COLOR[r.aiMode]}`}>{MODE_LABEL[r.aiMode]}</span>
                      <span className="rounded bg-cloud px-1.5 py-0.5 text-gray">{STATUS_LABEL[r.status]}</span>
                      {r.needsHuman && <span className="rounded bg-gold px-1.5 py-0.5 font-semibold text-navy">يحتاج موظفًا</span>}
                      {r.assignedTo && <span className="text-fg-muted">← {r.assignedTo.name}</span>}
                    </div>
                  </button>
                </li>
              ))}
              {!rows.length && <li className="p-6 text-center text-sm text-fg-muted">لا توجد محادثات مطابقة.</li>}
            </ul>
          </aside>

          {/* thread */}
          <section className={`min-h-0 ${selected ? "flex" : "hidden lg:flex"} flex-col bg-bg`}>
            {detail ? (
              <Thread detail={detail} onChanged={refresh} onBack={() => { setSelected(null); setDetail(null); }} />
            ) : (
              <div className="m-auto text-fg-muted">{selected ? "جارٍ التحميل…" : "اختر محادثة من القائمة"}</div>
            )}
          </section>

          {/* side */}
          <aside className={`min-h-0 overflow-y-auto border-s border-border bg-surface ${selected && detail ? "block" : "hidden lg:block"}`}>
            {detail ? <SidePanel detail={detail} onChanged={refresh} /> : <p className="p-6 text-sm text-fg-muted">تفاصيل العميل والطلب ستظهر هنا.</p>}
          </aside>
        </div>
      )}
    </div>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-md border border-border bg-bg px-2 py-1.5">
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}
