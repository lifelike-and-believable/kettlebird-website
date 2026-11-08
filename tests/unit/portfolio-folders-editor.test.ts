// The portfolio as folders, with subfolders: the editor (Art's two lists, the subfolder type, a piece's
// Subfolders, the messages, Preview and help) and the documents. Criteria: docs/specs/portfolio-folders.md.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  ART_LISTS, deleteMessage, DEVELOPER_WORDS, FIELDS, fieldText, gridHint, GRID_SIZES, ITEM_NAMES, leaveNote, listDetail,
  sectionLocked, sectionTitle, subfolderChoices, subfolderProblems,
} from '../../sanity-studio/lib/editor-content';
import { ITEM_HELP } from '../../sanity-studio/lib/help';
import { isPreviewable } from '../../sanity-studio/lib/preview';

const read = (path: string) => readFileSync(path, 'utf8');

describe('portfolio-folders#AC-17 editor menu', () => {
  it('Art lists Pieces and Subfolders', () => {
    expect(ART_LISTS.map((l) => [l.title, l.type, l.newLabel])).toEqual([
      ['Pieces', 'galleryItem', 'New piece'],
      ['Subfolders', 'portfolioSubfolder', 'New subfolder'],
    ]);
    expect(ART_LISTS[1].ordering).toEqual([['_createdAt', 'desc']]);
    const structure = read('sanity-studio/structure.ts');
    expect(structure).toMatch(/ART_LISTS\.map/);
    expect(read('sanity-studio/schemas/index.ts')).toMatch(/portfolioSubfolder/);
  });
});

describe('portfolio-folders#AC-18 AC-19 subfolder type', () => {
  it('has its name and fields in order, with the design help', () => {
    expect(ITEM_NAMES.portfolioSubfolder).toBe('Subfolder');
    expect(Object.keys(FIELDS.portfolioSubfolder)).toEqual(['name', 'slug', 'section', 'gridSize']);
    expect(fieldText('portfolioSubfolder', 'name')).toEqual({
      title: 'Name (required)',
      description: "Shown under its thumbnail, and on the section's tab after the section's name when it's open (\"Fan Work: Murderbot\").",
    });
    expect(fieldText('portfolioSubfolder', 'slug')).toEqual({
      title: 'Web address (required)',
      description: 'Made from the name. Leave it as it is once people may have shared links to it.',
    });
    expect(fieldText('portfolioSubfolder', 'section').description).toBe(
      "The Portfolio section it's in. Set when you make it; to move pieces to another section, make a subfolder there.",
    );
    expect(fieldText('portfolioSubfolder', 'gridSize')).toEqual({
      title: 'Grid size',
      description: 'How many of its pieces its thumbnail shows, newest first.',
    });
    expect(GRID_SIZES).toEqual([
      { title: '2 × 2', value: 2 },
      { title: '3 × 3', value: 3 },
      { title: '4 × 4', value: 4 },
    ]);
  });
  it('says what the grid shows for its pieces', () => {
    expect(gridHint('Murderbot', 4, 2)).toBe('Murderbot has 4 pieces: 2 × 2 shows them all.');
    expect(gridHint('Murderbot', 12, 3)).toBe('Murderbot has 12 pieces: 3 × 3 shows the newest 9.');
    expect(gridHint('Books', 1, 2)).toBe('Books has 1 piece: 2 × 2 shows it, with 3 empty cells.');
    expect(gridHint('Books', 0, 2)).toBe('Books has no pieces yet.');
    expect(gridHint('Ten', 9, 3)).toBe('Ten has 9 pieces: 3 × 3 shows them all.');
  });
  it('lists a subfolder with its section, grid size and count', () => {
    expect(listDetail('portfolioSubfolder', { section: 'fanart', gridSize: 2, count: 4 })).toBe('Fan Work · 2 × 2 · 4 pieces');
    expect(listDetail('portfolioSubfolder', { section: 'commission', gridSize: 3, count: 1 })).toBe('Past Clients · 3 × 3 · 1 piece');
    expect(listDetail('portfolioSubfolder', { section: 'fanart' })).toBe('Fan Work · 2 × 2 · 0 pieces');
    expect(listDetail('portfolioSubfolder', {})).toBeUndefined();
  });
  it('locks the section once published', () => {
    expect(sectionLocked(undefined, 'fanart')).toBe(false);
    expect(sectionLocked('fanart', 'fanart')).toBe(false);
    expect(sectionLocked('fanart', 'commission')).toBe(true);
    expect(sectionTitle('wip')).toBe('Work in Progress');
    expect(sectionTitle('nope')).toBe('nope');
  });
  it('defines the type with a unique web address, a section and the grid size', () => {
    const schema = read('sanity-studio/schemas/objects/portfolioSubfolder.ts');
    expect(schema).toMatch(/name: 'portfolioSubfolder'/);
    expect(schema).toMatch(/isUnique/);
    expect(schema).toMatch(/sectionLocked/);
    expect(schema).toMatch(/initialValue: 2/);
  });
});

