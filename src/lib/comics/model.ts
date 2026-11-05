// Comic reader model: series, chapters, pages, addresses, and labels.
// Spec: docs/specs/comic-reader-start-and-turn.md. Pure functions only; data loading is in source.ts.
import type { OpenOn } from './pairing';

export type { OpenOn };

export type SeriesStatus = 'ongoing' | 'complete' | 'hiatus';
export type SeriesType = 'original' | 'fancomic';

export interface ComicImage {
  src: string;
  srcset?: string;
  width: number;
  height: number;
  /** A small version for the contact sheet (about 300 px wide); the full image when missing. */
  thumb?: { src: string; srcset?: string };
  /** For a series cover: the whole cover on a paper-coloured 1200 × 630 background, for link previews. */
  social?: string;
}

export interface ComicPage {
  image: ComicImage;
  altText?: string;
  /** One picture across two facing pages (docs/specs/comic-reader-spread-and-flip.md). */
  spread?: boolean;
}


export interface ComicChapter {
  number: number;
  title?: string;
  /** How pages pair on a wide screen; the right when missing. */
  openOn?: OpenOn;
  pages: ComicPage[];
}

export interface ComicSeries {
  slug?: string;
  title: string;
  description?: string;
  status?: SeriesStatus;
  type?: SeriesType;
  cover?: ComicImage;
  /** How it reads (docs/specs/comic-reader-comic-settings.md): two pages side by side on a wide screen. Off when missing. */
  twoUp?: boolean;
  /** How it reads: turn pages with the page-flip. Off when missing. */
  pageFlip?: boolean;
  chapters: ComicChapter[];
}

export interface ReaderPage {
  series: ComicSeries;
  chapter: ComicChapter;
  page: ComicPage;
  pageNumber: number;
  pageCount: number;
  path: string;
  previousPath?: string;
  nextPath?: string;
  isLast: boolean;
}

// The labels the comics listing page already uses (design-comic-start-reading, Layout).
export const STATUS_LABELS: Record<SeriesStatus, string> = {
  ongoing: 'Ongoing',
  complete: 'Complete',
  hiatus: 'On Hiatus',
};
export const TYPE_LABELS: Record<SeriesType, string> = { original: 'Original', fancomic: 'Fancomic' };

export function seriesPath(slug: string): string {
  return `/comics/${slug}`;
}

// One address shape for every series, so adding chapters never breaks a shared link.
export function pagePath(slug: string, chapter: number, page: number): string {
  return `/comics/${slug}/${chapter}/${page}`;
}

// Chapters with pages, in number order. Empty chapters are hidden from visitors.
export function visibleChapters(series: ComicSeries): ComicChapter[] {
  return series.chapters.filter((c) => c.pages.length > 0).sort((a, b) => a.number - b.number);
}

// A series that is a single untitled chapter reads as having no chapters.
export function showsChapterList(series: ComicSeries): boolean {
  const chapters = visibleChapters(series);
  return !(chapters.length === 1 && !chapters[0].title);
}

export function chapterLabel(chapter: ComicChapter): string {
  if (chapter.number === 0) return chapter.title || 'Chapter 0';
  return chapter.title ? `Chapter ${chapter.number}: ${chapter.title}` : `Chapter ${chapter.number}`;
}

export function chapterShortLabel(chapter: ComicChapter): string {
  return chapter.number === 0 ? chapter.title || 'Chapter 0' : `Chapter ${chapter.number}`;
}

export function pageCountOf(series: ComicSeries): number {
  return visibleChapters(series).reduce((n, c) => n + c.pages.length, 0);
}

// Every page in reading order, with links to its neighbours across chapter boundaries.
export function readerPages(series: ComicSeries): ReaderPage[] {
  const slug = series.slug;
  if (!slug) return [];
  const entries: ReaderPage[] = [];
  const total = pageCountOf(series);
  for (const chapter of visibleChapters(series)) {
    chapter.pages.forEach((page, i) => {
      entries.push({
        series,
        chapter,
        page,
        pageNumber: i + 1,
        pageCount: chapter.pages.length,
        path: pagePath(slug, chapter.number, i + 1),
        isLast: entries.length === total - 1,
      });
    });
  }
  entries.forEach((entry, i) => {
    entry.previousPath = entries[i - 1]?.path;
    entry.nextPath = entries[i + 1]?.path;
  });
  return entries;
}

export function firstPagePath(series: ComicSeries): string | undefined {
  return readerPages(series)[0]?.path;
}

/** " · two-page spread" after a spread page's place. */
export const SPREAD_MARK = ' · two-page spread';

export function locationLine(entry: ReaderPage): string {
  const pages = `Page ${entry.pageNumber} of ${entry.pageCount}${entry.page.spread ? SPREAD_MARK : ''}`;
  return showsChapterList(entry.series) ? `${chapterLabel(entry.chapter)} · ${pages}` : pages;
}

// "Chapter 2, page 1", or "Page 1" for a series without visible chapters.
export function shortLocation(entry: ReaderPage): string {
  return showsChapterList(entry.series)
    ? `${chapterShortLabel(entry.chapter)}, page ${entry.pageNumber}`
    : `Page ${entry.pageNumber}`;
}

export function pageAltText(entry: ReaderPage): string {
  return entry.page.altText?.trim() || shortLocation(entry);
}

export function tabTitle(entry: ReaderPage): string {
  return `${shortLocation(entry)} · ${entry.series.title} · Kettlebird Creations`;
}

const END_LINES: Record<SeriesStatus, string> = {
  ongoing: 'New pages are on the way.',
  hiatus: 'This comic is on a break.',
  complete: "That's the end of the story.",
};

export function endNote(status: SeriesStatus | undefined): { heading: string; line: string } {
  return { heading: "You're all caught up!", line: END_LINES[status ?? 'ongoing'] };
}
