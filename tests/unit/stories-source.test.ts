// Reading stories at build time (docs/specs/story-reader-pages.md AC-1, AC-14).
import { describe, expect, it } from 'vitest';
import { fromSanity, STORIES_QUERY } from '../../src/lib/stories/source';

describe('story-reader-pages#AC-1 source', () => {
  it('reads each story with its chapters, in number order', () => {
    expect(STORIES_QUERY).toMatch(/\*\[_type == "writtenWork"\]/);
    expect(STORIES_QUERY).toMatch(/"chapters": \*\[_type == "storyChapter" && story\._ref == \^\._id\] \| order\(number asc\)/);
    for (const field of ['content', 'mature', 'rating', 'contentNotes', 'status', 'externalLink', 'publishDate', 'genre', 'excerpt']) expect(STORIES_QUERY).toContain(field);
  });

  it('turns a stored story into the model, keeping only known values', () => {
    const para = { _type: 'block', children: [{ _type: 'span', text: 'x' }] };
    expect(
      fromSanity({
        _id: 'a', title: 'A', slug: { current: 'a' }, excerpt: 'About.', genre: ['Fantasy'], mature: true, contentNotes: 'Notes.',
        status: 'complete', externalLink: 'https://archiveofourown.org/works/1', publishDate: '2026-10-01', content: [para],
        chapters: [{ number: 1, title: 'One', publishDate: '2026-10-02', content: [para] }, { title: '' }],
      }),
    ).toEqual({
      id: 'a', slug: 'a', title: 'A', description: 'About.', cover: undefined, genres: ['Fantasy'], mature: true, contentNotes: 'Notes.',
      status: 'complete', link: 'https://archiveofourown.org/works/1', date: '2026-10-01', text: [para],
      chapters: [{ number: 1, title: 'One', date: '2026-10-02', text: [para] }, { number: 0, title: undefined, date: undefined, text: [] }],
    });
    expect(fromSanity({ _id: 'b', title: 'B', slug: { current: '' }, rating: 'spicy', status: 'paused' })).toEqual({
      id: 'b', slug: undefined, title: 'B', description: undefined, cover: undefined, genres: [], mature: false, contentNotes: undefined,
      status: undefined, link: undefined, date: undefined, text: [], chapters: [],
    });
  });
});