describe('portfolio-folders#AC-20 AC-21 piece subfolders', () => {
  const subs = [
    { _id: 'mb', name: 'Murderbot', section: 'fanart' },
    { _id: 'dc', name: 'The Amazing Digital Circus', section: 'fanart' },
    { _id: 'bk', name: 'Book covers', section: 'commission' },
  ];
  it('adds the field after Portfolio sections, with its help', () => {
    expect(Object.keys(FIELDS.galleryItem).indexOf('subfolders')).toBe(Object.keys(FIELDS.galleryItem).indexOf('category') + 1);
    expect(fieldText('galleryItem', 'subfolders')).toEqual({
      title: 'Subfolders',
      description: 'Optional. At most one in each section this piece is in. Left as Loose, the piece shows on its own in that section.',
    });
    const schema = read('sanity-studio/schemas/objects/galleryItem.ts');
    expect(schema).toMatch(/weak: true/);
    expect(schema).toMatch(/subfolderProblems/);
  });
  it('gives one choice per section the piece is in, in the portfolio order', () => {
    expect(subfolderChoices(['featured', 'fanart'], subs, ['mb'])).toEqual([
      { section: 'featured', title: 'Featured', options: [], chosen: undefined, empty: 'Loose (no subfolders yet)' },
      { section: 'fanart', title: 'Fan Work', options: [{ id: 'mb', name: 'Murderbot' }, { id: 'dc', name: 'The Amazing Digital Circus' }], chosen: 'mb', empty: undefined },
    ]);
    expect(subfolderChoices([], subs, [])).toEqual([]);
  });
  it('allows at most one subfolder per section, only in sections the piece is in', () => {
    expect(subfolderProblems(['fanart'], [subs[0]])).toBeUndefined();
    expect(subfolderProblems(['fanart'], [subs[0], subs[1]])).toBe('Choose at most one subfolder in Fan Work.');
    expect(subfolderProblems(['fanart'], [subs[2]])).toBe('Book covers is in Past Clients, which this piece isn\'t in. Tick Past Clients, or choose Loose.');
    expect(subfolderProblems(['fanart'], [])).toBeUndefined();
  });
  it('notes that unticking a section leaves its subfolder', () => {
    expect(leaveNote('Fan Work', 'Murderbot')).toBe('If you untick Fan Work, this piece also leaves Murderbot when you publish.');
  });
  it("lists a piece with its sections, then its subfolders' names", () => {
    expect(listDetail('galleryItem', { category: ['featured', 'fanart'], subfolderNames: ['Murderbot'] })).toBe('Fan Work, Featured · Murderbot');
    expect(listDetail('galleryItem', { category: ['fanart'], subfolderNames: [] })).toBe('Fan Work');
    expect(listDetail('galleryItem', { category: ['fanart'], subfolderNames: [null, 'Murderbot'] })).toBe('Fan Work · Murderbot');
  });
});

describe('portfolio-folders#AC-22 delete', () => {
  it('asks before deleting, with the count and what happens', () => {
    expect(deleteMessage('Murderbot', 4, 'Fan Work')).toBe(
      'Delete Murderbot? Its 4 pieces stay in Fan Work, shown on their own. Its web address stops working: links people shared to it will show Page not found.',
    );
    expect(deleteMessage('Books', 1, 'Past Clients')).toBe(
      'Delete Books? Its 1 piece stays in Past Clients, shown on its own. Its web address stops working: links people shared to it will show Page not found.',
    );
    expect(deleteMessage('Empty', 0, 'Fan Work')).toBe('Delete Empty? It has no pieces. Its web address stops working: links people shared to it will show Page not found.');
  });
});

describe('portfolio-folders#AC-23 AC-24 preview and help', () => {
  it('previews a subfolder and links its help', () => {
    expect(isPreviewable('portfolioSubfolder')).toBe(true);
    expect(ITEM_HELP.portfolioSubfolder).toEqual({ text: 'Help: Subfolders', path: '/help/editing-your-site#subfolders' });
  });
  it("words the Picture's help for whole pieces and cropped grids", () => {
    expect(FIELDS.galleryItem.image.help).toBe(
      "Upload the original file; the site makes smaller copies. Pieces show whole; in a subfolder's grid they're cropped square. To keep the important part in view there, choose the picture's Edit button, then drag the circle over the part that matters.",
    );
  });
  it('uses no developer words in the new text', () => {
    const text = [
      ...Object.values(FIELDS.portfolioSubfolder).flatMap((f) => [f.label, f.help]),
      FIELDS.galleryItem.subfolders.help, gridHint('Murderbot', 4, 2), deleteMessage('Murderbot', 4, 'Fan Work'), leaveNote('Fan Work', 'Murderbot'),
    ].join(' ').toLowerCase();
    for (const word of DEVELOPER_WORDS) expect(text).not.toContain(word);
  });
});

describe('portfolio-folders#AC-25 documents', () => {
  it("Star's guide has Subfolders and the new Picture help", () => {
    const guide = read('docs/user/editing-your-site.md');
    expect(guide).toMatch(/^## Subfolders$/m);
    expect(guide).toContain("Pieces show whole; in a subfolder's grid they're cropped square.");
    expect(guide).toMatch(/publish the subfolder/i);
  });
  it("the fans' guide has no filter and explains INDEX", () => {
    const guide = read('docs/user/viewing-artwork.md');
    expect(guide).not.toMatch(/choose it in the Index at the top/);
    expect(guide).toMatch(/\*\*INDEX\*\*/);
    expect(guide).toMatch(/Back/);
  });
  it('the arrows design, requirements and style guide follow', () => {
    expect(read('docs/design/arrows.md')).not.toMatch(/The carousel has no "can't be used" state/);
    expect(read('docs/product/requirements/portfolio.md')).toMatch(/REQ-portfolio-2[\s\S]*retired/i);
    expect(read('docs/STYLE_GUIDE.md')).toMatch(/^### Portfolio folders$/m);
  });
});
