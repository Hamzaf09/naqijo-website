import { getPayload, type Payload } from "payload";
import config from "@payload-config";

let cached: Promise<Payload> | null = null;

/** Memoized Payload local-API client for use in server components / data access. */
export function getPayloadClient(): Promise<Payload> {
  if (!cached) cached = getPayload({ config });
  return cached;
}
