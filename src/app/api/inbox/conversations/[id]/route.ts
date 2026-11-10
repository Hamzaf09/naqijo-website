import { z } from "zod";
import * as A from "@/agent/actions";
import { isResponse, json, requireStaff } from "@/agent/auth";
import { windowState } from "@/agent/channels/window";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type Ctx = { params: Promise<{ id: string }> };

/** Full conversation: messages, customer, lead, handoffs, appointments, notes, messaging-window state. */
export async function GET(req: Request, ctx: Ctx) {
  const staff = await requireStaff(req);
  if (isResponse(staff)) return staff;
  const id = Number((await ctx.params).id);
  if (!Number.isFinite(id)) return json(400, { error: "bad_id" });
  const { payload } = staff;
  const conv = await payload.findByID({ collection: "conversations", id, depth: 1, overrideAccess: true }).catch(() => null);
  if (!conv) return json(404, { error: "not_found" });

  const [messages, notes, leads, handoffs, appts, staffList] = await Promise.all([
    payload.find({ collection: "messages", where: { conversation: { equals: id } }, sort: "createdAt", limit: 300, depth: 1, overrideAccess: true, pagination: false }),
    payload.find({ collection: "internal-notes", where: { conversation: { equals: id } }, sort: "createdAt", limit: 100, depth: 1, overrideAccess: true, pagination: false }),
    payload.find({ collection: "leads", where: { conversation: { equals: id } }, sort: "-updatedAt", limit: 3, depth: 0, overrideAccess: true }),
    payload.find({ collection: "handoffs", where: { conversation: { equals: id } }, sort: "-createdAt", limit: 10, depth: 0, overrideAccess: true }),
    payload.find({ collection: "appointments", where: { conversation: { equals: id } }, sort: "-createdAt", limit: 5, depth: 1, overrideAccess: true }),
    payload.find({ collection: "users", where: { role: { in: ["sales", "support", "admin", "super-admin"] } }, limit: 100, depth: 0, overrideAccess: true, pagination: false }),
  ]);
  const customer = typeof conv.customer === "object" ? conv.customer : null;
  const win = windowState(conv.channel, conv.lastInboundAt ? new Date(conv.lastInboundAt) : null);

  return json(200, {
    conversation: {
      id: conv.id, channel: conv.channel, customerName: conv.customerName, customerExternalId: conv.customerExternalId,
      status: conv.status, aiMode: conv.aiMode, needsHuman: conv.needsHuman, unreadCount: conv.unreadCount,
      assignedTeam: conv.assignedTeam, assignedTo: typeof conv.assignedTo === "object" && conv.assignedTo ? { id: conv.assignedTo.id, name: conv.assignedTo.name ?? conv.assignedTo.email } : null,
      lastIntent: conv.lastIntent, window: { open: win.open, expiresAt: win.expiresAt },
    },
    customer: customer && { displayName: customer.displayName, name: customer.name, phone: customer.phone, area: customer.area, consentStatus: customer.consentStatus, optedOut: customer.optedOut },
    lead: leads.docs[0] ?? null,
    leadVerified: leads.docs[0]?.verified ?? null,
    handoffs: handoffs.docs.map((h) => ({ id: h.id, reason: h.reason, status: h.status, notifyStatus: h.notifyStatus, notifyDetail: h.notifyDetail, summaryText: h.summaryText, recommendedAction: h.recommendedAction, createdAt: h.createdAt })),
    appointments: appts.docs.map((a) => ({ id: a.id, kind: a.kind, status: a.status, requestedWindow: a.requestedWindow, scheduledFor: a.scheduledFor, confirmedBy: typeof a.confirmedBy === "object" && a.confirmedBy ? (a.confirmedBy.name ?? a.confirmedBy.email) : null })),
    notes: notes.docs.map((n) => ({ id: n.id, body: n.body, at: n.createdAt, author: typeof n.author === "object" && n.author ? (n.author.name ?? n.author.email) : null })),
    messages: messages.docs.map((m) => ({
      id: m.id, direction: m.direction, senderType: m.senderType, kind: m.kind, text: m.text, status: m.status,
      error: m.error, attempts: m.attempts, at: m.createdAt, simulated: m.simulated,
      by: typeof m.sentBy === "object" && m.sentBy ? (m.sentBy.name ?? m.sentBy.email) : null,
    })),
    staff: staffList.docs.map((u) => ({ id: u.id, name: u.name ?? u.email, role: u.role })),
    me: staff.user.id,
  });
}

