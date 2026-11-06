// Full screen for the portfolio: the order of pieces, words, zoom, picture sizes, moving around,
// swipes and keys. Design: docs/design/portfolio-full-screen.md. Spec: docs/specs/portfolio-full-screen.md.
// Pure functions only.
import type { GalleryItem } from '../queries';

export interface Size {
  width: number;
  height: number;
}

// ---------------------------------------------------------------- order and words (AC-11, AC-13)

const hasPicture = (item: GalleryItem) => Boolean(item.image?.asset?._ref);

/** The pieces turned through: the section's, in gallery order, with a picture. */
export function turnOrder(items: GalleryItem[], section: string): GalleryItem[] {
  return items.filter((item) => item.category?.includes(section) && hasPicture(item));
}

/** The section a piece is turned through in: the one it was opened from, or its first. */
export function openedSection(item: GalleryItem, from: string | undefined): string | undefined {
  return from ?? item.category?.[0];
}

export function countLabel(index: number, count: number, sectionTitle?: string): string {
  return `${index + 1} of ${count}${sectionTitle ? ` · ${sectionTitle}` : ''}`;
}

export function announcement({ title, index, count, alt }: { title: string; index: number; count: number; alt?: string }): string {
  const described = alt?.trim();
  return `${title}, ${index + 1} of ${count}.${described ? ` ${described}` : ''}`;
}

export const LOAD_FAILED = "This piece couldn't load.";

// ---------------------------------------------------------------- picture sizes (AC-4)

const MAX_LONG_SIDE = 4000;

/** A picture's original size, from its asset id (`image-…-3000x2000-jpg`). */
export function originalSize(ref: string): Size | undefined {
  const match = /-(\d+)x(\d+)-[a-z]+$/.exec(ref);
  return match ? { width: Number(match[1]), height: Number(match[2]) } : undefined;
}

/** The fitted size of a picture in a view. */
export function fitted(original: Size, view: Size): Size {
  const scale = Math.min(view.width / original.width, view.height / original.height);
  return { width: original.width * scale, height: original.height * scale };
}

/** The width to ask the image CDN for: the fitted width times the pixel ratio, more past 150% and 300%. */
export function requestWidth({ zoom, view, dpr, original }: { zoom: number; view: Size; dpr: number; original: Size }): number {
  const factor = zoom > 3 ? 4 : zoom > 1.5 ? 2 : 1;
  const wanted = Math.ceil(fitted(original, view).width * dpr * factor);
  const longest = Math.round((MAX_LONG_SIDE * original.width) / Math.max(original.width, original.height));
  return Math.min(wanted, original.width, longest);
}

// ---------------------------------------------------------------- zoom (AC-5, AC-6)

export const ZOOM_STEP = 1.5;
export const DOUBLE_TAP_ZOOM = 2.5;

/** The most zoom: where one picture pixel covers two device pixels, but never below 200%. */
export function maxZoom({ originalWidth, fittedWidth, dpr }: { originalWidth: number; fittedWidth: number; dpr: number }): number {
  return Math.max(2, (2 * originalWidth) / (fittedWidth * dpr));
}

export function clampZoom(zoom: number, max: number): number {
  return Math.min(max, Math.max(1, zoom));
}

export function stepZoom(zoom: number, direction: 'in' | 'out', max: number): number {
  return clampZoom(direction === 'in' ? zoom * ZOOM_STEP : zoom / ZOOM_STEP, max);
}

export function zoomLabel(zoom: number): string {
  return `${Math.round(zoom * 100)}%`;
}

// ---------------------------------------------------------------- moving around (AC-7)

/** A key press moves a zoomed piece by this share of the view. */
export const PAN_STEP = 0.1;

/** Keeps a zoomed piece's edges at or beyond the view's; a piece that fits stays centred. */
export function clampPan(pan: { x: number; y: number }, zoom: number, fit: Size, view: Size): { x: number; y: number } {
  const limit = (scaled: number, room: number) => Math.max(0, (scaled - room) / 2);
  const lx = limit(fit.width * zoom, view.width);
  const ly = limit(fit.height * zoom, view.height);
  const clamp = (v: number, l: number) => (l === 0 ? 0 : Math.min(l, Math.max(-l, v)));
  return { x: clamp(pan.x, lx), y: clamp(pan.y, ly) };
}

// ---------------------------------------------------------------- turning, keys and controls (AC-8 to AC-12)

export const SWIPE_MIN = 50;
/** Swipes from within this distance of the left edge are the browser's back-swipe. */
export const EDGE = 20;
export const HIDE_DELAY_MS = 300;
export const LOADING_DELAY_MS = 300;

export type Turn = 'next' | 'previous';

