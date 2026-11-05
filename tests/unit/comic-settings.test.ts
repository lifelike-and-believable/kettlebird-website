// Settings per comic: two pages side by side and the page-flip. Criteria: docs/specs/comic-reader-comic-settings.md.
import { describe, expect, it } from 'vitest';
import { readerPages, type ComicSeries } from '../../src/lib/comics/model';
import { fromSanity } from '../../src/lib/comics/source';
import { readsAs } from '../../src/lib/comics/spreads';
import { fixtureSource, loadPreview } from '../../src/lib/preview/load';
import { previewTurn } from '../../src/lib/preview/turns';
import {
  HOW_IT_READS,
  linkChange,
  OPEN_ON_OFF_NOTE,
  PAGE_FLIP_FIELD,
  pageNote,
  TWO_UP_FIELD,
  WIDE_PICTURE_QUESTION,
} from '../../sanity-studio/lib/comic-pages';
import { FIXTURE_SERIES } from '../fixtures/comics';
import { FIXTURE_DRAFTS, FIXTURE_PREVIEW_KEY, FIXTURE_PUBLISHED } from '../fixtures/drafts';

const by = (slug: string) => FIXTURE_SERIES.find((s) => s.slug === slug)!;

describe('comic-reader-comic-settings#AC-1 fields', () => {
  it('groups two tick boxes under How it reads, with the design\'s help text, both unticked', () => {
    expect(HOW_IT_READS).toEqual({ name: 'howItReads', title: 'How it reads', description: 'Preview a chapter to see how it reads.' });
    expect(TWO_UP_FIELD).toEqual({
      name: 'twoUp',
      title: 'Two pages side by side',
      type: 'boolean',
      fieldset: 'howItReads',
      initialValue: false,
      description: 'On a laptop, or a tablet held sideways, show facing pages together, like an open comic. Off: one page at a time on every screen.',
    });
    expect(PAGE_FLIP_FIELD).toEqual({
      name: 'pageFlip',
      title: 'Page-flip',
      type: 'boolean',
      fieldset: 'howItReads',
      initialValue: false,
      description: 'Turn pages with an animation of a page turning over. Off: pages change at once.',
    });
  });
});

describe('comic-reader-comic-settings#AC-1 defaults', () => {
  it('reads both settings, and treats a comic saved before them as both off', () => {
    const base = { title: 'T', slug: { current: 't' } };
    expect(readsAs(fromSanity(base))).toEqual({ twoUp: false, pageFlip: false });
    expect(readsAs(fromSanity({ ...base, twoUp: true } as never))).toEqual({ twoUp: true, pageFlip: false });
    expect(readsAs(fromSanity({ ...base, pageFlip: true } as never))).toEqual({ twoUp: false, pageFlip: true });
    expect(readsAs(fromSanity({ ...base, twoUp: 'yes', pageFlip: 1 } as never))).toEqual({ twoUp: false, pageFlip: false });
    expect(readsAs({ title: 'X', chapters: [] })).toEqual({ twoUp: false, pageFlip: false });
  });

  it('gives the fixture comics the settings their tests rely on', () => {
    expect(readsAs(by('kettle-tales'))).toEqual({ twoUp: true, pageFlip: true });
    expect(readsAs(by('open-book'))).toEqual({ twoUp: true, pageFlip: true });
    expect(readsAs(by('one-shot'))).toEqual({ twoUp: false, pageFlip: false });
    expect(readsAs(by('single-sheets'))).toEqual({ twoUp: false, pageFlip: true });
  });
});

describe('comic-reader-comic-settings#AC-6 addresses don\'t change', () => {
  it('keeps every address when either setting changes', () => {
    const book = by('open-book');
    for (const twoUp of [true, false]) {
      for (const pageFlip of [true, false]) {
        expect(readerPages({ ...book, twoUp, pageFlip } as ComicSeries).map((e) => e.path)).toEqual(readerPages(book).map((e) => e.path));
      }
    }
    // Publishing a chapter of such a comic warns of nothing, as before.
    expect(linkChange({ number: 1, pages: [{ _key: 'a' }] }, { number: 1, pages: [{ _key: 'a' }] })).toEqual({ kind: 'none' });
  });
});

