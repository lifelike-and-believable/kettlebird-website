// Edges of finding panels, the panel editor, and the reader's panel steps, found by mutation testing.
// Criteria: docs/specs/comic-reader-panels.md (AC-1 to AC-3, AC-8, AC-12, AC-13).
import { describe, expect, it } from 'vitest';
import { readerPages, type ComicPage } from '../../src/lib/comics/model';
import { pagePanels, panelFrame, panelStep } from '../../src/lib/comics/panels';
import { edit, findPanels, startEditing, TOO_SMALL, type EditorState } from '../../sanity-studio/lib/panels';
import { FIXTURE_SERIES } from '../fixtures/comics';

/** A page of `background`, with flat boxes of `ink` at the given rectangles (in pixels). */
function page(width: number, height: number, boxes: [number, number, number, number][], background = 255, ink = 90): Uint8ClampedArray {
  const px = new Uint8ClampedArray(width * height * 4).fill(background);
  for (let i = 3; i < px.length; i += 4) px[i] = 255;
  for (const [bx, by, bw, bh] of boxes) {
    for (let y = by; y < by + bh; y++) {
      for (let x = bx; x < bx + bw; x++) {
        const i = (y * width + x) * 4;
        px[i] = px[i + 1] = px[i + 2] = ink;
      }
    }
  }
  return px;
}

const grid = (cols: number, rows: number, size: number, gap: number): [number, number, number, number][] => {
  const boxes: [number, number, number, number][] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) boxes.push([gap + c * (size + gap), gap + r * (size + gap), size, size]);
  return boxes;
};

describe('comic-reader-panels#AC-3 finding panels: edges', () => {
  it('fails on a picture it can\'t read', () => {
    expect(findPanels(new Uint8ClampedArray(0), 0, 10)).toBe('failed');
    expect(findPanels(new Uint8ClampedArray(0), 10, 0)).toBe('failed');
    expect(findPanels(new Uint8ClampedArray(10 * 10 * 4 - 1), 10, 10)).toBe('failed');
    expect(findPanels(new Uint8ClampedArray(1 * 1 * 4), 1, 1)).toEqual([]);
  });

  it('finds nothing on a blank page', () => {
    expect(findPanels(page(100, 100, []), 100, 100)).toEqual([]);
  });

  it('reads the background from the corners, light or dark', () => {
    const boxes: [number, number, number, number][] = [[10, 10, 80, 40], [10, 60, 80, 30]];
    expect(findPanels(page(100, 100, boxes), 100, 100)).toHaveLength(2);
    expect(findPanels(page(100, 100, boxes, 0, 200), 100, 100)).toHaveLength(2);
    // Each corner counts: one dark corner on a light page shifts the background, but not past "near".
    const px = page(100, 100, boxes);
    px[0] = px[1] = px[2] = 200;
    expect(findPanels(px, 100, 100)).toHaveLength(2);
  });

  it('needs a gutter at least 0.6% of the page thick', () => {
    // 300 high: 0.6% is 2 pixels. A 1-pixel gap joins the boxes into one splash.
    expect(findPanels(page(200, 300, [[10, 10, 180, 139], [10, 150, 180, 140]]), 200, 300)).toEqual([]);
    const two = findPanels(page(200, 300, [[10, 10, 180, 138], [10, 150, 180, 140]]), 200, 300) as { y: number; height: number }[];
    expect(two).toHaveLength(2);
    expect(two[0].height).toBeCloseTo((138 / 300) * 100);
    expect(two[1].y).toBeCloseTo(50);
    // Columns too: 200 wide, 0.6% is 1 pixel.
    expect(findPanels(page(200, 300, [[10, 10, 89, 280], [100, 10, 90, 280]]), 200, 300)).toHaveLength(2);
  });

  it('lets a gutter carry a few stray marks, but not many', () => {
    const boxes: [number, number, number, number][] = [[10, 10, 180, 130], [10, 160, 180, 130]];
    const marks = (n: number) => {
      const px = page(200, 300, boxes);
      // n dark pixels on every row of the gutter (y 140 to 159), spread across it.
      for (let y = 140; y < 160; y++) {
        for (let k = 0; k < n; k++) {
          const i = (y * 200 + 10 + k * 9) * 4;
          px[i] = px[i + 1] = px[i + 2] = 0;
        }
      }
      return px;
    };
    expect(findPanels(marks(5), 200, 300)).toHaveLength(2); // 5 of 180 across the content: under 3%
    expect(findPanels(marks(19), 200, 300)).toEqual([]); // 19 of 180: over 3%, so no gutter
  });

  it('trims every outer margin', () => {
    const [a, b] = findPanels(page(200, 200, [[30, 20, 60, 150], [110, 20, 50, 150]]), 200, 200) as { x: number; y: number; width: number; height: number }[];
    const r = (p: typeof a) => [p.x, p.y, p.width, p.height].map((v) => Math.round(v * 1000) / 1000);
    expect(r(a)).toEqual([15, 10, 30, 75]);
    expect(r(b)).toEqual([55, 10, 25, 75]);
  });

  it('keeps up to 12 panels, and gives up past 12', () => {
    expect(findPanels(page(310, 410, grid(3, 4, 90, 10)), 310, 410)).toHaveLength(12);
    expect(findPanels(page(410, 410, grid(4, 4, 90, 10)), 410, 410)).toEqual([]);
  });

  it('gives up when one panel is under 3% of the page or one covers 70% or more', () => {
    // 100 × 100: a 17 × 17 box is 2.89%; 18 × 17 is 3.06%.
    expect(findPanels(page(100, 100, [[2, 2, 96, 60], [2, 70, 17, 17]]), 100, 100)).toEqual([]);
    expect(findPanels(page(100, 100, [[2, 2, 96, 60], [2, 70, 18, 17]]), 100, 100)).toHaveLength(2);
    // 98 × 71 (69.6%) beside a small panel is fine; 98 × 72 (70.6%) isn't.
    expect(findPanels(page(100, 100, [[1, 1, 98, 71], [1, 78, 50, 21]]), 100, 100)).toHaveLength(2);
    expect(findPanels(page(100, 100, [[1, 1, 98, 72], [1, 78, 50, 21]]), 100, 100)).toEqual([]);
  });
});

