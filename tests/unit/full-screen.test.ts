// Full screen for the portfolio: the pure parts. Criteria: docs/specs/portfolio-full-screen.md.
import { describe, expect, it } from 'vitest';
import {
  announcement,
  clampPan,
  countLabel,
  DOUBLE_TAP_ZOOM,
  fetchNext,
  HIDE_DELAY_MS,
  keyAction,
  LOAD_FAILED,
  LOADING_DELAY_MS,
  maxZoom,
  openedSection,
  originalSize,
  PAN_STEP,
  requestWidth,
  stepZoom,
  swipeTurn,
  turnOrder,
  usable,
  zoomLabel,
} from '../../src/lib/portfolio/full-screen';
import type { GalleryItem } from '../../src/lib/queries';

const piece = (id: string, category: string[], picture = true): GalleryItem => ({
  _id: id,
  title: id.toUpperCase(),
  slug: { current: id },
  category,
  image: picture ? { asset: { _ref: `image-${id}aaaa-3000x2000-jpg` } } : (undefined as unknown as GalleryItem['image']),
});
const items = [piece('a', ['original']), piece('b', ['original', 'fanart']), piece('c', ['original'], false), piece('d', ['original']), piece('e', ['fanart'])];

describe('portfolio-full-screen#AC-11 order', () => {
  it('turns through the section it was opened from, leaving out pieces without a picture', () => {
    expect(turnOrder(items, 'original').map((p) => p._id)).toEqual(['a', 'b', 'd']);
    expect(turnOrder(items, 'fanart').map((p) => p._id)).toEqual(['b', 'e']);
    expect(turnOrder(items, 'wip')).toEqual([]);
  });

  it('opens a piece the preview opened directly in its first section', () => {
    expect(openedSection(items[1], 'fanart')).toBe('fanart');
    expect(openedSection(items[1], undefined)).toBe('original');
    expect(openedSection(piece('x', []), undefined)).toBeUndefined();
  });

  it('counts only pieces with a picture, and can\'t go past either end', () => {
    expect(countLabel(0, 3, 'Original Work')).toBe('1 of 3 · Original Work');
    expect(countLabel(2, 3)).toBe('3 of 3');
    expect(usable({ index: 0, count: 3, zoom: 1, max: 4 })).toMatchObject({ previous: false, next: true });
    expect(usable({ index: 2, count: 3, zoom: 1, max: 4 })).toMatchObject({ previous: true, next: false });
    expect(usable({ index: 0, count: 1, zoom: 1, max: 4 })).toMatchObject({ previous: false, next: false });
  });
});

describe('portfolio-full-screen#AC-4 picture sizes', () => {
  it('reads the original size from the asset id', () => {
    expect(originalSize('image-abc-3000x2000-jpg')).toEqual({ width: 3000, height: 2000 });
    expect(originalSize('image-abc-800x1200-png')).toEqual({ width: 800, height: 1200 });
    expect(originalSize('nonsense')).toBeUndefined();
  });

  it('asks for the fitted size times the pixel ratio, more as the zoom needs it, never more than the original or 4,000 px', () => {
    const original = { width: 3000, height: 2000 };
    const view = { width: 1280, height: 800 };
    // Fitted: 1200 × 800 on a 1280 × 800 view.
    expect(requestWidth({ zoom: 1, view, dpr: 1, original })).toBe(1200);
    expect(requestWidth({ zoom: 1.5, view, dpr: 1, original })).toBe(1200);
    expect(requestWidth({ zoom: 1.6, view, dpr: 1, original })).toBe(2400);
    expect(requestWidth({ zoom: 3, view, dpr: 1, original })).toBe(2400);
    expect(requestWidth({ zoom: 3.1, view, dpr: 1, original })).toBe(3000);
    expect(requestWidth({ zoom: 1, view, dpr: 2, original })).toBe(2400);
    // A tall phone, a portrait original.
    expect(requestWidth({ zoom: 1, view: { width: 390, height: 700 }, dpr: 3, original: { width: 800, height: 1200 } })).toBe(800);
    // No more than 4,000 px on the longer side.
    expect(requestWidth({ zoom: 5, view, dpr: 2, original: { width: 9000, height: 6000 } })).toBe(4000);
    expect(requestWidth({ zoom: 5, view, dpr: 2, original: { width: 6000, height: 9000 } })).toBe(2667);
  });
});

describe('portfolio-full-screen#AC-5 AC-6 zoom', () => {
  it('stays between 100% and where a picture pixel covers two device pixels, never below 200%', () => {
    // A 3000 px wide original fitted at 1200 css px on a 1× screen: 2 × 3000 / 1200 = 5.
    expect(maxZoom({ originalWidth: 3000, fittedWidth: 1200, dpr: 1 })).toBe(5);
    expect(maxZoom({ originalWidth: 800, fittedWidth: 780, dpr: 3 })).toBe(2);
  });

  it('steps by half again, and stops at the limits', () => {
    expect(stepZoom(1, 'in', 5)).toBe(1.5);
    expect(stepZoom(1.5, 'in', 5)).toBe(2.25);
    expect(stepZoom(4, 'in', 5)).toBe(5);
    expect(stepZoom(1.2, 'out', 5)).toBe(1);
    expect(stepZoom(2.25, 'out', 5)).toBe(1.5);
    expect(DOUBLE_TAP_ZOOM).toBe(2.5);
  });

  it('names the zoom from the fit', () => {
    expect(zoomLabel(1)).toBe('100%');
    expect(zoomLabel(2.5)).toBe('250%');
    expect(zoomLabel(2.25)).toBe('225%');
  });

  it('can\'t zoom out or fit at 100%, or zoom in at the most', () => {
    expect(usable({ index: 1, count: 3, zoom: 1, max: 4 })).toMatchObject({ zoomOut: false, fit: false, zoomIn: true });
    expect(usable({ index: 1, count: 3, zoom: 4, max: 4 })).toMatchObject({ zoomOut: true, fit: true, zoomIn: false });
  });
});

