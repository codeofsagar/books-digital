import type { JsonLdBundle } from '@/lib/types';

interface JsonLdSchemaProps {
  bundle: JsonLdBundle | null | undefined;
  // Optional fallback bundle generated locally — used when backend SEO endpoint
  // returns null. Backend always wins when present.
  fallback?: unknown[];
}

// Renders EACH schema object as its own <script type="application/ld+json">,
// per Master SOP §6.4 "multi-tag, never one combined blob". The schema density
// is the AI-search moat — don't strip schemas, don't merge them.
export function JsonLdSchema({ bundle, fallback }: JsonLdSchemaProps) {
  const objects = bundle && bundle.length > 0 ? bundle : fallback ?? [];
  if (objects.length === 0) return null;

  return (
    <>
      {objects.map((obj, i) => (
        <script
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          type="application/ld+json"
          // Schema objects are server-generated trusted JSON — safe to inline.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  );
}