const action = z.discriminatedUnion("action", [
  z.object({ action: z.literal("takeover") }),
  z.object({ action: z.literal("return_ai") }),
  z.object({ action: z.literal("pause") }),
  z.object({ action: z.literal("resume") }),
  z.object({ action: z.literal("seen") }),
  z.object({ action: z.literal("status"), status: z.enum(["open", "pending", "resolved"]) }),
  z.object({ action: z.literal("assign"), userId: z.number().int().nullable().optional(), team: z.enum(["sales", "support"]).nullable().optional() }),
  z.object({ action: z.literal("note"), body: z.string().min(1).max(4000) }),
  z.object({ action: z.literal("confirm_appointment"), appointmentId: z.number().int(), scheduledFor: z.string().min(8) }),
  z.object({ action: z.literal("cancel_appointment"), appointmentId: z.number().int() }),
  z.object({
    action: z.literal("lead_outcome"),
    leadId: z.number().int(),
    stage: z.enum(["won", "lost"]),
    evidence: z.string().max(200).optional(),
    amountJOD: z.number().min(0).optional(),
  }),
  z.object({ action: z.literal("send"), text: z.string().min(1).max(4000) }),
  z.object({
    action: z.literal("template"),
    name: z.string().min(1).max(100).regex(/^[a-z0-9_]+$/),
    language: z.string().min(2).max(10),
    bodyParams: z.array(z.string().max(500)).max(10).optional(),
  }),
]);

export async function POST(req: Request, ctx: Ctx) {
  const staff = await requireStaff(req, { mutate: true });
  if (isResponse(staff)) return staff;
  const id = Number((await ctx.params).id);
  const parsed = action.safeParse(await req.json().catch(() => null));
  if (!Number.isFinite(id) || !parsed.success) return json(400, { error: "invalid_request" });
  const { payload, user } = staff;
  const a = parsed.data;

  switch (a.action) {
    case "takeover": await A.takeover(payload, id, user.id); break;
    case "return_ai": await A.returnToAi(payload, id, user.id); break;
    case "pause": await A.setAiPaused(payload, id, true, user.id); break;
    case "resume": await A.setAiPaused(payload, id, false, user.id); break;
    case "seen": await A.markSeen(payload, id); break;
    case "status": await A.setStatus(payload, id, a.status, user.id); break;
    case "assign": await A.assign(payload, id, user.id, { userId: a.userId, team: a.team }); break;
    case "note": await A.addNote(payload, id, user.id, a.body); break;
    case "confirm_appointment": {
      try {
        await A.confirmAppointment(payload, a.appointmentId, user as never, new Date(a.scheduledFor).toISOString());
      } catch (e) {
        return json(422, { ok: false, error: (e as Error).message });
      }
      break;
    }
    case "cancel_appointment": await A.cancelAppointment(payload, a.appointmentId, user as never); break;
    case "lead_outcome": {
      try {
        await A.setLeadOutcome(payload, a.leadId, user as never, a);
      } catch (e) {
        return json(422, { ok: false, error: (e as Error).message });
      }
      break;
    }
    case "send": {
      const r = await A.sendHuman(payload, id, user.id, { text: a.text });
      return json(r.ok ? 200 : 422, r);
    }
    case "template": {
      const r = await A.sendHuman(payload, id, user.id, { template: { name: a.name, language: a.language, bodyParams: a.bodyParams }, text: `[template: ${a.name}]` });
      return json(r.ok ? 200 : 422, r);
    }
  }
  return json(200, { ok: true });
}
