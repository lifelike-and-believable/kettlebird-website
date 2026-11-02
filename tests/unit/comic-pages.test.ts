// Unit tests for the editor's comic page logic. Criteria: docs/specs/comic-publish-pages.md.
import { describe, expect, it } from 'vitest';
import {
  altTextMessage, chapterLabel, chapterRow, DID_NOT_UPLOAD, duplicateChapterMessage, isAcceptedImage,
  linkChange, missingAltCount, naturalCompare, nextChapterNumber, NOT_AN_IMAGE, publishDialog,
  publishLabel, retryable, SERIES_SLUG_MESSAGE, sortByFileName, type ChapterLike,
  deleteSeriesDialog, chapterDocsToDelete, publishedIds, altTextRule, ALT_TEXT_WARNING, type RuleLike,
} from '../../sanity-studio/lib/comic-pages';

const pages = (...keys: string[]) => keys.map((k) => ({ _key: k, altText: `alt ${k}` }));
const ch = (number: number, keys: string[], title = 'The Long Road'): ChapterLike => ({ number, title, pages: pages(...keys) });

describe('comic-publish-pages#AC-1 natural file order', () => {
  it('compares numbers as numbers, ignoring case', () => {
    const names = ['page-10.png', 'Page-2.png', 'page-1.png', 'cover.png'];
    expect(sortByFileName(names.map((name) => ({ name }))).map((f) => f.name)).toEqual(['cover.png', 'page-1.png', 'Page-2.png', 'page-10.png']);
    expect(naturalCompare('ch3-p9', 'ch3-p10')).toBeLessThan(0);
  });
});

describe('comic-publish-pages#AC-2 append uploads in order', () => {
  it('sorts a dropped batch without touching the input array', () => {
    const batch = [{ name: 'b.png' }, { name: 'a.png' }];
    expect(sortByFileName(batch).map((f) => f.name)).toEqual(['a.png', 'b.png']);
    expect(batch[0].name).toBe('b.png');
  });
});

describe('comic-publish-pages#AC-3 accepted file types', () => {
  it('accepts common image types and rejects others', () => {
    for (const type of ['image/png', 'image/jpeg', 'image/tiff', 'image/webp', 'image/gif']) expect(isAcceptedImage({ name: 'x', type })).toBe(true);
    for (const [name, type] of [['p.psd', 'image/vnd.adobe.photoshop'], ['p.pdf', 'application/pdf'], ['n.txt', 'text/plain'], ['p.psd', '']]) expect(isAcceptedImage({ name, type })).toBe(false);
    expect(isAcceptedImage({ name: 'page.TIF', type: '' })).toBe(true);
    expect(NOT_AN_IMAGE).toBe("This isn't an image file");
  });
});

describe('comic-publish-pages#AC-4 upload queue states', () => {
  it('only failed uploads can be retried', () => {
    expect(retryable({ name: 'a', state: 'failed' })).toBe(true);
    expect(retryable({ name: 'a', state: 'rejected' })).toBe(false);
    expect(retryable({ name: 'a', state: 'done' })).toBe(false);
    expect(DID_NOT_UPLOAD).toBe("Didn't upload");
  });
});

describe('comic-publish-pages#AC-5 publish label while uploading', () => {
  it('counts finished uploads out of the batch while any are in progress', () => {
    expect(publishLabel([{ name: 'a', state: 'done' }, { name: 'b', state: 'uploading' }, { name: 'c', state: 'waiting' }, { name: 'd', state: 'rejected' }])).toBe('Uploading 1 of 3…');
    expect(publishLabel([{ name: 'a', state: 'done' }, { name: 'b', state: 'failed' }])).toBe('Publish');
    expect(publishLabel([])).toBe('Publish');
  });
});

describe('comic-publish-pages#AC-6 alt text count and wording', () => {
  it('counts pages with empty or blank alt text', () => {
    expect(missingAltCount([{ _key: 'a' }, { _key: 'b', altText: '  ' }, { _key: 'c', altText: 'x' }])).toBe(2);
    expect(altTextMessage(0)).toBeNull();
    expect(altTextMessage(1)).toBe('1 page needs alt text');
    expect(altTextMessage(3)).toBe('3 pages need alt text');
  });
});

