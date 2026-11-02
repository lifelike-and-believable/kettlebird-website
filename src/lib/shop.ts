// The shop's sections, in order, with their headings (content-editing-organised-editor AC-9). The
// editor offers the same sections (sanity-studio/lib/editor-content.ts, SHOP_SECTION_OPTIONS).
export interface ShopSection { value: string; heading: string }

export const SHOP_SECTIONS: ShopSection[] = [
  { value: 'print', heading: 'Prints' },
  { value: 'sticker', heading: 'Stickers' },
  { value: 'digital', heading: 'Digital' },
];

/** Products grouped under their section's heading, in section order; others aren't listed. */
export function shopSections<P extends { category?: string }>(products: P[]): { heading: string; products: P[] }[] {
  return SHOP_SECTIONS.map(({ value, heading }) => ({ heading, products: products.filter((p) => p.category === value) }))
    .filter((section) => section.products.length > 0);
}
