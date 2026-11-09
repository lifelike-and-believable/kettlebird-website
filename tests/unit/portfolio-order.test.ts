// Oldest first in a subfolder: the order of a subfolder's pieces, its place, its grid, full screen, its
// link picture, the editor's words, Preview and the documents. Criteria: docs/specs/portfolio-order.md.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  buildFolders, folderTurnOrder, gridCells, newestPiece, orderPieces, sortPieces, type Subfolder,
} from '../../src/lib/portfolio/folders';
import { SUBFOLDERS_QUERY, type GalleryItem } from '../../src/lib/queries';
import { FIELDS, fieldText, gridHint, listDetail, SUBFOLDER_ORDERS } from '../../sanity-studio/lib/editor-content';

const read = (path: string) => readFileSync(path, 'utf8');
const piece = (id: string, date?: string, subs?: string[], title = id, category = ['commission']): GalleryItem => ({
  _id: id, title, slug: { current: id }, category, date, subfolders: subs,
  image: { asset: { _ref: `image-${id}aaaa-1600x900-jpg` } },
});
const ids = (pieces: GalleryItem[]) => pieces.map((p) => p._id);
const books = (order?: 'newest' | 'oldest', gridSize = 2): Subfolder => ({
  _id: 'bk', name: 'Book covers', slug: { current: 'book-covers' }, section: 'commission', gridSize, ...(order ? { order } : {}),
});

describe('portfolio-order#AC-1 order', () => {
  const mixed = [
    piece('mar', '2025-03-01'), piece('undated-b', undefined, undefined, 'Bee'), piece('may', '2025-05-01'),
    piece('apr-z', '2025-04-01', undefined, 'Zebra'), piece('undated-a', undefined, undefined, 'Ant'), piece('apr-a', '2025-04-01', undefined, 'Apple'),
  ];
  it('puts dated pieces newest first, ties by title, undated last by title', () => {
    expect(ids(orderPieces(mixed, 'newest'))).toEqual(['may', 'apr-a', 'apr-z', 'mar', 'undated-a', 'undated-b']);
    expect(ids(orderPieces(mixed, undefined))).toEqual(ids(orderPieces(mixed, 'newest')));
    expect(ids(sortPieces(mixed))).toEqual(ids(orderPieces(mixed, 'newest')));
  });
  it('puts dated pieces oldest first, ties by title, undated still last by title', () => {
    expect(ids(orderPieces(mixed, 'oldest'))).toEqual(['mar', 'apr-a', 'apr-z', 'may', 'undated-a', 'undated-b']);
  });
  it("doesn't change the list it's given", () => {
    const copy = [...mixed];
    orderPieces(mixed, 'oldest');
    expect(mixed).toEqual(copy);
  });
  it('orders pieces that are all undated by title in both orders', () => {
    const undated = [piece('c', undefined, undefined, 'Cat'), piece('a', undefined, undefined, 'Ant')];
    expect(ids(orderPieces(undated, 'newest'))).toEqual(['a', 'c']);
    expect(ids(orderPieces(undated, 'oldest'))).toEqual(['a', 'c']);
  });
  it('the newest piece is the first newest first', () => {
    expect(newestPiece(mixed)?._id).toBe('may');
    expect(newestPiece([])).toBeUndefined();
  });
});

