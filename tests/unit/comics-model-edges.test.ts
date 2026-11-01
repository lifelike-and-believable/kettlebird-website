// Edge cases for src/lib/comics/model.ts that mutation testing found untested (Stryker, 2026-11-01).
// Criteria: docs/specs/comic-reader-start-and-turn.md.
import { describe, expect, it } from 'vitest';
import {
  chapterLabel, pageAltText, readerPages, shortLocation, showsChapterList,
  type ComicChapter, type ComicSeries,
} from '../../src/lib/comics/model';

const image = { src: 'p.png', width: 800, height: 1200 };
const chapter = (number: number, pageCount: number, title?: string, altText?: string): ComicChapter =>
  ({ number, title, pages: Array.from({ length: pageCount }, () => ({ image, altText })) });
const series = (...chapters: ComicChapter[]): ComicSeries => ({ slug: 'test', title: 'Test', chapters });

describe('comic-reader-start-and-turn#AC-5 hidden chapters', () => {
  it('shows the chapter list for one titled chapter', () => {
    expect(showsChapterList(series(chapter(1, 2, 'The Kettle')))).toBe(true);
  });
  it('shows the chapter list for several untitled chapters', () => {
    expect(showsChapterList(series(chapter(1, 2), chapter(2, 1)))).toBe(true);
  });
});

describe('comic-reader-start-and-turn#AC-3 chapter labels and visible chapters', () => {
  it('labels an untitled chapter 0 as "Chapter 0"', () => {
    expect(chapterLabel({ number: 0, pages: [] })).toBe('Chapter 0');
  });
});

describe('comic-reader-start-and-turn#AC-7 page addresses and location lines', () => {
  it('names a prologue by its title in the short location, or "Chapter 0" without one', () => {
    const titled = readerPages(series(chapter(0, 1, 'Prologue'), chapter(1, 1, 'The Kettle')));
    expect(shortLocation(titled[0])).toBe('Prologue, page 1');
    expect(shortLocation(titled[1])).toBe('Chapter 1, page 1');
    const untitled = readerPages(series(chapter(0, 1), chapter(1, 1)));
    expect(shortLocation(untitled[0])).toBe('Chapter 0, page 1');
  });
  it('treats alt text made of spaces as missing', () => {
    const [entry] = readerPages(series(chapter(1, 1, undefined, '   ')));
    expect(pageAltText(entry)).toBe('Page 1');
  });
});

describe('comic-reader-start-and-turn#AC-10 end notes', () => {
  it('marks only the final page as the last one', () => {
    const entries = readerPages(series(chapter(1, 2, 'A'), chapter(2, 1, 'B')));
    expect(entries.map((e) => e.isLast)).toEqual([false, false, true]);
  });
});
