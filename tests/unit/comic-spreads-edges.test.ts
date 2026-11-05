// Edge cases mutation testing asked for (docs/specs/comic-reader-spread-and-flip.md).
import { describe, expect, it } from 'vitest';
import { readerPages, type ComicSeries } from '../../src/lib/comics/model';
import { aloneBeforeSpread, wideView } from '../../src/lib/comics/spreads';
import { imageSize, pageNote } from '../../sanity-studio/lib/comic-pages';
import { FIXTURE_SERIES } from '../fixtures/comics';

const book = FIXTURE_SERIES.find((s) => s.slug === 'open-book')!;
const [left1, left2] = book.chapters[1].pages;

describe('comic-reader-spread-and-flip#AC-2 edges', () => {
  it('finds a page alone only before a spread', () => {
    expect(aloneBeforeSpread([false, false, false], 'left', 3)).toBeUndefined();
    expect(aloneBeforeSpread([false, true], 'right', 1)).toBeUndefined();
    expect(aloneBeforeSpread([true], 'right', 1)).toBeUndefined();
  });
});

describe('comic-reader-spread-and-flip#AC-5 edges', () => {
  it('announces a pair in a series without chapter names, and skips missing or blank alt text', () => {
    const plain: ComicSeries = {
      slug: 'p',
      title: 'P',
      status: 'ongoing',
      chapters: [{ number: 1, openOn: 'left', pages: [{ ...left1, altText: '  ' }, { ...left2, altText: undefined }, left1, left2] }],
    };
    const entry = readerPages(plain)[0];
    expect(wideView(entry).announcement).toBe('Pages 1 and 2 of 4.');
    expect(wideView(entry).location).toBe('Pages 1–2 of 4');
  });
});

describe('comic-reader-spread-and-flip#AC-10 edges', () => {
  it('reads a picture\'s size from its asset id', () => {
    expect(imageSize('image-abc123-1600x1200-png')).toEqual({ width: 1600, height: 1200 });
    expect(imageSize('image-abc-80x120-jpg')).toEqual({ width: 80, height: 120 });
    expect(imageSize('image-abc-1600x1200-png-extra')).toBeUndefined();
    expect(imageSize('image-abc-1600x1200-')).toBeUndefined();
    expect(imageSize('image-abc-x1200-png')).toBeUndefined();
    expect(imageSize(undefined)).toBeUndefined();
  });

  it('asks about a wide picture only when both sides are known', () => {
    expect(pageNote([{ width: 1600 }], 'right', 1)).toBeUndefined();
    expect(pageNote([{ height: 1200 }], 'right', 1)).toBeUndefined();
  });
});
