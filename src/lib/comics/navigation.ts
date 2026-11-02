// Comic reader navigation: the player-style controls under a page, and the contact sheets.
// Design: docs/design/comic-sheet-and-controls.md. Spec: docs/specs/comic-reader-sheet-and-controls.md.
// Pure functions only, like model.ts.
import {
  chapterLabel,
  chapterShortLabel,
  pagePath,
  readerPages,
  seriesPath,
  showsChapterList,
  visibleChapters,
  type ComicChapter,
  type ComicImage,
  type ComicSeries,
  type ReaderPage,
} from './model';

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

export function playControls(entry: ReaderPage): PlayControl[] {
  const pages = readerPages(entry.series);
  if (pages.length < 2) return [];
  const first = pages[0].path;
  const newest = pages[pages.length - 1].path;
  const last = entry.series.status === 'complete';
  const unless = (path: string) => (path === entry.path ? undefined : path);
  return [
    { kind: 'first', caption: 'First', name: 'First page of the series', path: unless(first) },
    { kind: 'previous', caption: 'Previous', name: 'Previous page', path: entry.previousPath },
    { kind: 'next', caption: 'Next', name: 'Next page', path: entry.nextPath },
    last
      ? { kind: 'newest', caption: 'Last', name: 'Last page of the series', path: unless(newest) }
      : { kind: 'newest', caption: 'Newest', name: 'Newest page of the series', path: unless(newest) },
  ];
}

export function chapterSheetPath(slug: string, chapter: number): string {
  return `${seriesPath(slug)}/${chapter}/pages`;
}

/** The address of a page's own sheet, or undefined for a chapter with one page. */
export function pageSheetPath(entry: ReaderPage): string | undefined {
  return entry.pageCount > 1 ? `${entry.path}/pages` : undefined;
}

/** Where **All pages** goes: the page's sheet, scrolled to its picture. */
export function allPagesHref(entry: ReaderPage): string | undefined {
  const path = pageSheetPath(entry);
  return path && `${path}#page-${entry.pageNumber}`;
}

const count = (n: number) => `${n} page${n === 1 ? '' : 's'}`;

function sheet(series: ComicSeries, chapter: ComicChapter, path: string, marked?: ReaderPage): ContactSheet {
  const slug = series.slug!;
  const named = showsChapterList(series);
  const chapters = visibleChapters(series);
  const index = chapters.indexOf(chapter);
  const withList = named && chapters.length > 1;
  const highest = chapters[chapters.length - 1].number;
  const link = (c: ComicChapter | undefined, previous: boolean): ChapterLink | undefined => {
    if (!withList || !c) return undefined;
    const label = chapterShortLabel(c);
    return {
      label: previous ? `← ${label}` : `${label} →`,
      name: `${previous ? 'Previous' : 'Next'} chapter: ${label}`,
      path: chapterSheetPath(slug, c.number),
    };
  };
  return {
    path,
    tabTitle: `${named ? `${chapterShortLabel(chapter)}, all pages` : 'All pages'} · ${series.title} · Kettlebird Creations`,
    heading: named ? `${series.title} · ${chapterLabel(chapter)}` : series.title,
    pageCount: count(chapter.pages.length),
    seriesPath: seriesPath(slug),
    backToPage: marked && { label: `← Back to page ${marked.pageNumber}`, path: marked.path },
    pictures: chapter.pages.map((page, i) => {
      const number = i + 1;
      const isMarked = marked?.pageNumber === number;
      const alt = page.altText?.trim();
      const name = `Page ${number}${alt ? `: ${alt}` : ''}${isMarked ? ' You were here' : ''}`;
      return { number, anchor: `page-${number}`, path: pagePath(slug, chapter.number, number), name, marked: isMarked, image: page.image };
    }),
    chapterList: withList
      ? {
          summary: `${chapter.number === 0 ? chapterShortLabel(chapter) : `Chapter ${chapter.number} of ${highest}`} · All chapters`,
          items: chapters.map((c) => ({
            label: chapterLabel(c),
            pages: count(c.pages.length),
            path: c === chapter ? undefined : chapterSheetPath(slug, c.number),
            current: c === chapter,
          })),
        }
      : undefined,
    previousChapter: link(chapters[index - 1], true),
    nextChapter: link(chapters[index + 1], false),
  };
}

export function pageSheet(entry: ReaderPage): ContactSheet {
  return sheet(entry.series, entry.chapter, `${entry.path}/pages`, entry);
}

export function chapterSheet(series: ComicSeries, chapter: ComicChapter): ContactSheet {
  return sheet(series, chapter, chapterSheetPath(series.slug!, chapter.number));
}
