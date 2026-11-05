// Stories on the site: the model (docs/specs/story-reader-pages.md).
import { describe, expect, it } from 'vitest';
import {
  alsoOn, beforeYouRead, cardLine, chapterLabel, chapterNav, chapterPath, chapterTabTitle, gateLine, hasPage,
  inChapters, latestDate, ratingLine, readNewestPath, shownChapters, sortForWriting, startReadingPath, storyPath,
  storyTabTitle, type Story,
} from '../../src/lib/stories/model';
import { FIXTURE_STORIES } from '../fixtures/stories';

const by = (slug: string) => FIXTURE_STORIES.find((s) => s.slug === slug)!;
const song = by('the-kettles-song');
const road = by('the-long-road');
const market = by('night-market');
const finished = by('finished-tale');
const elsewhere = by('elsewhere-tale');
const story = (over: Partial<Story>): Story => ({ id: 'x', title: 'X', genres: [], text: [], chapters: [], ...over });
const para = { _type: 'block', children: [{ _type: 'span', text: 'Words.' }] };

describe('story-reader-pages#AC-1 pages', () => {
  it('gives a story with a web address and text or a shown chapter its page', () => {
    expect(storyPath('the-long-road')).toBe('/writing/the-long-road');
    expect(chapterPath('the-long-road', 2)).toBe('/writing/the-long-road/2');
    expect(hasPage(song)).toBe(true);
    expect(hasPage(road)).toBe(true);
    expect(hasPage(elsewhere)).toBe(false);
    expect(hasPage(story({ text: [para] }))).toBe(false);
    expect(hasPage(story({ slug: 'a', chapters: [{ number: 1, text: [] }] }))).toBe(false);
    expect(hasPage(story({ slug: 'a', chapters: [{ number: 1, text: [para] }] }))).toBe(true);
  });

  it('shows only chapters with text, in number order', () => {
    expect(shownChapters(road).map((c) => c.number)).toEqual([1, 2, 3]);
    expect(inChapters(road)).toBe(true);
    expect(inChapters(song)).toBe(false);
  });
});

describe('story-reader-pages#AC-2 writing page', () => {
  it('orders stories by their latest date, chapters included', () => {
    expect(latestDate(road)).toBe('2026-11-01');
    expect(latestDate(song)).toBe('2026-10-01');
    expect(latestDate(story({}))).toBeUndefined();
    expect(sortForWriting([elsewhere, song, story({ id: 'undated' }), road, market]).map((s) => s.id)).toEqual([
      'story-road', 'story-song', 'story-market', 'story-elsewhere', 'undated',
    ]);
  });

  it('describes a story in chapters on its card', () => {
    expect(cardLine(road)).toBe('In progress · 3 chapters');
    expect(cardLine(finished)).toBe('Complete · 2 chapters');
    expect(cardLine(story({ slug: 'a', chapters: [{ number: 1, text: [para] }] }))).toBe('1 chapter');
    expect(cardLine(song)).toBeUndefined();
  });

  it('names the rating, and the other site', () => {
    expect(ratingLine('teen')).toBe('Rated Teen');
    expect(ratingLine('explicit')).toBe('Rated Explicit');
    expect(ratingLine('notRated')).toBeUndefined();
    expect(ratingLine(undefined)).toBeUndefined();
    expect(alsoOn('https://archiveofourown.org/works/1')).toBe('Also on AO3');
    expect(alsoOn('https://ko-fi.com/kettlebird')).toBe('Also on Ko-fi');
    expect(alsoOn('https://kettlebird.tumblr.com/post/1')).toBe('Also on Tumblr');
    expect(alsoOn('https://www.wattpad.com/story/1')).toBe('Also on Wattpad');
    expect(alsoOn('https://example.com/story')).toBe('Also elsewhere');
    expect(alsoOn('not a link')).toBe('Also elsewhere');
  });
});

describe('story-reader-pages#AC-5 before you read', () => {
  it('shows the rating and the notes, or nothing', () => {
    expect(beforeYouRead(song)).toEqual({ rating: 'Rated Teen', notes: 'Mild peril.\nA very loud kettle.' });
    expect(beforeYouRead(road)).toEqual({ rating: 'Rated General' });
    expect(beforeYouRead(finished)).toEqual({ rating: 'Not rated', notes: 'Grief.' });
    expect(beforeYouRead(story({ rating: 'notRated' }))).toBeNull();
    expect(beforeYouRead(story({}))).toBeNull();
    expect(beforeYouRead(story({ contentNotes: '  ' }))).toBeNull();
  });
});

describe('story-reader-pages#AC-6 gate', () => {
  it('asks first on Mature and Explicit stories only', () => {
    expect(gateLine(market)).toBe('This story is rated Mature.');
    expect(gateLine(story({ rating: 'explicit' }))).toBe('This story is rated Explicit.');
    expect(gateLine(song)).toBeUndefined();
    expect(gateLine(finished)).toBeUndefined();
  });
});

describe('story-reader-pages#AC-7 AC-8 chapters', () => {
  it('labels chapters', () => {
    expect(chapterLabel({ number: 2, title: 'Over the Ridge' })).toBe('Chapter 2: Over the Ridge');
    expect(chapterLabel({ number: 3 })).toBe('Chapter 3');
    expect(chapterLabel({ number: 3, title: '  ' })).toBe('Chapter 3');
  });

  it('starts at the first chapter and offers the newest on a story in progress', () => {
    expect(startReadingPath(road)).toBe('/writing/the-long-road/1');
    expect(readNewestPath(road)).toBe('/writing/the-long-road/3');
    expect(readNewestPath(finished)).toBeUndefined();
    expect(readNewestPath(story({ slug: 'a', status: 'inProgress', chapters: [{ number: 1, text: [para] }] }))).toBeUndefined();
    expect(startReadingPath(song)).toBeUndefined();
  });

  it('moves between shown chapters, and says where the story stops', () => {
    expect(chapterNav(road, 1)).toEqual({ chapters: '/writing/the-long-road#chapters', next: '/writing/the-long-road/2' });
    expect(chapterNav(road, 2)).toEqual({
      previous: '/writing/the-long-road/1', chapters: '/writing/the-long-road#chapters', next: '/writing/the-long-road/3',
    });
    expect(chapterNav(road, 3)).toEqual({
      previous: '/writing/the-long-road/2', chapters: '/writing/the-long-road#chapters', end: "That's the newest chapter. More to come.",
    });
    expect(chapterNav(finished, 2).end).toBe('The end.');
    expect(chapterNav(story({ slug: 'a', chapters: [{ number: 5, text: [para] }] }), 5).end).toBe("That's the newest chapter. More to come.");
  });
});

describe('story-reader-pages#AC-9 tab titles', () => {
  it('names the story and the chapter', () => {
    expect(storyTabTitle(road)).toBe('The Long Road · Writing · Kettlebird Creations');
    expect(chapterTabTitle(road, shownChapters(road)[1])).toBe('Chapter 2: Over the Ridge · The Long Road · Kettlebird Creations');
  });
});
