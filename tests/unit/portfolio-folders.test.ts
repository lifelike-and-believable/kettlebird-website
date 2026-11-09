// The portfolio as folders, with subfolders: the pure logic of the page (rows, order, grids, tabs,
// addresses, history, arrows, full screen). Criteria: docs/specs/portfolio-folders.md.
import { describe, expect, it } from 'vitest';
import {
  arrowsUsable, buildFolders, FOLDERS, folderBySlug, gridCells, indexAction, openAnnouncement, pieceWidth, piecesCount,
  rowHeight, subfolderDescription, subfolderLinkName, subfolderPath, subfolderPaths, subfolderTitle, tabLabel,
  folderTurnOrder, type Subfolder,
} from '../../src/lib/portfolio/folders';
import { countLabel } from '../../src/lib/portfolio/full-screen';
import type { GalleryItem } from '../../src/lib/queries';

const piece = (id: string, o: Partial<GalleryItem> & { subs?: string[] } = {}): GalleryItem => ({
  _id: id,
  title: o.title ?? id,
  slug: { current: id },
  image: { asset: { _ref: `image-${id}aaaa-1600x900-jpg` } },
  category: o.category ?? ['fanart'],
  date: o.date,
  subfolders: o.subs,
  ...('image' in o ? { image: o.image as GalleryItem['image'] } : {}),
});
const sub = (id: string, name: string, section = 'fanart', gridSize = 2, slug = name.toLowerCase()): Subfolder => ({
  _id: id, name, slug: { current: slug }, section, gridSize,
});

describe('portfolio-folders#AC-1 folders', () => {
  it('has the five sections in order, with their address parts and fixed tab sides', () => {
    expect(FOLDERS.map((f) => [f.value, f.title, f.slug, f.side])).toEqual([
      ['featured', 'Featured', 'featured', 'right'],
      ['original', 'Original Work', 'original-work', 'left'],
      ['fanart', 'Fan Work', 'fan-work', 'right'],
      ['commission', 'Past Clients', 'past-clients', 'left'],
      ['wip', 'Work in Progress', 'work-in-progress', 'right'],
    ]);
    expect(folderBySlug('fan-work')?.value).toBe('fanart');
    expect(folderBySlug('fanart')).toBeUndefined();
  });
  it('shows one folder per section with pieces, in order, keeping each side', () => {
    const items = [piece('a', { category: ['wip'] }), piece('b', { category: ['original', 'featured'] })];
    const folders = buildFolders(items, []);
    expect(folders.map((f) => [f.folder.value, f.folder.side])).toEqual([['featured', 'right'], ['original', 'left'], ['wip', 'right']]);
  });
  it('shows no folders with no pieces, and ignores unknown sections', () => {
    expect(buildFolders([], [])).toEqual([]);
    expect(buildFolders([piece('a', { category: ['other'] })], [])).toEqual([]);
  });
});

describe('portfolio-folders#AC-3 row height', () => {
  // At most 240 since portfolio-size AC-1 (it was 480).
  it('is 9/16 of the width, rounded, at most 240', () => {
    expect(rowHeight(390)).toBe(219);
    expect(rowHeight(320)).toBe(180);
    expect(rowHeight(427)).toBe(240);
    expect(rowHeight(1280)).toBe(240);
    expect(rowHeight(0)).toBe(0);
  });
  it('gives a piece its own width at the row height, from the asset size', () => {
    expect(pieceWidth(piece('a'), 219)).toBe(389);
    expect(pieceWidth(piece('p', { image: { asset: { _ref: 'image-paaaa-1200x1600-png' } } }), 200)).toBe(150);
    expect(pieceWidth(piece('w', { image: { asset: { _ref: 'image-waaaa-2100x700-jpg' } } }), 200)).toBe(600);
    // Unknown size: square.
    expect(pieceWidth(piece('u', { image: { asset: { _ref: 'odd' } } }), 200)).toBe(200);
  });
});

