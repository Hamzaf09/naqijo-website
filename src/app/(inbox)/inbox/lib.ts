export const CHANNEL_LABEL: Record<string, string> = { whatsapp: "واتساب", messenger: "ماسنجر", instagram: "إنستغرام", test: "محاكي" };
export const CHANNEL_COLOR: Record<string, string> = {
  whatsapp: "bg-[#e3f6ea] text-[#17703f]",
  messenger: "bg-[#e3eefc] text-[#1456b8]",
  instagram: "bg-[#fde8f1] text-[#b0235f]",
  test: "bg-cloud text-gray",
};
export const STATUS_LABEL: Record<string, string> = { open: "مفتوحة", pending: "بانتظار موظف", resolved: "تم الحل" };
export const MODE_LABEL: Record<string, string> = { ai: "المساعد الآلي", human: "موظف", paused: "متوقف مؤقتًا" };
export const MODE_COLOR: Record<string, string> = {
  ai: "bg-dew text-naqi-blue",
  human: "bg-navy text-white",
  paused: "bg-[#fff1d6] text-gold-deep",
};
export const REASON_LABEL: Record<string, string> = {
  complaint: "شكوى",
  human_request: "طلب التحدث مع موظف",
  technical_uncertain: "سؤال فني غير مؤكد",
  missing_info: "معلومة غير متوفرة بالقاعدة",
  discount_request: "طلب خصم / استثناء",
  warranty_dispute: "خلاف ضمان",
  appointment_confirmation: "تأكيد موعد",
  high_intent_lead: "عميل جاهز للشراء",
  safety: "مسألة سلامة (عاجل)",
  unsupported_service: "خدمة غير مؤكدة",
  existing_order: "طلب / موعد قائم",
  ai_failure: "تعذّر على المساعد المعالجة",
};
export const NOTIFY_LABEL: Record<string, string> = {
  pending: "قيد الإرسال",
  sent: "تم إشعار الفريق",
  partial: "إشعار جزئي",
  failed: "فشل إشعار الفريق",
  not_configured: "لا توجد قناة إشعار مفعّلة",
};
export const CONSENT_LABEL: Record<string, string> = { unknown: "لم يُسأل", requested: "بانتظار الرد", granted: "موافق", declined: "رفض" };
export const STAGE_LABEL: Record<string, string> = { new: "جديد", qualifying: "قيد التأهيل", qualified: "مؤهَّل", "handed-off": "محوَّل للفريق", won: "بيع مؤكد", lost: "خسارة" };

export async function api<T = unknown>(path: string, init?: RequestInit): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await fetch(path, {
    credentials: "same-origin",
    ...init,
    headers: { ...(init?.body ? { "Content-Type": "application/json" } : {}), ...init?.headers },
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return { ok: res.ok, status: res.status, data };
}

export const post = <T = unknown>(path: string, body: unknown) => api<T>(path, { method: "POST", body: JSON.stringify(body) });

export function timeAgo(iso?: string | null): string {
  if (!iso) return "";
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "الآن";
  if (s < 3600) return `${Math.floor(s / 60)} د`;
  if (s < 86400) return `${Math.floor(s / 3600)} س`;
  return new Date(iso).toLocaleDateString("ar-JO", { day: "numeric", month: "short" });
}

export const clock = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit", numberingSystem: "latn" } as Intl.DateTimeFormatOptions) : "";
export const dateTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("ar-JO", { dateStyle: "medium", timeStyle: "short", numberingSystem: "latn" } as Intl.DateTimeFormatOptions) : "—";

export interface ConvRow {
  id: number;
  channel: string;
  customerName: string;
  status: string;
  aiMode: string;
  needsHuman: boolean;
  unreadCount: number;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  assignedTeam?: string | null;
  assignedTo: { id: number; name: string } | null;
}

export interface Detail {
  conversation: {
    id: number; channel: string; customerName: string; customerExternalId: string; status: string; aiMode: string;
    needsHuman: boolean; assignedTeam?: string | null; assignedTo: { id: number; name: string } | null; lastIntent?: string;
    window: { open: boolean; expiresAt: string | null };
  };
  customer: { displayName?: string; name?: string; phone?: string; area?: string; consentStatus: string; optedOut?: boolean } | null;
  lead: { id: number; kind: string; stage: string; qualified: boolean; productInterest?: string; area?: string; homeType?: string; existingSystem?: string; problem?: string; budget?: string; equipmentType?: string; brandModel?: string; preferredTime?: string; address?: string; offerKey?: string } | null;
  leadVerified: { evidence?: string; amountJOD?: number } | null;
  handoffs: { id: number; reason: string; status: string; notifyStatus: string; notifyDetail?: string; summaryText?: string; recommendedAction?: string; createdAt: string }[];
  appointments: { id: number; kind: string; status: string; requestedWindow?: string; scheduledFor?: string; confirmedBy?: string | null }[];
  notes: { id: number; body: string; at: string; author: string | null }[];
  messages: { id: number; direction: string; senderType: string; kind: string; text?: string; status: string; error?: string; attempts?: number; at: string; simulated?: boolean; by?: string | null }[];
  staff: { id: number; name: string; role: string }[];
  me: number;
}
