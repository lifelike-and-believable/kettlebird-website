// The portfolio as folders, with subfolders: which folders show, what each row holds and in what
// order, the subfolders' grids, tabs and addresses, and the arrows' state. Pure: no DOM, no Sanity.
// Spec: docs/specs/portfolio-folders.md. Design: docs/design/portfolio-folders.md.
import type { GalleryItem } from '../queries';
import { originalSize } from './full-screen';

export interface Folder {
  /** The stored section value. */
  value: string;
  title: string;
  /** Its part of a subfolder's address. */
  slug: string;
  /** The side its tab sits on, fixed whichever folders show (AC-1). */
  side: 'left' | 'right';
}

/** AC-1: the five, in order. */
export const FOLDERS: Folder[] = [
  { value: 'featured', title: 'Featured', slug: 'featured', side: 'right' },
  { value: 'original', title: 'Original Work', slug: 'original-work', side: 'left' },
  { value: 'fanart', title: 'Fan Work', slug: 'fan-work', side: 'right' },
  { value: 'commission', title: 'Past Clients', slug: 'past-clients', side: 'left' },
  { value: 'wip', title: 'Work in Progress', slug: 'work-in-progress', side: 'right' },
];

export const folderBySlug = (slug: string) => FOLDERS.find((f) => f.slug === slug);
export const folderByValue = (value: string) => FOLDERS.find((f) => f.value === value);

export interface Subfolder {
  _id: string;
  name: string;
  slug?: { current?: string };
  section: string;
  gridSize?: number;
  /** Its pieces' order (portfolio-order AC-6); newest first when unset. */
  order?: 'newest' | 'oldest';
}

export type Entry = { kind: 'piece'; item: GalleryItem } | { kind: 'subfolder'; subfolder: Subfolder; pieces: GalleryItem[] };

export interface FolderView {
  folder: Folder;
  /** The row at the top level, in order (AC-4). */
  entries: Entry[];
  /** Its pieces not in one of its subfolders, in order. */
  loose: GalleryItem[];
  /** Its subfolders with published pieces, each with its pieces in order. */
  subfolders: { subfolder: Subfolder; pieces: GalleryItem[] }[];
}

/** AC-3: 9/16 of the width, at most 240 pixels (portfolio-size AC-1; it was 480). */
export function rowHeight(width: number): number {
  return Math.min(Math.round((width * 9) / 16), 240);
}

/** AC-3: a piece's width at the row's height, from its asset's size; square if unknown. */
export function pieceWidth(item: GalleryItem, height: number): number {
  const size = item.image?.asset?._ref ? originalSize(item.image.asset._ref) : undefined;
  return size ? Math.round((height * size.width) / size.height) : height;
}

/** AC-4, portfolio-order AC-1: by date, newest or oldest first; the same date by title; undated after, by title. */
function comparer(order?: Subfolder['order']) {
  return (a: GalleryItem, b: GalleryItem): number => {
    // Dates are YYYY-MM-DD, so they sort as text.
    if (a.date && b.date && a.date !== b.date) return order === 'oldest' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
    if (a.date && !b.date) return -1;
    if (b.date && !a.date) return 1;
    return a.title.localeCompare(b.title);
  };
}
export const orderPieces = (items: GalleryItem[], order: Subfolder['order']) => [...items].sort(comparer(order));
export const sortPieces = (items: GalleryItem[]) => orderPieces(items, undefined);
const compare = comparer();
/** portfolio-order AC-2, AC-5: a subfolder's newest piece, whatever its order. */
export const newestPiece = (items: GalleryItem[]): GalleryItem | undefined => sortPieces(items)[0];

