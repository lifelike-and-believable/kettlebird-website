// Unit tests for src/lib/comics/model.ts. Criteria: docs/specs/comic-reader-start-and-turn.md.
import { describe, expect, it } from 'vitest';
import {
  chapterLabel,
  endNote,
  firstPagePath,
  locationLine,
  pageAltText,
  pageCountOf,
  pagePath,
  readerPages,
  seriesPath,
  showsChapterList,
  STATUS_LABELS,
  tabTitle,
  TYPE_LABELS,
  visibleChapters,
} from '../../src/lib/comics/model';
import { FIXTURE_SERIES } from '../fixtures/comics';

const [kettle, oneShot, paused, comingSoon] = FIXTURE_SERIES;

describe('comic-reader-start-and-turn#AC-3 chapter labels and visible chapters', () => {
  it('lists only chapters with pages, in number order', () => {
    expect(visibleChapters(kettle).map((c) => c.number)).toEqual([1, 2, 4]);
  });
  it('labels chapters as "Chapter N: Title", "Chapter N", or the title alone for chapter 0', () => {
    expect(chapterLabel({ number: 2, title: 'The Long Road', pages: [] })).toBe('Chapter 2: The Long Road');
    expect(chapterLabel({ number: 5, pages: [] })).toBe('Chapter 5');
    expect(chapterLabel({ number: 0, title: 'Prologue', pages: [] })).toBe('Prologue');
  });
  it('counts pages across visible chapters', () => {
    expect(pageCountOf(kettle)).toBe(6);
    expect(pageCountOf(comingSoon)).toBe(0);
  });
});

describe('comic-reader-start-and-turn#AC-5 hidden chapters', () => {
  it('hides the chapter list for a single untitled chapter', () => {
    expect(showsChapterList(oneShot)).toBe(false);
    expect(showsChapterList(paused)).toBe(false);
  });
  it('shows the chapter list when chapters are titled or there are several', () => {
    expect(showsChapterList(kettle)).toBe(true);
  });
});

describe('comic-reader-start-and-turn#AC-7 page addresses and location lines', () => {
  it('builds addresses with the same shape for every series', () => {
    expect(seriesPath('kettle-tales')).toBe('/comics/kettle-tales');
    expect(pagePath('kettle-tales', 2, 1)).toBe('/comics/kettle-tales/2/1');
    expect(pagePath('one-shot', 1, 1)).toBe('/comics/one-shot/1/1');
  });
  it('starts reading at the first chapter that has pages', () => {
    expect(firstPagePath(kettle)).toBe('/comics/kettle-tales/1/1');
    expect(firstPagePath(comingSoon)).toBeUndefined();
  });
  it('writes the location line with the chapter, or pages only for a one-shot', () => {
    const k = readerPages(kettle).find((e) => e.path === '/comics/kettle-tales/2/1')!;
    expect(locationLine(k)).toBe('Chapter 2: The Long Road · Page 1 of 2');
    const o = readerPages(oneShot)[0];
    expect(locationLine(o)).toBe('Page 1 of 2');
  });
  it('falls back to the short location for missing alt text', () => {
    const o = readerPages(oneShot)[1];
    expect(pageAltText(o)).toBe('Page 2');
    const k = readerPages(kettle)[0];
    expect(pageAltText(k)).toBe('A fox looks up at a kettle on a high shelf.');
  });
  it('titles the tab with the short location and series (AC-8)', () => {
    const k = readerPages(kettle).find((e) => e.path === '/comics/kettle-tales/2/1')!;
    expect(tabTitle(k)).toBe('Chapter 2, page 1 · Kettle Tales · Kettlebird Creations');
    expect(tabTitle(readerPages(oneShot)[0])).toBe('Page 1 · One Shot · Kettlebird Creations');
  });
  it('uses the labels the comics page already uses', () => {
    expect(STATUS_LABELS).toEqual({ ongoing: 'Ongoing', complete: 'Complete', hiatus: 'On Hiatus' });
    expect(TYPE_LABELS).toEqual({ original: 'Original', fancomic: 'Fancomic' });
  });
});

describe('comic-reader-start-and-turn#AC-9 neighbours across chapters', () => {
  const pages = readerPages(kettle);
  const at = (path: string) => pages.find((e) => e.path === path)!;
  it('builds one entry per page, in reading order', () => {
    expect(pages.map((e) => e.path)).toEqual([
      '/comics/kettle-tales/1/1',
      '/comics/kettle-tales/1/2',
      '/comics/kettle-tales/1/3',
      '/comics/kettle-tales/2/1',
      '/comics/kettle-tales/2/2',
      '/comics/kettle-tales/4/1',
    ]);
  });
  it('has no previous page on the first page', () => {
    expect(at('/comics/kettle-tales/1/1').previousPath).toBeUndefined();
    expect(at('/comics/kettle-tales/1/1').nextPath).toBe('/comics/kettle-tales/1/2');
  });
  it('crosses chapter boundaries both ways, skipping empty chapters', () => {
    expect(at('/comics/kettle-tales/1/3').nextPath).toBe('/comics/kettle-tales/2/1');
    expect(at('/comics/kettle-tales/2/1').previousPath).toBe('/comics/kettle-tales/1/3');
    expect(at('/comics/kettle-tales/2/2').nextPath).toBe('/comics/kettle-tales/4/1');
    expect(at('/comics/kettle-tales/4/1').previousPath).toBe('/comics/kettle-tales/2/2');
  });
  it('marks only the last page as last, with no next page', () => {
    expect(pages.filter((e) => e.isLast).map((e) => e.path)).toEqual(['/comics/kettle-tales/4/1']);
    expect(at('/comics/kettle-tales/4/1').nextPath).toBeUndefined();
  });
  it('gives a single-page series neither neighbour', () => {
    const [only] = readerPages(paused);
    expect(only.previousPath).toBeUndefined();
    expect(only.nextPath).toBeUndefined();
    expect(only.isLast).toBe(true);
  });
  it('builds nothing for a series without a web address', () => {
    expect(readerPages(FIXTURE_SERIES[4])).toEqual([]);
  });
});

describe('comic-reader-start-and-turn#AC-10 end notes', () => {
  it('says what comes next for each status', () => {
    expect(endNote('ongoing')).toEqual({ heading: "You're all caught up!", line: 'New pages are on the way.' });
    expect(endNote('hiatus')).toEqual({ heading: "You're all caught up!", line: 'This comic is on a break.' });
    expect(endNote('complete')).toEqual({ heading: "You're all caught up!", line: "That's the end of the story." });
    expect(endNote(undefined).line).toBe('New pages are on the way.');
  });
});
