// Two-page spreads and the page-flip: the pure parts. Criteria: docs/specs/comic-reader-spread-and-flip.md.
import { describe, expect, it } from 'vitest';
import { locationLine, readerPages, type ComicSeries } from '../../src/lib/comics/model';
import { pageSheet } from '../../src/lib/comics/navigation';
import { pageAnnouncement } from '../../src/lib/comics/sharing';
import {
  aloneBeforeSpread,
  pageGroups,
  turnDirection,
  WIDE_MEDIA,
  wideView,
} from '../../src/lib/comics/spreads';
import {
  linkChange,
  OPEN_ON_FIELD,
  pageGridSubtitle,
  pageNote,
  SPREAD_FIELD,
  WIDE_PICTURE_QUESTION,
} from '../../sanity-studio/lib/comic-pages';
import { previewFrameHeight } from '../../sanity-studio/lib/preview';
import { FIXTURE_SERIES } from '../fixtures/comics';

const book = FIXTURE_SERIES.find((s) => s.slug === 'open-book')!;
const at = (series: ComicSeries, path: string) => readerPages(series).find((e) => e.path === path)!;
const ob = (path: string) => at(book, `/comics/open-book/${path}`);
const F = false;
const T = true;

describe('comic-reader-spread-and-flip#AC-1 fields', () => {
  it('Open on: two choices, right by default, with the help text', () => {
    expect(OPEN_ON_FIELD.title).toBe('Open on');
    expect(OPEN_ON_FIELD.description).toBe(
      'How pages pair up on a wide screen. A printed comic opens on the right, so its facing pages are 2 and 3, 4 and 5.',
    );
    expect(OPEN_ON_FIELD.initialValue).toBe('right');
    expect(OPEN_ON_FIELD.options.layout).toBe('radio');
    expect(OPEN_ON_FIELD.options.list).toEqual([
      { value: 'right', title: 'The right, like a printed comic: Page 1 alone on the right, then 2 and 3, 4 and 5.' },
      { value: 'left', title: 'The left, pairing from page 1: Pages 1 and 2 together, then 3 and 4.' },
    ]);
  });

  it('Two-page spread: a tick box with the help text', () => {
    expect(SPREAD_FIELD).toEqual({
      name: 'spread',
      title: 'Two-page spread',
      type: 'boolean',
      description:
        "One picture drawn across two facing pages. On a wide screen it covers both pages; on a phone it's shrunk to fit. It's never split across a page turn.",
    });
  });

  it('a chapter saved before Open on existed opens on the right', () => {
    const old: ComicSeries = { slug: 'x', title: 'X', chapters: [{ number: 1, pages: [0, 1, 2].map(() => book.chapters[0].pages[0]) }] };
    expect(wideView(at(old, '/comics/x/1/1')).pages.map((e) => e.pageNumber)).toEqual([1]);
    expect(wideView(at(old, '/comics/x/1/2')).pages.map((e) => e.pageNumber)).toEqual([2, 3]);
  });
});

describe('comic-reader-spread-and-flip#AC-1 addresses don\'t change', () => {
  it('ticking a spread or changing Open on keeps every address, and publishing warns of nothing', () => {
    const flipped: ComicSeries = {
      ...book,
      chapters: book.chapters.map((c) => ({ ...c, openOn: c.openOn === 'left' ? 'right' : 'left', pages: c.pages.map((p) => ({ ...p, spread: !p.spread })) })),
    };
    expect(readerPages(flipped).map((e) => e.path)).toEqual(readerPages(book).map((e) => e.path));
    const pages = [{ _key: 'a' }, { _key: 'b' }];
    expect(linkChange({ number: 1, pages }, { number: 1, pages: [{ _key: 'a', spread: true }, { _key: 'b' }] })).toEqual({ kind: 'none' });
  });
});

