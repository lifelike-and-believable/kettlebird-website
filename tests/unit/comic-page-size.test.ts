// How a comic's pages fit on a computer: the editor's settings, the pictures' widths and the sizes asked for.
// Criteria: docs/specs/comic-reader-page-size.md.
import { describe, expect, it } from 'vitest';
import {
  HOW_IT_READS,
  LARGEST_PAGE_WIDTH_ERROR,
  LARGEST_PAGE_WIDTH_FIELD,
  largestPageWidthProblem,
  PAGE_SIZE_FIELD,
  picturesSizesLine,
} from '../../sanity-studio/lib/comic-pages';
import { readerSizes } from '../../src/lib/comics/panels';
import { chapterColumn, pageCap, pictureWidths, readLargestPageWidth, readPageSize } from '../../src/lib/comics/page-size';
import { fromSanity } from '../../src/lib/comics/source';
import { fixtureSource, loadPreview } from '../../src/lib/preview/load';
import { FIXTURE_DRAFTS, FIXTURE_PREVIEW_KEY, FIXTURE_PUBLISHED } from '../fixtures/drafts';

describe('comic-reader-page-size#AC-1 fields', () => {
  it('adds Page size on a computer to How it reads, Fit the screen by default, with the design\'s text', () => {
    expect(PAGE_SIZE_FIELD).toEqual({
      name: 'pageSize',
      title: 'Page size on a computer',
      type: 'string',
      fieldset: 'howItReads',
      initialValue: 'screen',
      description:
        'How big pages show on a laptop or desktop, one at a time or two side by side. Readers on a computer can choose another size for themselves. Phones and tablets always fit the screen.',
      options: {
        layout: 'radio',
        list: [
          { value: 'screen', title: 'Fit the screen: The whole page and the buttons show at once, without scrolling, as now. On a 1440 × 900 laptop a page is about 470 pixels wide.' },
          { value: 'width', title: 'Fit the width: Each page shows as wide as its picture, or as Largest page width, narrowed to fit the window. Readers scroll down each page to the buttons.' },
          { value: 'height', title: "Fit the height: Each page's height matches the window's, never wider than its picture or Largest page width. Readers scroll up to Back to series and the page number, and down to the buttons." },
        ],
      },
    });
  });

  it('adds an optional Largest page width to How it reads, with the design\'s help text', () => {
    expect(LARGEST_PAGE_WIDTH_FIELD).toMatchObject({
      name: 'largestPageWidth',
      title: 'Largest page width',
      type: 'number',
      fieldset: 'howItReads',
      description:
        "In screen pixels. A number wider than a page's picture enlarges the picture, and it may look soft. Leave it empty to show each page no wider than its picture. A two-page spread shows up to twice this. Fit the screen ignores it.",
    });
    expect(LARGEST_PAGE_WIDTH_FIELD).not.toHaveProperty('initialValue');
  });

  it('gives How it reads the design\'s preview line', () => {
    expect(HOW_IT_READS.description).toBe(
      'Preview a chapter to see how it reads. The preview at Computer is a 1280 × 800 laptop, shown smaller to fit beside the editor.',
    );
  });
});

