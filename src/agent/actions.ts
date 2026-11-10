import type { Payload } from "payload";
import { audit } from "./audit";
import { sendReply, type SendResult } from "./outbound";

type UserId = number | string;

const touch = (payload: Payload, id: number, data: Record<string, unknown>) =>
  payload.update({ collection: "conversations", id, data, overrideAccess: true });

/** Human takes the chat: AI replies stop immediately and stay off until explicitly returned. */
export async function takeover(payload: Payload, id: number, userId: UserId) {
  await touch(payload, id, { aiMode: "human", assignedTo: Number(userId), status: "open", unreadCount: 0 });
  await audit(payload, { action: "conversation.takeover", actorType: "staff", actor: userId, entity: "conversations", entityId: id });
}

export async function returnToAi(payload: Payload, id: number, userId: UserId) {
  await touch(payload, id, { aiMode: "ai", needsHuman: false });
  await audit(payload, { action: "conversation.return_to_ai", actorType: "staff", actor: userId, entity: "conversations", entityId: id });
}

export async function setAiPaused(payload: Payload, id: number, paused: boolean, userId: UserId) {
  await touch(payload, id, { aiMode: paused ? "paused" : "ai" });
  await audit(payload, { action: paused ? "ai.pause" : "ai.resume", actorType: "staff", actor: userId, entity: "conversations", entityId: id });
}

export async function assign(payload: Payload, id: number, userId: UserId, to: { userId?: number | null; team?: "sales" | "support" | null }) {
  await touch(payload, id, {
    ...(to.userId !== undefined ? { assignedTo: to.userId } : {}),
    ...(to.team !== undefined ? { assignedTeam: to.team } : {}),
  });
  await audit(payload, { action: "conversation.assign", actorType: "staff", actor: userId, entity: "conversations", entityId: id, detail: to });
}

export async function setStatus(payload: Payload, id: number, status: "open" | "pending" | "resolved", userId: UserId) {
  await touch(payload, id, { status, ...(status === "resolved" ? { needsHuman: false } : {}) });
  if (status === "resolved") {
    await payload.update({
      collection: "handoffs",
      where: { and: [{ conversation: { equals: id } }, { status: { not_equals: "resolved" } }] },
      data: { status: "resolved", resolvedAt: new Date().toISOString(), resolvedBy: Number(userId) },
      overrideAccess: true,
    });
  }
  await audit(payload, { action: "conversation.status", actorType: "staff", actor: userId, entity: "conversations", entityId: id, detail: { status } });
}

export async function markSeen(payload: Payload, id: number) {
  await touch(payload, id, { unreadCount: 0 });
}

export async function addNote(payload: Payload, id: number, userId: UserId, body: string) {
  const n = await payload.create({
    collection: "internal-notes",
    overrideAccess: true,
    data: { conversation: id, author: Number(userId), body: body.slice(0, 4000) },
  });
  await audit(payload, { action: "conversation.note", actorType: "staff", actor: userId, entity: "conversations", entityId: id });
  return n;
}

/**
 * A person writes to the customer. If the AI was still active it is switched
 * off first, so the AI can never answer on top of a human.
 */
export async function sendHuman(
  payload: Payload,
  id: number,
  userId: UserId,
  msg: { text?: string; template?: { name: string; language: string; bodyParams?: string[] } },
): Promise<SendResult> {
  const conv = await payload.findByID({ collection: "conversations", id, depth: 0, overrideAccess: true });
  if (conv.aiMode === "ai") await takeover(payload, id, userId);
  else if (!conv.assignedTo) await touch(payload, id, { assignedTo: Number(userId) });
  const r = await sendReply(payload, { conversationId: id, text: msg.text, template: msg.template, senderType: "agent", userId });
  await audit(payload, { action: "message.send_human", actorType: "staff", actor: userId, entity: "conversations", entityId: id, detail: { ok: r.ok, blocked: r.blockedReason } });
  if (r.ok) await touch(payload, id, { status: "open", needsHuman: false });
  return r;
}

type StaffRef = { id: number; role: string; email: string };
const asUser = (u: StaffRef) => ({ collection: "users" as const, ...u }) as never;

/** Staff confirm an appointment (the collection hook stamps confirmedBy/At and requires a date). */
export async function confirmAppointment(payload: Payload, appointmentId: number, user: StaffRef, scheduledFor: string) {
  const r = await payload.update({
    collection: "appointments",
    id: appointmentId,
    data: { status: "confirmed", scheduledFor },
    user: asUser(user),
    overrideAccess: true,
  });
  await audit(payload, { action: "appointment.confirmed", actorType: "staff", actor: user.id, entity: "appointments", entityId: appointmentId, detail: { scheduledFor } });
  return r;
}

export async function cancelAppointment(payload: Payload, appointmentId: number, user: StaffRef) {
  await payload.update({ collection: "appointments", id: appointmentId, data: { status: "cancelled" }, overrideAccess: true });
  await audit(payload, { action: "appointment.cancelled", actorType: "staff", actor: user.id, entity: "appointments", entityId: appointmentId });
}

/** Records a verified outcome. 'won' requires evidence (enforced by the collection hook). */
export async function setLeadOutcome(
  payload: Payload,
  leadId: number,
  user: StaffRef,
  o: { stage: "won" | "lost"; evidence?: string; amountJOD?: number },
) {
  const r = await payload.update({
    collection: "leads",
    id: leadId,
    data: { stage: o.stage, ...(o.stage === "won" ? { verified: { evidence: o.evidence, amountJOD: o.amountJOD } } : {}) },
    user: asUser(user),
    overrideAccess: true,
  });
  await audit(payload, { action: `lead.${o.stage}`, actorType: "staff", actor: user.id, entity: "leads", entityId: leadId, detail: { evidence: o.evidence, amountJOD: o.amountJOD } });
  return r;
}
