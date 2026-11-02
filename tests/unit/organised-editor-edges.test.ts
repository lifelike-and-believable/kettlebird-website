// Edge cases for the organised editor's text and helpers, added after mutation testing.
// Criteria: docs/specs/content-editing-organised-editor.md.
import { describe, expect, it } from 'vitest';
import { isItemType, ITEM_TYPES, listDetail, missingFields, requiredMessage } from '../../sanity-studio/lib/editor-content';

describe('content-editing-organised-editor#AC-2 list details: edge cases', () => {
  it('ignores values it can\'t show', () => {
    expect(listDetail('galleryItem', { category: 'original' })).toBeUndefined();
    expect(listDetail('galleryItem', { category: ['unknown', 'original'] })).toBe('Original Work');
    expect(listDetail('galleryItem', { category: ['unknown'] })).toBeUndefined();
    expect(listDetail('galleryItem', { category: ['wip', 'original'] })).toBe('Original Work, Work in Progress');
    expect(listDetail('writtenWork', { publishDate: 20261031 })).toBeUndefined();
    expect(listDetail('writtenWork', {})).toBeUndefined();
    expect(listDetail('commissionType', { priceRange: '' })).toBeUndefined();
    expect(listDetail('commissionType', { priceRange: 80 })).toBeUndefined();
  });
});

describe('content-editing-organised-editor#AC-5 AC-6 what\'s missing: edge cases', () => {
  it('finds the empty required fields from validation paths, in form order', () => {
    expect(missingFields('galleryItem', [['category'], ['title', 'x'], ['altText'], [0], []])).toEqual(['title', 'category']);
    expect(missingFields('product', [['price'], ['category']])).toEqual(['category']);
    expect(missingFields('writtenWork', [])).toEqual([]);
  });
  it('refuses a field it doesn\'t know', () => {
    expect(() => requiredMessage('product', 'colour')).toThrow("product.colour isn't required");
  });
});

describe('content-editing-organised-editor#AC-11 the kinds of item', () => {
  it('organises the five kinds of item, and not chapters', () => {
    expect(ITEM_TYPES).toEqual(['comicSeries', 'galleryItem', 'writtenWork', 'product', 'commissionType']);
    expect(isItemType('product')).toBe(true);
    expect(isItemType('comicChapter')).toBe(false);
    expect(isItemType('')).toBe(false);
  });
});
