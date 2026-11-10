import { graphHost, graphVersion } from "../config";
import type { MetaChannel } from "../types";

/** Error from the Meta Graph API with a retry classification. */
export class GraphError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: number,
    readonly subcode?: number,
    readonly retryable = false,
  ) {
    super(message);
    this.name = "GraphError";
  }
}

/** Graph/WhatsApp error codes that are transient (throttling, temporary failures). */
const RETRYABLE_CODES = new Set([1, 2, 4, 17, 32, 341, 368, 613, 80007, 130429, 131000, 131016, 133016]);

export function isRetryable(status: number, code?: number): boolean {
  if (status === 0 || status === 408 || status === 429 || status >= 500) return true;
  return code !== undefined && RETRYABLE_CODES.has(code);
}

type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;
let httpFetch: FetchLike = (url, init) => fetch(url, init);

/** Test seam: replace the HTTP client (never used in production code paths). */
export function setHttpClient(f: FetchLike | null): void {
  httpFetch = f ?? ((url, init) => fetch(url, init));
}

export function graphUrl(channel: MetaChannel, path: string): string {
  return `${graphHost(channel)}/${graphVersion()}/${path.replace(/^\/+/, "")}`;
}

export async function graphRequest<T = Record<string, unknown>>(
  channel: MetaChannel,
  method: "GET" | "POST",
  path: string,
  token: string,
  body?: unknown,
): Promise<T> {
  let res: Response;
  try {
    res = await httpFetch(graphUrl(channel, path), {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    throw new GraphError(`network error: ${(err as Error).message}`, 0, undefined, undefined, true);
  }
  const json = (await res.json().catch(() => ({}))) as {
    error?: { message?: string; code?: number; error_subcode?: number; error_data?: { details?: string } };
  } & Record<string, unknown>;
  if (!res.ok || json.error) {
    const e = json.error ?? {};
    const detail = e.error_data?.details ? ` — ${e.error_data.details}` : "";
    throw new GraphError(
      `${e.message ?? `HTTP ${res.status}`}${detail}`,
      res.status,
      e.code,
      e.error_subcode,
      isRetryable(res.status, e.code),
    );
  }
  return json as T;
}
