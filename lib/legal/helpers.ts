import type { LegalBlock, LegalInline } from "@/lib/legal/types";

export function inline(text: string, options?: Omit<LegalInline, "text">): LegalInline {
  return { text, ...options };
}

export function paragraph(...content: LegalInline[]): LegalBlock {
  return { type: "paragraph", content };
}

export function listItem(...content: LegalInline[]): LegalInline[] {
  return content;
}

export function labeledItem(label: string, value: string): LegalInline[] {
  return [inline(label, { bold: true }), inline(` : ${value}`)];
}

export function plainParagraph(text: string): LegalBlock {
  return paragraph(inline(text));
}

export function plainList(items: string[]): LegalBlock {
  return {
    type: "list",
    items: items.map((item) => [inline(item)]),
  };
}
