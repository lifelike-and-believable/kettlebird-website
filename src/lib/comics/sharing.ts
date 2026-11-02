// Comic reader sharing and announcements: share titles, link previews, the series link on Page not
// found, what a screen reader hears when a page opens, and when focus returns to a control.
// Design: docs/design/comic-share-and-announce.md. Spec: docs/specs/comic-reader-share-and-announce.md.
// Pure functions only, like model.ts.
import type { ComicSeries, ReaderPage } from './model';
import type { ControlKind } from './navigation';

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

export function absoluteUrl(_site: string, _path: string): string {
  throw new Error('not implemented');
}

/** "Kettle Tales · Chapter 2, page 4", or "One Shot · Page 4". */
export function shareTitle(_entry: ReaderPage): string {
  throw new Error('not implemented');
}

/** What a screen reader hears when a page opens. */
export function pageAnnouncement(_entry: ReaderPage): string {
  throw new Error('not implemented');
}

export function pagePreview(_entry: ReaderPage, _site: string): LinkPreview {
  throw new Error('not implemented');
}

export function seriesPreview(_series: ComicSeries, _site: string): LinkPreview {
  throw new Error('not implemented');
}

/** The series' newest page, for **Read the newest page**; only on ongoing series with more than one page. */
export function readNewestPath(_series: ComicSeries): string | undefined {
  throw new Error('not implemented');
}

/** On Page not found: the series an address belongs to, if it still exists. */
export function seriesForMissingPath(
  _path: string,
  _series: { slug: string; title: string }[],
): { title: string; path: string } | undefined {
  throw new Error('not implemented');
}

/** Which control should get focus on this page, if the fan arrived by turning with it. */
export function focusAfterTurn(
  _turn: RememberedTurn | undefined,
  _now: { navigation: NavigationKind; referrerPath: string | undefined; time: number },
): ControlKind | undefined {
  throw new Error('not implemented');
}

/** Whether this opening of the page is announced: not on a reload. */
export function announcesOnOpen(_navigation: NavigationKind): boolean {
  throw new Error('not implemented');
}
