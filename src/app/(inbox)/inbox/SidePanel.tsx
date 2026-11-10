"use client";

import { useState } from "react";
import { CONSENT_LABEL, dateTime, NOTIFY_LABEL, post, REASON_LABEL, STAGE_LABEL, type Detail } from "./lib";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-border p-4">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-fg-muted">{title}</h3>
      {children}
    </section>
  );
}
const Row = ({ k, v }: { k: string; v?: string | null }) => (v ? <div className="flex justify-between gap-3 py-0.5 text-sm"><span className="text-fg-muted">{k}</span><span className="text-end font-medium">{v}</span></div> : null);

export function SidePanel({ detail, onChanged }: { detail: Detail; onChanged: () => Promise<void> }) {
  const c = detail.conversation;
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [when, setWhen] = useState<Record<number, string>>({});
  const [evidence, setEvidence] = useState({ evidence: "", amount: "" });

  const act = async (body: Record<string, unknown>) => {
    setMsg(null);
    const r = await post<{ error?: string }>(`/api/inbox/conversations/${c.id}`, body);
    if (!r.ok) setMsg(r.data.error ?? "تعذّر تنفيذ العملية");
    await onChanged();
  };
  const l = detail.lead;
  const cu = detail.customer;

  return (
    <div>
      <Section title="الإسناد والحالة">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <label className="space-y-1"><span className="text-xs text-fg-muted">الموظف</span>
            <select value={c.assignedTo?.id ?? ""} onChange={(e) => act({ action: "assign", userId: e.target.value ? Number(e.target.value) : null })} className="w-full rounded-md border border-border bg-bg px-2 py-1.5">
              <option value="">غير مسندة</option>
              {detail.staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select></label>
          <label className="space-y-1"><span className="text-xs text-fg-muted">الفريق</span>
            <select value={c.assignedTeam ?? ""} onChange={(e) => act({ action: "assign", team: e.target.value || null })} className="w-full rounded-md border border-border bg-bg px-2 py-1.5">
              <option value="">—</option><option value="sales">المبيعات</option><option value="support">الدعم الفني</option>
            </select></label>
          <label className="col-span-2 space-y-1"><span className="text-xs text-fg-muted">الحالة</span>
            <select value={c.status} onChange={(e) => act({ action: "status", status: e.target.value })} className="w-full rounded-md border border-border bg-bg px-2 py-1.5">
              <option value="open">مفتوحة</option><option value="pending">بانتظار موظف</option><option value="resolved">تم الحل</option>
            </select></label>
        </div>
        {!c.window.open && c.channel !== "test" && <p className="mt-2 text-xs text-gold-deep">نافذة المراسلة مغلقة منذ {dateTime(c.window.expiresAt)}</p>}
        {msg && <p className="mt-2 text-xs text-danger">{msg}</p>}
      </Section>

      <Section title="العميل">
        <Row k="الاسم على المنصة" v={cu?.displayName} />
        <Row k="الاسم" v={cu?.name} />
        <Row k="الهاتف" v={cu?.phone} />
        <Row k="المنطقة" v={cu?.area} />
        <Row k="الموافقة على حفظ البيانات" v={CONSENT_LABEL[cu?.consentStatus ?? "unknown"]} />
        {cu?.optedOut && <p className="mt-1 text-xs font-bold text-danger">طلب العميل عدم المراسلة</p>}
        <Row k="آخر نية مكتشفة" v={c.lastIntent} />
      </Section>

      <Section title="الطلب / العميل المحتمل">
        {l ? (
          <>
            <div className="mb-1 flex items-center gap-2 text-sm"><b>{l.kind === "maintenance" ? "صيانة" : "مبيعات"}</b><span className="rounded bg-dew px-2 py-0.5 text-xs text-naqi-blue">{STAGE_LABEL[l.stage]}</span>{l.qualified && <span className="rounded bg-[#e3f6ea] px-2 py-0.5 text-xs text-success">مؤهَّل</span>}</div>
            <Row k="المنتج / الخدمة" v={l.productInterest ?? l.equipmentType} />
            <Row k="الماركة / الموديل" v={l.brandModel} />
            <Row k="المنطقة" v={l.area} />
            <Row k="نوع المنزل" v={l.homeType} />
            <Row k="النظام الحالي" v={l.existingSystem} />
            <Row k="المشكلة" v={l.problem} />
            <Row k="الميزانية" v={l.budget} />
            <Row k="الوقت المفضل" v={l.preferredTime} />
            <Row k="العنوان" v={l.address} />
            <Row k="العرض" v={l.offerKey} />
            {l.stage !== "won" && l.stage !== "lost" ? (
              <details className="mt-3 rounded-md border border-border p-2 text-sm">
                <summary className="cursor-pointer font-semibold">تسجيل نتيجة موثّقة</summary>
                <p className="my-2 text-xs text-fg-muted">لا يُحتسب البيع إلا بمرجع فاتورة / طلب.</p>
                <input value={evidence.evidence} onChange={(e) => setEvidence({ ...evidence, evidence: e.target.value })} placeholder="مرجع الفاتورة / الطلب" className="mb-2 w-full rounded-md border border-border bg-bg px-2 py-1.5" />
                <input value={evidence.amount} onChange={(e) => setEvidence({ ...evidence, amount: e.target.value })} placeholder="المبلغ (دينار)" inputMode="decimal" className="mb-2 w-full rounded-md border border-border bg-bg px-2 py-1.5" />
                <div className="flex gap-2">
                  <button onClick={() => act({ action: "lead_outcome", leadId: l.id, stage: "won", evidence: evidence.evidence, amountJOD: evidence.amount ? Number(evidence.amount) : undefined })} className="rounded-md bg-success px-3 py-1.5 text-white">بيع مؤكد</button>
                  <button onClick={() => act({ action: "lead_outcome", leadId: l.id, stage: "lost" })} className="rounded-md border border-border px-3 py-1.5">خسارة</button>
                </div>
              </details>
            ) : l.stage === "won" ? <Row k="مرجع التحقق" v={`${detail.leadVerified?.evidence ?? ""}${detail.leadVerified?.amountJOD ? ` · ${detail.leadVerified.amountJOD} د` : ""}`} /> : null}
          </>
        ) : <p className="text-sm text-fg-muted">لا يوجد عميل محتمل — محادثة دعم / استفسار فقط.</p>}
      </Section>

      <Section title="التحويلات للفريق">
        {detail.handoffs.length ? detail.handoffs.map((h) => (
          <details key={h.id} className="mb-2 rounded-md border border-border p-2 text-sm" open={h.status !== "resolved"}>
            <summary className="cursor-pointer font-semibold">{REASON_LABEL[h.reason] ?? h.reason} <span className="text-xs font-normal text-fg-muted">· {h.status === "resolved" ? "مغلق" : "مفتوح"}</span></summary>
            <p className={`mt-1 text-xs ${h.notifyStatus === "failed" || h.notifyStatus === "partial" ? "font-bold text-danger" : "text-fg-muted"}`}>{NOTIFY_LABEL[h.notifyStatus]}</p>
            {h.notifyDetail && <p className="text-[11px] text-fg-subtle" dir="auto">{h.notifyDetail}</p>}
            <p className="mt-1 text-xs"><b>الإجراء المقترح:</b> {h.recommendedAction}</p>
            <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded bg-cloud p-2 text-[11px]" dir="auto">{h.summaryText}</pre>
          </details>
        )) : <p className="text-sm text-fg-muted">لا يوجد.</p>}
      </Section>

      <Section title="المواعيد">
        {detail.appointments.length ? detail.appointments.map((a) => (
          <div key={a.id} className="mb-2 rounded-md border border-border p-2 text-sm">
            <div className="flex items-center gap-2"><b>{a.kind}</b>
              <span className={`rounded px-2 py-0.5 text-xs ${a.status === "confirmed" || a.status === "completed" ? "bg-[#e3f6ea] text-success" : "bg-[#fff1d6] text-gold-deep"}`}>
                {a.status === "requested" ? "مطلوب — غير مؤكد" : a.status === "confirmed" ? "مؤكد" : a.status === "completed" ? "منجز" : "ملغي"}
              </span></div>
            <Row k="المطلوب" v={a.requestedWindow} />
            <Row k="الموعد" v={a.scheduledFor ? dateTime(a.scheduledFor) : null} />
            <Row k="أكّده" v={a.confirmedBy} />
            {a.status === "requested" && (
              <div className="mt-2 flex gap-2">
                <input type="datetime-local" value={when[a.id] ?? ""} onChange={(e) => setWhen({ ...when, [a.id]: e.target.value })} className="min-w-0 flex-1 rounded-md border border-border bg-bg px-2 py-1" />
                <button disabled={!when[a.id]} onClick={() => act({ action: "confirm_appointment", appointmentId: a.id, scheduledFor: when[a.id] })} className="rounded-md bg-naqi-blue px-3 py-1 text-white disabled:opacity-50">تأكيد</button>
                <button onClick={() => act({ action: "cancel_appointment", appointmentId: a.id })} className="rounded-md border border-border px-2 py-1">إلغاء</button>
              </div>
            )}
          </div>
        )) : <p className="text-sm text-fg-muted">لا يوجد.</p>}
      </Section>

      <Section title="ملاحظات داخلية">
        <ul className="mb-2 space-y-2">
          {detail.notes.map((n) => <li key={n.id} className="rounded-md bg-[#fff8e6] p-2 text-sm"><p className="whitespace-pre-wrap">{n.body}</p><p className="mt-1 text-[11px] text-fg-subtle">{n.author} · {dateTime(n.at)}</p></li>)}
        </ul>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="ملاحظة للفريق فقط (لا تصل للعميل)" className="w-full rounded-md border border-border bg-bg px-2 py-1.5 text-sm" />
        <button disabled={!note.trim()} onClick={async () => { await act({ action: "note", body: note }); setNote(""); }} className="mt-1 rounded-md bg-navy px-3 py-1.5 text-sm text-white disabled:opacity-50">حفظ الملاحظة</button>
      </Section>
    </div>
  );
}
