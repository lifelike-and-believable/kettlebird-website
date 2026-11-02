// Unit tests for src/lib/comics/sharing.ts. Criteria: docs/specs/comic-reader-share-and-announce.md.
import { describe, expect, it } from 'vitest';
import { readerPages, type ComicSeries } from '../../src/lib/comics/model';
import {
  absoluteUrl,
  announcesOnOpen,
  FALLBACK_IMAGE_PATH,
  focusAfterTurn,
  pageAnnouncement,
  pagePreview,
  readNewestPath,
  seriesForMissingPath,
  seriesPreview,
  shareTitle,
  TURN_WINDOW_MS,
} from '../../src/lib/comics/sharing';
import { FIXTURE_SERIES } from '../fixtures/comics';

const [kettle, oneShot, paused, comingSoon] = FIXTURE_SERIES;
const SITE = 'https://newsite.kettlebird.com';
const at = (series: ComicSeries, path: string) => readerPages(series).find((e) => e.path === path)!;
const img = { src: 'x.png', width: 800, height: 1200 };

describe('comic-reader-share-and-announce#AC-1 share titles and addresses', () => {
  it('names a shared page by series and place', () => {
    expect(shareTitle(at(kettle, '/comics/kettle-tales/2/2'))).toBe('Kettle Tales · Chapter 2, page 2');
    expect(shareTitle(at(oneShot, '/comics/one-shot/1/2'))).toBe('One Shot · Page 2');
  });
  it('makes absolute addresses from the site address, with or without a trailing slash', () => {
    expect(absoluteUrl(SITE, '/comics/kettle-tales/2/2')).toBe('https://newsite.kettlebird.com/comics/kettle-tales/2/2');
    expect(absoluteUrl(`${SITE}/`, '/comics')).toBe('https://newsite.kettlebird.com/comics');
  });
});

describe('comic-reader-share-and-announce#AC-3 read the newest page', () => {
  it('links the newest page of an ongoing series with more than one page', () => {
    expect(readNewestPath(kettle)).toBe('/comics/kettle-tales/4/1');
  });
  it('is missing for complete, on-hiatus, one-page, page-less and status-less series', () => {
    expect(readNewestPath(oneShot)).toBeUndefined(); // complete
    expect(readNewestPath(paused)).toBeUndefined(); // hiatus, one page
    expect(readNewestPath(comingSoon)).toBeUndefined(); // no pages
    const onePage: ComicSeries = { slug: 'o', title: 'O', status: 'ongoing', chapters: [{ number: 1, pages: [{ image: img }] }] };
    expect(readNewestPath(onePage)).toBeUndefined();
    const noStatus: ComicSeries = { slug: 'n', title: 'N', chapters: [{ number: 1, pages: [{ image: img }, { image: img }] }] };
    expect(readNewestPath(noStatus)).toBeUndefined();
  });
});

describe('comic-reader-share-and-announce#AC-4 page not found', () => {
  const list = [{ slug: 'kettle-tales', title: 'Kettle Tales' }, { slug: 'one-shot', title: 'One Shot' }];
  it('finds the series of a missing page, chapter or sheet', () => {
    for (const path of ['/comics/kettle-tales/9/1', '/comics/kettle-tales/2/99', '/comics/kettle-tales/3/pages', '/comics/kettle-tales/2/1/pages/', '/comics/one-shot/1/9'])
      expect(seriesForMissingPath(path, list), path).toEqual(
        path.includes('one-shot') ? { title: 'One Shot', path: '/comics/one-shot' } : { title: 'Kettle Tales', path: '/comics/kettle-tales' },
      );
  });
  it('finds nothing for a removed series, or an address outside a series', () => {
    for (const path of ['/comics/gone/1/1', '/comics/gone', '/comics', '/about/x', '/', '/comics/kettle-talesx/1/1', '/xcomics/kettle-tales/1/1'])
      expect(seriesForMissingPath(path, list), path).toBeUndefined();
  });
});

