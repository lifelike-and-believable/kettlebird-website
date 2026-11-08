// Unit tests for the preview's pure logic: src/lib/preview/*, src/lib/deploy-routes.ts and
// sanity-studio/lib/preview.ts. Criteria: docs/specs/content-editing-preview.md.
import { describe, expect, it } from 'vitest';
import { isPreviewKind, PREVIEW_KINDS, previewTarget, type RawDoc } from '../../src/lib/preview/targets';
import { overlay, previewChanges } from '../../src/lib/preview/changes';
import { readFileSync } from 'node:fs';
import { sourceToRegex, withSiteRoutes, type VercelConfig } from '../../src/lib/deploy-routes';
import {
  isPreviewable,
  PREVIEW_TEXT,
  PREVIEWABLE_TYPES,
  previewUrl,
  regionName,
  scaleToFit,
  SECRET_RENEW_MS,
  SETTLE_MS,
  WIDTHS,
} from '../../sanity-studio/lib/preview';

const doc = (type: string, fields: Record<string, unknown> = {}, id = `${type}-1`): RawDoc => ({ _id: id, _type: type, ...fields });
// A story's chapter joined these with story-reader-pages AC-12.
// And a portfolio subfolder with portfolio-folders AC-23.
const ALL = ['galleryItem', 'portfolioSubfolder', 'comicChapter', 'comicSeries', 'commissionSettings', 'aboutPage', 'homePage', 'contactSettings', 'writtenWork', 'storyChapter', 'product', 'commissionType'];

describe('content-editing-preview#AC-1 previewable types', () => {
  it('the editor and the site agree on the kinds of item', () => {
    expect([...PREVIEWABLE_TYPES].sort()).toEqual([...ALL].sort());
    expect([...PREVIEW_KINDS].sort()).toEqual([...ALL].sort());
    for (const t of ALL) {
      expect(isPreviewable(t)).toBe(true);
      expect(isPreviewKind(t)).toBe(true);
    }
  });
  it('other kinds have no preview', () => {
    for (const t of ['siteStatus', 'sanity.previewUrlSecret', 'newsPost', '']) {
      expect(isPreviewable(t)).toBe(false);
      expect(isPreviewKind(t)).toBe(false);
    }
  });
});

describe('content-editing-preview#AC-2 AC-10 AC-11 preview pane text', () => {
  it("uses the design's words", () => {
    expect(PREVIEW_TEXT).toEqual({
      preview: 'Preview',
      hide: 'Hide preview',
      computer: 'Computer',
      phone: 'Phone',
      showOpened: 'Show it opened',
      ribbon: "Preview: not on the site yet. This item's unpublished changes are shown, outlined; everything else is as published.",
      published: 'Published. The site matches this preview once the status at the top right says Live.',
      updated: 'Updated just now',
      cantLoad: "Can't show the preview right now.",
      tryAgain: 'Try again',
      saved: 'Your changes are saved. You can still publish.',
      linksOff: "Links don't work in the preview",
      announced: 'Preview updated',
    });
  });
  it('computer is 1280 pixels, scaled to fit; phone is 375, never enlarged', () => {
    expect(WIDTHS).toEqual({ computer: 1280, phone: 375 });
    expect(scaleToFit(640, 1280)).toBe(0.5);
    expect(scaleToFit(1280, 1280)).toBe(1);
    expect(scaleToFit(2000, 375)).toBe(1);
  });
  it('names the region for screen readers', () => {
    expect(regionName('the Commissions page')).toBe('Preview of the Commissions page');
  });
  it('builds the preview address with the key, the open page and Show it opened', () => {
    expect(previewUrl('https://newsite.kettlebird.com', 'commissionSettings', 'commissionSettings', { secret: 'abc' })).toBe(
      'https://newsite.kettlebird.com/preview/commissionSettings/commissionSettings?sanity-preview-secret=abc',
    );
    expect(previewUrl('https://x.test/', 'comicChapter', 'ch 2', { secret: 's/1', page: 3 })).toBe(
      'https://x.test/preview/comicChapter/ch%202?sanity-preview-secret=s%2F1&page=3',
    );
    expect(previewUrl('https://x.test', 'galleryItem', 'g1', { secret: 's', opened: true })).toBe(
      'https://x.test/preview/galleryItem/g1?sanity-preview-secret=s&opened=1',
    );
  });
});