describe('comic-reader-spread-and-flip#AC-2 pairing', () => {
  const shape = (spreads: boolean[], openOn?: 'right' | 'left') => pageGroups(spreads, openOn).map((g) => `${g.kind}:${g.pages.join('-')}`);

  it('opens on the right like a printed comic, by default', () => {
    expect(shape([F, F, F, F, F])).toEqual(['right:1', 'pair:2-3', 'pair:4-5']);
    expect(shape([F, F, F, F, F], 'right')).toEqual(['right:1', 'pair:2-3', 'pair:4-5']);
  });

  it('or pairs from page 1, leaving a last page alone on the left', () => {
    expect(shape([F, F, F], 'left')).toEqual(['pair:1-2', 'left:3']);
    expect(shape([F, F, F, F], 'left')).toEqual(['pair:1-2', 'pair:3-4']);
  });

  it('gives a spread both sides, leaves a waiting page alone on the left, and starts a new pair after it', () => {
    expect(shape([F, F, F, F, T, F])).toEqual(['right:1', 'pair:2-3', 'left:4', 'spread:5', 'left:6']);
    expect(shape([F, F, F, F, T, F, F])).toEqual(['right:1', 'pair:2-3', 'left:4', 'spread:5', 'pair:6-7']);
    expect(shape([F, T, F, F])).toEqual(['right:1', 'spread:2', 'pair:3-4']);
    expect(shape([F, F, T])).toEqual(['right:1', 'left:2', 'spread:3']);
    expect(shape([F, T, F], 'left')).toEqual(['left:1', 'spread:2', 'left:3']);
    expect(shape([T, F], 'left')).toEqual(['spread:1', 'left:2']);
    expect(shape([T, F])).toEqual(['spread:1', 'left:2']);
    expect(shape([T, T])).toEqual(['spread:1', 'spread:2']);
  });

  it('shows a one-page chapter on the side Open on names, and an empty chapter as nothing', () => {
    expect(shape([F])).toEqual(['right:1']);
    expect(shape([F], 'left')).toEqual(['left:1']);
    expect(shape([])).toEqual([]);
  });

  it('names the page a spread leaves alone', () => {
    expect(aloneBeforeSpread([F, F, F, F, T, F], 'right', 5)).toBe(4);
    expect(aloneBeforeSpread([F, T, F], 'left', 2)).toBe(1);
    expect(aloneBeforeSpread([F, T, F, F], 'right', 2)).toBeUndefined();
    expect(aloneBeforeSpread([F, F, F, F, T, F], 'right', 4)).toBeUndefined();
    expect(aloneBeforeSpread([T, F], 'left', 1)).toBeUndefined();
  });
});

describe('comic-reader-spread-and-flip#AC-3 width test', () => {
  it('is 62.5em wide and landscape', () => {
    expect(WIDE_MEDIA).toBe('(min-width: 62.5em) and (orientation: landscape)');
  });
});

describe('comic-reader-spread-and-flip#AC-4 wide links', () => {
  it('shows the whole group a page is in, whichever page the address names', () => {
    expect(wideView(ob('1/2')).pages.map((e) => e.path)).toEqual(['/comics/open-book/1/2', '/comics/open-book/1/3']);
    expect(wideView(ob('1/3')).pages.map((e) => e.path)).toEqual(['/comics/open-book/1/2', '/comics/open-book/1/3']);
    expect(wideView(ob('1/3')).kind).toBe('pair');
    expect(wideView(ob('1/1')).kind).toBe('right');
    expect(wideView(ob('1/4')).kind).toBe('left');
    expect(wideView(ob('1/5')).kind).toBe('spread');
    expect(wideView(ob('2/4')).pages.map((e) => e.pageNumber)).toEqual([3, 4]);
  });

  it('turns to the first page of the next or previous group, across chapters', () => {
    const links = (path: string) => {
      const v = wideView(ob(path));
      return [v.previousPath?.replace('/comics/open-book/', ''), v.nextPath?.replace('/comics/open-book/', '')];
    };
    expect(links('1/1')).toEqual([undefined, '1/2']);
    expect(links('1/2')).toEqual(['1/1', '1/4']);
    expect(links('1/3')).toEqual(['1/1', '1/4']);
    expect(links('1/4')).toEqual(['1/2', '1/5']);
    expect(links('1/5')).toEqual(['1/4', '1/6']);
    expect(links('1/6')).toEqual(['1/5', '2/1']);
    expect(links('2/1')).toEqual(['1/6', '2/3']);
    expect(links('2/2')).toEqual(['1/6', '2/3']);
    expect(links('2/3')).toEqual(['2/1', undefined]);
    expect(links('2/4')).toEqual(['2/1', undefined]);
  });

  it('holds the end note for the group with the newest page, which the narrow view only shows on that page', () => {
    expect(wideView(ob('2/3')).isLast).toBe(true);
    expect(ob('2/3').isLast).toBe(false);
    expect(wideView(ob('2/1')).isLast).toBe(false);
  });

  it('works in a series of one chapter that opens on the right', () => {
    const kettle = FIXTURE_SERIES[0];
    const v = wideView(at(kettle, '/comics/kettle-tales/1/3'));
    expect(v.pages.map((e) => e.pageNumber)).toEqual([2, 3]);
    expect(v.previousPath).toBe('/comics/kettle-tales/1/1');
    expect(v.nextPath).toBe('/comics/kettle-tales/2/1');
  });
});

