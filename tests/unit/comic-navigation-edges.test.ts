// Edge cases for src/lib/comics/navigation.ts found by mutation testing.
// Spec: docs/specs/comic-reader-sheet-and-controls.md (AC-7).
import { describe, expect, it } from 'vitest';
import { readerPages, type ComicSeries } from '../../src/lib/comics/model';
import { chapterSheet } from '../../src/lib/comics/navigation';

const img = { src: 'x.png', width: 800, height: 1200 };

describe('comic-reader-sheet-and-controls#AC-7 picture names', () => {
  it('alt text made only of spaces is left out, and spaces around alt text are trimmed', () => {
    const series: ComicSeries = {
      slug: 's',
      title: 'S',
      chapters: [{ number: 1, pages: [{ image: img, altText: '   ' }, { image: img, altText: '  A cat.  ' }] }],
    };
    const sheet = chapterSheet(series, readerPages(series)[0].chapter);
    expect(sheet.pictures.map((p) => p.name)).toEqual(['Page 1', 'Page 2: A cat.']);
  });
});