describe('content-editing-preview#AC-6 update timing', () => {
  it('reloads about a second and a half after saving, and renews the hour-long key before it runs out', () => {
    expect(SETTLE_MS).toBeGreaterThanOrEqual(1000);
    expect(SETTLE_MS).toBeLessThanOrEqual(2000);
    expect(SECRET_RENEW_MS).toBe(50 * 60 * 1000);
  });
});

describe('content-editing-preview#AC-4 AC-10 preview targets', () => {
  it('Site settings items open their pages', () => {
    expect(previewTarget(doc('commissionSettings', { status: 'closed' }))).toEqual({ page: 'commissions', name: 'the Commissions page' });
    expect(previewTarget(doc('homePage', { artistText: 'Hi' }))).toEqual({ page: 'home', name: 'the home page', anchor: 'artist-text' });
    expect(previewTarget(doc('contactSettings', { email: 'a@b.c' }))).toEqual({
      page: 'home',
      name: 'the home page, scrolled to the social links and footer',
      anchor: 'social-links',
    });
    expect(previewTarget(doc('aboutPage', { bio: 'x' }), { firstChanged: 'bio' })).toEqual({ page: 'about', name: 'the about page', anchor: 'about-bio' });
    expect(previewTarget(doc('aboutPage', {}))).toEqual({ page: 'about', name: 'the about page' });
  });
  it('an art piece opens the portfolio at its first section, or opened', () => {
    const piece = doc('galleryItem', { title: 'Fox', image: { asset: { _ref: 'i' } }, category: ['fanart', 'featured'] }, 'g1');
    expect(previewTarget(piece)).toEqual({ page: 'portfolio', name: 'the Portfolio', anchor: 'section-fanart' });
    expect(previewTarget(piece, { opened: true })).toEqual({ page: 'portfolio', name: 'the Portfolio, with this piece opened', anchor: 'section-fanart' });
  });
  it("an art piece without a section or a picture can't be shown", () => {
    expect(previewTarget(doc('galleryItem', { image: { asset: { _ref: 'i' } }, category: [] })).message).toBe(
      'Choose a portfolio section to see where this piece goes.',
    );
    expect(previewTarget(doc('galleryItem', { category: ['original'] })).message).toBe('Add the picture to preview it.');
  });
  it('a series opens its page; without a web address it says so', () => {
    expect(previewTarget(doc('comicSeries', { title: 'Kettle Tales', slug: { current: 'kettle-tales' } }))).toEqual({
      page: 'series',
      name: 'the Kettle Tales series page',
    });
    expect(previewTarget(doc('comicSeries', { title: 'Kettle Tales' })).message).toBe(
      'Add a web address so readers can find this comic. The preview needs it too.',
    );
  });
  it('a chapter opens the reader at the open page, or page 1', () => {
    const series = doc('comicSeries', { title: 'Kettle Tales', slug: { current: 'kettle-tales' } }, 'series-1');
    const chapter = doc('comicChapter', { number: 2, pages: [{ _key: 'a' }, { _key: 'b' }, { _key: 'c' }] });
    expect(previewTarget(chapter, { series, page: 3 })).toEqual({ page: 'reader', name: 'Chapter 2, page 3 in the reader' });
    expect(previewTarget(chapter, { series })).toEqual({ page: 'reader', name: 'Chapter 2, page 1 in the reader' });
    expect(previewTarget(chapter, { series, page: 9 }).name).toBe('Chapter 2, page 3 in the reader');
  });
  it("a chapter without pages, or whose series has no web address, can't be shown", () => {
    const series = doc('comicSeries', { title: 'K', slug: { current: 'k' } });
    expect(previewTarget(doc('comicChapter', { number: 1, pages: [] }), { series }).message).toBe('Add a page to preview this chapter.');
    expect(previewTarget(doc('comicChapter', { number: 1, pages: [{ _key: 'a' }] }), { series: doc('comicSeries', { title: 'K' }) }).message).toBe(
      'Add a web address so readers can find this comic. The preview needs it too.',
    );
    expect(previewTarget(doc('comicChapter', { number: 1, pages: [{ _key: 'a' }] })).message).toBe(
      'Add a web address so readers can find this comic. The preview needs it too.',
    );
  });
  it('stories, products and commission types open their pages at the item', () => {
    expect(previewTarget(doc('writtenWork', {}, 'w1'))).toEqual({ page: 'writing', name: 'the Writing page', anchor: 'item-w1' });
    expect(previewTarget(doc('product', {}, 'p1'))).toEqual({ page: 'shop', name: 'the shop', anchor: 'item-p1' });
    expect(previewTarget(doc('commissionType', {}, 'c1'))).toEqual({ page: 'commissions', name: 'the Commissions page', anchor: 'item-c1' });
  });
});