describe('comic-reader-spread-and-flip#AC-4 AC-6 wide controls', () => {
  const controls = (path: string) => wideView(ob(path)).controls.map((c) => [c.kind, c.name, c.path?.replace('/comics/open-book/', '')]);

  it('names Previous and Next for the pages they lead to, and keeps First and Newest', () => {
    expect(controls('1/1')).toEqual([
      ['first', 'First page of the series', undefined],
      ['previous', 'Previous page', undefined],
      ['next', 'Next pages', '1/2'],
      ['newest', 'Newest page of the series', '2/4'],
    ]);
    expect(controls('1/3')).toEqual([
      ['first', 'First page of the series', '1/1'],
      ['previous', 'Previous page', '1/1'],
      ['next', 'Next page', '1/4'],
      ['newest', 'Newest page of the series', '2/4'],
    ]);
    expect(controls('1/4').slice(1, 3)).toEqual([
      ['previous', 'Previous pages', '1/2'],
      ['next', 'Next page', '1/5'],
    ]);
    expect(controls('1/6').slice(1, 3)).toEqual([
      ['previous', 'Previous page', '1/5'],
      ['next', 'Next pages', '2/1'],
    ]);
  });

  it('makes Next and Newest unusable on the group with the newest page, and First on the group with the first', () => {
    expect(controls('2/3')).toEqual([
      ['first', 'First page of the series', '1/1'],
      ['previous', 'Previous pages', '2/1'],
      ['next', 'Next page', undefined],
      ['newest', 'Newest page of the series', undefined],
    ]);
    expect(wideView(ob('2/3')).controls.map((c) => c.caption)).toEqual(['First', 'Previous', 'Next', 'Newest']);
  });

  it('has no controls in a series of one page, and says Last on a finished series', () => {
    expect(wideView(at(FIXTURE_SERIES[2], '/comics/paused/1/1')).controls).toEqual([]);
    const done: ComicSeries = { ...book, status: 'complete' };
    expect(wideView(at(done, '/comics/open-book/1/1')).controls[3]).toMatchObject({ caption: 'Last', name: 'Last page of the series' });
  });
});

describe('comic-reader-spread-and-flip#AC-5 location', () => {
  it('says Pages 2–3 for a pair and marks a spread on both views', () => {
    expect(wideView(ob('1/3')).location).toBe('Chapter 1: Facing Pages · Pages 2–3 of 6');
    expect(wideView(ob('1/1')).location).toBe('Chapter 1: Facing Pages · Page 1 of 6');
    expect(wideView(ob('1/5')).location).toBe('Chapter 1: Facing Pages · Page 5 of 6 · two-page spread');
    expect(locationLine(ob('1/5'))).toBe('Chapter 1: Facing Pages · Page 5 of 6 · two-page spread');
    expect(locationLine(ob('1/3'))).toBe('Chapter 1: Facing Pages · Page 3 of 6');
    const single: ComicSeries = { slug: 's', title: 'S', chapters: [{ number: 1, pages: book.chapters[1].pages }] };
    expect(wideView(at(single, '/comics/s/1/2')).location).toBe('Pages 2–3 of 4');
  });
});

describe('comic-reader-spread-and-flip#AC-5 announcements', () => {
  it('announces both pages of a pair, left first, and a spread as one', () => {
    expect(wideView(ob('1/3')).announcement).toBe('Chapter 1: Facing Pages, pages 2 and 3 of 6. A hall of mirrors. The fox sees itself.');
    expect(wideView(ob('1/5')).announcement).toBe('Chapter 1: Facing Pages, page 5 of 6, two-page spread. The whole valley below.');
    expect(pageAnnouncement(ob('1/5'))).toBe('Chapter 1: Facing Pages, page 5 of 6, two-page spread. The whole valley below.');
    expect(wideView(ob('1/1')).announcement).toBe(pageAnnouncement(ob('1/1')));
  });

  it('adds the end note on the group with the newest page', () => {
    expect(wideView(ob('2/3')).announcement).toBe(
      "Chapter 2: Left First, pages 3 and 4 of 4. The road. A bridge. You're all caught up! New pages are on the way.",
    );
  });
});