describe('comic-publish-pages#AC-7 link changes between published and draft', () => {
  const published = ch(2, ['a', 'b', 'c', 'd']);
  it('reports nothing for an unpublished chapter, no change, or appended pages', () => {
    expect(linkChange(null, ch(2, ['a']))).toEqual({ kind: 'none' });
    expect(linkChange(published, ch(2, ['a', 'b', 'c', 'd']))).toEqual({ kind: 'none' });
    expect(linkChange(published, ch(2, ['a', 'b', 'c', 'd', 'e']))).toEqual({ kind: 'none' });
  });
  it('reports a moved page from the first changed position to the last published page', () => {
    expect(linkChange(published, ch(2, ['a', 'c', 'b', 'd']))).toEqual({ kind: 'moved', page: 2, lastPage: 4 });
  });
  it('reports a removed page', () => {
    expect(linkChange(published, ch(2, ['a', 'b', 'd']))).toEqual({ kind: 'removed', page: 3, lastPage: 4 });
  });
  it('reports a page inserted before published pages', () => {
    expect(linkChange(published, ch(2, ['a', 'x', 'b', 'c', 'd']))).toEqual({ kind: 'inserted', page: 2, lastPage: 4 });
  });
  it('reports a changed chapter number first', () => {
    expect(linkChange(published, ch(5, ['a', 'b', 'c', 'd']))).toEqual({ kind: 'renumbered', from: 2, to: 5 });
  });
});

describe('comic-publish-pages#AC-8 publish dialog content', () => {
  const draft = ch(2, ['a', 'b', 'c'], 'The Long Road');
  it('words each link change as the design does', () => {
    expect(publishDialog({ kind: 'moved', page: 3, lastPage: 24 }, draft)).toEqual({
      title: 'Some page links will change',
      lines: ['You moved page 3 of Chapter 2: The Long Road. Links people have shared to pages 3 to 24 of Chapter 2 will point to different pages.'],
    });
    expect(publishDialog({ kind: 'removed', page: 5, lastPage: 24 }, draft)!.lines[0]).toBe('You removed page 5 of Chapter 2: The Long Road. Links people have shared to pages 5 to 24 of Chapter 2 will point to different pages.');
    expect(publishDialog({ kind: 'inserted', page: 3, lastPage: 24 }, draft)!.lines[0]).toBe('You added a page before page 3 of Chapter 2: The Long Road. Links people have shared to pages 3 to 24 of Chapter 2 will point to different pages.');
    expect(publishDialog({ kind: 'renumbered', from: 2, to: 5 }, { ...draft, number: 5 })!.lines[0]).toBe("You changed The Long Road from chapter 2 to chapter 5. Links people have shared to its pages use chapter 2's addresses, so they'll stop working, or open a different chapter if you later add a new chapter 2.");
  });
  it('adds the alt text reminder, or shows it alone', () => {
    const noAlt = { ...draft, number: 3, title: 'Homeward', pages: [{ _key: 'a' }, { _key: 'b' }, { _key: 'c', altText: 'x' }] };
    expect(publishDialog({ kind: 'none' }, noAlt)).toEqual({
      title: 'Some pages have no alt text',
      lines: ["2 pages in Chapter 3: Homeward have no alt text, so people using screen readers won't be able to follow them."],
    });
    expect(publishDialog({ kind: 'moved', page: 1, lastPage: 3 }, noAlt)!.lines[1]).toBe('Reminder: 2 pages in this chapter have no alt text.');
    expect(publishDialog({ kind: 'none' }, draft)).toBeNull();
  });
  it('labels chapters as the site does', () => {
    expect(chapterLabel({ number: 2, title: 'The Long Road' })).toBe('Chapter 2: The Long Road');
    expect(chapterLabel({ number: 4 })).toBe('Chapter 4');
    expect(chapterLabel({ number: 0, title: 'Prologue' })).toBe('Prologue');
  });
});

describe('comic-publish-pages#AC-9 duplicate chapter numbers', () => {
  it('blocks a number another chapter of the series uses', () => {
    expect(duplicateChapterMessage(2, [1, 2, 3])).toBe('Chapter 2 already exists in this series. Choose another number.');
    expect(duplicateChapterMessage(4, [1, 2, 3])).toBeNull();
  });
});

describe('comic-publish-pages#AC-10 schema messages', () => {
  it('asks for a web address in plain words', () => {
    expect(SERIES_SLUG_MESSAGE).toBe('Add a web address so readers can find this comic.');
  });
});

describe('comic-publish-pages#AC-11 chapter rows and next number', () => {
  it('describes each chapter and suggests the next number', () => {
    expect(chapterRow({ number: 2, title: 'The Long Road', pageCount: 24, published: true })).toBe('Chapter 2: The Long Road · 24 pages · On the site');
    expect(chapterRow({ number: 3, title: 'Homeward', pageCount: 1, published: false })).toBe('Chapter 3: Homeward · 1 page · Not published yet');
    expect(chapterRow({ number: 4, pageCount: 0, published: false })).toBe('Chapter 4 · 0 pages · hidden from readers · Not published yet');
    expect(nextChapterNumber([1, 2, 4])).toBe(5);
    expect(nextChapterNumber([])).toBe(1);
    expect(nextChapterNumber([0])).toBe(1);
  });
});

