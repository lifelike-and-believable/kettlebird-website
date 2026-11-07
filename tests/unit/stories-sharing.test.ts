// Stories' link previews, news entries and Page not found (docs/specs/story-reader-pages.md AC-9 to AC-11).
import { describe, expect, it } from 'vitest';
import { shownChapters, type Story } from '../../src/lib/stories/model';
import { chapterPreview, newsEntries, storyForMissingPath, storyPreview } from '../../src/lib/stories/sharing';
import type { NewsPost } from '../../src/lib/queries';
import { FIXTURE_STORIES } from '../fixtures/stories';

const SITE = 'https://newsite.kettlebird.com';
const LOGO = `${SITE}/assets/images/site-card.jpg`;
const by = (slug: string) => FIXTURE_STORIES.find((s) => s.slug === slug)!;
const road = by('the-long-road');

describe('story-reader-pages#AC-9 sharing', () => {
  it('previews a story and a chapter with the description and the logo when there is no cover', () => {
    expect(storyPreview(by('the-kettles-song'), SITE)).toEqual({
      title: "The Kettle's Song",
      description: 'A kettle that sings at midnight.',
      image: LOGO,
      url: `${SITE}/writing/the-kettles-song`,
    });
    expect(chapterPreview(road, shownChapters(road)[1], SITE)).toEqual({
      title: 'The Long Road · Chapter 2: Over the Ridge',
      description: 'A fox walks home the long way.',
      image: LOGO,
      url: `${SITE}/writing/the-long-road/2`,
    });
  });

  it('describes a story without a description, and uses its cover for link previews', () => {
    expect(storyPreview(by('finished-tale'), SITE).description).toBe('Finished Tale, a story by Star Goldberg.');
    const withCover: Story = { ...road, description: 'Line one.\nLine two.', cover: { src: 'c.jpg', width: 1, height: 1, social: 'https://cdn/social.jpg' } };
    expect(storyPreview(withCover, SITE)).toMatchObject({ image: 'https://cdn/social.jpg', description: 'Line one. Line two.' });
  });
});

const post = (over: Partial<NewsPost>): NewsPost => ({ _id: 'p', _type: 'writtenWork', title: 'T', slug: { current: '' }, ...over }) as NewsPost;

describe('story-reader-pages#AC-10 news', () => {
  const posts = [
    post({ _id: 'story-elsewhere', title: 'Elsewhere Tale', slug: { current: 'elsewhere-tale' }, publishDate: '2026-06-01', externalLink: 'https://kettlebird.tumblr.com/post/1' }),
    post({ _id: 'story-song', title: "The Kettle's Song", slug: { current: 'the-kettles-song' }, publishDate: '2026-10-01', externalLink: 'https://archiveofourown.org/works/1' }),
    post({ _id: 'art-1', _type: 'galleryItem', title: 'Moon', publishDate: '2026-10-15' }),
    post({ _id: 'story-road', title: 'The Long Road', slug: { current: 'the-long-road' }, publishDate: '2026-09-01' }),
    post({ _id: 'story-unknown', title: 'Unknown', publishDate: '2026-05-01' }),
  ];

  it('links stories to their pages and adds later chapters, newest first', () => {
    const entries = newsEntries(posts, FIXTURE_STORIES);
    expect(entries.map((e) => [e.kind === 'post' ? e.post.title : e.title, e.href, e.date])).toEqual([
      ['The Long Road · Chapter 3', '/writing/the-long-road/3', '2026-11-01'],
      ['The Long Road · Chapter 2: Over the Ridge', '/writing/the-long-road/2', '2026-10-20'],
      ['Moon', '/portfolio', '2026-10-15'],
      ["The Kettle's Song", '/writing/the-kettles-song', '2026-10-01'],
      ['The Long Road', '/writing/the-long-road', '2026-09-01'],
      ['Elsewhere Tale', 'https://kettlebird.tumblr.com/post/1', '2026-06-01'],
      ['Unknown', '/writing', '2026-05-01'],
    ]);
    expect(entries.filter((e) => e.kind === 'post' && e.external).map((e) => e.href)).toEqual(['https://kettlebird.tumblr.com/post/1']);
  });

  it('keeps at most the limit', () => {
    expect(newsEntries(posts, FIXTURE_STORIES, 3)).toHaveLength(3);
    expect(newsEntries([], [])).toEqual([]);
  });
});

describe('story-reader-pages#AC-11 not found', () => {
  const list = [{ slug: 'the-long-road', title: 'The Long Road' }];
  it('finds the story an address belongs to', () => {
    expect(storyForMissingPath('/writing/the-long-road/9', list)).toEqual({ title: 'The Long Road', path: '/writing/the-long-road' });
    expect(storyForMissingPath('/writing/the-long-road/9/', list)).toEqual({ title: 'The Long Road', path: '/writing/the-long-road' });
    expect(storyForMissingPath('/writing/gone/1', list)).toBeUndefined();
    expect(storyForMissingPath('/writing/the-long-road', list)).toBeUndefined();
    expect(storyForMissingPath('/comics/the-long-road/1', list)).toBeUndefined();
  });
});
