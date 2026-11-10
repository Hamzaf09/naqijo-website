"use client";

import { useEffect, useRef, useState } from "react";
import { CHANNEL_COLOR, CHANNEL_LABEL, clock, dateTime, MODE_COLOR, MODE_LABEL, post, type Detail } from "./lib";

const TICK: Record<string, [string, string]> = {
  queued: ["⏳", "في الانتظار / إعادة محاولة"],
  sent: ["✓", "أُرسلت"],
  delivered: ["✓✓", "وصلت"],
  read: ["✓✓", "قُرئت"],
  failed: ["⚠", "فشل الإرسال"],
  blocked: ["⛔", "محجوبة (نافذة المراسلة)"],
};

export function Thread({ detail, onChanged, onBack }: { detail: Detail; onChanged: () => Promise<void>; onBack: () => void }) {
  const c = detail.conversation;
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [tpl, setTpl] = useState({ name: "", language: "ar" });
  const bottom = useRef<HTMLDivElement>(null);
  const count = detail.messages.length;
  useEffect(() => { bottom.current?.scrollIntoView({ block: "end" }); }, [count, c.id]);

  const act = async (body: Record<string, unknown>) => {
    setBusy(true);
    setErr(null);
    const r = await post<{ ok?: boolean; error?: string; blockedReason?: string }>(`/api/inbox/conversations/${c.id}`, body);
    setBusy(false);
    if (!r.ok) setErr(r.data.blockedReason === "whatsapp_24h_window_closed_template_required" ? "انتهت نافذة الـ 24 ساعة في واتساب — استخدم قالب رسالة معتمدًا." : r.data.error ?? r.data.blockedReason ?? "تعذّر تنفيذ العملية");
    await onChanged();
    return r.ok;
  };
  const send = async () => {
    if (!text.trim()) return;
    if (await act({ action: "send", text })) setText("");
  };
  const windowClosed = c.channel !== "test" && !c.window.open;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
        <button onClick={onBack} className="rounded-md px-2 py-1 text-sm hover:bg-cloud lg:hidden">→ رجوع</button>
        <div>
          <h2 className="font-bold text-navy">{c.customerName}</h2>
          <p className="text-xs text-fg-muted" dir="ltr">{c.customerExternalId}</p>
        </div>
        <span className={`rounded px-2 py-0.5 text-xs ${CHANNEL_COLOR[c.channel]}`}>{CHANNEL_LABEL[c.channel]}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${MODE_COLOR[c.aiMode]}`}>{MODE_LABEL[c.aiMode]}</span>
        <div className="ms-auto flex gap-2 text-sm">
          {c.aiMode !== "human" ? (
            <button disabled={busy} onClick={() => act({ action: "takeover" })} className="rounded-md bg-navy px-3 py-1.5 font-semibold text-white disabled:opacity-50">استلام المحادثة</button>
          ) : (
            <button disabled={busy} onClick={() => act({ action: "return_ai" })} className="rounded-md bg-naqi-blue px-3 py-1.5 font-semibold text-white disabled:opacity-50">إعادة للمساعد الآلي</button>
          )}
          {c.aiMode === "ai" && <button disabled={busy} onClick={() => act({ action: "pause" })} className="rounded-md border border-border px-3 py-1.5">إيقاف الآلي</button>}
          {c.aiMode === "paused" && <button disabled={busy} onClick={() => act({ action: "resume" })} className="rounded-md border border-border px-3 py-1.5">استئناف الآلي</button>}
          {c.status !== "resolved" ? (
            <button disabled={busy} onClick={() => act({ action: "status", status: "resolved" })} className="rounded-md border border-border px-3 py-1.5">تم الحل</button>
          ) : (
            <button disabled={busy} onClick={() => act({ action: "status", status: "open" })} className="rounded-md border border-border px-3 py-1.5">إعادة فتح</button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-bg-subtle p-4">
        {detail.messages.map((m) => {
          const mine = m.direction === "outbound";
          const [tick, tickLabel] = TICK[m.status] ?? ["", ""];
          const who = m.senderType === "ai" ? "المساعد الآلي" : m.senderType === "agent" ? (m.by ?? "موظف") : m.senderType === "system" ? "النظام" : "";
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm shadow-xs ${mine ? (m.senderType === "agent" ? "bg-navy text-white" : "bg-dew text-fg") : "bg-surface"}`}>
                {who && <div className={`mb-0.5 text-[11px] font-semibold ${m.senderType === "agent" ? "text-blue-100" : "text-naqi-blue"}`}>{who}</div>}
                <p className="whitespace-pre-wrap break-words">{m.text || (m.kind === "media" ? "📎 مرفق (صورة / صوت)" : m.kind === "unsupported" ? "رسالة غير مدعومة" : "")}</p>
                <div className={`mt-1 flex items-center gap-2 text-[11px] ${m.senderType === "agent" ? "text-white/70" : "text-fg-subtle"}`} title={dateTime(m.at)}>
                  <span>{clock(m.at)}</span>
                  {mine && <span className={m.status === "failed" || m.status === "blocked" ? "font-bold text-danger" : m.status === "read" ? "text-naqi-blue" : ""} title={tickLabel}>{tick} {m.status === "failed" || m.status === "blocked" || m.status === "queued" ? tickLabel : ""}</span>}
                  {m.simulated && <span>(محاكاة)</span>}
                </div>
                {m.error && <div className="mt-1 rounded bg-[#fde8e4] px-2 py-1 text-[11px] text-danger" dir="auto">{m.error}{m.attempts ? ` · محاولات: ${m.attempts}` : ""}</div>}
              </div>
            </div>
          );
        })}
        <div ref={bottom} />
      </div>

      <div className="border-t border-border bg-surface p-3">
        {err && <p className="mb-2 rounded bg-[#fde8e4] px-3 py-1.5 text-sm text-danger">{err}</p>}
        {c.aiMode === "ai" && <p className="mb-2 text-xs text-fg-muted">المساعد الآلي فعّال — إرسال رسالتك سيستلم المحادثة ويوقف الرد الآلي تلقائيًا.</p>}
        {windowClosed ? (
          <div className="space-y-2 text-sm">
            <p className="text-gold-deep">
              {c.channel === "whatsapp" ? "انتهت نافذة المراسلة (24 ساعة) — يمكن إرسال قالب واتساب معتمد فقط." : "انتهت نافذة المراسلة (24 ساعة) — لا يمكن الإرسال إلا ضمن شروط وسم الوكيل البشري."}
            </p>
            {c.channel === "whatsapp" && (
              <div className="flex flex-wrap gap-2">
                <input value={tpl.name} onChange={(e) => setTpl({ ...tpl, name: e.target.value.toLowerCase() })} placeholder="اسم القالب (مثال: follow_up)" dir="ltr" className="rounded-md border border-border bg-bg px-3 py-2" />
                <input value={tpl.language} onChange={(e) => setTpl({ ...tpl, language: e.target.value })} dir="ltr" className="w-20 rounded-md border border-border bg-bg px-3 py-2" />
                <button disabled={busy || !tpl.name} onClick={() => act({ action: "template", name: tpl.name, language: tpl.language })} className="rounded-md bg-naqi-blue px-4 py-2 font-semibold text-white disabled:opacity-50">إرسال القالب</button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void send(); }} rows={2} placeholder="اكتب ردك… (Ctrl+Enter للإرسال)" className="min-h-[44px] flex-1 resize-none rounded-lg border border-border bg-bg px-3 py-2 text-sm" />
            <button disabled={busy || !text.trim()} onClick={send} className="self-end rounded-lg bg-naqi-blue px-5 py-2.5 font-semibold text-white hover:bg-blue-deep disabled:opacity-50">إرسال</button>
          </div>
        )}
      </div>
    </>
  );
}