describe('comic-reader-page-size#AC-2 largest page width', () => {
  it('accepts a whole number from 400 to 3200, or nothing', () => {
    for (const ok of [undefined, null, 400, 900, 1200, 3200]) expect(largestPageWidthProblem(ok), String(ok)).toBeUndefined();
  });

  it('refuses anything else with the design\'s message', () => {
    expect(LARGEST_PAGE_WIDTH_ERROR).toBe('Choose a whole number of pixels between 400 and 3200, or leave it empty.');
    for (const bad of [399, 3201, 0, -900, 900.5, '900px', '900', Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(largestPageWidthProblem(bad), String(bad)).toBe(LARGEST_PAGE_WIDTH_ERROR);
    }
  });
});

describe('comic-reader-page-size#AC-3 pictures\' sizes', () => {
  const page = (width: number, spread = false) => ({ width, height: 1200, spread });
  const SHARP = 'On sharp (high-density) screens, a picture looks sharpest at half its width or less.';

  it('gives one width, or a range', () => {
    expect(picturesSizesLine([page(800), page(800)])).toBe(`This comic's pages are 800 pixels wide. ${SHARP}`);
    expect(picturesSizesLine([page(1200), page(600), page(4000)])).toBe(`This comic's pages are 600 to 4000 pixels wide. ${SHARP}`);
  });

  it('adds the spreads\' widths', () => {
    expect(picturesSizesLine([page(800), page(1600, true)])).toBe(`This comic's pages are 800 pixels wide, and its spread 1600. ${SHARP}`);
    expect(picturesSizesLine([page(800), page(1600, true), page(1600, true)])).toBe(`This comic's pages are 800 pixels wide, and its spreads 1600. ${SHARP}`);
    expect(picturesSizesLine([page(600), page(2400, true), page(1600, true)])).toBe(`This comic's pages are 600 pixels wide, and its spreads 1600 to 2400. ${SHARP}`);
  });

  it('speaks of spreads alone when there are only spreads', () => {
    expect(picturesSizesLine([page(1600, true)])).toBe(`This comic's spread is 1600 pixels wide. ${SHARP}`);
  });

  it('gives no line without pages, or without their sizes', () => {
    expect(picturesSizesLine([])).toBeUndefined();
    expect(picturesSizesLine([{ spread: false }])).toBeUndefined();
  });
});

describe('comic-reader-page-size#AC-4 read from Sanity', () => {
  it('reads the size, Fit the screen unless width or height', () => {
    expect(readPageSize('width')).toBe('width');
    expect(readPageSize('height')).toBe('height');
    for (const other of ['screen', undefined, null, '', 'WIDTH', 3]) expect(readPageSize(other), String(other)).toBe('screen');
  });

  it('keeps a largest width only when it\'s a whole number from 400 to 3200', () => {
    expect(readLargestPageWidth(1200)).toBe(1200);
    expect(readLargestPageWidth(400)).toBe(400);
    expect(readLargestPageWidth(3200)).toBe(3200);
    for (const bad of [undefined, null, 399, 3201, 900.5, '1200']) expect(readLargestPageWidth(bad), String(bad)).toBeUndefined();
  });

  it('carries both onto the comic', () => {
    const raw = { title: 'T', slug: { current: 't' }, status: 'ongoing' as const, type: 'original' as const, chapters: [] };
    expect(fromSanity({ ...raw, pageSize: 'height', largestPageWidth: 1200 })).toMatchObject({ pageSize: 'height', largestPageWidth: 1200 });
    const plain = fromSanity(raw);
    expect(plain.pageSize).toBe('screen');
    expect(plain.largestPageWidth).toBeUndefined();
  });
});

describe('comic-reader-page-size#AC-5 largest widths', () => {
  it('is the comic\'s largest width, twice it for a spread', () => {
    expect(pageCap({ width: 800 }, false, 1200)).toBe(1200);
    expect(pageCap({ width: 1600 }, true, 1200)).toBe(2400);
  });

  it('is the picture\'s own width without one, at most 3200', () => {
    expect(pageCap({ width: 800 }, false)).toBe(800);
    expect(pageCap({ width: 2400 }, true)).toBe(2400);
    expect(pageCap({ width: 4000 }, false)).toBe(3200);
    expect(pageCap({ width: 3200 }, false)).toBe(3200);
  });

  it('makes the chapter\'s column the widest page that isn\'t a spread', () => {
    const pages = [
      { image: { width: 600 } },
      { image: { width: 1200 } },
      { image: { width: 2400 }, spread: true },
      { image: { width: 4000 } },
    ];
    expect(chapterColumn(pages)).toBe(3200);
    expect(chapterColumn(pages.slice(0, 3))).toBe(1200);
    expect(chapterColumn(pages, 900)).toBe(900);
    expect(chapterColumn([{ image: { width: 1600 }, spread: true }])).toBe(0);
    expect(chapterColumn([])).toBe(0);
  });
});

describe('comic-reader-page-size#AC-6 picture widths', () => {
  it('makes pictures at 480 to 3200, never wider than the picture', () => {
    expect(pictureWidths(4000)).toEqual([480, 800, 1200, 1600, 2400, 3200]);
    expect(pictureWidths(3200)).toEqual([480, 800, 1200, 1600, 2400, 3200]);
    expect(pictureWidths(1600)).toEqual([480, 800, 1200, 1600]);
    expect(pictureWidths(600)).toEqual([480, 600]);
    expect(pictureWidths(800)).toEqual([480, 800]);
    expect(pictureWidths(300)).toEqual([300]);
  });

  it('makes the reader\'s pages at those widths', () => {
    const series = fromSanity({
      title: 'T', slug: { current: 't' }, status: 'ongoing', type: 'original',
      chapters: [{ number: 1, pages: [{ asset: { _ref: 'image-abc-600x900-png' }, dimensions: { width: 600, height: 900 } }] }],
    });
    const image = series.chapters[0]!.pages[0]!.image;
    expect(image.srcset?.split(', ').map((s) => s.split(' ')[1])).toEqual(['480w', '600w']);
  });
});

describe('comic-reader-page-size#AC-7 sizes', () => {
  const page = { width: 800, height: 1200 };
  const COMPUTER = '(hover: hover) and (pointer: fine)';

  it('is unchanged with Fit the screen, and panel by panel', () => {
    expect(readerSizes(page, false, false, { size: 'screen', cap: 800 })).toBe(readerSizes(page, false, false));
    expect(readerSizes(page, true, true, { size: 'width', cap: 1600 })).toBe(readerSizes(page, true, true));
  });

  it('asks for a page fitting the width at its width, on a computer', () => {
    const sizes = readerSizes(page, false, false, { size: 'width', cap: 800 });
    expect(sizes.startsWith(`${COMPUTER} min(800px, calc(100vw - 2rem)), `)).toBe(true);
    expect(sizes.endsWith(readerSizes(page, false, false))).toBe(true);
  });

  it('asks for a page fitting the height at the window\'s height times its shape', () => {
    const sizes = readerSizes(page, false, false, { size: 'height', cap: 1200 });
    expect(sizes.startsWith(`${COMPUTER} min(1200px, calc(100vw - 2rem), calc(100vh * 0.6667)), `)).toBe(true);
  });

  it('asks for a spread at its own largest width', () => {
    const spread = { width: 1600, height: 1200 };
    expect(readerSizes(spread, true, false, { size: 'width', cap: 1600 }).startsWith(`${COMPUTER} min(1600px, calc(100vw - 2rem)), `)).toBe(true);
  });
});

describe('comic-reader-page-size#AC-22 preview', () => {
  const source = fixtureSource({ key: FIXTURE_PREVIEW_KEY, published: FIXTURE_PUBLISHED, drafts: FIXTURE_DRAFTS });
  const load = (id: string) =>
    loadPreview('comicChapter', id, new URL(`https://site.test/preview/comicChapter/${id}?sanity-preview-secret=${FIXTURE_PREVIEW_KEY}`), source);

  it('uses the comic\'s draft page size and largest width in a chapter\'s preview', async () => {
    const result = await load('sheets-1');
    if (result?.model.page !== 'reader') throw new Error(`page ${result?.model.page}`);
    // Published: Fit the screen. The draft: Fit the height, at most 1200.
    expect(result.model.entry.series).toMatchObject({ pageSize: 'height', largestPageWidth: 1200 });
  });

  it('uses the published settings when the comic has no draft', async () => {
    const result = await load('chapter-new');
    if (result?.model.page !== 'reader') throw new Error(`page ${result?.model.page}`);
    expect(result.model.entry.series.pageSize).toBe('screen');
  });
});
