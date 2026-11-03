// Edge cases for the preview's pure logic, found by mutation testing.
// Spec: docs/specs/content-editing-preview.md.
import { describe, expect, it } from 'vitest';
import { overlay, previewChanges } from '../../src/lib/preview/changes';
import { partSelector } from '../../src/lib/preview/parts';
import { previewTarget, type RawDoc } from '../../src/lib/preview/targets';
import { pageFromPath, previewUrl } from '../../sanity-studio/lib/preview';

const doc = (type: string, fields: Record<string, unknown> = {}, id = `${type}-1`): RawDoc => ({ _id: id, _type: type, ...fields });

describe('content-editing-preview#AC-4 the open chapter page', () => {
  const pages = [{ _key: 'a' }, { _key: 'b' }, { _key: 'c' }];
  it('reads the open page from the form pane path', () => {
    expect(pageFromPath('pages[_key=="b"]', pages)).toBe(2);
    expect(pageFromPath('pages[_key=="c"].altText', pages)).toBe(3);
    expect(pageFromPath('pages[_key=="a"]', pages)).toBe(1);
  });
  it('no page without a path, an unknown key, or no pages', () => {
    expect(pageFromPath(undefined, pages)).toBeUndefined();
    expect(pageFromPath('title', pages)).toBeUndefined();
    expect(pageFromPath('pages[_key=="z"]', pages)).toBeUndefined();
    expect(pageFromPath('pages[_key=="a"]', undefined)).toBeUndefined();
    expect(pageFromPath('pages[_key=="ab"]', [{ _key: 'a' }, { _key: 'ab' }])).toBe(2);
  });
  it('trims every slash from the end of the site address', () => {
    expect(previewUrl('https://x.test//', 'product', 'p', { secret: 's' })).toBe('https://x.test/preview/product/p?sanity-preview-secret=s');
  });
});

describe('content-editing-preview#AC-5 parts', () => {
  it('maps each field to the part that shows it', () => {
    const cases: [Parameters<typeof partSelector>[0], string, string][] = [
      ['commissionSettings', 'status', 'commission-banner'],
      ['commissionSettings', 'note', 'commission-banner'],
      ['homePage', 'artistText', 'artist-text'],
      ['contactSettings', 'links', 'social-links'],
      ['aboutPage', 'portrait', 'about-portrait'],
      ['aboutPage', 'bio', 'about-bio'],
      ['aboutPage', 'statement', 'about-statement'],
      ['aboutPage', 'facts', 'about-facts'],
      ['comicSeries', 'title', 'series-title'],
      ['comicSeries', 'description', 'series-description'],
      ['comicSeries', 'coverImage', 'series-cover'],
      ['comicSeries', 'status', 'series-tags'],
      ['comicSeries', 'type', 'series-tags'],
      ['comicChapter', 'pages', 'reader-page'],
      ['comicChapter', 'title', 'reader-location'],
      ['comicChapter', 'number', 'reader-location'],
    ];
    for (const [kind, field, name] of cases) expect(partSelector(kind, field, 'x'), `${kind}.${field}`).toBe(`[data-part="${name}"]`);
  });
  it('a card item is outlined whole, whatever changed', () => {
    expect(partSelector('galleryItem', 'title', 'g1')).toBe('[data-part="piece-g1"]');
    expect(partSelector('writtenWork', 'excerpt', 'w1')).toBe('[data-part="item-w1"]');
    expect(partSelector('product', 'price', 'p1')).toBe('[data-part="item-p1"]');
    expect(partSelector('commissionType', 'name', 'c1')).toBe('[data-part="item-c1"]');
  });
  it('a field no part shows has no selector', () => {
    expect(partSelector('contactSettings', 'email', 'x')).toBeUndefined();
    expect(partSelector('comicSeries', 'slug', 'x')).toBeUndefined();
  });
});

