// Stories on the site: the model, addresses, which stories and chapters show, and their labels.
// Design: docs/design/story-reader.md. Spec: docs/specs/story-reader-pages.md. Pure; loading is in source.ts.

export type StoryStatus = 'inProgress' | 'complete';

/** A block of Portable Text as the editor stores a story's text (story-reader-editor AC-3). */
export interface TextBlock {
  _type: string;
  _key?: string;
  style?: string;
  children?: { _type: string; text?: string; marks?: string[] }[];
}

/**
 * A picture from a Word document in a story's text (docs/specs/story-import-word.md AC-21), as the site uses it.
 * It's a block like the others, so a text is still a list of blocks.
 */
export interface StoryPicture extends TextBlock {
  _type: 'storyPicture';
  src: string;
  srcset?: string;
  width: number;
  height: number;
  alt?: string;
  decorative?: boolean;
}

/** AC-21: its alt text: Alt text when there is some, empty when decorative, else "Picture". */
export function pictureAlt(picture: { alt?: string; decorative?: boolean }): string {
  if (picture.decorative) return '';
  return picture.alt?.trim() || 'Picture';
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
  /** Mature or explicit content (docs/specs/story-mature-content.md): asks before showing the text. */
  mature: boolean;
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

/** story-mature-content AC-5, AC-6: one wording everywhere. */
export const MATURE_TAG = 'Mature or explicit';
export const MATURE_LINE = 'This story has mature or explicit content.';
export const STATUS_TITLES: Record<StoryStatus, string> = { inProgress: 'In progress', complete: 'Complete' };
// Named from when stories had ratings, and kept so a fan who continued then isn't asked again (story-mature-content AC-7).
export const GATE_STORAGE_KEY = 'kb-continue-rated';

const SITE_NAME = 'Kettlebird Creations';
const hasText = (blocks: TextBlock[]) => blocks.length > 0;

export function storyPath(slug: string): string {
  return `/writing/${slug}`;
}

/** Chapter numbers are Star's own, so a chapter's address stays put when chapters are added after it. */
export function chapterPath(slug: string, number: number): string {
  return `/writing/${slug}/${number}`;
}

/** Chapters readers see: those with text, in number order. (The build reads published chapters only.) */
export function shownChapters(story: Story): StoryChapter[] {
  return story.chapters.filter((c) => hasText(c.text)).sort((a, b) => a.number - b.number);
}

export function inChapters(story: Story): boolean {
  return shownChapters(story).length > 0;
}

/** AC-1: a story with a web address and text or a shown chapter has a page. */
export function hasPage(story: Story): boolean {
  return Boolean(story.slug) && (hasText(story.text) || inChapters(story));
}

export function chapterLabel(chapter: { number: number; title?: string }): string {
  const title = chapter.title?.trim();
  return title ? `Chapter ${chapter.number}: ${title}` : `Chapter ${chapter.number}`;
}

/** story-mature-content AC-5: the tag on a ticked story's card and page. */
export function matureTag(story: Story): string | undefined {
  return story.mature ? MATURE_TAG : undefined;
}

/** story-mature-content AC-6: what the Before you read box says, or null for no box. */
export function beforeYouRead(story: Story): { line?: string; notes?: string } | null {
  const notes = story.contentNotes?.trim() ? story.contentNotes : undefined;
  if (story.mature) return notes ? { line: MATURE_LINE, notes } : { line: MATURE_LINE };
  return notes ? { notes } : null;
}

/** story-mature-content AC-7: ticked stories ask first. */
export function asksFirst(story: Story): boolean {
  return story.mature;
}

/** AC-2: "In progress · 3 chapters", for a story in chapters. */
export function cardLine(story: Story): string | undefined {
  const count = shownChapters(story).length;
  if (count === 0) return undefined;
  const chapters = count === 1 ? '1 chapter' : `${count} chapters`;
  return story.status ? `${STATUS_TITLES[story.status]} · ${chapters}` : chapters;
}

/** AC-2: the story's date or its newest shown chapter's, whichever is later. */
export function latestDate(story: Story): string | undefined {
  // Dates are YYYY-MM-DD, so they sort as text.
  return [story.date, ...shownChapters(story).map((c) => c.date)].filter((d): d is string => Boolean(d)).sort().at(-1);
}

/** Newest first; undated stories last. Ties keep their given order (the sort is stable). */
export function sortForWriting(stories: Story[]): Story[] {
  return [...stories].sort((a, b) => (latestDate(b) ?? '').localeCompare(latestDate(a) ?? ''));
}

const SITES: [RegExp, string][] = [
  [/(^|\.)archiveofourown\.org$/, 'AO3'],
  [/(^|\.)ko-fi\.com$/, 'Ko-fi'],
  [/(^|\.)tumblr\.com$/, 'Tumblr'],
  [/(^|\.)wattpad\.com$/, 'Wattpad'],
];

/** AC-2: "Also on AO3", from the link's site. */
export function alsoOn(link: string): string {
  const host = URL.canParse(link) ? new URL(link).hostname : '';
  const site = SITES.find(([pattern]) => pattern.test(host))?.[1];
  return site ? `Also on ${site}` : 'Also elsewhere';
}

export function startReadingPath(story: Story): string | undefined {
  const first = shownChapters(story)[0];
  return first && story.slug ? chapterPath(story.slug, first.number) : undefined;
}

/** AC-7: only on a story in progress with two or more chapters. */
export function readNewestPath(story: Story): string | undefined {
  const chapters = shownChapters(story);
  if (story.status !== 'inProgress' || chapters.length < 2 || !story.slug) return undefined;
  return chapterPath(story.slug, chapters[chapters.length - 1].number);
}

export interface ChapterNav { previous?: string; chapters: string; next?: string; end?: string }

/** AC-8: Previous, Chapters and Next; on the newest chapter, where the story stops instead of Next. */
export function chapterNav(story: Story, number: number): ChapterNav {
  const slug = story.slug!;
  const chapters = shownChapters(story);
  const at = chapters.findIndex((c) => c.number === number);
  const previous = at > 0 ? chapterPath(slug, chapters[at - 1].number) : undefined;
  const next = at >= 0 && at < chapters.length - 1 ? chapterPath(slug, chapters[at + 1].number) : undefined;
  const nav: ChapterNav = { chapters: `${storyPath(slug)}#chapters` };
  if (previous) nav.previous = previous;
  if (next) nav.next = next;
  else nav.end = story.status === 'complete' ? 'The end.' : "That's the newest chapter. More to come.";
  return nav;
}

export function storyTabTitle(story: Story): string {
  return `${story.title} · Writing · ${SITE_NAME}`;
}

export function chapterTabTitle(story: Story, chapter: StoryChapter): string {
  return `${chapterLabel(chapter)} · ${story.title} · ${SITE_NAME}`;
}
