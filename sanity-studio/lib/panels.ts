// Panels in the editor: finding them on a page, the panel editor's steps, and its words.
// Design: docs/design/comic-panels.md. Spec: docs/specs/comic-reader-panels.md (AC-2 to AC-10).
// Pure; no `sanity` imports, so the site's Vitest can test it.

/** A panel, in percent of the picture. */
export interface Panel {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type PanelsBy = 'site' | 'star';

// ---------------------------------------------------------------- finding panels (AC-2, AC-3)

/** A gutter is at least this share of the piece's length thick (of the page's height or width). */
const MIN_GUTTER = 0.006;
/** …and at least this share of its pixels are near the background. */
const GUTTER_FILL = 0.97;
/** How near the background a pixel must be (0–255, per channel average). */
const NEAR = 28;
const MAX_PANELS = 12;
const MIN_AREA = 0.03;
/** One piece covering this much of the page is a splash: no panels. */
const SPLASH = 0.7;

interface Box {
  x0: number;
  y0: number;
  x1: number; // exclusive
  y1: number;
}

/**
 * The panels on a page, in reading order: cut into rows wherever a light gutter runs right across
 * a piece, then into columns wherever one runs right down it, and so on until nothing splits.
 * `pixels` is RGBA. An empty list means the page has no usable panels; "failed" that it can't be read.
 */
export function findPanels(pixels: Uint8ClampedArray, width: number, height: number): Panel[] | 'failed' {
  if (width < 1 || height < 1 || pixels.length < width * height * 4) return 'failed';
  const light = new Uint8Array(width * height);
  const bg = background(pixels, width, height);
  for (let i = 0; i < width * height; i++) {
    const v = (pixels[i * 4] + pixels[i * 4 + 1] + pixels[i * 4 + 2]) / 3;
    light[i] = Math.abs(v - bg) <= NEAR ? 1 : 0;
  }
  const gutterRow = (y: number, b: Box) => {
    let n = 0;
    for (let x = b.x0; x < b.x1; x++) n += light[y * width + x];
    return n >= GUTTER_FILL * (b.x1 - b.x0);
  };
  const gutterCol = (x: number, b: Box) => {
    let n = 0;
    for (let y = b.y0; y < b.y1; y++) n += light[y * width + x];
    return n >= GUTTER_FILL * (b.y1 - b.y0);
  };
  const trim = (b: Box): Box | undefined => {
    let { x0, y0, x1, y1 } = b;
    while (y0 < y1 && gutterRow(y0, { x0, y0, x1, y1 })) y0++;
    while (y1 > y0 && gutterRow(y1 - 1, { x0, y0, x1, y1 })) y1--;
    while (x0 < x1 && gutterCol(x0, { x0, y0, x1, y1 })) x0++;
    while (x1 > x0 && gutterCol(x1 - 1, { x0, y0, x1, y1 })) x1--;
    return x1 > x0 && y1 > y0 ? { x0, y0, x1, y1 } : undefined;
  };
  // Runs of content between gutters at least `min` thick, along one axis.
  const split = (b: Box, rows: boolean): Box[] => {
    const [from, to] = rows ? [b.y0, b.y1] : [b.x0, b.x1];
    const min = Math.max(1, Math.round(MIN_GUTTER * (rows ? height : width)));
    const isGutter = (i: number) => (rows ? gutterRow(i, b) : gutterCol(i, b));
    const parts: Box[] = [];
    let start = from;
    let i = from;
    while (i < to) {
      if (!isGutter(i)) {
        i++;
        continue;
      }
      let j = i;
      while (j < to && isGutter(j)) j++;
      if (j - i >= min && i > start) {
        parts.push(rows ? { ...b, y0: start, y1: i } : { ...b, x0: start, x1: i });
        start = j;
      }
      i = j;
    }
    if (start < to) parts.push(rows ? { ...b, y0: start, y1: to } : { ...b, x0: start, x1: to });
    return parts.map(trim).filter((p): p is Box => Boolean(p));
  };
  const cut = (b: Box, rowsFirst: boolean, tried = false): Box[] => {
    const parts = split(b, rowsFirst);
    if (parts.length > 1) return parts.flatMap((p) => cut(p, !rowsFirst));
    if (!tried) return cut(parts[0] ?? b, !rowsFirst, true);
    return [parts[0] ?? b];
  };
  const page = trim({ x0: 0, y0: 0, x1: width, y1: height });
  if (!page) return [];
  const boxes = cut(page, true);
  const area = (b: Box) => ((b.x1 - b.x0) * (b.y1 - b.y0)) / (width * height);
  if (boxes.length < 2 || boxes.length > MAX_PANELS) return [];
  if (boxes.some((b) => area(b) < MIN_AREA) || boxes.some((b) => area(b) >= SPLASH)) return [];
  return boxes.map((b) => ({
    x: (b.x0 / width) * 100,
    y: (b.y0 / height) * 100,
    width: ((b.x1 - b.x0) / width) * 100,
    height: ((b.y1 - b.y0) / height) * 100,
  }));
}

/** The page's background: the average of its four corners. */
function background(pixels: Uint8ClampedArray, width: number, height: number): number {
  const at = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    return (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
  };
  return (at(0, 0) + at(width - 1, 0) + at(0, height - 1) + at(width - 1, height - 1)) / 4;
}

// ---------------------------------------------------------------- the editor's words (AC-4 to AC-7)

export interface PageState {
  panels?: Panel[];
  panelsBy?: PanelsBy;
  finding?: boolean;
  failed?: boolean;
}

export const FIND_WAIT_MS = 20_000;
export const PICTURE_CHANGED = 'The picture changed. Check that your panels still match.';
export const FOUND_AFTER_PUBLISHING = 'Panels found after publishing. Publish again to use them.';
export const TOO_SMALL = 'That box was too small to be a panel.';

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Panels are found on a page unless Star set them (AC-4, AC-10). */
export function shouldFind(page: { panelsBy?: PanelsBy }): boolean {
  return page.panelsBy !== 'star';
}

export function tileCaption(page: PageState): string {
  if (page.finding) return 'Finding panels…';
  if (page.failed) return "Couldn't look for panels";
  if (!page.panelsBy) return 'No panels yet';
  const n = page.panels?.length ?? 0;
  return n ? count(n, 'panel', 'panels') : 'Shown whole';
}

export function panelStatus(page: PageState): string {
  if (page.finding) return 'Finding panels…';
  if (page.failed) return "Couldn't look for panels on this page. Draw them, or leave it whole.";
  const n = page.panels?.length ?? 0;
  if (page.panelsBy === 'star') return n ? `${count(n, 'panel', 'panels')}, set by you.` : 'Shown whole: panel by panel shows this page as one.';
  if (n) return `${count(n, 'panel', 'panels')}, found by the site. Check that they match your page.`;
  return 'No panels found: this page shows whole. Draw panels on it if it has some.';
}

export function publishFindingLabel(pages: number): string | undefined {
  return pages > 0 ? `Finding panels on ${count(pages, 'page', 'pages')}…` : undefined;
}

export function olderPagesBanner(pages: number): string | undefined {
  if (pages < 1) return undefined;
  return `${count(pages, 'page has', 'pages have')} no panels yet. Find them, then check them before you publish.`;
}

export function findingProgress(done: number, total: number): string {
  return `Finding panels: ${done} of ${total} done.`;
}

// ---------------------------------------------------------------- the panel editor (AC-8, AC-9)

export interface EditorState {
  panels: Panel[];
  by?: PanelsBy;
  selected?: number;
  /** While setting the reading order: the boxes picked so far, by their old index. */
  ordering?: number[];
  /** What changed, for the status line read by screen readers. */
  message?: string;
  /** Earlier states, back to when the page was opened. */
  history: { panels: Panel[]; by?: PanelsBy }[];
}

export type EditorAction =
  | { type: 'select'; index?: number }
  | { type: 'move'; dx: number; dy: number }
  | { type: 'resize'; dw: number; dh: number }
  | { type: 'draw'; box: Panel }
  | { type: 'add' }
  | { type: 'remove' }
  | { type: 'earlier' }
  | { type: 'later' }
  | { type: 'startOrder' }
  | { type: 'pick'; index: number }
  | { type: 'finishOrder' }
  | { type: 'cancelOrder' }
  | { type: 'whole' }
  | { type: 'confirm' }
  | { type: 'undo' };

export function startEditing(page: { panels?: Panel[]; panelsBy?: PanelsBy }): EditorState {
  return { panels: [...(page.panels ?? [])], by: page.panelsBy, history: [] };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const fit = (p: Panel): Panel => {
  const width = clamp(p.width, 1, 100);
  const height = clamp(p.height, 1, 100);
  return { x: clamp(p.x, 0, 100 - width), y: clamp(p.y, 0, 100 - height), width, height };
};

/** A change: Star's from now on, and undoable. */
function change(s: EditorState, panels: Panel[], extra: Partial<EditorState> = {}): EditorState {
  return { ...s, ...extra, panels, by: 'star', history: [...s.history, { panels: s.panels, by: s.by }] };
}

export function edit(s: EditorState, a: EditorAction): EditorState {
  const i = s.selected;
  const has = i !== undefined && i >= 0 && i < s.panels.length;
  switch (a.type) {
    case 'select':
      return { ...s, selected: a.index, message: a.index === undefined ? undefined : `${boxName(a.index, s.panels.length, true)}.` };
    case 'move':
    case 'resize': {
      if (!has) return s;
      const p = s.panels[i];
      const next = a.type === 'move'
        ? fit({ ...p, x: clamp(p.x + a.dx, 0, 100 - p.width), y: clamp(p.y + a.dy, 0, 100 - p.height) })
        : fit({ ...p, width: Math.min(p.width + a.dw, 100 - p.x), height: Math.min(p.height + a.dh, 100 - p.y) });
      return change(s, s.panels.map((q, j) => (j === i ? next : q)), { message: `Panel ${i + 1} ${a.type === 'move' ? 'moved' : 'resized'}.` });
    }
    case 'draw': {
      const box = fit(a.box);
      if (box.width * box.height < 300) return { ...s, message: TOO_SMALL };
      return change(s, [...s.panels, box], { selected: s.panels.length, message: `Panel ${s.panels.length + 1} added.` });
    }
    case 'add':
      return change(s, [...s.panels, { x: 35, y: 40, width: 30, height: 20 }], { selected: s.panels.length, message: `Panel ${s.panels.length + 1} added.` });
    case 'remove':
      if (!has) return s;
      return change(s, s.panels.filter((_, j) => j !== i), { selected: undefined, message: `Panel ${i + 1} removed.` });
    case 'earlier':
    case 'later': {
      if (!has) return s;
      const to = a.type === 'earlier' ? i - 1 : i + 1;
      if (to < 0 || to >= s.panels.length) return s;
      const panels = [...s.panels];
      [panels[i], panels[to]] = [panels[to], panels[i]];
      return change(s, panels, { selected: to, message: `Panel ${i + 1} moved ${a.type}. Now panel ${to + 1} of ${panels.length}.` });
    }
    case 'startOrder':
      return s.panels.length ? { ...s, ordering: [], selected: undefined } : s;
    case 'pick':
      if (!s.ordering || s.ordering.includes(a.index) || a.index < 0 || a.index >= s.panels.length) return s;
      return { ...s, ordering: [...s.ordering, a.index], message: `${s.ordering.length + 1} of ${s.panels.length} numbered.` };
    case 'finishOrder': {
      if (!s.ordering) return s;
      const order = [...s.ordering, ...s.panels.map((_, j) => j).filter((j) => !s.ordering!.includes(j))];
      return change(s, order.map((j) => s.panels[j]), { ordering: undefined, message: 'Reading order set.' });
    }
    case 'cancelOrder':
      return { ...s, ordering: undefined };
    case 'whole':
      return s.panels.length ? change(s, [], { selected: undefined, message: 'Shown whole.' }) : s;
    case 'confirm':
      return { ...s, by: 'star', history: [...s.history, { panels: s.panels, by: s.by }], message: 'Panels confirmed.' };
    case 'undo': {
      const last = s.history[s.history.length - 1];
      if (!last) return s;
      return { ...s, panels: last.panels, by: last.by, history: s.history.slice(0, -1), selected: undefined, ordering: undefined, message: 'Undone.' };
    }
  }
}

export function canUse(s: EditorState): { setOrder: boolean; showWhole: boolean; findAgain: boolean; undo: boolean } {
  const any = s.panels.length > 0;
  return { setOrder: any, showWhole: any, findAgain: s.by !== 'star', undo: s.history.length > 0 };
}

/** A box's name, for screen readers (AC-9). */
export function boxName(index: number, count: number, selected: boolean): string {
  return `Panel ${index + 1} of ${count}${selected ? ', selected' : ''}`;
}

/**
 * The step a drag of a box makes: a move, or a resize by its handle; none for a click without a drag
 * (docs/specs/comic-reader-panels.md AC-8). Used as the box follows the pointer and when it's let go, so what
 * shows while dragging is what's kept.
 */
export function dragStep(kind: 'move' | 'resize', dx: number, dy: number): EditorAction | undefined {
  if (Math.abs(dx) + Math.abs(dy) < 0.3) return undefined;
  return kind === 'move' ? { type: 'move', dx, dy } : { type: 'resize', dw: dx, dh: dy };
}

/** The boxes as they'd be after the drag so far, without making it a step: shown while the pointer moves. */
export function dragPreview(s: EditorState, kind: 'move' | 'resize', dx: number, dy: number): Panel[] {
  const step = dragStep(kind, dx, dy);
  return step ? edit(s, step).panels : s.panels;
}
