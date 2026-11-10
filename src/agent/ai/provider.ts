import type { Classification } from "../classifier";
import type { KbItem } from "../knowledge";
import type { AiTurn, Collected, Lang } from "../types";

export interface TurnInput {
  lang: Lang;
  classification: Classification;
  /** Latest customer text (possibly several rapid messages joined). */
  latest: string;
  history: { role: "user" | "assistant"; content: string }[];
  context: KbItem[];
  /** What we already know — never re-ask these. */
  known: Partial<Collected>;
  consent: "unknown" | "requested" | "granted" | "declined";
  isFirstReply: boolean;
  /** Feedback from the guard on a previous attempt (regeneration). */
  correction?: string[];
}

export interface AiProvider {
  readonly name: string;
  generate(input: TurnInput): Promise<AiTurn>;
}
