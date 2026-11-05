// Stories on the site: the model, addresses, which stories and chapters show, and their labels.
// Design: docs/design/story-reader.md. Spec: docs/specs/story-reader-pages.md. Pure; loading is in source.ts.
// STUB (tests first): the functions below are filled in by the build commit.

export type Rating = 'general' | 'teen' | 'mature' | 'explicit' | 'notRated';
export type StoryStatus = 'inProgress' | 'complete';

/** A block of Portable Text as the editor stores a story's text (story-reader-editor AC-3). */
export interface TextBlock {
  _type: string;
  _key?: string;
  style?: string;
  children?: { _type: string; text?: string; marks?: string[] }[];
}

export interface StoryImage {
  src: string;
  srcset?: string;
  width: number;
  height: number;
  /** The cover on a paper-coloured 1200 × 630 background, for link previews. */
  social?: string;
}

export interface StoryChapter {
  number: number;
  title?: string;
  /** Date posted, YYYY-MM-DD. */
  date?: string;
  text: TextBlock[];
}

export interface Story {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  cover?: StoryImage;
  genres: string[];
  rating?: Rating;
  contentNotes?: string;
  status?: StoryStatus;
  /** Link to read it (elsewhere). */
  link?: string;
  /** Date posted, YYYY-MM-DD. */
  date?: string;
  /** A one-shot's text. */
  text: TextBlock[];
  chapters: StoryChapter[];
}

export const RATING_TITLES: Record<Rating, string> = { general: 'General', teen: 'Teen', mature: 'Mature', explicit: 'Explicit', notRated: 'Not rated' };
export const STATUS_TITLES: Record<StoryStatus, string> = { inProgress: 'In progress', complete: 'Complete' };
export const GATE_STORAGE_KEY = 'kb-continue-rated';

const stub = (): never => { throw new Error('Not built yet'); };

export function storyPath(_slug: string): string { return stub(); }
export function chapterPath(_slug: string, _number: number): string { return stub(); }
export function shownChapters(_story: Story): StoryChapter[] { return stub(); }
export function hasPage(_story: Story): boolean { return stub(); }
export function inChapters(_story: Story): boolean { return stub(); }
export function chapterLabel(_chapter: { number: number; title?: string }): string { return stub(); }
export function ratingLine(_rating: Rating | undefined): string | undefined { return stub(); }
export function beforeYouRead(_story: Story): { rating: string; notes?: string } | null { return stub(); }
export function gateLine(_story: Story): string | undefined { return stub(); }
export function cardLine(_story: Story): string | undefined { return stub(); }
export function latestDate(_story: Story): string | undefined { return stub(); }
export function sortForWriting(_stories: Story[]): Story[] { return stub(); }
export function alsoOn(_link: string): string { return stub(); }
export function startReadingPath(_story: Story): string | undefined { return stub(); }
export function readNewestPath(_story: Story): string | undefined { return stub(); }
export interface ChapterNav { previous?: string; chapters: string; next?: string; end?: string }
export function chapterNav(_story: Story, _number: number): ChapterNav { return stub(); }
export function storyTabTitle(_story: Story): string { return stub(); }
export function chapterTabTitle(_story: Story, _chapter: StoryChapter): string { return stub(); }