describe('portfolio-folders#AC-4 AC-22 order', () => {
  it('puts the newest first, undated last in title order, a subfolder where its newest piece would be', () => {
    const items = [
      piece('old', { date: '2024-01-01' }),
      piece('m1', { date: '2025-03-01', subs: ['s-mb'] }),
      piece('new', { date: '2025-06-01' }),
      piece('m2', { date: '2024-06-01', subs: ['s-mb'] }),
      piece('zed', { title: 'Zed' }),
      piece('abe', { title: 'Abe' }),
    ];
    const [fan] = buildFolders(items, [sub('s-mb', 'Murderbot')]);
    expect(fan.entries.map((e) => (e.kind === 'piece' ? e.item._id : `sub:${e.subfolder.name}`))).toEqual(['new', 'sub:Murderbot', 'old', 'abe', 'zed']);
    expect(fan.loose.map((p) => p._id)).toEqual(['new', 'old', 'abe', 'zed']);
    expect(fan.subfolders[0].pieces.map((p) => p._id)).toEqual(['m1', 'm2']);
  });
  it('keeps a piece in a subfolder in one section and loose in another', () => {
    const items = [piece('m', { category: ['fanart', 'featured'], subs: ['s-mb'] })];
    const [featured, fan] = buildFolders(items, [sub('s-mb', 'Murderbot')]);
    expect(featured.entries.map((e) => e.kind)).toEqual(['piece']);
    expect(fan.entries.map((e) => e.kind)).toEqual(['subfolder']);
  });
  it('treats a reference to a missing subfolder, or one in a section the piece is not in, as loose', () => {
    const items = [piece('a', { subs: ['gone'] }), piece('b', { subs: ['s-pc'] })];
    const [fan] = buildFolders(items, [sub('s-pc', 'Books', 'commission')]);
    expect(fan.entries.map((e) => e.kind)).toEqual(['piece', 'piece']);
  });
  it('leaves out a subfolder with no pieces', () => {
    const folders = buildFolders([piece('a')], [sub('s-mb', 'Murderbot')]);
    expect(folders[0].subfolders).toEqual([]);
  });
  it('orders two subfolders by their newest pieces', () => {
    const items = [piece('a', { date: '2025-01-01', subs: ['s1'] }), piece('b', { date: '2025-02-01', subs: ['s2'] })];
    const [fan] = buildFolders(items, [sub('s1', 'One'), sub('s2', 'Two')]);
    expect(fan.entries.map((e) => (e.kind === 'subfolder' ? e.subfolder.name : ''))).toEqual(['Two', 'One']);
  });
});

describe('portfolio-folders#AC-8 grid', () => {
  const four = ['a', 'b', 'c', 'd'].map((id) => piece(id));
  it('fills the grid with the newest pieces, then empty cells', () => {
    expect(gridCells(four, 3, false).map((p) => p?._id ?? null)).toEqual(['a', 'b', 'c', 'd', null, null, null, null, null]);
    expect(gridCells(four, 2, false).map((p) => p?._id)).toEqual(['a', 'b', 'c', 'd']);
    expect(gridCells([...four, piece('e')], 2, false)).toHaveLength(4);
  });
  it('shows at most 2 × 2 on a phone', () => {
    expect(gridCells(four, 4, true)).toHaveLength(4);
    expect(gridCells(four.slice(0, 1), 3, true).map((p) => p?._id ?? null)).toEqual(['a', null, null, null]);
  });
  it('treats a missing or odd grid size as 2 × 2', () => {
    expect(gridCells(four, undefined, false)).toHaveLength(4);
    expect(gridCells(four, 7, false)).toHaveLength(4);
  });
  it('names the link with its count', () => {
    expect(subfolderLinkName('Murderbot', 4)).toBe('Murderbot, 4 pieces');
    expect(subfolderLinkName('Books', 1)).toBe('Books, 1 piece');
    expect(piecesCount(0)).toBe('0 pieces');
  });
});

describe('portfolio-folders#AC-9 AC-10 tab', () => {
  it('reads the folder, then the subfolder when one is open', () => {
    expect(tabLabel('Fan Work')).toBe('Fan Work');
    expect(tabLabel('Fan Work', 'Murderbot')).toBe('Fan Work: Murderbot');
  });
  it('announces the open subfolder', () => {
    expect(openAnnouncement('Fan Work', 'Murderbot', 4)).toBe('Fan Work: Murderbot, 4 pieces.');
    expect(openAnnouncement('Fan Work', undefined, 12)).toBe('Fan Work, 12 pieces.');
  });
});

describe('portfolio-folders#AC-12 addresses', () => {
  it('builds a subfolder address from the folder part and its web address', () => {
    expect(subfolderPath(sub('s', 'Murderbot'))).toBe('/portfolio/fan-work/murderbot');
    expect(subfolderPath(sub('s', 'Books', 'commission', 2, 'book-covers'))).toBe('/portfolio/past-clients/book-covers');
    expect(subfolderPath(sub('s', 'X', 'nowhere'))).toBeUndefined();
  });
  it('builds a page for each subfolder with published pieces, and none for empty ones', () => {
    const items = [piece('a', { subs: ['s1'] })];
    expect(subfolderPaths(items, [sub('s1', 'Murderbot'), sub('s2', 'Empty')])).toEqual([{ folder: 'fan-work', subfolder: 'murderbot' }]);
  });
  it('skips a subfolder without a web address', () => {
    const odd = { ...sub('s1', 'Murderbot'), slug: undefined } as unknown as Subfolder;
    expect(subfolderPaths([piece('a', { subs: ['s1'] })], [odd])).toEqual([]);
  });
});

describe('portfolio-folders#AC-13 history', () => {
  it('goes back when the entry before is the top level, else replaces', () => {
    expect(indexAction(true)).toBe('back');
    expect(indexAction(false)).toBe('replace');
  });
});

