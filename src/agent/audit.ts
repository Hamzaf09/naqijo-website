import type { Payload } from "payload";
import { TENANT_ID } from "./config";

export interface AuditEntry {
  action: string;
  actorType: "staff" | "ai" | "system" | "webhook";
  actor?: number | string | null;
  entity?: string;
  entityId?: string | number;
  detail?: Record<string, unknown>;
}

/** Best-effort audit trail: an audit failure must never break customer handling. */
export async function audit(payload: Payload, e: AuditEntry): Promise<void> {
  try {
    await payload.create({
      collection: "audit-logs",
      overrideAccess: true,
      data: {
        tenant: TENANT_ID,
        action: e.action,
        actorType: e.actorType,
        actor: e.actor ? Number(e.actor) : undefined,
        entity: e.entity,
        entityId: e.entityId !== undefined ? String(e.entityId) : undefined,
        detail: e.detail as never,
      },
    });
  } catch (err) {
    payload.logger.error({ err, action: e.action }, "audit log write failed");
  }
}
