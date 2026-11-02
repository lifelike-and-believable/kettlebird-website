// Edge cases for sanity-studio/lib/comic-pages.ts that mutation testing found untested (Stryker,
// 2026-11-01). Criteria: docs/specs/comic-publish-pages.md.
import { describe, expect, it } from 'vitest';
import { chapterLabel, isAcceptedImage, linkChange, publishDialog, publishLabel, type ChapterLike } from '../../sanity-studio/lib/comic-pages';

const withAlt = (...keys: string[]) => keys.map((k) => ({ _key: k, altText: `alt ${k}` }));

describe('comic-publish-pages#AC-3 accepted file types', () => {
  it('goes by the extension at the end of the name when the browser gives no type', () => {
    expect(isAcceptedImage({ name: 'page-1.jpg', type: '' })).toBe(true);
    expect(isAcceptedImage({ name: 'notes.png.txt', type: '' })).toBe(false);
  });
});

describe('comic-publish-pages#AC-5 publish label while uploading', () => {
  it('waits while files are only waiting, or only uploading', () => {
    expect(publishLabel([{ name: 'a', state: 'waiting' }])).toBe('Uploading 0 of 1…');
    expect(publishLabel([{ name: 'a', state: 'uploading' }, { name: 'b', state: 'done' }])).toBe('Uploading 1 of 2…');
  });
});

describe('comic-publish-pages#AC-7 link changes between published and draft', () => {
  it('reports nothing when the published chapter had no pages', () => {
    expect(linkChange({ number: 2, pages: [] }, { number: 2, pages: withAlt('a') })).toEqual({ kind: 'none' });
  });
});

describe('comic-publish-pages#AC-8 publish dialog content', () => {
  it('uses the singular for one page without alt text', () => {
    const one: ChapterLike = { number: 3, title: 'Homeward', pages: [{ _key: 'a' }, ...withAlt('b')] };
    expect(publishDialog({ kind: 'none' }, one)!.lines[0]).toBe("1 page in Chapter 3: Homeward has no alt text, so people using screen readers won't be able to follow it.");
    expect(publishDialog({ kind: 'moved', page: 1, lastPage: 2 }, one)!.lines[1]).toBe('Reminder: 1 page in this chapter has no alt text.');
  });
  it('names a single affected page', () => {
    const draft: ChapterLike = { number: 2, title: 'The Long Road', pages: withAlt('a', 'b', 'c') };
    expect(publishDialog({ kind: 'removed', page: 4, lastPage: 4 }, draft)!.lines[0]).toBe('You removed page 4 of Chapter 2: The Long Road. Links people have shared to page 4 of Chapter 2 will point to different pages.');
  });
  it('words a renumbered chapter without a title', () => {
    const draft: ChapterLike = { number: 5, pages: withAlt('a') };
    expect(publishDialog({ kind: 'renumbered', from: 2, to: 5 }, draft)!.lines[0]).toBe("You changed chapter 2 to chapter 5. Links people have shared to its pages use chapter 2's addresses, so they'll stop working, or open a different chapter if you later add a new chapter 2.");
    const blank: ChapterLike = { number: 5, title: '  ', pages: withAlt('a') };
    expect(publishDialog({ kind: 'renumbered', from: 2, to: 5 }, blank)!.lines[0]).toMatch(/^You changed chapter 2 to chapter 5\./);
  });
  it('labels a chapter whose title is only spaces by its number', () => {
    expect(chapterLabel({ number: 4, title: '   ' })).toBe('Chapter 4');
  });
});
