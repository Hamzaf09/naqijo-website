import type { SerializedEditorState } from "lexical";

/**
 * Wrap plain, paragraph-separated text into a minimal Lexical editor state that
 * Payload's <RichText /> renderer accepts. Lets static content power the same
 * detail-page components that previously rendered CMS rich text — with no
 * component changes.
 */
export function toRichText(
  text: string,
  direction: "ltr" | "rtl" = "ltr",
): SerializedEditorState {
  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction,
      children: paragraphs.map((p) => ({
        type: "paragraph",
        version: 1,
        format: "",
        indent: 0,
        direction,
        textFormat: 0,
        children: [
          {
            type: "text",
            version: 1,
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: p,
          },
        ],
      })),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any as SerializedEditorState;
}