export function swipeTurn({ dx, dy, startX, zoomed }: { dx: number; dy: number; startX: number; zoomed: boolean }): Turn | undefined {
  if (zoomed || startX < EDGE) return undefined;
  if (Math.abs(dx) < SWIPE_MIN || Math.abs(dy) >= Math.abs(dx)) return undefined;
  return dx < 0 ? 'next' : 'previous';
}

export type KeyAction =
  | { turn: Turn }
  | { pan: { dx: number; dy: number } }
  | { zoom: 'in' | 'out' }
  | { fit: true }
  | { close: true }
  | undefined;

const PANS: Record<string, { dx: number; dy: number }> = {
  ArrowLeft: { dx: 1, dy: 0 },
  ArrowRight: { dx: -1, dy: 0 },
  ArrowUp: { dx: 0, dy: 1 },
  ArrowDown: { dx: 0, dy: -1 },
};

export function keyAction({ key, shift, zoomed }: { key: string; shift: boolean; zoomed: boolean }): KeyAction {
  if (key === 'Escape') return { close: true };
  if (key === '+' || key === '=' || key === 'Add') return { zoom: 'in' };
  if (key === '-' || key === 'Subtract') return { zoom: 'out' };
  if (key === '0') return { fit: true };
  if (!shift && key === 'ArrowLeft') return { turn: 'previous' };
  if (!shift && key === 'ArrowRight') return { turn: 'next' };
  // Left and Right without Shift have turned above, so any arrow left here moves a zoomed piece.
  if (zoomed && key in PANS) return { pan: PANS[key] };
  return undefined;
}

export function usable({ index, count, zoom, max }: { index: number; count: number; zoom: number; max: number }) {
  return { previous: index > 0, next: index < count - 1, zoomOut: zoom > 1, fit: zoom > 1, zoomIn: zoom < max };
}

/** The pieces to fetch once the current one has loaded: the way the fan is going first. */
export function fetchNext(order: GalleryItem[], index: number, going: Turn): GalleryItem[] {
  const ahead = going === 'next' ? order[index + 1] : order[index - 1];
  const behind = going === 'next' ? order[index - 1] : order[index + 1];
  return [ahead, behind].filter((p): p is GalleryItem => Boolean(p));
}

// ---------------------------------------------------------------- a phone's bottom bar (site-arrows AC-10)

/** The bottom bar on a phone held upright, when Previous, the zoom controls and Next share one row. */
export const PHONE_BAR = 76;
/** Room beside each side button: its 8 px margin from the edge and 4 px before the zoom controls. */
const BESIDE = 12;
/** With two rows, the zoom controls sit this far up, above the side buttons, with this much under the bar's top. */
const ZOOM_ROW = 80;
const ZOOM_TOP = 8;

/** The zoom controls stay centred between the side buttons when they fit with room either side. */
export function oneRow({ width, zoom, side }: { width: number; zoom: number; side: number }): boolean {
  return zoom + 2 * (side + BESIDE) <= width;
}

/** The bar's height, and where the zoom controls sit (undefined: as styled, on the buttons' row). */
export function bottomBar({ oneRow: single, zoomHeight }: { oneRow: boolean; zoomHeight: number }): { height: number; zoomBottom: number | undefined } {
  return single ? { height: PHONE_BAR, zoomBottom: undefined } : { height: ZOOM_ROW + zoomHeight + ZOOM_TOP, zoomBottom: ZOOM_ROW };
}

// ---------------------------------------------------------------- touches (AC-6, AC-7, AC-9)

/** A touch that moves no more than this, and lifts within TAP_MS, is a tap. */
export const TAP_MOVE = 10;
export const TAP_MS = 500;
/** A second tap within this time, and near the first, is a double tap. */
export const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_DISTANCE = 40;

export function isTap({ moved, duration }: { moved: number; duration: number }): boolean {
  return moved <= TAP_MOVE && duration <= TAP_MS;
}

type TapAt = { time: number; x: number; y: number };

export function isDoubleTap(previous: TapAt | undefined, now: TapAt): boolean {
  if (!previous) return false;
  return now.time - previous.time <= DOUBLE_TAP_MS && Math.hypot(now.x - previous.x, now.y - previous.y) <= DOUBLE_TAP_DISTANCE;
}

/** The fingers down after one more touches: a new first finger means every earlier one has lifted,
 * even if a phone never reported it. */
export function downPointers(
  pointers: Map<number, { x: number; y: number }>,
  { id, x, y, primary }: { id: number; x: number; y: number; primary: boolean },
): Map<number, { x: number; y: number }> {
  const next = primary ? new Map<number, { x: number; y: number }>() : new Map(pointers);
  next.set(id, { x, y });
  return next;
}
