// Edge cases mutation testing asked for (docs/specs/comic-reader-comic-settings.md).
import { describe, expect, it } from 'vitest';
import { readerPages } from '../../src/lib/comics/model';
import { previewTurn } from '../../src/lib/preview/turns';
import { FIXTURE_SERIES } from '../fixtures/comics';

const book = FIXTURE_SERIES.find((s) => s.slug === 'open-book')!;
const entry = readerPages(book).find((e) => e.path === '/comics/open-book/1/2')!;
const url = new URL('https://site.test/preview/comicChapter/ob-1?sanity-preview-secret=k');

describe('comic-reader-comic-settings#AC-9 edges', () => {
  it('turns only to a page number in the same chapter', () => {
    expect(previewTurn(url, entry, '/comics/open-book/1/pages')).toBeUndefined();
    expect(previewTurn(url, entry, '/comics/open-book/1/0')).toBeUndefined();
    expect(previewTurn(url, entry, '/comics/open-book/1/3/pages')).toBeUndefined();
    expect(previewTurn(url, entry, '/comics/open-book/1/03')).toBeUndefined();
    expect(previewTurn(url, entry, '/comics/open-book/1/')).toBeUndefined();
    expect(previewTurn(url, entry, '/comics/open-book/1/12')).toBe('/preview/comicChapter/ob-1?sanity-preview-secret=k&page=12');
  });
});
