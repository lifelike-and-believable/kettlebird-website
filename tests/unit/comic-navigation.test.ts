// Unit tests for src/lib/comics/navigation.ts. Criteria: docs/specs/comic-reader-sheet-and-controls.md.
import { describe, expect, it } from 'vitest';
import type { ComicSeries } from '../../src/lib/comics/model';
import { readerPages, visibleChapters } from '../../src/lib/comics/model';
import {
  allPagesHref,
  chapterSheet,
  chapterSheetPath,
  pageSheet,
  pageSheetPath,
  playControls,
} from '../../src/lib/comics/navigation';
import { FIXTURE_SERIES } from '../fixtures/comics';

const [kettle, oneShot, paused] = FIXTURE_SERIES;
const at = (series: ComicSeries, path: string) => readerPages(series).find((e) => e.path === path)!;
const img = { src: 'x.png', width: 800, height: 1200 };
const pages = (n: number) => Array.from({ length: n }, () => ({ image: img }));

describe('comic-reader-sheet-and-controls#AC-1 controls', () => {
  it('a middle page has First, Previous, Next and Newest, in that order, all usable', () => {
    const controls = playControls(at(kettle, '/comics/kettle-tales/1/2'));
    expect(controls.map((c) => c.kind)).toEqual(['first', 'previous', 'next', 'newest']);
    expect(controls.map((c) => c.caption)).toEqual(['First', 'Previous', 'Next', 'Newest']);
    expect(controls.map((c) => c.name)).toEqual([
      'First page of the series',
      'Previous page',
      'Next page',
      'Newest page of the series',
    ]);
    expect(controls.map((c) => c.path)).toEqual([
      '/comics/kettle-tales/1/1',
      '/comics/kettle-tales/1/1',
      '/comics/kettle-tales/1/3',
      '/comics/kettle-tales/4/1',
    ]);
  });
  it('every caption is part of its full name, so voice control works by the visible word', () => {
    for (const c of playControls(at(oneShot, '/comics/one-shot/1/1'))) expect(c.name).toContain(c.caption);
    for (const c of playControls(at(kettle, '/comics/kettle-tales/2/1'))) expect(c.name).toContain(c.caption);
  });
});

describe('comic-reader-sheet-and-controls#AC-2 first and newest', () => {
  it('First and Newest go to the series first and newest pages, skipping empty chapters', () => {
    const controls = playControls(at(kettle, '/comics/kettle-tales/2/1'));
    expect(controls[0].path).toBe('/comics/kettle-tales/1/1');
    expect(controls[1].path).toBe('/comics/kettle-tales/1/3');
    expect(controls[3].path).toBe('/comics/kettle-tales/4/1');
  });
  it('on a complete series the last control reads Last', () => {
    const last = playControls(at(oneShot, '/comics/one-shot/1/1'))[3];
    expect(last).toMatchObject({ kind: 'newest', caption: 'Last', name: 'Last page of the series', path: '/comics/one-shot/1/2' });
  });
  it('ongoing and on-hiatus series, and those without a status, read Newest', () => {
    const series = (status?: 'ongoing' | 'hiatus'): ComicSeries => ({ slug: 's', title: 'S', status, chapters: [{ number: 1, pages: pages(2) }] });
    for (const s of [series('ongoing'), series('hiatus'), series()]) {
      expect(playControls(readerPages(s)[0])[3].caption).toBe('Newest');
    }
  });
});

describe('comic-reader-sheet-and-controls#AC-3 controls that cannot be used', () => {
  it('on the first page, First and Previous have no address', () => {
    const controls = playControls(at(kettle, '/comics/kettle-tales/1/1'));
    expect(controls.map((c) => c.path === undefined)).toEqual([true, true, false, false]);
  });
  it('on the newest page, Next and Newest have no address', () => {
    const controls = playControls(at(kettle, '/comics/kettle-tales/4/1'));
    expect(controls.map((c) => c.path === undefined)).toEqual([false, false, true, true]);
  });
  it('a series with one page has no controls', () => {
    expect(playControls(at(paused, '/comics/paused/1/1'))).toEqual([]);
  });
});

describe('comic-reader-sheet-and-controls#AC-6 sheet addresses', () => {
  it('a page sheet is the page address plus /pages; a chapter sheet the chapter address plus /pages', () => {
    expect(pageSheetPath(at(kettle, '/comics/kettle-tales/2/2'))).toBe('/comics/kettle-tales/2/2/pages');
    expect(chapterSheetPath('kettle-tales', 3)).toBe('/comics/kettle-tales/3/pages');
  });
  it('All pages opens the sheet scrolled to the page', () => {
    expect(allPagesHref(at(kettle, '/comics/kettle-tales/1/3'))).toBe('/comics/kettle-tales/1/3/pages#page-3');
  });
  it('a chapter with one page has no page sheet and no All pages', () => {
    expect(pageSheetPath(at(kettle, '/comics/kettle-tales/4/1'))).toBeUndefined();
    expect(allPagesHref(at(kettle, '/comics/kettle-tales/4/1'))).toBeUndefined();
  });
});