describe('comic-reader-comic-settings#AC-7 editor notes', () => {
  const page = (spread: boolean, width = 800, height = 1200) => ({ spread, width, height });
  const chapter = [page(false), page(false), page(false), page(false), page(true, 1600, 1200), page(false)];

  it('says Open on has no effect when pairs are off', () => {
    expect(OPEN_ON_OFF_NOTE).toBe("Two pages side by side is off for this comic, so this has no effect. Turn it on in the comic's How it reads.");
  });

  it('hides the note about a page left alone when pairs are off, and keeps the wide-picture question', () => {
    expect(pageNote(chapter, 'right', 5, true)).toBe('This chapter opens on the right, so page 4 shows alone on the left, before this spread.');
    expect(pageNote(chapter, 'right', 5)).toBe('This chapter opens on the right, so page 4 shows alone on the left, before this spread.');
    expect(pageNote(chapter, 'right', 5, false)).toBeUndefined();
    expect(pageNote([page(false, 1600, 1200)], 'right', 1, false)).toBe(WIDE_PICTURE_QUESTION);
  });
});

describe('comic-reader-comic-settings#AC-8 preview settings', () => {
  const source = fixtureSource({ key: FIXTURE_PREVIEW_KEY, published: FIXTURE_PUBLISHED, drafts: FIXTURE_DRAFTS });
  const load = (id: string) =>
    loadPreview('comicChapter', id, new URL(`https://site.test/preview/comicChapter/${id}?sanity-preview-secret=${FIXTURE_PREVIEW_KEY}`), source);

  it('uses the comic\'s draft settings in a chapter\'s preview', async () => {
    const result = await load('sheets-1');
    if (result?.model.page !== 'reader') throw new Error(`page ${result?.model.page}`);
    // Published: pairs off, flip on. The draft turns pairs on.
    expect(readsAs(result.model.entry.series)).toEqual({ twoUp: true, pageFlip: true });
  });

  it('uses the published settings when the comic has no draft', async () => {
    const result = await load('chapter-new');
    if (result?.model.page !== 'reader') throw new Error(`page ${result?.model.page}`);
    expect(readsAs(result.model.entry.series)).toEqual({ twoUp: false, pageFlip: false });
  });
});

describe('comic-reader-comic-settings#AC-9 preview turns', () => {
  const book = by('open-book');
  const at = (path: string) => readerPages(book).find((e) => e.path === path)!;
  const url = new URL('https://site.test/preview/comicChapter/ob-1?sanity-preview-secret=k');

  it('turns within the chapter in the preview, keeping the preview\'s address', () => {
    expect(previewTurn(url, at('/comics/open-book/1/2'), '/comics/open-book/1/3')).toBe('/preview/comicChapter/ob-1?sanity-preview-secret=k&page=3');
    expect(previewTurn(url, at('/comics/open-book/1/2'), '/comics/open-book/1/1')).toBe('/preview/comicChapter/ob-1?sanity-preview-secret=k&page=1');
    const paged = new URL(`${url.href}&page=2&rev=abc`);
    expect(previewTurn(paged, at('/comics/open-book/1/2'), '/comics/open-book/1/4')).toBe('/preview/comicChapter/ob-1?sanity-preview-secret=k&page=4&rev=abc');
  });

  it('leaves a turn to another chapter, or no turn, inactive', () => {
    expect(previewTurn(url, at('/comics/open-book/1/6'), '/comics/open-book/2/1')).toBeUndefined();
    expect(previewTurn(url, at('/comics/open-book/1/6'), '/comics/open-book/10/1')).toBeUndefined();
    expect(previewTurn(url, at('/comics/open-book/1/1'), undefined)).toBeUndefined();
  });
});