describe('portfolio-order#AC-2 AC-4 folders', () => {
  const items = [
    piece('h', '2025-05-01', ['bk'], 'Harbour Cover'),
    piece('o', '2025-04-01', ['bk'], 'Orchard Cover'),
    piece('s', '2025-04-15', undefined, 'Shopfront'),
    piece('old', '2024-01-01', undefined, 'Old'),
  ];
  it('keeps the section newest first, the subfolder where its newest piece would be, whatever its order', () => {
    for (const order of [undefined, 'newest', 'oldest'] as const) {
      const [clients] = buildFolders(items, [books(order)]);
      expect(clients.entries.map((e) => (e.kind === 'piece' ? e.item._id : e.subfolder._id)), String(order)).toEqual(['bk', 's', 'old']);
      expect(ids(clients.loose)).toEqual(['s', 'old']);
    }
  });
  it("holds the subfolder's pieces in its own order", () => {
    const [newest] = buildFolders(items, [books('newest')]);
    expect(ids(newest.subfolders[0].pieces)).toEqual(['h', 'o']);
    const [oldest] = buildFolders(items, [books('oldest')]);
    expect(ids(oldest.subfolders[0].pieces)).toEqual(['o', 'h']);
    const entry = oldest.entries[0];
    expect(entry.kind === 'subfolder' && ids(entry.pieces)).toEqual(['o', 'h']);
    const [unset] = buildFolders(items, [books()]);
    expect(ids(unset.subfolders[0].pieces)).toEqual(['h', 'o']);
  });
  it('turns through an open oldest-first subfolder in its order', () => {
    const [oldest] = buildFolders(items, [books('oldest')]);
    expect(ids(folderTurnOrder(oldest, 'bk'))).toEqual(['o', 'h']);
    expect(ids(folderTurnOrder(oldest))).toEqual(['s', 'old']);
  });
  it('places a subfolder of undated pieces by its first title among the undated, in either order', () => {
    const undated = [
      piece('z', undefined, ['bk'], 'Zed'), piece('b', undefined, ['bk'], 'Bee'),
      piece('c', undefined, undefined, 'Cat'), piece('d', '2025-01-01', undefined, 'Dated'),
    ];
    for (const order of ['newest', 'oldest'] as const) {
      const [clients] = buildFolders(undated, [books(order)]);
      expect(clients.entries.map((e) => (e.kind === 'piece' ? e.item._id : e.subfolder._id))).toEqual(['d', 'bk', 'c']);
      expect(ids(clients.subfolders[0].pieces)).toEqual(['b', 'z']);
    }
  });
});

