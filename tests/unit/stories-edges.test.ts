// Edge cases of stories on the site that mutation testing showed nothing checked
// (docs/specs/story-reader-pages.md AC-2, AC-4, AC-7 to AC-11; recorded under the spec's unlocks).
import { describe, expect, it } from 'vitest';
import { alsoOn, chapterNav, latestDate, readNewestPath, sortForWriting, type Story } from '../../src/lib/stories/model';
import { storyForMissingPath, storyPreview } from '../../src/lib/stories/sharing';
import { fromSanity } from '../../src/lib/stories/source';
import { storyHtml } from '../../src/lib/stories/text';
import { FIXTURE_STORIES } from '../fixtures/stories';

const para = (text = 'Words.') => ({ _type: 'block', children: [{ _type: 'span', text }] });
const story = (over: Partial<Story>): Story => ({ id: 'x', slug: 's', title: 'X', genres: [], text: [], chapters: [], ...over });
const road = FIXTURE_STORIES.find((s) => s.slug === 'the-long-road')!;

describe('story-reader-pages#AC-2 edges', () => {
  it('names only the real sites', () => {
    expect(alsoOn('https://archiveofourown.org.example.com/works/1')).toBe('Also elsewhere');
    expect(alsoOn('https://notarchiveofourown.org/works/1')).toBe('Also elsewhere');
    expect(alsoOn('https://www.archiveofourown.org/works/1')).toBe('Also on AO3');
    expect(alsoOn('https://evilko-fi.com/x')).toBe('Also elsewhere');
    expect(alsoOn('https://tumblr.com/kettlebird')).toBe('Also on Tumblr');
    expect(alsoOn('https://tumblr.com.example.com/x')).toBe('Also elsewhere');
    expect(alsoOn('https://wattpad.com/story/1')).toBe('Also on Wattpad');
    expect(alsoOn('https://wattpad.com.example.com/x')).toBe('Also elsewhere');
    expect(alsoOn('https://ko-fi.com.example.com/x')).toBe('Also elsewhere');
  });

  it('dates a story by the later of its own date and its chapters\'', () => {
    expect(latestDate(story({ date: '2026-10-05', chapters: [{ number: 1, date: '2026-09-01', text: [para()] }] }))).toBe('2026-10-05');
    expect(latestDate(story({ chapters: [{ number: 1, date: '2026-09-01', text: [para()] }, { number: 2, text: [para()] }] }))).toBe('2026-09-01');
    expect(latestDate(story({ date: '2026-01-01', chapters: [{ number: 1, date: '2026-12-01', text: [] }] }))).toBe('2026-01-01');
  });

  it('keeps stories with the same date in their order', () => {
    const a = story({ id: 'a', date: '2026-01-01' });
    const b = story({ id: 'b', date: '2026-01-01' });
    expect(sortForWriting([a, b]).map((s) => s.id)).toEqual(['a', 'b']);
    expect(sortForWriting([b, a]).map((s) => s.id)).toEqual(['b', 'a']);
  });
});

describe('story-reader-pages#AC-7 AC-8 edges', () => {
  it('offers the newest chapter from two chapters', () => {
    const two = story({ status: 'inProgress', chapters: [{ number: 1, text: [para()] }, { number: 2, text: [para()] }] });
    expect(readNewestPath(two)).toBe('/writing/s/2');
  });

  it('gives a chapter that isn\'t shown no Previous or Next', () => {
    expect(chapterNav(road, 4)).toStrictEqual({ chapters: '/writing/the-long-road#chapters', end: "That's the newest chapter. More to come." });
  });

  it('gives only the links a chapter has', () => {
    expect(chapterNav(road, 1)).toStrictEqual({ chapters: '/writing/the-long-road#chapters', next: '/writing/the-long-road/2' });
    expect(chapterNav(road, 3)).toStrictEqual({
      previous: '/writing/the-long-road/2', chapters: '/writing/the-long-road#chapters', end: "That's the newest chapter. More to come.",
    });
  });
});

describe('story-reader-pages#AC-4 edges', () => {
  it('reads spans without marks, and never turns other objects into text or breaks', () => {
    expect(storyHtml([{ _type: 'block', children: [{ _type: 'span', text: 'Plain' }] }])).toBe('<p>Plain</p>');
    expect(storyHtml([para('A'), { _type: 'image', children: [{ _type: 'span', text: '***' }] }, para('B')])).toBe('<p>A</p><p>B</p>');
    expect(storyHtml([{ _type: 'quote', children: [{ _type: 'span', text: 'Not shown' }] }])).toBe('');
    const split = { _type: 'block', children: [{ _type: 'span', text: '*' }, { _type: 'span', text: '**' }] };
    expect(storyHtml([para('A'), split, para('B')])).toBe('<p>A</p><hr class="scene-break" aria-label="Scene break"><p>B</p>');
  });
});

describe('story-reader-pages#AC-9 AC-11 edges', () => {
  it('describes a story whose description is only spaces', () => {
    expect(storyPreview(story({ title: 'X', description: '   ' }), 'https://site.test').description).toBe('X, a story by Star Goldberg.');
  });

  it('only matches addresses that start with /writing/', () => {
    expect(storyForMissingPath('/old/writing/s/1', [{ slug: 's', title: 'X' }])).toBeUndefined();
  });
});

describe('story-reader-pages#AC-1 source edges', () => {
  it('reads a story without a web address, and builds a cover for every width and for link previews', () => {
    expect(fromSanity({ _id: 'a', title: 'A' }).slug).toBeUndefined();
    const cover = fromSanity({ _id: 'a', title: 'A', coverImage: { asset: { _ref: 'image-Abc123-800x1200-png' } } }).cover!;
    expect(cover.width).toBe(500);
    expect(cover.height).toBe(700);
    expect(cover.src).toMatch(/^https:\/\/cdn\.sanity\.io\/.*w=500/);
    expect(cover.srcset?.split(', ').map((s) => s.split(' ')[1])).toEqual(['300w', '500w', '800w']);
    for (const part of ['w=1200', 'h=630', 'fit=fill', 'bg=f5f1e8', 'fm=jpg']) expect(cover.social).toContain(part);
    const sized = fromSanity({ _id: 'a', title: 'A', coverImage: { asset: { _ref: 'image-Abc123-800x1200-png' }, dimensions: { width: 800, height: 1200 } } }).cover!;
    expect([sized.width, sized.height]).toEqual([800, 1200]);
  });
});