describe('portfolio-folders#AC-14 subfolder page', () => {
  it('has its title and description', () => {
    expect(subfolderTitle('Murderbot', 'Fan Work')).toBe('Murderbot · Fan Work · Portfolio • Kettlebird Creations');
    expect(subfolderDescription('Murderbot', 'Fan Work', 4)).toBe("Star's Murderbot pieces, in Fan Work: 4 pieces.");
    expect(subfolderDescription('Books', 'Past Clients', 1)).toBe("Star's Books pieces, in Past Clients: 1 piece.");
  });
});

describe('portfolio-folders#AC-5 arrows', () => {
  it("can't scroll left at the start or right at the end", () => {
    expect(arrowsUsable({ scrollLeft: 0, scrollWidth: 2000, clientWidth: 800 })).toEqual({ left: false, right: true });
    expect(arrowsUsable({ scrollLeft: 600, scrollWidth: 2000, clientWidth: 800 })).toEqual({ left: true, right: true });
    expect(arrowsUsable({ scrollLeft: 1200, scrollWidth: 2000, clientWidth: 800 })).toEqual({ left: true, right: false });
  });
  it('allows a pixel of rounding at either end', () => {
    expect(arrowsUsable({ scrollLeft: 0.6, scrollWidth: 2000, clientWidth: 800 })).toEqual({ left: false, right: true });
    expect(arrowsUsable({ scrollLeft: 1199.4, scrollWidth: 2000, clientWidth: 800 })).toEqual({ left: true, right: false });
    expect(arrowsUsable({ scrollLeft: 2, scrollWidth: 2000, clientWidth: 800 })).toEqual({ left: true, right: true });
  });
  it('a row that fits can use neither', () => {
    expect(arrowsUsable({ scrollLeft: 0, scrollWidth: 800, clientWidth: 800 })).toEqual({ left: false, right: false });
  });
});

describe('portfolio-folders#AC-15 full screen', () => {
  const items = [
    piece('a', { date: '2025-05-01' }),
    piece('m1', { date: '2025-04-01', subs: ['s'] }),
    piece('b', { date: '2025-03-01' }),
    piece('m2', { date: '2025-02-01', subs: ['s'] }),
    piece('nopic', { date: '2025-01-01', image: undefined as unknown as GalleryItem['image'] }),
  ];
  const [fan] = buildFolders(items, [sub('s', 'Murderbot')]);
  it('turns through the loose pieces with a picture, in the row order', () => {
    expect(folderTurnOrder(fan).map((p) => p._id)).toEqual(['a', 'b']);
  });
  it("turns through an open subfolder's pieces", () => {
    expect(folderTurnOrder(fan, 's').map((p) => p._id)).toEqual(['m1', 'm2']);
    expect(folderTurnOrder(fan, 'missing')).toEqual([]);
  });
  it("counts with the subfolder's or the folder's name", () => {
    expect(countLabel(2, 4, 'Murderbot')).toBe('3 of 4 · Murderbot');
    expect(countLabel(2, 12, 'Fan Work')).toBe('3 of 12 · Fan Work');
  });
});

describe('portfolio-folders#AC-23 preview', () => {
  it('previews a subfolder open, drafts included, and a piece in its subfolder', async () => {
    const { fixtureSource, loadPreview } = await import('../../src/lib/preview/load');
    const { FIXTURE_PREVIEW_KEY, FIXTURE_PUBLISHED, FIXTURE_DRAFTS } = await import('../fixtures/drafts');
    const source = fixtureSource({ key: FIXTURE_PREVIEW_KEY, published: FIXTURE_PUBLISHED, drafts: FIXTURE_DRAFTS });
    const url = new URL(`https://example.test/x?sanity-preview-secret=${FIXTURE_PREVIEW_KEY}`);
    const books = await loadPreview('portfolioSubfolder', 'sub-books', url, source);
    expect(books?.model).toMatchObject({ page: 'portfolio', openSubfolder: 'sub-books' });
    const model = books!.model as { subfolders: Subfolder[]; items: GalleryItem[] };
    expect(model.subfolders.map((s) => s._id)).toContain('sub-books');
    expect(model.items.find((i) => i._id === 'piece-cover1')?.subfolders).toEqual(['sub-books']);
    const fresh = await loadPreview('portfolioSubfolder', 'sub-new', url, source);
    expect(fresh?.model).toMatchObject({ page: 'portfolio', openSubfolder: 'sub-new' });
    expect((fresh!.model as { subfolders: Subfolder[] }).subfolders.find((s) => s._id === 'sub-new')?.name).toBe('Murderbot');
    const cover = await loadPreview('galleryItem', 'piece-cover2', url, source);
    expect(cover?.model).toMatchObject({ page: 'portfolio', openSubfolder: 'sub-books', focusId: 'piece-cover2' });
    const loose = await loadPreview('galleryItem', 'piece-wide', url, source);
    expect(loose?.model).toMatchObject({ page: 'portfolio', openSubfolder: undefined });
  });
});
