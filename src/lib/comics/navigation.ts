// Comic reader navigation: the player-style controls under a page, and the contact sheets.
// Design: docs/design/comic-sheet-and-controls.md. Spec: docs/specs/comic-reader-sheet-and-controls.md.
// Pure functions only, like model.ts.
import type { ComicChapter, ComicImage, ComicSeries, ReaderPage } from './model';

export type ControlKind = 'first' | 'previous' | 'next' | 'newest';

export interface PlayControl {
  kind: ControlKind;
  /** The short word under the icon: "First", "Previous", "Next", "Newest" or "Last". */
  caption: string;
  /** The full name, for screen readers and the hover and focus label. */
  name: string;
  /** Missing when the control can't be used from this page. */
  path?: string;
}

export interface SheetPicture {
  number: number;
  /** The id the "All pages" link jumps to: "page-4". */
  anchor: string;
  path: string;
  name: string;
  marked: boolean;
  image: ComicImage;
}

export interface ChapterListItem {
  label: string;
  pages: string;
  /** Missing for the chapter the sheet shows. */
  path?: string;
  current: boolean;
}

export interface ChapterLink {
  /** "← Chapter 1" or "Chapter 3 →". */
  label: string;
  /** "Previous chapter: Chapter 1". */
  name: string;
  path: string;
}

export interface ContactSheet {
  path: string;
  tabTitle: string;
  heading: string;
  pageCount: string;
  seriesPath: string;
  /** Only on a page's own sheet. */
  backToPage?: { label: string; path: string };
  pictures: SheetPicture[];
  chapterList?: { summary: string; items: ChapterListItem[] };
  previousChapter?: ChapterLink;
  nextChapter?: ChapterLink;
}

export function playControls(_entry: ReaderPage): PlayControl[] {
  throw new Error('not implemented');
}

export function chapterSheetPath(_slug: string, _chapter: number): string {
  throw new Error('not implemented');
}

/** The address of a page's own sheet, or undefined for a chapter with one page. */
export function pageSheetPath(_entry: ReaderPage): string | undefined {
  throw new Error('not implemented');
}

/** Where **All pages** goes: the page's sheet, scrolled to its picture. */
export function allPagesHref(_entry: ReaderPage): string | undefined {
  throw new Error('not implemented');
}

export function pageSheet(_entry: ReaderPage): ContactSheet {
  throw new Error('not implemented');
}

export function chapterSheet(_series: ComicSeries, _chapter: ComicChapter): ContactSheet {
  throw new Error('not implemented');
}
