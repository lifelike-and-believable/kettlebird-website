// Reading panel by panel: a page's panels, the panel view's frame, steps, and words.
// Design: docs/design/comic-panels.md. Spec: docs/specs/comic-reader-panels.md (AC-11 to AC-15).
// Pure functions only, like model.ts.
import { locationLine, type ComicPage, type ReaderPage } from './model';

export interface Panel {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** A page's usable panels, in reading order; none means the page reads whole (AC-1). */
export function pagePanels(page: ComicPage): Panel[] {
  return (page.panels ?? []).filter((p) => p.width > 0 && p.height > 0);
}

/** Panel by panel is offered in a chapter where any page has panels (AC-11). */
export function offersPanels(entry: ReaderPage): boolean {
  return entry.chapter.pages.some((p) => pagePanels(p).length > 0);
}

/** The margin around a panel, as a share of the page's width (AC-12). */
export const PANEL_MARGIN = 0.04;

/**
 * How to place a page shown at `areaWidth` × `areaHeight` (the whole page fitting the area) so that
 * `panel` and its margin fill the area, centred: scale it, then move it by x and y pixels.
 */
export function panelFrame(panel: Panel | undefined, areaWidth: number, areaHeight: number): { scale: number; x: number; y: number } {
  if (!panel) return { scale: 1, x: 0, y: 0 };
  const m = PANEL_MARGIN * areaWidth;
  const left = (panel.x / 100) * areaWidth;
  const top = (panel.y / 100) * areaHeight;
  const width = (panel.width / 100) * areaWidth;
  const height = (panel.height / 100) * areaHeight;
  const scale = Math.min(areaWidth / (width + 2 * m), areaHeight / (height + 2 * m));
  return {
    scale,
    x: areaWidth / 2 - (left + width / 2) * scale,
    y: areaHeight / 2 - (top + height / 2) * scale,
  };
}

/** "Page 4 of 12 · panel 2 of 5", or "… · whole page" (AC-12). */
export function panelLocation(entry: ReaderPage, panel: number): string {
  const panels = pagePanels(entry.page);
  return `${locationLine(entry)} · ${panels.length ? `panel ${panel + 1} of ${panels.length}` : 'whole page'}`;
}

export type PanelStep = { panel: number } | { path: string; at: 'first' | 'last' };

/** The next or previous step from a panel: within the page, or to a neighbouring page (AC-13). */
export function panelStep(entry: ReaderPage, panel: number, dir: 'next' | 'previous'): PanelStep | undefined {
  const count = pagePanels(entry.page).length;
  if (dir === 'next') {
    if (panel + 1 < count) return { panel: panel + 1 };
    return entry.nextPath ? { path: entry.nextPath, at: 'first' } : undefined;
  }
  if (panel > 0 && count > 0) return { panel: panel - 1 };
  return entry.previousPath ? { path: entry.previousPath, at: 'last' } : undefined;
}

/** "Next panel" when the step stays on the page, "Next page" when it leaves it (AC-13). */
export function panelControlName(entry: ReaderPage, panel: number, dir: 'next' | 'previous'): string {
  const step = panelStep(entry, panel, dir);
  const word = dir === 'next' ? 'Next' : 'Previous';
  return `${word} ${step && 'panel' in step ? 'panel' : 'page'}`;
}

/** What a screen reader hears at each step (AC-15). */
export function panelAnnouncement(panel: number, count: number): string {
  return `Panel ${panel + 1} of ${count}.`;
}

export function panelsOn(panel: number, count: number): string {
  return `Panel by panel. ${panelAnnouncement(panel, count)}`;
}

export const PANELS_OFF = 'Whole page';

// With two pages side by side (docs/specs/comic-reader-panels-two-up.md).

/** The width test for two pages side by side; WIDE_MEDIA in spreads.ts. */
const WIDE_SIZES = '(min-width: 62.5em) and (orientation: landscape)';

/**
 * A page's `sizes`. In a chapter with panels, a wide screen asks for twice the page area's width when
 * one page shows: the area's height (the window less the bar and controls) times the page's shape,
 * doubled, so a zoomed panel stays sharp (AC-7). Otherwise, as before.
 */
export function readerSizes(
  image: { width: number; height: number },
  spread: boolean,
  panelled: boolean,
  /** How the page fits on a computer, and its largest width (docs/specs/comic-reader-page-size.md AC-7). */
  fit?: { size: 'screen' | 'width' | 'height'; cap: number },
): string {
  const narrow = spread ? '100vw' : '(max-width: 700px) 100vw, 900px';
  const today = panelled
    ? `${WIDE_SIZES} calc((100vh - 12.5rem) * ${((2 * image.width) / image.height).toFixed(4)}), ${narrow}`
    : spread ? '100vw' : `${WIDE_SIZES} 50vw, ${narrow}`;
  // Panel by panel fits the window whatever the size, so its sizes stay as they are.
  if (!fit || fit.size === 'screen' || panelled) return today;
  const tall = fit.size === 'height' ? `, calc(100vh * ${(image.width / image.height).toFixed(4)})` : '';
  return `${COMPUTER} min(${fit.cap}px, calc(100vw - 2rem)${tall}), ${today}`;
}

/** A computer: a mouse or trackpad (design-comic-page-width, "On a computer"). */
export const COMPUTER = '(hover: hover) and (pointer: fine)';

/** What switching panel by panel off says: what arriving at a pair or a spread says, else "Whole page" (AC-5). */
export function panelsOffAnnouncement(view: 'narrow' | 'wide', kind: string, wideText: string): string {
  return view === 'wide' && (kind === 'pair' || kind === 'spread') ? wideText : PANELS_OFF;
}
