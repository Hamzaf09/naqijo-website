import type { LocalizedString } from "@/data/product-types";

type MaybeLocalized = Partial<Record<string, string>> | string | null | undefined;

/** Normalize a Payload localized value (from `locale: "all"`) into `{ ar, en }`. */
export function L(value: MaybeLocalized): LocalizedString {
  if (value && typeof value === "object") {
    const ar = value.ar ?? value.en ?? "";
    const en = value.en ?? value.ar ?? "";
    return { ar, en };
  }
  const str = typeof value === "string" ? value : "";
  return { ar: str, en: str };
}

export interface MediaImage {
  src: string;
  width: number;
  height: number;
  alt: LocalizedString;
}

/** Map a populated Payload upload doc into a plain image object. */
export function mapMedia(media: unknown): MediaImage | null {
  if (!media || typeof media !== "object") return null;
  const m = media as Record<string, unknown>;
  if (typeof m.url !== "string") return null;
  return {
    src: m.url,
    width: typeof m.width === "number" ? m.width : 1600,
    height: typeof m.height === "number" ? m.height : 900,
    alt: L(m.alt as MaybeLocalized),
  };
}