describe('comic-reader-sheet-and-controls#AC-7 page sheet', () => {
  const sheet = () => pageSheet(at(kettle, '/comics/kettle-tales/2/2'));
  it('names the series and chapter, counts the pages, and titles the tab', () => {
    expect(sheet()).toMatchObject({
      path: '/comics/kettle-tales/2/2/pages',
      heading: 'Kettle Tales · Chapter 2: The Long Road',
      pageCount: '2 pages',
      tabTitle: 'Chapter 2, all pages · Kettle Tales · Kettlebird Creations',
      seriesPath: '/comics/kettle-tales',
      backToPage: { label: 'Back to page 2', path: '/comics/kettle-tales/2/2' },
    });
  });
  it('lists every page in order, linking to the reader, and marks the page the fan came from', () => {
    const pictures = sheet().pictures;
    expect(pictures.map((p) => p.number)).toEqual([1, 2]);
    expect(pictures.map((p) => p.path)).toEqual(['/comics/kettle-tales/2/1', '/comics/kettle-tales/2/2']);
    expect(pictures.map((p) => p.anchor)).toEqual(['page-1', 'page-2']);
    expect(pictures.map((p) => p.marked)).toEqual([false, true]);
  });
  it('names each picture by its number and alt text, adding "You were here" to the marked one', () => {
    expect(sheet().pictures.map((p) => p.name)).toEqual([
      'Page 1: The fox sets out at dawn.',
      'Page 2: Rain on the road. You were here',
    ]);
    const plain = pageSheet(at(oneShot, '/comics/one-shot/1/1'));
    expect(plain.pictures.map((p) => p.name)).toEqual(['Page 1: Two friends meet. You were here', 'Page 2']);
  });
  it('a series without visible chapters is headed and titled by the series alone', () => {
    const s = pageSheet(at(oneShot, '/comics/one-shot/1/2'));
    expect(s.heading).toBe('One Shot');
    expect(s.tabTitle).toBe('All pages · One Shot · Kettlebird Creations');
  });
  it('a prologue is named by its title', () => {
    const series: ComicSeries = { slug: 'p', title: 'P', chapters: [{ number: 0, title: 'Prologue', pages: pages(2) }, { number: 1, pages: pages(2) }] };
    const s = pageSheet(readerPages(series)[0]);
    expect(s.heading).toBe('P · Prologue');
    expect(s.tabTitle).toBe('Prologue, all pages · P · Kettlebird Creations');
  });
  it('uses the small images when there are some', () => {
    const series: ComicSeries = { slug: 't', title: 'T', chapters: [{ number: 1, pages: [{ image: { ...img, thumb: { src: 'small.png' } } }, { image: img }] }] };
    const s = pageSheet(readerPages(series)[0]);
    expect(s.pictures[0].image.thumb?.src).toBe('small.png');
    expect(s.pictures[1].image.src).toBe('x.png');
  });
});

describe('comic-reader-sheet-and-controls#AC-8 chapter sheet', () => {
  it('marks nothing and has no link back to a page', () => {
    const chapter = visibleChapters(kettle)[1];
    const s = chapterSheet(kettle, chapter);
    expect(s.path).toBe('/comics/kettle-tales/2/pages');
    expect(s.backToPage).toBeUndefined();
    expect(s.pictures.every((p) => !p.marked)).toBe(true);
    expect(s.pictures.map((p) => p.name)).toEqual(['Page 1: The fox sets out at dawn.', 'Page 2: Rain on the road.']);
  });
  it('a chapter with one page still has its sheet', () => {
    const s = chapterSheet(kettle, visibleChapters(kettle)[2]);
    expect(s.pictures).toHaveLength(1);
    expect(s.pageCount).toBe('1 page');
  });
});

describe('comic-reader-sheet-and-controls#AC-9 chapter list', () => {
  it('lists every chapter with pages; the current one is marked and not a link', () => {
    const list = pageSheet(at(kettle, '/comics/kettle-tales/2/1')).chapterList!;
    expect(list.summary).toBe('Chapter 2 of 4 · All chapters');
    expect(list.items).toEqual([
      { label: 'Chapter 1: The Kettle', pages: '3 pages', path: '/comics/kettle-tales/1/pages', current: false },
      { label: 'Chapter 2: The Long Road', pages: '2 pages', path: undefined, current: true },
      { label: 'Chapter 4: Homeward', pages: '1 page', path: '/comics/kettle-tales/4/pages', current: false },
    ]);
  });
  it('a prologue summary uses its title', () => {
    const series: ComicSeries = { slug: 'p', title: 'P', chapters: [{ number: 0, title: 'Prologue', pages: pages(2) }, { number: 1, pages: pages(2) }] };
    expect(pageSheet(readerPages(series)[0]).chapterList!.summary).toBe('Prologue · All chapters');
  });
  it('no list for a series without visible chapters, or with one chapter that has pages', () => {
    expect(pageSheet(at(oneShot, '/comics/one-shot/1/1')).chapterList).toBeUndefined();
    const titled: ComicSeries = { slug: 't', title: 'T', chapters: [{ number: 1, title: 'Only', pages: pages(2) }, { number: 2, pages: [] }] };
    expect(pageSheet(readerPages(titled)[0]).chapterList).toBeUndefined();
  });
});

describe('comic-reader-sheet-and-controls#AC-10 chapters either side', () => {
  it('links the chapters with pages either side, skipping empty ones', () => {
    const middle = pageSheet(at(kettle, '/comics/kettle-tales/2/1'));
    expect(middle.previousChapter).toEqual({ label: 'Chapter 1', name: 'Previous chapter: Chapter 1', path: '/comics/kettle-tales/1/pages' });
    expect(middle.nextChapter).toEqual({ label: 'Chapter 4', name: 'Next chapter: Chapter 4', path: '/comics/kettle-tales/4/pages' });
  });
  it('none before the first chapter or after the last', () => {
    expect(pageSheet(at(kettle, '/comics/kettle-tales/1/1')).previousChapter).toBeUndefined();
    expect(chapterSheet(kettle, visibleChapters(kettle)[2]).nextChapter).toBeUndefined();
  });
  it('none on a series without visible chapters', () => {
    const s = pageSheet(at(oneShot, '/comics/one-shot/1/1'));
    expect(s.previousChapter).toBeUndefined();
    expect(s.nextChapter).toBeUndefined();
  });
});
