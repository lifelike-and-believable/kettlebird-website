// Comic reader model: series, chapters, pages, addresses, and labels.
// Spec: docs/specs/comic-reader-start-and-turn.md. Pure functions only; data loading is in source.ts.
// STUB: signatures only, so the tests in tests/unit fail on their assertions.

export type SeriesStatus = 'ongoing' | 'complete' | 'hiatus';
export type SeriesType = 'original' | 'fancomic';

export interface ComicImage {
  src: string;
  srcset?: string;
  width: number;
  height: number;
}

export interface ComicPage {
  image: ComicImage;
  altText?: string;
}

export interface ComicChapter {
  number: number;
  title?: string;
  pages: ComicPage[];
}

export interface ComicSeries {
  slug?: string;
  title: string;
  description?: string;
  status?: SeriesStatus;
  type?: SeriesType;
  cover?: ComicImage;
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

export const STATUS_LABELS: Record<SeriesStatus, string> = { ongoing: '', complete: '', hiatus: '' };
export const TYPE_LABELS: Record<SeriesType, string> = { original: '', fancomic: '' };

export function seriesPath(_slug: string): string { return ''; }
export function pagePath(_slug: string, _chapter: number, _page: number): string { return ''; }
export function visibleChapters(_series: ComicSeries): ComicChapter[] { return []; }
export function showsChapterList(_series: ComicSeries): boolean { return false; }
export function chapterLabel(_chapter: ComicChapter): string { return ''; }
export function readerPages(_series: ComicSeries): ReaderPage[] { return []; }
export function firstPagePath(_series: ComicSeries): string | undefined { return undefined; }
export function locationLine(_entry: ReaderPage): string { return ''; }
export function shortLocation(_entry: ReaderPage): string { return ''; }
export function pageAltText(_entry: ReaderPage): string { return ''; }
export function tabTitle(_entry: ReaderPage): string { return ''; }
export function endNote(_status: SeriesStatus | undefined): { heading: string; line: string } {
  return { heading: '', line: '' };
}
export function pageCountOf(_series: ComicSeries): number { return 0; }