describe('content-editing-preview#AC-3 overlay', () => {
  it("puts this item's draft in place of its published version and leaves the rest", () => {
    const a = doc('product', { name: 'A' }, 'a');
    const b = doc('product', { name: 'B' }, 'b');
    const draftB = { ...b, _id: 'drafts.b', name: 'B2' };
    expect(overlay([a, b], draftB)).toEqual([a, { ...b, name: 'B2' }]);
  });
  it('adds a never-published draft, under its published id', () => {
    const a = doc('product', { name: 'A' }, 'a');
    expect(overlay([a], { _id: 'drafts.new', _type: 'product', name: 'N' })).toEqual([a, { _id: 'new', _type: 'product', name: 'N' }]);
  });
});

describe('content-editing-preview#AC-5 changes', () => {
  it('outlines changed top-level fields, ignoring system fields', () => {
    const pub = doc('comicSeries', { title: 'K', description: 'Old', _rev: '1', _updatedAt: 'x' }, 's');
    const draft = { ...pub, _id: 'drafts.s', description: 'New', _rev: '2', _updatedAt: 'y' };
    expect(previewChanges(pub, draft)).toEqual({ outlined: ['description'], notes: [] });
  });
  it('a list with a changed item outlines the whole list', () => {
    const pub = doc('aboutPage', { facts: [{ _key: 'a', label: 'Lives in', value: 'Toronto' }] });
    const draft = { ...pub, facts: [{ _key: 'a', label: 'Lives in', value: 'Montreal' }] };
    expect(previewChanges(pub, draft).outlined).toEqual(['facts']);
  });
  it('lists changes the page cannot show', () => {
    const piece = doc('galleryItem', { altText: 'A fox.', category: ['original'] });
    expect(previewChanges(piece, { ...piece, altText: 'A fox at dawn.' })).toEqual({ outlined: [], notes: ['Not visible on the page: alt text'] });
    const about = doc('aboutPage', { portrait: { asset: { _ref: 'p' }, alt: 'Me' } });
    expect(previewChanges(about, { ...about, portrait: { asset: { _ref: 'p' }, alt: 'Me, smiling' } }).notes).toEqual(['Not visible on the page: alt text']);
    const contact = doc('contactSettings', { email: 'a@b.c' });
    expect(previewChanges(contact, { ...contact, email: 'star@kettlebird.com' })).toEqual({
      outlined: [],
      notes: ['Not visible on the page: where the email buttons send people (now star@kettlebird.com)'],
    });
  });
  it('lists removed links by name', () => {
    const pub = doc('contactSettings', { links: [{ _key: 'i', name: 'Instagram', url: 'https://i' }, { _key: 'b', name: 'Bluesky', url: 'https://b' }] });
    const draft = { ...pub, links: [{ _key: 'b', name: 'Bluesky', url: 'https://b' }] };
    expect(previewChanges(pub, draft)).toEqual({ outlined: ['links'], notes: ['Removed: Instagram link'] });
  });
  it('closing commissions lists what leaves the page', () => {
    const pub = doc('commissionSettings', { status: 'open' });
    expect(previewChanges(pub, { ...pub, status: 'closed' })).toEqual({
      outlined: ['status'],
      notes: ['Removed from the page: How it works, Ready to order? and the commission email buttons'],
    });
    expect(previewChanges({ ...pub, status: 'closed' }, pub).notes).toEqual([]);
  });
  it('a never-published item outlines everything it has', () => {
    expect(previewChanges(undefined, { _id: 'drafts.s', _type: 'comicSeries', title: 'K', description: 'D' }).outlined).toEqual(['title', 'description']);
  });
  it("names an art piece's other sections, an unpublished series and a duplicate number", () => {
    const piece = doc('galleryItem', { title: 'F' });
    expect(previewChanges(piece, piece, { otherSections: ['Featured', 'Fan Work'] }).notes).toEqual(['Also in: Featured, Fan Work']);
    const ch = doc('comicChapter', { number: 2 });
    expect(previewChanges(ch, ch, { seriesUnpublished: true, duplicateNumber: 2 }).notes).toEqual([
      "The series isn't published yet; it's shown as it will be.",
      'Chapter 2 already exists in this series; publishing is blocked until you change one',
    ]);
  });
});