describe('portfolio-full-screen#AC-7 moving around', () => {
  const fitted = { width: 1200, height: 800 };
  const view = { width: 1280, height: 800 };
  it('stops at the piece\'s edges, and centres it when it fits', () => {
    // At 2×, the piece is 2400 × 1600: it can move 560 sideways and 400 up or down each way.
    expect(clampPan({ x: 1000, y: -1000 }, 2, fitted, view)).toEqual({ x: 560, y: -400 });
    expect(clampPan({ x: 100, y: 50 }, 2, fitted, view)).toEqual({ x: 100, y: 50 });
    expect(clampPan({ x: 100, y: 50 }, 1, fitted, view)).toEqual({ x: 0, y: 0 });
  });

  it('moves a tenth of the view a key press', () => {
    expect(PAN_STEP).toBe(0.1);
  });
});

describe('portfolio-full-screen#AC-10 turning', () => {
  it('turns on a sideways swipe of 50 px or more while the piece fits', () => {
    expect(swipeTurn({ dx: -80, dy: 10, startX: 200, zoomed: false })).toBe('next');
    expect(swipeTurn({ dx: 80, dy: -10, startX: 200, zoomed: false })).toBe('previous');
    expect(swipeTurn({ dx: -40, dy: 0, startX: 200, zoomed: false })).toBeUndefined();
    expect(swipeTurn({ dx: -50, dy: 0, startX: 200, zoomed: false })).toBe('next');
  });

  it('doesn\'t turn on a mostly vertical swipe, one from the left edge, or a zoomed piece', () => {
    expect(swipeTurn({ dx: -80, dy: 90, startX: 200, zoomed: false })).toBeUndefined();
    expect(swipeTurn({ dx: 80, dy: 0, startX: 19, zoomed: false })).toBeUndefined();
    expect(swipeTurn({ dx: 80, dy: 0, startX: 20, zoomed: false })).toBe('previous');
    expect(swipeTurn({ dx: -80, dy: 0, startX: 200, zoomed: true })).toBeUndefined();
  });

  it('turns with Left and Right at any zoom; moves with Shift and the arrows, or Up and Down, while zoomed', () => {
    expect(keyAction({ key: 'ArrowRight', shift: false, zoomed: false })).toEqual({ turn: 'next' });
    expect(keyAction({ key: 'ArrowLeft', shift: false, zoomed: true })).toEqual({ turn: 'previous' });
    expect(keyAction({ key: 'ArrowRight', shift: true, zoomed: true })).toEqual({ pan: { dx: -1, dy: 0 } });
    expect(keyAction({ key: 'ArrowLeft', shift: true, zoomed: true })).toEqual({ pan: { dx: 1, dy: 0 } });
    expect(keyAction({ key: 'ArrowDown', shift: false, zoomed: true })).toEqual({ pan: { dx: 0, dy: -1 } });
    expect(keyAction({ key: 'ArrowUp', shift: true, zoomed: true })).toEqual({ pan: { dx: 0, dy: 1 } });
    expect(keyAction({ key: 'ArrowUp', shift: false, zoomed: false })).toBeUndefined();
    expect(keyAction({ key: 'ArrowRight', shift: true, zoomed: false })).toBeUndefined();
  });

  it('zooms, fits and leaves with keys', () => {
    for (const key of ['+', '=', 'Add']) expect(keyAction({ key, shift: false, zoomed: false })).toEqual({ zoom: 'in' });
    for (const key of ['-', 'Subtract']) expect(keyAction({ key, shift: false, zoomed: true })).toEqual({ zoom: 'out' });
    expect(keyAction({ key: '0', shift: false, zoomed: true })).toEqual({ fit: true });
    expect(keyAction({ key: 'Escape', shift: false, zoomed: false })).toEqual({ close: true });
    expect(keyAction({ key: 'a', shift: false, zoomed: false })).toBeUndefined();
  });
});

describe('portfolio-full-screen#AC-12 loading', () => {
  it('fetches the neighbours once the piece has loaded, the way the fan is going first', () => {
    const order = turnOrder(items, 'original');
    expect(fetchNext(order, 1, 'next').map((p) => p._id)).toEqual(['d', 'a']);
    expect(fetchNext(order, 1, 'previous').map((p) => p._id)).toEqual(['a', 'd']);
    expect(fetchNext(order, 0, 'next').map((p) => p._id)).toEqual(['b']);
    expect(fetchNext(order, 2, 'next').map((p) => p._id)).toEqual(['b']);
  });

  it('waits 300 ms before the loading sign, and says when a piece fails', () => {
    expect(LOADING_DELAY_MS).toBe(300);
    expect(LOAD_FAILED).toBe("This piece couldn't load.");
  });
});

describe('portfolio-full-screen#AC-9 hiding the controls', () => {
  it('hides them only once a double-tap can\'t follow', () => {
    expect(HIDE_DELAY_MS).toBe(300);
  });
});

describe('portfolio-full-screen#AC-13 accessibility', () => {
  it('says the title and where the piece is, then what it shows', () => {
    expect(announcement({ title: 'Night Market', index: 2, count: 12, alt: 'Lanterns over the river.' })).toBe('Night Market, 3 of 12. Lanterns over the river.');
    expect(announcement({ title: 'Night Market', index: 2, count: 12 })).toBe('Night Market, 3 of 12.');
    expect(announcement({ title: 'Night Market', index: 2, count: 12, alt: '  ' })).toBe('Night Market, 3 of 12.');
  });
});
