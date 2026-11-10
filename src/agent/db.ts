import type { Payload } from "payload";
import { getPayloadClient } from "@/lib/payload/client";

export type { Payload };
export const getDb = (): Promise<Payload> => getPayloadClient();

/** Payload `create`/`update` options for trusted server-side writes (no user session). */
export const SYSTEM = { overrideAccess: true } as const;
