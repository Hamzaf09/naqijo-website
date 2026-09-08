/**
 * Renders one or more JSON-LD blocks as <script type="application/ld+json">.
 * Server component — the JSON is serialized at render time, never on the client.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Data is built from trusted, static repo config — no user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
