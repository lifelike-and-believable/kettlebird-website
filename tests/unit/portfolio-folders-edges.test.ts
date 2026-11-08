// Edges of the portfolio folders' logic, found by mutation testing: equal dates, the arrows' exact
// boundaries, pieces with no section or picture, a subfolder with no web address, and the editor's
// choices across every section. Criteria: docs/specs/portfolio-folders.md.
import { describe, expect, it } from 'vitest';
import { gridHint, subfolderChoices, subfolderProblems } from '../../sanity-studio/lib/editor-content';
import { arrowsUsable, buildFolders, folderTurnOrder, pieceWidth, sortPieces, subfolderPath, type Subfolder } from '../../src/lib/portfolio/folders';
import type { GalleryItem } from '../../src/lib/queries';

const piece = (id: string, date?: string, extra: Partial<GalleryItem> = {}): GalleryItem => ({
  _id: id, title: id, slug: { current: id }, category: ['fanart'], date,
  image: { asset: { _ref: `image-${id}aaaa-1600x900-jpg` } }, ...extra,
});

describe('portfolio-folders#AC-4 order edges', () => {
  it('keeps pieces with the same date in the order given, whichever order they come in', () => {
    expect(sortPieces([piece('a', '2025-01-01'), piece('b', '2025-01-01')]).map((p) => p._id)).toEqual(['a', 'b']);
    expect(sortPieces([piece('b', '2025-01-01'), piece('a', '2025-01-01')]).map((p) => p._id)).toEqual(['b', 'a']);
  });
  it('puts the newer first from either side', () => {
    expect(sortPieces([piece('old', '2024-01-01'), piece('new', '2025-01-01')]).map((p) => p._id)).toEqual(['new', 'old']);
    expect(sortPieces([piece('new', '2025-01-01'), piece('old', '2024-01-01')]).map((p) => p._id)).toEqual(['new', 'old']);
    expect(sortPieces([piece('x'), piece('d', '2020-01-01')]).map((p) => p._id)).toEqual(['d', 'x']);
  });
  it('leaves out a piece with no section', () => {
    expect(buildFolders([piece('a', undefined, { category: undefined })], [])).toEqual([]);
  });
});

describe('portfolio-folders#AC-3 AC-15 pictures edges', () => {
  it('a piece with no picture is square at the row height and not turned through', () => {
    const none = piece('n', '2025-01-01', { image: undefined as unknown as GalleryItem['image'] });
    const noAsset = piece('m', '2025-01-01', { image: {} as unknown as GalleryItem['image'] });
    expect(pieceWidth(none, 200)).toBe(200);
    expect(pieceWidth(noAsset, 200)).toBe(200);
    const [fan] = buildFolders([none, noAsset, piece('p', '2025-01-01')], []);
    expect(folderTurnOrder(fan).map((p) => p._id)).toEqual(['p']);
  });
});

describe('portfolio-folders#AC-5 arrows edges', () => {
  it('a pixel from either end still counts as the end', () => {
    expect(arrowsUsable({ scrollLeft: 1, scrollWidth: 2000, clientWidth: 800 })).toEqual({ left: false, right: true });
    expect(arrowsUsable({ scrollLeft: 1199, scrollWidth: 2000, clientWidth: 800 })).toEqual({ left: true, right: false });
  });
});

describe('portfolio-folders#AC-12 address edges', () => {
  it('has no address without a web address', () => {
    const noSlug = { _id: 's', name: 'X', section: 'fanart' } as Subfolder;
    expect(subfolderPath(noSlug)).toBeUndefined();
  });
});

describe('portfolio-folders#AC-18 AC-20 editor edges', () => {
  it('says what a grid shows, from fewer pieces than cells to more', () => {
    expect(gridHint('A', 2, 2)).toBe('A has 2 pieces: 2 × 2 shows them all.');
    expect(gridHint('A', 5, 2)).toBe('A has 5 pieces: 2 × 2 shows the newest 4.');
    expect(gridHint('A', 1, 3)).toBe('A has 1 piece: 3 × 3 shows it, with 8 empty cells.');
  });
  it('offers a choice for every section the piece is in, in the portfolio order', () => {
    const all = ['wip', 'commission', 'fanart', 'original', 'featured'];
    expect(subfolderChoices(all, [], []).map((c) => c.title)).toEqual(['Featured', 'Original Work', 'Fan Work', 'Past Clients', 'Work in Progress']);
  });
  it('allows one subfolder in each of two sections', () => {
    expect(subfolderProblems(['fanart', 'commission'], [{ name: 'A', section: 'fanart' }, { name: 'B', section: 'commission' }])).toBeUndefined();
  });
});
