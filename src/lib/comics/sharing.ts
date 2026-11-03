// Comic reader sharing and announcements: share titles, link previews, the series link on Page not
// found, what a screen reader hears when a page opens, and when focus returns to a control.
// Design: docs/design/comic-share-and-announce.md. Spec: docs/specs/comic-reader-share-and-announce.md.
// Pure functions only, like model.ts.
import {
  chapterLabel,
  endNote,
  pageCountOf,
  readerPages,
  seriesPath,
  shortLocation,
  showsChapterList,
  type ComicSeries,
  type ReaderPage,
} from './model';
import type { ControlKind } from './navigation';
import { oneLine } from '../text';

export interface LinkPreview {
  title: string;
  description: string;
  /** Absolute address of the picture. */
  image: string;
  /** Absolute canonical address of the page. */
  url: string;
}

/** A turn the reader remembers for the next page: which control, from which page, and when. */
export interface RememberedTurn {
  kind: ControlKind;
  from: string;
  at: number;
}

/** How the page was opened, as the browser's navigation timing reports it. */
export type NavigationKind = 'navigate' | 'reload' | 'back_forward' | 'prerender';

/** How long a remembered turn counts, in milliseconds. */
export const TURN_WINDOW_MS = 30_000;

/** The site's own picture, used when a series has no cover. */
export const FALLBACK_IMAGE_PATH = '/assets/images/kblogo.png';

export function absoluteUrl(site: string, path: string): string {
  return new URL(path, site).href;
}

/** "Kettle Tales · Chapter 2, page 4", or "One Shot · Page 4". */
export function shareTitle(entry: ReaderPage): string {
  return `${entry.series.title} · ${shortLocation(entry)}`;
}

/** "Chapter 2: The Long Road, page 4 of 12.", or "Page 4 of 12." */
function placeLine(entry: ReaderPage): string {
  const of = `${entry.pageNumber} of ${entry.pageCount}.`;
  return showsChapterList(entry.series) ? `${chapterLabel(entry.chapter)}, page ${of}` : `Page ${of}`;
}

const joined = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(' ');

/** What a screen reader hears when a page opens. */
export function pageAnnouncement(entry: ReaderPage): string {
  const end = entry.isLast ? endNote(entry.series.status) : undefined;
  return joined(placeLine(entry), entry.page.altText?.trim(), end?.heading, end?.line);
}

const previewImage = (series: ComicSeries, site: string) => series.cover?.social ?? absoluteUrl(site, FALLBACK_IMAGE_PATH);

export function pagePreview(entry: ReaderPage, site: string): LinkPreview {
  return {
    title: shareTitle(entry),
    description: joined(placeLine(entry), entry.series.description && oneLine(entry.series.description)),
    image: previewImage(entry.series, site),
    url: absoluteUrl(site, entry.path),
  };
}

export function seriesPreview(series: ComicSeries, site: string): LinkPreview {
  return {
    title: series.title,
    description: series.description ? oneLine(series.description) : `${series.title}, a comic by Star Goldberg.`,
    image: previewImage(series, site),
    url: absoluteUrl(site, seriesPath(series.slug!)),
  };
}

/** The series' newest page, for **Read the newest page**; only on ongoing series with more than one page. */
export function readNewestPath(series: ComicSeries): string | undefined {
  if (series.status !== 'ongoing' || pageCountOf(series) < 2) return undefined;
  return readerPages(series).at(-1)?.path;
}

/** On Page not found: the series an address belongs to, if it still exists. */
export function seriesForMissingPath(
  path: string,
  series: { slug: string; title: string }[],
): { title: string; path: string } | undefined {
  const slug = /^\/comics\/([^/]+)\/./.exec(path)?.[1];
  const found = series.find((s) => s.slug === slug);
  return found && { title: found.title, path: seriesPath(found.slug) };
}

/** Which control should get focus on this page, if the fan arrived by turning with it. */
export function focusAfterTurn(
  turn: RememberedTurn | undefined,
  now: { navigation: NavigationKind; referrerPath: string | undefined; time: number },
): ControlKind | undefined {
  if (!turn || now.navigation !== 'navigate' || now.referrerPath !== turn.from) return undefined;
  const age = now.time - turn.at;
  return age >= 0 && age <= TURN_WINDOW_MS ? turn.kind : undefined;
}

/** Whether this opening of the page is announced: not on a reload. */
export function announcesOnOpen(navigation: NavigationKind): boolean {
  return navigation !== 'reload';
}