const P = (x: number, y: number, width: number, height: number) => ({ x, y, width, height });
const three = (): EditorState => startEditing({ panels: [P(0, 0, 50, 50), P(50, 0, 50, 50), P(0, 50, 100, 50)], panelsBy: 'site' });

describe('comic-reader-panels#AC-8 panel editor: edges', () => {
  it('does nothing to a box when none is selected', () => {
    const s = three();
    for (const type of ['remove', 'earlier', 'later'] as const) expect(edit(s, { type })).toBe(s);
    expect(edit(s, { type: 'move', dx: 1, dy: 1 })).toBe(s);
    expect(edit(edit(s, { type: 'select', index: 3 }), { type: 'remove' }).panels).toHaveLength(3);
    expect(edit(edit(s, { type: 'select', index: -1 }), { type: 'remove' }).panels).toHaveLength(3);
    expect(edit(s, { type: 'select', index: undefined }).message).toBeUndefined();
  });

  it('removes the selected box, as Star\'s change', () => {
    const s = edit(edit(three(), { type: 'select', index: 1 }), { type: 'remove' });
    expect(s.panels).toEqual([P(0, 0, 50, 50), P(0, 50, 100, 50)]);
    expect(s).toMatchObject({ by: 'star', selected: undefined, message: 'Panel 2 removed.' });
    expect(s.history).toHaveLength(1);
  });

  it('can\'t move the first box earlier or the last later', () => {
    const first = edit(three(), { type: 'select', index: 0 });
    expect(edit(first, { type: 'earlier' })).toBe(first);
    const last = edit(three(), { type: 'select', index: 2 });
    expect(edit(last, { type: 'later' })).toBe(last);
    const moved = edit(first, { type: 'later' });
    expect(moved.panels[1]).toEqual(P(0, 0, 50, 50));
    expect(moved).toMatchObject({ selected: 1, by: 'star', message: 'Panel 1 moved later. Now panel 2 of 3.' });
  });

  it('only picks boxes while setting the order, each once, and only real ones', () => {
    const s = three();
    expect(edit(s, { type: 'pick', index: 0 })).toBe(s);
    const o = edit(s, { type: 'startOrder' });
    expect(o.ordering).toEqual([]);
    const one = edit(o, { type: 'pick', index: 1 });
    expect(one).toMatchObject({ ordering: [1], message: '1 of 3 numbered.' });
    expect(edit(one, { type: 'pick', index: 1 })).toBe(one);
    expect(edit(one, { type: 'pick', index: -1 })).toBe(one);
    expect(edit(one, { type: 'pick', index: 3 })).toBe(one);
    expect(edit(one, { type: 'pick', index: 2 }).message).toBe('2 of 3 numbered.');
    expect(edit(startEditing({ panels: [] }), { type: 'startOrder' }).ordering).toBeUndefined();
  });

  it('finishes the order only while setting it, keeping the rest after in their old order', () => {
    const s = three();
    expect(edit(s, { type: 'finishOrder' })).toBe(s);
    const done = edit(edit(edit(s, { type: 'startOrder' }), { type: 'pick', index: 2 }), { type: 'finishOrder' });
    expect(done.panels).toEqual([P(0, 50, 100, 50), P(0, 0, 50, 50), P(50, 0, 50, 50)]);
    expect(done).toMatchObject({ ordering: undefined, by: 'star', message: 'Reading order set.' });
    expect(done.history).toEqual([{ panels: s.panels, by: 'site' }]);
  });

  it('shows a page whole only when it has boxes', () => {
    const none = startEditing({ panels: [], panelsBy: 'site' });
    expect(edit(none, { type: 'whole' })).toBe(none);
    const whole = edit(edit(three(), { type: 'select', index: 0 }), { type: 'whole' });
    expect(whole).toMatchObject({ panels: [], by: 'star', selected: undefined, message: 'Shown whole.' });
  });

  it('confirms without changing the boxes, and undoing a confirm gives them back to the site', () => {
    const s = three();
    const ok = edit(s, { type: 'confirm' });
    expect(ok.panels).toBe(s.panels);
    expect(ok).toMatchObject({ by: 'star', message: 'Panels confirmed.' });
    const back = edit(ok, { type: 'undo' });
    expect(back).toMatchObject({ by: 'site', history: [], message: 'Undone.' });
  });

  it('undoes one step at a time, clearing the selection and any order being set', () => {
    let s = edit(edit(three(), { type: 'select', index: 0 }), { type: 'move', dx: 5, dy: 0 });
    s = edit(s, { type: 'move', dx: 0, dy: 5 });
    s = edit(edit(s, { type: 'startOrder' }), { type: 'pick', index: 0 });
    const once = edit(s, { type: 'undo' });
    expect(once.panels[0]).toEqual(P(5, 0, 50, 50));
    expect(once).toMatchObject({ selected: undefined, ordering: undefined });
    expect(once.history).toHaveLength(1);
    expect(edit(once, { type: 'undo' }).panels[0]).toEqual(P(0, 0, 50, 50));
  });

  it('keeps a drawn box of exactly 3% of the page, inside the picture', () => {
    expect(edit(three(), { type: 'draw', box: P(10, 10, 17, 17) }).message).toBe(TOO_SMALL);
    const kept = edit(three(), { type: 'draw', box: P(95, 95, 20, 15) });
    expect(kept.panels[3]).toEqual(P(80, 85, 20, 15));
    expect(kept).toMatchObject({ selected: 3, message: 'Panel 4 added.' });
  });
});

