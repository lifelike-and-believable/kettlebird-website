// Previewing stories and chapters, and View on site (docs/specs/story-reader-pages.md AC-12).
import { describe, expect, it } from 'vitest';
import { fixtureSource, loadPreview } from '../../src/lib/preview/load';
import { previewTarget, PREVIEW_MESSAGES } from '../../src/lib/preview/targets';
import { viewOnSitePath, LATEST_QUERY } from '../../sanity-studio/lib/live-status';
import { isPreviewable } from '../../sanity-studio/lib/preview';
import { FIXTURE_DRAFTS, FIXTURE_PREVIEW_KEY, FIXTURE_PUBLISHED } from '../fixtures/drafts';

const source = fixtureSource({ key: FIXTURE_PREVIEW_KEY, published: FIXTURE_PUBLISHED, drafts: FIXTURE_DRAFTS });
const url = (kind: string, id: string) => new URL(`https://site.test/preview/${kind}/${id}?sanity-preview-secret=${FIXTURE_PREVIEW_KEY}`);
const load = (kind: string, id: string) => loadPreview(kind, id, url(kind, id), source);
const para = [{ _type: 'block', children: [{ _type: 'span', text: 'x' }] }];

describe('story-reader-pages#AC-12 preview targets', () => {
  it('previews a story with a page as that page, and others on the Writing page', () => {
    expect(previewTarget({ _id: 's', _type: 'writtenWork', title: 'A', slug: { current: 'a' }, content: para })).toEqual({ page: 'story', name: 'the A story page' });
    expect(previewTarget({ _id: 's', _type: 'writtenWork', title: 'A', slug: { current: 'a' } }, { storyHasChapters: true })).toEqual({ page: 'story', name: 'the A story page' });
    expect(previewTarget({ _id: 's', _type: 'writtenWork', title: 'A', slug: { current: 'a' } })).toEqual({ page: 'writing', name: 'the Writing page', anchor: 'item-s' });
    expect(previewTarget({ _id: 's', _type: 'writtenWork', title: 'A', content: para })).toEqual({
      page: 'story', name: 'the A story page', message: 'Add a web address so readers can find this story. The preview needs it too.',
    });
  });

  it('previews a chapter as its page, if it has text and its story a web address', () => {
    const story = { _id: 's', _type: 'writtenWork', title: 'A', slug: { current: 'a' } };
    expect(previewTarget({ _id: 'c', _type: 'storyChapter', number: 2, title: 'Two', content: para }, { story })).toEqual({ page: 'chapter', name: 'the page for Chapter 2: Two' });
    expect(previewTarget({ _id: 'c', _type: 'storyChapter', number: 3, content: [] }, { story })).toEqual({ page: 'chapter', name: 'the page for Chapter 3', message: "Add the chapter's text to preview it." });
    expect(previewTarget({ _id: 'c', _type: 'storyChapter', number: 3, content: para }, { story: { ...story, slug: undefined } }).message).toBe(PREVIEW_MESSAGES.noStoryAddress);
  });
});

describe('story-reader-pages#AC-12 preview pages', () => {
  it('shows a story\'s draft text, ticked or not', async () => {
    const result = await load('writtenWork', 'story-song');
    expect(result?.model.page).toBe('story');
    if (result?.model.page !== 'story') return;
    // story-mature-content AC-8: the draft is ticked.
    expect(result.model.story.mature).toBe(true);
    expect(JSON.stringify(result.model.story.text)).toContain('Draft text.');
  });

  it('shows a story in chapters with its published chapters', async () => {
    const result = await load('writtenWork', 'story-road');
    if (result?.model.page !== 'story') throw new Error(`page ${result?.model.page}`);
    expect(result.model.story.chapters.map((c) => c.number)).toEqual([1, 2]);
  });

  it('shows a chapter\'s draft among its story\'s chapters', async () => {
    const result = await load('storyChapter', 'road-2');
    if (result?.model.page !== 'chapter') throw new Error(`page ${result?.model.page}`);
    expect(result.model.chapter.number).toBe(2);
    expect(JSON.stringify(result.model.chapter.text)).toContain('The ridge was steeper.');
    expect(result.model.story.slug).toBe('the-long-road');
    expect(result.info.name).toBe('the page for Chapter 2: Over the Ridge');
  });

  it('uses a never-published story\'s draft, and says so', async () => {
    const result = await load('storyChapter', 'new-1');
    if (result?.model.page !== 'chapter') throw new Error(`page ${result?.model.page}`);
    expect(result.model.story.title).toBe('New Story');
    expect(result.info.notes).toContain("The story isn't published yet; it's shown as it will be.");
  });

  it('explains what a preview needs', async () => {
    expect((await load('storyChapter', 'road-5'))?.info.message).toBe("Add the chapter's text to preview it.");
    expect((await load('writtenWork', 'story-nameless'))?.info.message).toBe(PREVIEW_MESSAGES.noStoryAddress);
    expect((await load('writtenWork', 'story-elsewhere'))?.model.page).toBe('writing');
  });
});

describe('story-reader-pages#AC-12 editor', () => {
  it('previews chapters, and opens a story\'s or chapter\'s page on the site', () => {
    expect(isPreviewable('storyChapter')).toBe(true);
    expect(LATEST_QUERY).toMatch(/"storySlug": story->slug\.current/);
    expect(LATEST_QUERY).toMatch(/"hasPage":/);
    const c = (over: object) => ({ _type: 'writtenWork', _updatedAt: '2026-11-05T00:00:00Z', ...over });
    expect(viewOnSitePath(c({ slug: 'the-long-road', hasPage: true }))).toBe('/writing/the-long-road');
    expect(viewOnSitePath(c({ slug: 'elsewhere-tale', hasPage: false }))).toBe('/writing');
    expect(viewOnSitePath(c({ _type: 'storyChapter', storySlug: 'the-long-road', number: 2 }))).toBe('/writing/the-long-road/2');
    expect(viewOnSitePath(c({ _type: 'storyChapter', number: 2 }))).toBe('/writing');
  });
});
