// How a chapter's pages pair up on a wide screen. Shared by the site (spreads.ts) and the editor
// (sanity-studio/lib/comic-pages.ts), so it imports nothing. Spec: docs/specs/comic-reader-spread-and-flip.md AC-2.

/** Which side a chapter's page 1 is on: the right, like a printed comic, or the left. */
export type OpenOn = 'right' | 'left';

export type GroupKind = 'pair' | 'left' | 'right' | 'spread';

/** What shows at once on a wide screen: page numbers within the chapter, from 1. */
export interface PageGroup {
  kind: GroupKind;
  pages: number[];
}

/** A chapter's pages in wide-screen groups, given which pages are spreads (AC-2). */
export function pageGroups(spreads: boolean[], openOn?: OpenOn): PageGroup[] {
  const groups: PageGroup[] = [];
  let waiting: number | undefined; // a page on the left, waiting for its partner
  let onLeft = openOn === 'left'; // where the next page goes; the right unless the chapter opens on the left
  spreads.forEach((spread, i) => {
    const n = i + 1;
    if (spread) {
      if (waiting !== undefined) groups.push({ kind: 'left', pages: [waiting] });
      waiting = undefined;
      groups.push({ kind: 'spread', pages: [n] });
      onLeft = true;
    } else if (onLeft) {
      waiting = n;
      onLeft = false;
    } else {
      groups.push(waiting === undefined ? { kind: 'right', pages: [n] } : { kind: 'pair', pages: [waiting, n] });
      waiting = undefined;
      onLeft = true;
    }
  });
  if (waiting !== undefined) groups.push({ kind: 'left', pages: [waiting] });
  return groups;
}

/** The page a spread at `page` leaves alone on the left, if any (AC-10). */
export function aloneBeforeSpread(spreads: boolean[], openOn: OpenOn, page: number): number | undefined {
  // A page alone on the left only ever comes before a spread (or ends the chapter).
  const groups = pageGroups(spreads, openOn);
  const at = groups.findIndex((g) => g.pages[0] === page);
  return at > 0 && groups[at - 1].kind === 'left' ? page - 1 : undefined;
}

