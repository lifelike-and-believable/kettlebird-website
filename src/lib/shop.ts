// Stub for the tests-first commit; see docs/specs/content-editing-organised-editor.md (AC-9).
export interface ShopSection { value: string; heading: string }
export const SHOP_SECTIONS: ShopSection[] = [{ value: 'stub', heading: 'stub' }];
export function shopSections<P extends { category?: string }>(_products: P[]): { heading: string; products: P[] }[] {
  return [{ heading: 'stub', products: [] }];
}