describe('content-editing-preview#AC-12 deploy routes', () => {
  const adapter: VercelConfig = {
    version: 3,
    routes: [
      { handle: 'filesystem' },
      { src: '^/_astro/(.*)$', headers: { 'cache-control': 'public, max-age=31536000, immutable' }, continue: true },
      { src: '^/preview/([^/]+?)/([^/]+?)/?$', dest: '_render' },
      { src: '^/.*$', dest: '/404.html', status: 404 },
    ],
  };
  const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));

  it("turns vercel.json's sources into regular expressions", () => {
    expect(sourceToRegex('/(.*)')).toBe('^/(.*)$');
    expect(sourceToRegex('/studio')).toBe('^/studio$');
    expect(sourceToRegex('/studio/(.*)')).toBe('^/studio/(.*)$');
    expect(sourceToRegex('/studio/:path*')).toBe('^/studio(?:/(.*))?$');
    expect(sourceToRegex('/build-info.json')).toBe('^/build-info\\.json$');
  });
  it("puts vercel.json's headers first, in its order, so every response gets them", () => {
    const out = withSiteRoutes(adapter, vercel);
    const headerRoutes = out.routes.slice(0, vercel.headers.length);
    expect(headerRoutes.map((r) => r.src)).toEqual(vercel.headers.map((h: { source: string }) => sourceToRegex(h.source)));
    expect(headerRoutes.every((r) => r.continue === true)).toBe(true);
    expect(headerRoutes[0].headers).toEqual({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Content-Security-Policy': "frame-ancestors 'self'",
      'X-XSS-Protection': '1; mode=block',
    });
    expect(out.routes[vercel.headers.length]).toEqual({ handle: 'filesystem' });
  });
  it("serves the editor for every /studio address, after files and before the adapter's catch-all 404", () => {
    const out = withSiteRoutes(adapter, vercel);
    const rewrite = out.routes.findIndex((r) => r.dest === '/studio/index.html');
    expect(out.routes[rewrite]).toEqual({ src: '^/studio(?:/(.*))?$', dest: '/studio/index.html' });
    expect(rewrite).toBeGreaterThan(out.routes.findIndex((r) => r.handle === 'filesystem'));
    expect(rewrite).toBeLessThan(out.routes.findIndex((r) => r.status === 404));
    expect(out.routes.filter((r) => r.dest === '_render')).toHaveLength(1);
  });
  it('keeps the rest of the config, and is safe to run twice', () => {
    const out = withSiteRoutes({ ...adapter, images: { sizes: [] } } as VercelConfig, vercel);
    expect(out.version).toBe(3);
    expect(out.images).toEqual({ sizes: [] });
    expect(withSiteRoutes(out, vercel).routes).toEqual(out.routes);
  });
  it('without a catch-all, the rewrite goes last', () => {
    const out = withSiteRoutes({ version: 3, routes: [{ handle: 'filesystem' }] }, { rewrites: [{ source: '/a', destination: '/b' }] });
    expect(out.routes).toEqual([{ handle: 'filesystem' }, { src: '^/a$', dest: '/b' }]);
  });
});