describe('portfolio-order#AC-3 grid', () => {
  it("shows an oldest-first subfolder's oldest pieces, and counts them all", () => {
    const twelve = Array.from({ length: 12 }, (_, i) => piece(`p${i + 1}`, `2025-${String(i + 1).padStart(2, '0')}-01`, ['bk']));
    const [clients] = buildFolders(twelve, [books('oldest', 3)]);
    const { pieces } = clients.subfolders[0];
    expect(pieces).toHaveLength(12);
    expect(gridCells(pieces, 3, false).map((p) => p?._id)).toEqual(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9']);
    expect(gridCells(pieces, 3, true).map((p) => p?._id)).toEqual(['p1', 'p2', 'p3', 'p4']);
    const [newest] = buildFolders(twelve, [books('newest', 3)]);
    expect(gridCells(newest.subfolders[0].pieces, 3, false)[0]?._id).toBe('p12');
  });
});

describe('portfolio-order#AC-5 link picture', () => {
  it("keeps the subfolder page's link picture its newest piece", () => {
    const page = read('src/components/pages/PortfolioPage.astro');
    expect(page).toMatch(/newestPiece\(opened\.pieces\)/);
    expect(page).not.toMatch(/opened\.pieces\[0\]/);
  });
});

describe('portfolio-order#AC-6 AC-7 editor', () => {
  it('adds Order of pieces after Grid size, with its two choices and help', () => {
    expect(Object.keys(FIELDS.portfolioSubfolder)).toEqual(['name', 'slug', 'section', 'gridSize', 'order']);
    expect(fieldText('portfolioSubfolder', 'order')).toEqual({
      title: 'Order of pieces',
      description: "The order its pieces show in when it's open, and which of them its thumbnail shows. Pieces without a date come last.",
    });
    expect(SUBFOLDER_ORDERS).toEqual([
      { title: 'Newest first', value: 'newest' },
      { title: 'Oldest first', value: 'oldest' },
    ]);
    const schema = read('sanity-studio/schemas/objects/portfolioSubfolder.ts');
    expect(schema).toMatch(/name: 'order'/);
    expect(schema).toMatch(/SUBFOLDER_ORDERS/);
    expect(schema).toMatch(/initialValue: 'newest'/);
    expect(schema.indexOf("name: 'order'")).toBeGreaterThan(schema.indexOf("name: 'gridSize'"));
  });
  it('names Oldest first in the list row only when set', () => {
    expect(listDetail('portfolioSubfolder', { section: 'fanart', gridSize: 2, count: 4, order: 'oldest' })).toBe('Fan Work · 2 × 2 · 4 pieces · Oldest first');
    expect(listDetail('portfolioSubfolder', { section: 'fanart', gridSize: 2, count: 4, order: 'newest' })).toBe('Fan Work · 2 × 2 · 4 pieces');
    expect(listDetail('portfolioSubfolder', { section: 'fanart', gridSize: 2, count: 4 })).toBe('Fan Work · 2 × 2 · 4 pieces');
  });
  it('words Grid size, its hint and the Date help for the order', () => {
    expect(FIELDS.portfolioSubfolder.gridSize.help).toBe(
      'How many of its pieces its thumbnail shows, starting from the first in its order. Computers show at most 3 × 3, phones 2 × 2.',
    );
    expect(gridHint('Murderbot', 12, 3)).toBe('Murderbot has 12 pieces: 3 × 3 shows the first 9.');
    expect(FIELDS.galleryItem.date.help).toBe(
      'When you made it. The portfolio shows newest first, except in a subfolder set to oldest first; pieces without a date come last.',
    );
  });
});

describe('portfolio-order#AC-8 query and preview', () => {
  it("fetches each subfolder's order", () => {
    expect(SUBFOLDERS_QUERY).toMatch(/\border\b/);
  });
  it("previews a subfolder's draft order", async () => {
    const { fixtureSource, loadPreview } = await import('../../src/lib/preview/load');
    const published = [
      { _id: 'bk', _type: 'portfolioSubfolder', name: 'Book covers', slug: { current: 'book-covers' }, section: 'commission', gridSize: 2 },
      { _id: 'h', _type: 'galleryItem', title: 'Harbour Cover', date: '2025-05-01', category: ['commission'], subfolders: [{ _type: 'reference', _ref: 'bk', _weak: true, _key: 'a' }] },
      { _id: 'o', _type: 'galleryItem', title: 'Orchard Cover', date: '2025-04-01', category: ['commission'], subfolders: [{ _type: 'reference', _ref: 'bk', _weak: true, _key: 'a' }] },
    ];
    const drafts = [{ ...published[0], _id: 'drafts.bk', order: 'oldest' }];
    const source = fixtureSource({ key: 'k', published, drafts });
    const result = await loadPreview('portfolioSubfolder', 'bk', new URL('https://example.test/x?sanity-preview-secret=k'), source);
    const model = result!.model as { items: GalleryItem[]; subfolders: Subfolder[] };
    expect(model.subfolders.find((s) => s._id === 'bk')?.order).toBe('oldest');
    const [clients] = buildFolders(model.items, model.subfolders);
    expect(ids(clients.subfolders[0].pieces)).toEqual(['o', 'h']);
  });
});

describe('portfolio-order#AC-9 documents', () => {
  it("Star's guide has Order of pieces and the new words", () => {
    const guide = read('docs/user/editing-your-site.md');
    expect(guide).toMatch(/\| \*\*Order of pieces\*\* \|/);
    expect(guide).toContain('a grid of its first pieces');
    expect(guide).toContain('starting from the first in its order');
    expect(guide).toContain('The portfolio shows newest first, except in a subfolder set to oldest first; pieces without a date come last.');
    expect(guide).not.toContain('a grid of its newest pieces');
  });
  it("the fans' guide says a subfolder can run from the oldest", () => {
    const guide = read('docs/user/viewing-artwork.md');
    expect(guide).toContain('one square of its first pieces');
    expect(guide).toContain('Its pieces run newest first, or from the oldest where Star has chosen that, so a story reads from its start.');
  });
  it('the folders design notes the change', () => {
    const subfolders = read('docs/design/portfolio-folders.md').split('### Subfolders')[1].split('\n### ')[0];
    expect(subfolders).toMatch(/design-portfolio-order/);
  });
});
