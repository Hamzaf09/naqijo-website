import type { Where } from "payload";
import { getPayloadClient } from "@/lib/payload/client";
import { L } from "@/lib/payload/map";
import type { LocalizedString } from "@/data/product-types";

export interface Faq {
  question: LocalizedString;
  answer: LocalizedString;
  category: string;
}

/** Published FAQs, ordered. Optionally filtered by category. */
export async function getFaqs(category?: string): Promise<Faq[]> {
  const payload = await getPayloadClient();
  const where: Where[] = [{ _status: { equals: "published" } }];
  if (category) where.push({ category: { equals: category } });

  const res = await payload.find({
    collection: "faqs",
    locale: "all",
    where: { and: where },
    sort: "order",
    limit: 200,
    depth: 0,
  });
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return res.docs.map((doc: any) => ({
    question: L(doc.question),
    answer: L(doc.answer),
    category: String(doc.category || "general"),
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
