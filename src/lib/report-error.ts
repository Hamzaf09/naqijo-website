/**
 * Central error reporter — the single hook point for an external error service.
 * Logs server-side today; wire Sentry/Datadog here (guarded by SENTRY_DSN) when
 * you want remote reporting, without touching call sites.
 */
export function reportError(error: unknown, context?: Record<string, unknown>): void {
  console.error("[naqijo]", error, context ?? "");
}
