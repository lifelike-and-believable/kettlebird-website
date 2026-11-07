// Edge cases for src/lib/comics/sharing.ts found by mutation testing.
// Spec: docs/specs/comic-reader-share-and-announce.md.
import { describe, expect, it } from 'vitest';
import { readerPages, type ComicSeries } from '../../src/lib/comics/model';
import { focusAfterTurn, pagePreview, readNewestPath, seriesForMissingPath } from '../../src/lib/comics/sharing';

const img = { src: 'x.png', width: 800, height: 1200 };
const twoPages: ComicSeries = { slug: 't', title: 'T', status: 'ongoing', chapters: [{ number: 1, pages: [{ image: img }, { image: img }] }] };

describe('comic-reader-share-and-announce#AC-3 read the newest page, edges', () => {
  it('shows on an ongoing series with exactly two pages', () => {
    expect(readNewestPath(twoPages)).toBe('/comics/t/1/2');
  });
  it('is missing for a series without a web address', () => {
    expect(readNewestPath({ ...twoPages, slug: undefined })).toBeUndefined();
  });
});

describe('comic-reader-share-and-announce#AC-4 page not found, edges', () => {
  it('matches only addresses that start with /comics/', () => {
    expect(seriesForMissingPath('/old/comics/kettle-tales/1/1', [{ slug: 'kettle-tales', title: 'Kettle Tales' }])).toBeUndefined();
  });
});

describe('comic-reader-share-and-announce#AC-5 link previews, edges', () => {
  it("falls back on the site card, at its address on the site", () => {
    expect(pagePreview(readerPages(twoPages)[0], 'https://newsite.kettlebird.com/').image).toBe(
      'https://newsite.kettlebird.com/assets/images/site-card.jpg',
    );
  });
});

describe('comic-reader-share-and-announce#AC-7 focus after a turn, edges', () => {
  it('counts a turn that arrives in the same millisecond', () => {
    const turn = { kind: 'previous' as const, from: '/a', at: 5 };
    expect(focusAfterTurn(turn, { navigation: 'navigate', referrerPath: '/a', time: 5 })).toBe('previous');
  });
});