const sheets = FIXTURE_SERIES.find((s) => s.slug === 'single-sheets')!;
const at = (path: string) => readerPages(sheets).find((e) => e.path === `/comics/single-sheets/${path}`)!;

describe('comic-reader-panels#AC-1 AC-12 AC-13 reader: edges', () => {
  it('drops panels with no width or no height', () => {
    const p = { panels: [P(0, 0, 0, 10), P(0, 0, 10, 0), P(0, 0, 10, 10)] } as unknown as ComicPage;
    expect(pagePanels(p)).toEqual([P(0, 0, 10, 10)]);
  });

  it('fits a wide panel by width and a tall one by height', () => {
    // Area 100 × 100, margin 4: a 50 × 10 panel fits by width (100 / 58), a 10 × 50 one by height.
    expect(panelFrame(P(0, 0, 50, 10), 100, 100).scale).toBeCloseTo(100 / 58);
    expect(panelFrame(P(0, 0, 10, 50), 100, 100).scale).toBeCloseTo(100 / 58);
    const wide = panelFrame(P(0, 0, 50, 10), 200, 100);
    expect(wide.scale).toBeCloseTo(Math.min(200 / 116, 100 / 26));
    const tall = panelFrame(P(0, 0, 10, 80), 200, 100);
    expect(tall.scale).toBeCloseTo(Math.min(200 / 36, 100 / 96));
  });

  it('steps back to the previous page from any panel of a page without panels', () => {
    const whole = at('1/2');
    expect(pagePanels(whole.page)).toHaveLength(0);
    expect(panelStep(whole, 1, 'previous')).toEqual({ path: whole.previousPath, at: 'last' });
    expect(panelStep(at('1/1'), 1, 'previous')).toEqual({ panel: 0 });
    expect(panelStep(at('1/1'), 0, 'previous')).toBeUndefined();
  });
});