describe('comic-reader-share-and-announce#AC-5 link previews', () => {
  it('a page shows its series cover, its share title and its place before the description', () => {
    const series: ComicSeries = { ...kettle, cover: { ...kettle.cover!, social: 'https://cdn.sanity.io/images/p/d/cover.png?w=1200&h=630&fit=fill&bg=f5f1e8' } };
    expect(pagePreview(at(series, '/comics/kettle-tales/2/2'), SITE)).toEqual({
      title: 'Kettle Tales · Chapter 2, page 2',
      description: 'Chapter 2: The Long Road, page 2 of 2. A fox and a kettle set out across the hills.',
      image: 'https://cdn.sanity.io/images/p/d/cover.png?w=1200&h=630&fit=fill&bg=f5f1e8',
      url: 'https://newsite.kettlebird.com/comics/kettle-tales/2/2',
    });
  });
  it('without a social cover, the site picture; without a description, the place alone', () => {
    const p = pagePreview(at(paused, '/comics/paused/1/1'), SITE);
    expect(p.image).toBe(`https://newsite.kettlebird.com${FALLBACK_IMAGE_PATH}`);
    expect(p.description).toBe('Page 1 of 1.');
    expect(p.title).toBe('Paused · Page 1');
  });
  it('a series page shows its cover, title and description', () => {
    expect(seriesPreview(kettle, SITE)).toEqual({
      title: 'Kettle Tales',
      description: 'A fox and a kettle set out across the hills.',
      image: `https://newsite.kettlebird.com${FALLBACK_IMAGE_PATH}`,
      url: 'https://newsite.kettlebird.com/comics/kettle-tales',
    });
    expect(seriesPreview(paused, SITE).description).toBe('Paused, a comic by Star Goldberg.');
  });
});

describe('comic-reader-share-and-announce#AC-6 announcements', () => {
  it('says the place and the alt text', () => {
    expect(pageAnnouncement(at(kettle, '/comics/kettle-tales/2/2'))).toBe('Chapter 2: The Long Road, page 2 of 2. Rain on the road.');
    expect(pageAnnouncement(at(oneShot, '/comics/one-shot/1/1'))).toBe('Page 1 of 2. Two friends meet.');
  });
  it('says the place alone without alt text, never the fallback name again', () => {
    expect(pageAnnouncement(at(oneShot, '/comics/one-shot/1/2'))).toBe("Page 2 of 2. You're all caught up! That's the end of the story.");
    const blank: ComicSeries = { slug: 'b', title: 'B', chapters: [{ number: 1, pages: [{ image: img, altText: '  ' }, { image: img }] }] };
    expect(pageAnnouncement(readerPages(blank)[0])).toBe('Page 1 of 2.');
  });
  it('adds the end note on the newest page', () => {
    expect(pageAnnouncement(at(kettle, '/comics/kettle-tales/4/1'))).toBe(
      "Chapter 4: Homeward, page 1 of 1. Home at last. You're all caught up! New pages are on the way.",
    );
  });
  it('is made on arrival and on back or forward, not on a reload', () => {
    expect(announcesOnOpen('navigate')).toBe(true);
    expect(announcesOnOpen('back_forward')).toBe(true);
    expect(announcesOnOpen('prerender')).toBe(true);
    expect(announcesOnOpen('reload')).toBe(false);
  });
});

describe('comic-reader-share-and-announce#AC-7 focus after a turn', () => {
  const turn = { kind: 'next' as const, from: '/comics/kettle-tales/1/1', at: 1_000 };
  const now = (o: Partial<{ navigation: 'navigate' | 'reload' | 'back_forward'; referrerPath: string; time: number }> = {}) => ({
    navigation: o.navigation ?? 'navigate',
    referrerPath: 'referrerPath' in o ? o.referrerPath : '/comics/kettle-tales/1/1',
    time: o.time ?? 1_000 + 2_000,
  });
  it('returns the control used for a link navigation from the turn page within the window', () => {
    expect(focusAfterTurn(turn, now())).toBe('next');
    expect(focusAfterTurn(turn, now({ time: 1_000 + TURN_WINDOW_MS }))).toBe('next');
  });
  it('nothing without a turn, after the window, on reload or back and forward, or from another page', () => {
    expect(focusAfterTurn(undefined, now())).toBeUndefined();
    expect(focusAfterTurn(turn, now({ time: 1_000 + TURN_WINDOW_MS + 1 }))).toBeUndefined();
    expect(focusAfterTurn(turn, now({ navigation: 'reload' }))).toBeUndefined();
    expect(focusAfterTurn(turn, now({ navigation: 'back_forward' }))).toBeUndefined();
    expect(focusAfterTurn(turn, now({ referrerPath: '/comics/kettle-tales/1/2' }))).toBeUndefined();
    expect(focusAfterTurn(turn, now({ referrerPath: undefined }))).toBeUndefined();
  });
  it('nothing for a turn remembered in the future (a changed clock)', () => {
    expect(focusAfterTurn(turn, now({ time: 500 }))).toBeUndefined();
  });
});
