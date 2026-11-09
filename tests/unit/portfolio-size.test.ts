// Smaller folders on a computer: the row's cap, the grid's cap, the editor's help and the documents.
// Criteria: docs/specs/portfolio-size.md.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { fieldText } from '../../sanity-studio/lib/editor-content';
import { gridCells, rowHeight } from '../../src/lib/portfolio/folders';
import type { GalleryItem } from '../../src/lib/queries';

const read = (path: string) => readFileSync(path, 'utf8');
const piece = (id: string): GalleryItem => ({ _id: id, title: id, slug: { current: id }, category: ['fanart'], image: { asset: { _ref: `image-${id}aaaa-1600x900-jpg` } } });
const sixteen = Array.from({ length: 16 }, (_, i) => piece(`p${i}`));

describe('portfolio-size#AC-1 row height', () => {
  it('is 9/16 of the width, at most 240', () => {
    expect(rowHeight(390)).toBe(219);
    expect(rowHeight(426)).toBe(240);
    expect(rowHeight(427)).toBe(240);
    expect(rowHeight(768)).toBe(240);
    expect(rowHeight(1920)).toBe(240);
    expect(rowHeight(320)).toBe(180);
  });
});

describe('portfolio-size#AC-5 grid', () => {
  it('shows at most 3 × 3 on a computer and 2 × 2 on a phone', () => {
    expect(gridCells(sixteen, 4, false)).toHaveLength(9);
    expect(gridCells(sixteen, 4, false).map((p) => p?._id)).toEqual(sixteen.slice(0, 9).map((p) => p._id));
    expect(gridCells(sixteen, 3, false)).toHaveLength(9);
    expect(gridCells(sixteen, 2, false)).toHaveLength(4);
    expect(gridCells(sixteen, 4, true)).toHaveLength(4);
    expect(gridCells(sixteen, 3, true)).toHaveLength(4);
  });
});

describe('portfolio-size#AC-6 editor', () => {
  it("Grid size's help says what computers and phones show", () => {
    expect(fieldText('portfolioSubfolder', 'gridSize').description).toBe(
      // portfolio-order AC-7 changes the start of the sentence.
      'How many of its pieces its thumbnail shows, starting from the first in its order. Computers show at most 3 × 3, phones 2 × 2.',
    );
    expect(read('docs/user/editing-your-site.md')).toContain('Computers show at most 3 × 3, phones 2 × 2.');
  });
});

describe('portfolio-size#AC-8 documents', () => {
  it('the folders design notes the change, and the style guide gives the new sizes', () => {
    const design = read('docs/design/portfolio-folders.md');
    expect(design.match(/design-portfolio-size/g)?.length ?? 0).toBeGreaterThanOrEqual(4);
    const style = read('docs/STYLE_GUIDE.md');
    const section = style.slice(style.indexOf('### Portfolio folders'));
    expect(section).toMatch(/at most 240 px/);
    expect(section).toMatch(/1\.35rem/);
    expect(section).toMatch(/at most 3 × 3 on a computer/);
  });
});