describe('comic-publish-pages#AC-15 publishing a new series with its chapter', () => {
  const draft = ch(1, ['a'], 'The Kettle');
  it('asks to publish both when nothing else needs saying', () => {
    expect(publishDialog({ kind: 'none' }, draft, { newSeriesTitle: 'Kettle Tales' })).toEqual({
      title: 'Publish the series too',
      lines: ["Kettle Tales isn't on the site yet, so publishing this chapter publishes it too."],
      confirm: 'Publish both',
    });
  });
  it('adds the line to the other dialogs', () => {
    const noAlt = { ...draft, pages: [{ _key: 'a' }] };
    const dialog = publishDialog({ kind: 'none' }, noAlt, { newSeriesTitle: 'Kettle Tales' })!;
    expect(dialog.title).toBe('Some pages have no alt text');
    expect(dialog.lines[1]).toBe("Kettle Tales isn't on the site yet, so publishing this chapter publishes it too.");
    expect(dialog.confirm).toBeUndefined(); // the action's default, Publish anyway
  });
  it('leaves the dialogs unchanged for a series already on the site', () => {
    expect(publishDialog({ kind: 'none' }, draft)).toBeNull();
    expect(publishDialog({ kind: 'none' }, draft, {})).toBeNull();
  });
});

describe('comic-publish-pages#AC-16 deleting a series with its chapters', () => {
  it('names each chapter once, without draft prefixes', () => {
    expect(publishedIds(['c1', 'drafts.c1', 'drafts.c2', 'c3'])).toEqual(['c1', 'c2', 'c3']);
    expect(publishedIds([])).toEqual([]);
    // Only a leading drafts. prefix is a draft; the same text later in an ID is part of the name.
    expect(publishedIds(['old-drafts.c4'])).toEqual(['old-drafts.c4']);
  });
  it('deletes every chapter, published and draft, before the series', () => {
    expect(chapterDocsToDelete(['c1', 'drafts.c1', 'drafts.c2'])).toEqual(['c1', 'drafts.c1', 'c2', 'drafts.c2']);
    expect(chapterDocsToDelete([])).toEqual([]);
  });
  it('says how many chapters go with the comic', () => {
    expect(deleteSeriesDialog('Kettle Tales', 3)).toEqual({
      title: 'Delete Kettle Tales and its 3 chapters?',
      lines: ["The comic, its chapters and their pages come off the site with the next update. This can't be undone."],
      confirm: 'Delete comic and chapters',
    });
    expect(deleteSeriesDialog('Kettle Tales', 1).title).toBe('Delete Kettle Tales and its chapter?');
  });
  it('asks plainly when the comic has no chapters', () => {
    expect(deleteSeriesDialog('Kettle Tales', 0)).toEqual({
      title: 'Delete Kettle Tales?',
      lines: ["It comes off the site with the next update. This can't be undone."],
      confirm: 'Delete',
    });
  });
  it('names an untitled comic "this comic"', () => {
    expect(deleteSeriesDialog('  ', 2).title).toBe('Delete this comic and its 2 chapters?');
    expect(deleteSeriesDialog(undefined, 0).title).toBe('Delete this comic?');
  });
});

describe('comic-publish-pages#AC-8 missing alt text never blocks Publish', () => {
  // Records what the schema asks of Sanity's Rule, as Sanity's own Rule would.
  class FakeRule implements RuleLike<FakeRule> {
    level = 'error';
    check?: (value: unknown) => true | string;
    custom(fn: (value: unknown) => true | string) { this.check = fn; return this; }
    warning() { this.level = 'warning'; return this; }
  }
  it('is a warning, not an error', () => {
    expect(altTextRule(new FakeRule()).level).toBe('warning');
  });
  it('asks for alt text only when it is empty', () => {
    const rule = altTextRule(new FakeRule());
    expect(rule.check!('Fox looks at the kettle.')).toBe(true);
    expect(rule.check!('   ')).toBe(ALT_TEXT_WARNING);
    expect(rule.check!(undefined)).toBe(ALT_TEXT_WARNING);
    expect(ALT_TEXT_WARNING).toBe('Add alt text so people using screen readers can follow the story');
  });
});