describe('comic-reader-spread-and-flip#AC-9 sheet', () => {
  it('marks a spread\'s picture and names it', () => {
    const pictures = pageSheet(ob('1/5')).pictures;
    expect(pictures.map((p) => p.spread)).toEqual([F, F, F, F, T, F]);
    expect(pictures[4].name).toBe('Page 5, two-page spread: The whole valley below. You were here');
    expect(pageSheet(ob('1/1')).pictures[4].name).toBe('Page 5, two-page spread: The whole valley below.');
    const noAlt: ComicSeries = { slug: 'n', title: 'N', chapters: [{ number: 1, pages: [book.chapters[0].pages[0], { ...book.chapters[0].pages[4], altText: undefined }] }] };
    expect(pageSheet(at(noAlt, '/comics/n/1/1')).pictures[1].name).toBe('Page 2, two-page spread');
  });
});

describe('comic-reader-spread-and-flip#AC-10 editor notes', () => {
  const page = (spread: boolean, width = 800, height = 1200) => ({ spread, width, height });
  const chapter = [page(F), page(F), page(F), page(F), page(T, 1600, 1200), page(F)];

  it('says which page a spread leaves alone', () => {
    expect(pageNote(chapter, 'right', 5)).toBe('This chapter opens on the right, so page 4 shows alone on the left, before this spread.');
    expect(pageNote([page(F), page(T, 1600, 1200)], 'left', 2)).toBe('This chapter opens on the left, so page 1 shows alone on the left, before this spread.');
    expect(pageNote(chapter, 'right', 4)).toBeUndefined();
    expect(pageNote([page(F), page(T, 1600, 1200)], 'right', 2)).toBeUndefined();
  });

  it('asks about a wide picture that isn\'t ticked', () => {
    expect(WIDE_PICTURE_QUESTION).toBe(
      'This picture is wider than it is tall. Is it a two-page spread? If so, tick Two-page spread; otherwise it shows small, on one side.',
    );
    expect(pageNote([page(F, 1600, 1200)], 'right', 1)).toBe(WIDE_PICTURE_QUESTION);
    expect(pageNote([page(F, 1200, 1200)], 'right', 1)).toBeUndefined();
    expect(pageNote([{ spread: false }], 'right', 1)).toBeUndefined();
    expect(pageNote([page(T, 1600, 1200)], 'right', 1)).toBeUndefined();
    expect(pageNote([], 'right', 1)).toBeUndefined();
  });

  it('marks a spread in the pages grid, beside a missing alt text', () => {
    expect(pageGridSubtitle({ spread: true, altText: 'A valley.' })).toBe('Two-page spread');
    expect(pageGridSubtitle({ spread: true })).toBe('Two-page spread · ⚠ Alt text');
    expect(pageGridSubtitle({ altText: '  ' })).toBe('⚠ Alt text');
    expect(pageGridSubtitle({ altText: 'A door.' })).toBeUndefined();
  });
});

describe('comic-reader-spread-and-flip#AC-11 turn direction', () => {
  const links = { previous: ['/c/1/1', '/c/1/2'], next: ['/c/1/4', '/c/1/5'] };
  it('turns forward to a next page and back to a previous one, and not elsewhere', () => {
    expect(turnDirection('/c/1/4', links)).toBe('forward');
    expect(turnDirection('/c/1/5', links)).toBe('forward');
    expect(turnDirection('/c/1/2', links)).toBe('back');
    expect(turnDirection('/c/9/9', links)).toBeUndefined();
    expect(turnDirection('/c/1/4', { previous: [], next: [] })).toBeUndefined();
  });
});

describe('comic-reader-spread-and-flip#AC-12 preview frame', () => {
  it('caps a chapter\'s computer preview at a laptop\'s height, and leaves the rest', () => {
    expect(previewFrameHeight('comicChapter', 'computer', 0.5)).toBe('min(calc(100% / 0.5), 800px)');
    expect(previewFrameHeight('comicChapter', 'phone', 1)).toBe('calc(100% / 1)');
    expect(previewFrameHeight('galleryItem', 'computer', 0.5)).toBe('calc(100% / 0.5)');
  });
});
