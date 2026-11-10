import type { Payload } from "payload";
import { TENANT_ID } from "./config";
import type { Collected, Intent } from "./types";

export const isMaintenanceIntent = (i: Intent) => i === "maintenance_request" || i === "technical_support";

export function isQualified(kind: "sales" | "maintenance", c: Partial<Record<string, string | null | undefined>>): boolean {
  if (kind === "maintenance") return Boolean((c.equipmentType || c.productInterest) && c.problem && c.area);
  return Boolean(c.productInterest && c.area);
}

/** Merge rule: a non-empty new value replaces; an empty one never erases what we know. */
const keep = (n: string | undefined, o: string | null | undefined) => (n && n.trim() ? n.trim() : (o ?? undefined));

export interface LeadUpdate {
  conversationId: number;
  customerId?: number | null;
  intent: Intent;
  collected: Collected;
  allowAddress: boolean;
  offerKey?: string;
}

/**
 * Creates/updates the single open lead for a conversation from what the
 * customer has actually said. Support-only conversations (no product/equipment
 * signal) do not create leads — we don't force everyone into a funnel.
 */
export async function upsertLead(payload: Payload, u: LeadUpdate) {
  const c = u.collected;
  const found = await payload.find({
    collection: "leads",
    where: { and: [{ conversation: { equals: u.conversationId } }, { stage: { not_in: ["won", "lost"] } }] },
    sort: "-updatedAt",
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const cur = found.docs[0];
  const hasSignal = Boolean(c.product_interest || c.equipment_type || c.problem || c.area) ||
    ["purchase_intent", "price_inquiry", "product_inquiry", "maintenance_request", "installation_inquiry", "product_comparison"].includes(u.intent);
  if (!cur && !hasSignal) return null;

  const kind: "sales" | "maintenance" = isMaintenanceIntent(u.intent) ? "maintenance" : (cur?.kind as "sales" | "maintenance") ?? "sales";
  const merged = {
    productInterest: keep(c.product_interest, cur?.productInterest),
    area: keep(c.area, cur?.area),
    homeType: keep(c.home_type, cur?.homeType),
    existingSystem: keep(c.existing_system, cur?.existingSystem),
    problem: keep(c.problem, cur?.problem),
    budget: keep(c.budget, cur?.budget),
    equipmentType: keep(c.equipment_type, cur?.equipmentType),
    brandModel: keep(c.brand_model, cur?.brandModel),
    preferredTime: keep(c.preferred_time, cur?.preferredTime),
    address: u.allowAddress ? keep(c.address, cur?.address) : cur?.address ?? undefined,
    offerKey: u.offerKey ?? cur?.offerKey ?? undefined,
  };
  const qualified = isQualified(kind, merged);
  let stage = (cur?.stage as string) ?? "new";
  if (stage === "new" && (merged.productInterest || merged.area || merged.problem)) stage = "qualifying";
  if (qualified && (stage === "new" || stage === "qualifying")) stage = "qualified";

  const data = {
    ...merged,
    kind,
    qualified,
    stage: stage as "new",
    ...(qualified && !cur?.qualified ? { qualifiedAt: new Date().toISOString() } : {}),
    ...(u.customerId ? { customer: u.customerId } : {}),
  };
  if (cur) return payload.update({ collection: "leads", id: cur.id, data, overrideAccess: true });
  return payload.create({
    collection: "leads",
    overrideAccess: true,
    data: { tenant: TENANT_ID, conversation: u.conversationId, ...data },
  });
}

export async function markLeadHandedOff(payload: Payload, leadId: number) {
  const l = await payload.findByID({ collection: "leads", id: leadId, depth: 0, overrideAccess: true });
  if (["won", "lost", "handed-off"].includes(l.stage as string)) return;
  await payload.update({ collection: "leads", id: leadId, data: { stage: "handed-off" }, overrideAccess: true });
}

export async function createAppointmentRequest(
  payload: Payload,
  a: { conversationId: number; leadId?: number | null; customerId?: number | null; kind: "maintenance" | "installation" | "consultation" | "inspection"; requestedWindow?: string; address?: string; details?: string },
) {
  const open = await payload.find({
    collection: "appointments",
    where: { and: [{ conversation: { equals: a.conversationId } }, { status: { equals: "requested" } }] },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  if (open.docs[0]) {
    return payload.update({
      collection: "appointments",
      id: open.docs[0].id,
      overrideAccess: true,
      data: { requestedWindow: a.requestedWindow || open.docs[0].requestedWindow || undefined, address: a.address || open.docs[0].address || undefined },
    });
  }
  return payload.create({
    collection: "appointments",
    overrideAccess: true,
    data: {
      tenant: TENANT_ID,
      conversation: a.conversationId,
      lead: a.leadId ?? undefined,
      customer: a.customerId ?? undefined,
      kind: a.kind,
      status: "requested",
      requestedWindow: a.requestedWindow,
      address: a.address,
      details: a.details,
    },
  });
}

/** Records a question we could not answer so staff can add it to the knowledge base. */
export async function recordGap(payload: Payload, question: string, conversationId: number) {
  const key = question.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim().slice(0, 160);
  if (!key) return;
  const found = await payload.find({ collection: "knowledge-gaps", where: { normalizedKey: { equals: key } }, limit: 1, depth: 0, overrideAccess: true });
  const now = new Date().toISOString();
  if (found.docs[0]) {
    await payload.update({
      collection: "knowledge-gaps",
      id: found.docs[0].id,
      overrideAccess: true,
      data: { count: (found.docs[0].count ?? 1) + 1, lastSeenAt: now, lastConversation: conversationId, status: found.docs[0].status === "answered" ? "open" : found.docs[0].status },
    });
  } else {
    await payload.create({
      collection: "knowledge-gaps",
      overrideAccess: true,
      data: { tenant: TENANT_ID, question: question.slice(0, 300), normalizedKey: key, count: 1, status: "open", lastSeenAt: now, lastConversation: conversationId },
    });
  }
}