describe('content-editing-preview#AC-5 changes, edges', () => {
  it('ignores every system field', () => {
    const pub = doc('product', { name: 'A', _createdAt: '1', _originalId: 'a', _system: { x: 1 } });
    const draft = { ...pub, _createdAt: '2', _originalId: 'drafts.a', _system: { x: 2 } };
    expect(previewChanges(pub, draft)).toEqual({ outlined: [], notes: [] });
  });
  it('a field removed in the draft is outlined', () => {
    expect(previewChanges(doc('comicSeries', { title: 'K', description: 'D' }), doc('comicSeries', { title: 'K' })).outlined).toEqual(['description']);
  });
  it('alt text changed inside a list is a note, not an outline', () => {
    const pub = doc('comicChapter', { pages: [{ _key: 'a', altText: 'One' }] });
    expect(previewChanges(pub, { ...pub, pages: [{ _key: 'a', altText: 'Two' }] })).toEqual({ outlined: [], notes: ['Not visible on the page: alt text'] });
  });
  it('only the contact email is a note; an email field elsewhere is outlined', () => {
    const contact = doc('contactSettings', { email: 'a@b.c' });
    expect(previewChanges(contact, { ...contact, email: undefined }).notes).toEqual([
      'Not visible on the page: where the email buttons send people (now )',
    ]);
    const other = doc('aboutPage', { email: 'a@b.c' });
    expect(previewChanges(other, { ...other, email: 'x@y.z' })).toEqual({ outlined: ['email'], notes: [] });
    expect(previewChanges(undefined, { _id: 'drafts.contactSettings', _type: 'contactSettings', email: 'a@b.c' }).outlined).toEqual(['email']);
  });
  it('removed links are listed only for contact and social links, with a stand-in for a missing name', () => {
    const contact = doc('contactSettings', { links: [{ _key: 'x', url: 'https://x' }, { _key: 'y', name: 'Y', url: 'https://y' }] });
    expect(previewChanges(contact, { ...contact, links: undefined }).notes).toEqual(['Removed: a link', 'Removed: Y link']);
    const other = doc('aboutPage', { links: [{ _key: 'x', name: 'X' }] });
    expect(previewChanges(other, { ...other, links: [] }).notes).toEqual([]);
  });
  it('the closing note is only for Commissions going from open to closed', () => {
    const series = doc('comicSeries', { status: 'open' });
    expect(previewChanges(series, { ...series, status: 'closed' }).notes).toEqual([]);
    const settings = doc('commissionSettings', { status: 'open' });
    expect(previewChanges(settings, settings).notes).toEqual([]);
    expect(previewChanges(undefined, { _id: 'drafts.commissionSettings', _type: 'commissionSettings', status: 'closed' }).notes).toEqual([]);
    expect(previewChanges({ ...settings, status: 'paused' }, { ...settings, status: 'closed' }).notes).toEqual([]);
  });
  it('only a leading drafts. is removed from an id', () => {
    expect(overlay([], { _id: 'xdrafts.y', _type: 'product' })).toEqual([{ _id: 'xdrafts.y', _type: 'product' }]);
  });
});