/** AC-1, AC-4, AC-22: the folders with pieces, in order, and what each holds. */
export function buildFolders(items: GalleryItem[], subfolders: Subfolder[]): FolderView[] {
  const views: FolderView[] = [];
  for (const folder of FOLDERS) {
    const inFolder = sortPieces(items.filter((item) => item.category?.includes(folder.value)));
    if (!inFolder.length) continue;
    const own = subfolders.filter((s) => s.section === folder.value);
    const loose: GalleryItem[] = [];
    const held = new Map<string, GalleryItem[]>();
    for (const item of inFolder) {
      const sub = own.find((s) => item.subfolders?.includes(s._id));
      if (sub) held.set(sub._id, [...(held.get(sub._id) ?? []), item]);
      else loose.push(item);
    }
    // portfolio-order AC-2: each subfolder's pieces in its own order; its place by its newest piece.
    const subs = own.filter((s) => held.has(s._id)).map((subfolder) => ({ subfolder, pieces: orderPieces(held.get(subfolder._id)!, subfolder.order) }));
    const entries: (Entry & { newest: GalleryItem })[] = [
      ...loose.map((item) => ({ kind: 'piece' as const, item, newest: item })),
      ...subs.map(({ subfolder, pieces }) => ({ kind: 'subfolder' as const, subfolder, pieces, newest: held.get(subfolder._id)![0] })),
    ];
    entries.sort((a, b) => compare(a.newest, b.newest));
    views.push({ folder, entries: entries.map(({ newest: _, ...entry }) => entry as Entry), loose, subfolders: subs });
  }
  return views;
}

const GRID_SIZES = [2, 3, 4];

/** AC-8: the grid's cells: the newest pieces, then empty cells; at most 3 × 3 on a computer and 2 × 2 on a phone (portfolio-size AC-5). */
export function gridCells(pieces: GalleryItem[], gridSize: number | undefined, phone: boolean): (GalleryItem | null)[] {
  const size = phone ? 2 : Math.min(GRID_SIZES.includes(gridSize ?? 0) ? gridSize! : 2, 3);
  return Array.from({ length: size * size }, (_, i) => pieces[i] ?? null);
}

export const piecesCount = (count: number) => `${count} ${count === 1 ? 'piece' : 'pieces'}`;
export const subfolderLinkName = (name: string, count: number) => `${name}, ${piecesCount(count)}`;

/** AC-9: the tab, and the folder's region name. */
export const tabLabel = (folderTitle: string, subfolderName?: string) => (subfolderName ? `${folderTitle}: ${subfolderName}` : folderTitle);

/** AC-10, AC-13 */
export const openAnnouncement = (folderTitle: string, subfolderName: string | undefined, count: number) =>
  `${tabLabel(folderTitle, subfolderName)}, ${piecesCount(count)}.`;

/** AC-12 */
export function subfolderPath(subfolder: Subfolder): string | undefined {
  const folder = folderByValue(subfolder.section);
  const slug = subfolder.slug?.current;
  return folder && slug ? `/portfolio/${folder.slug}/${slug}` : undefined;
}

/** AC-12: the pages built ahead of time: subfolders with published pieces. */
export function subfolderPaths(items: GalleryItem[], subfolders: Subfolder[]): { folder: string; subfolder: string }[] {
  return buildFolders(items, subfolders).flatMap((view) =>
    view.subfolders
      .filter(({ subfolder }) => subfolder.slug?.current)
      .map(({ subfolder }) => ({ folder: view.folder.slug, subfolder: subfolder.slug!.current! })),
  );
}

/** AC-14 */
export const subfolderTitle = (name: string, folderTitle: string) => `${name} · ${folderTitle} · Portfolio • Kettlebird Creations`;
export const subfolderDescription = (name: string, folderTitle: string, count: number) =>
  `Star's ${name} pieces, in ${folderTitle}: ${piecesCount(count)}.`;

/** AC-13: INDEX goes back when the entry before is the top level; otherwise replaces. */
export const indexAction = (previousIsTop: boolean): 'back' | 'replace' => (previousIsTop ? 'back' : 'replace');

/** AC-5: whether each arrow can scroll, allowing a pixel of rounding. */
export function arrowsUsable({ scrollLeft, scrollWidth, clientWidth }: { scrollLeft: number; scrollWidth: number; clientWidth: number }) {
  return { left: scrollLeft > 1, right: scrollLeft + clientWidth < scrollWidth - 1 };
}

const hasPicture = (item: GalleryItem) => Boolean(item.image?.asset?._ref);

/** AC-15: full screen turns through an open subfolder's pieces, or the folder's loose pieces. */
export function folderTurnOrder(view: FolderView, subfolderId?: string): GalleryItem[] {
  const pieces = subfolderId ? view.subfolders.find((s) => s.subfolder._id === subfolderId)?.pieces ?? [] : view.loose;
  return pieces.filter(hasPicture);
}
