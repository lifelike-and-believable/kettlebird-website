// Two-page spreads on a wide screen: how a chapter's pages pair up, and the wide view of a reader
// page (its pages, links, controls, location and announcement). Design: docs/design/comic-spread-and-flip.md.
// Spec: docs/specs/comic-reader-spread-and-flip.md. Pure functions only, like model.ts.
import {
  chapterLabel,
  endNote,
  locationLine,
  readerPages,
  showsChapterList,
  visibleChapters,
  type ReaderPage,
} from './model';
import { playControls, type PlayControl } from './navigation';
import { joined, pageAnnouncement } from './sharing';
import { pageGroups, type GroupKind } from './pairing';

export { aloneBeforeSpread, pageGroups, type GroupKind, type PageGroup } from './pairing';

/** The width test: two pages side by side when it matches (AC-3). */
export const WIDE_MEDIA = '(min-width: 62.5em) and (orientation: landscape)';

export interface WideView {
  kind: GroupKind;
  /** The group's pages, left first. */
  pages: ReaderPage[];
  previousPath?: string;
  nextPath?: string;
  /** The group holds the series' newest page: the end note shows. */
  isLast: boolean;
  location: string;
  announcement: string;
  controls: PlayControl[];
}

interface Group {
  kind: GroupKind;
  pages: ReaderPage[];
}

function seriesGroups(entry: ReaderPage): Group[] {
  const all = readerPages(entry.series);
  const byPath = new Map(all.map((e) => [e.path, e]));
  return visibleChapters(entry.series).flatMap((chapter) => {
    const entries = all.filter((e) => e.chapter.number === chapter.number);
    return pageGroups(chapter.pages.map((p) => Boolean(p.spread)), chapter.openOn).map((g) => ({
      kind: g.kind,
      pages: g.pages.map((n) => byPath.get(entries[n - 1].path)!),
    }));
  });
}

function pairPlace(group: Group, announce: boolean): string {
  const [a, b] = group.pages;
  const named = showsChapterList(a.series);
  if (announce) {
    const of = `${a.pageNumber} and ${b.pageNumber} of ${a.pageCount}.`;
    return named ? `${chapterLabel(a.chapter)}, pages ${of}` : `Pages ${of}`;
  }
  const of = `Pages ${a.pageNumber}–${b.pageNumber} of ${a.pageCount}`;
  return named ? `${chapterLabel(a.chapter)} · ${of}` : of;
}

/** A reader page as it shows on a wide screen (AC-4 to AC-6). */
export function wideView(entry: ReaderPage): WideView {
  const groups = seriesGroups(entry);
  const index = groups.findIndex((g) => g.pages.some((p) => p.path === entry.path));
  const group = groups[index];
  const previous = groups[index - 1];
  const next = groups[index + 1];
  const all = groups.flatMap((g) => g.pages);
  const first = all[0];
  const newest = all[all.length - 1];
  const holds = (page: ReaderPage) => group.pages.some((p) => p.path === page.path);
  const isLast = holds(newest);
  const pair = group.kind === 'pair';
  const end = isLast ? endNote(entry.series.status) : undefined;

  const narrow = playControls(entry);
  const controls: PlayControl[] = narrow.map((c) => {
    switch (c.kind) {
      case 'first':
        return { ...c, path: holds(first) ? undefined : first.path };
      case 'previous':
        return { ...c, name: previous?.kind === 'pair' ? 'Previous pages' : 'Previous page', path: previous?.pages[0].path };
      case 'next':
        return { ...c, name: next?.kind === 'pair' ? 'Next pages' : 'Next page', path: next?.pages[0].path };
      default:
        return { ...c, path: isLast ? undefined : newest.path };
    }
  });

  return {
    kind: group.kind,
    pages: group.pages,
    previousPath: previous?.pages[0].path,
    nextPath: next?.pages[0].path,
    isLast,
    location: pair ? pairPlace(group, false) : locationLine(group.pages[0]),
    announcement: pair
      ? joined(pairPlace(group, true), ...group.pages.map((p) => p.page.altText?.trim()), end?.heading, end?.line)
      : pageAnnouncement(group.pages[0]),
    controls,
  };
}

/** Which way a turn to `to` goes, or undefined when it isn't a turn and the page-flip doesn't play (AC-11). */
export function turnDirection(to: string, links: { previous: string[]; next: string[] }): 'forward' | 'back' | undefined {
  if (links.next.includes(to)) return 'forward';
  if (links.previous.includes(to)) return 'back';
  return undefined;
}