describe('content-editing-preview#AC-4 AC-10 targets, edges', () => {
  const series = doc('comicSeries', { title: 'K', slug: { current: 'k' } });
  it('names a prologue by its title, and a chapter without a number as chapter 0', () => {
    expect(previewTarget(doc('comicChapter', { number: 0, title: 'Prologue', pages: [{}] }), { series }).name).toBe('Prologue, page 1 in the reader');
    expect(previewTarget(doc('comicChapter', { number: 0, pages: [{}] }), { series }).name).toBe('Chapter 0, page 1 in the reader');
    expect(previewTarget(doc('comicChapter', { pages: [{}] }), { series }).name).toBe('Chapter 0, page 1 in the reader');
    expect(previewTarget(doc('comicChapter', { number: '3', title: 7, pages: [{}] }), { series }).name).toBe('Chapter 0, page 1 in the reader');
  });
  it('keeps the page within the chapter', () => {
    const chapter = doc('comicChapter', { number: 1, pages: [{}, {}] });
    expect(previewTarget(chapter, { series, page: 0 }).name).toBe('Chapter 1, page 1 in the reader');
    expect(previewTarget(chapter, { series, page: -2 }).name).toBe('Chapter 1, page 1 in the reader');
    expect(previewTarget(doc('comicChapter', { number: 1, pages: 'none' }), { series }).name).toBe('Chapter 1, page 1 in the reader');
  });
  it('reads only text sections and a real picture', () => {
    const image = { asset: { _ref: 'i' } };
    expect(previewTarget(doc('galleryItem', { image, category: [1, '', 'wip'] })).anchor).toBe('section-wip');
    expect(previewTarget(doc('galleryItem', { image, category: 'original' })).message).toBe('Choose a portfolio section to see where this piece goes.');
    expect(previewTarget(doc('galleryItem', { image: {}, category: ['original'] })).message).toBe('Add the picture to preview it.');
    expect(previewTarget(doc('galleryItem', { image: {}, category: ['original'] }), { opened: true }).name).toBe('the Portfolio, with this piece opened');
    expect(previewTarget(doc('galleryItem', { category: [] }), { opened: true })).toEqual({
      page: 'portfolio',
      name: 'the Portfolio, with this piece opened',
      message: 'Choose a portfolio section to see where this piece goes.',
    });
  });
  it('a series name and web address are read as text', () => {
    expect(previewTarget(doc('comicSeries', { title: 5, slug: { current: 9 } }))).toEqual({
      page: 'series',
      name: 'the  series page',
      message: 'Add a web address so readers can find this comic. The preview needs it too.',
    });
    expect(previewTarget(doc('comicSeries', { title: 'K', slug: 'k' })).message).toBeDefined();
  });
  it('an unknown kind falls back to the Commissions page', () => {
    expect(previewTarget(doc('mystery'))).toEqual({ page: 'commissions', name: 'the Commissions page' });
  });
});

describe('content-editing-preview mutation edges', () => {
  it('a page without a key never matches', () => {
    expect(pageFromPath('title', [{}])).toBeUndefined();
  });
  it('a link without a key is listed when the links are all removed', () => {
    const contact = doc('contactSettings', { links: [{ name: 'X' }] });
    expect(previewChanges(contact, { ...contact, links: undefined }).notes).toEqual(['Removed: X link']);
  });
  it('a kind with no mapped parts has no selector', () => {
    expect(partSelector('mystery' as never, 'title', 'x')).toBeUndefined();
  });
  it("messages keep their page", () => {
    const series = doc('comicSeries', { title: 'K', slug: { current: 'k' } });
    expect(previewTarget(doc('galleryItem', { category: ['original'] })).page).toBe('portfolio');
    expect(previewTarget(doc('comicChapter', { number: 1, pages: [{}] })).page).toBe('reader');
    expect(previewTarget(doc('comicChapter', { number: 1, pages: [] }), { series }).page).toBe('reader');
  });
  it("names an art piece's other sections as the portfolio does", async () => {
    const { PORTFOLIO_SECTION_TITLES } = await import('../../src/lib/preview/targets');
    expect(PORTFOLIO_SECTION_TITLES).toEqual({
      original: 'Original Work',
      fanart: 'Fan Work',
      commission: 'Past Clients',
      featured: 'Featured',
      wip: 'Work in Progress',
    });
  });
  it('deploy routes: no rewrites, and a :path* only at the end', async () => {
    const { sourceToRegex, withSiteRoutes } = await import('../../src/lib/deploy-routes');
    expect(withSiteRoutes({ version: 3, routes: [{ handle: 'filesystem' }] }, { headers: [] }).routes).toEqual([{ handle: 'filesystem' }]);
    expect(sourceToRegex('/a/:id*/b')).toBe('^/a/:id*/b$');
  });
});
