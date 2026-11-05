// Panels: on a page, in the editor, and in the reader. Criteria: docs/specs/comic-reader-panels.md.
import { describe, expect, it } from 'vitest';
import { readerPages, type ComicPage, type ReaderPage } from '../../src/lib/comics/model';
import { fromSanity } from '../../src/lib/comics/source';
import {
  offersPanels,
  pagePanels,
  PANELS_OFF,
  panelAnnouncement,
  panelControlName,
  panelFrame,
  panelLocation,
  panelsOn,
  panelStep,
} from '../../src/lib/comics/panels';
import {
  boxName,
  canUse,
  edit,
  FIND_WAIT_MS,
  FOUND_AFTER_PUBLISHING,
  findingProgress,
  olderPagesBanner,
  panelStatus,
  PICTURE_CHANGED,
  publishFindingLabel,
  shouldFind,
  startEditing,
  tileCaption,
  TOO_SMALL,
  type EditorState,
} from '../../sanity-studio/lib/panels';
import { FIXTURE_SERIES } from '../fixtures/comics';

const sheets = FIXTURE_SERIES.find((s) => s.slug === 'single-sheets')!;
const at = (path: string) => readerPages(sheets).find((e) => e.path === `/comics/single-sheets/${path}`)!;
const P = (x: number, y: number, width: number, height: number) => ({ x, y, width, height });

describe('comic-reader-panels#AC-1 page panels', () => {
  it('reads panels and who set them, and treats missing or empty ones as whole', () => {
    const series = fromSanity({
      title: 'T',
      slug: { current: 't' },
      chapters: [{ number: 1, pages: [
        { asset: { _ref: 'image-a-800x1200-png' }, panels: [P(5, 3, 43, 30), P(53, 3, 43, 30)], panelsBy: 'site' },
        { asset: { _ref: 'image-b-800x1200-png' }, panels: [], panelsBy: 'star' },
        { asset: { _ref: 'image-c-800x1200-png' } },
      ] }],
    } as never);
    const [a, b, c] = series.chapters[0].pages;
    expect(pagePanels(a)).toEqual([P(5, 3, 43, 30), P(53, 3, 43, 30)]);
    expect(a.panelsBy).toBe('site');
    expect(pagePanels(b)).toEqual([]);
    expect(b.panelsBy).toBe('star');
    expect(pagePanels(c)).toEqual([]);
    expect(c.panelsBy).toBeUndefined();
    expect(pagePanels({ image: a.image, panels: [P(5, 3, 0, 30)] } as ComicPage)).toEqual([]);
  });
});

describe('comic-reader-panels#AC-4 AC-6 AC-7 AC-10 editor words', () => {
  it('finds panels only on pages Star hasn\'t set', () => {
    expect(shouldFind({})).toBe(true);
    expect(shouldFind({ panelsBy: 'site' })).toBe(true);
    expect(shouldFind({ panelsBy: 'star' })).toBe(false);
  });

  it('says what each page has, on its tile and in its page panel', () => {
    expect(tileCaption({ finding: true })).toBe('Finding panels…');
    expect(tileCaption({ panels: [P(1, 1, 40, 40), P(50, 1, 40, 40)], panelsBy: 'site' })).toBe('2 panels');
    expect(tileCaption({ panels: [P(1, 1, 40, 40)], panelsBy: 'star' })).toBe('1 panel');
    expect(tileCaption({ panels: [], panelsBy: 'site' })).toBe('Shown whole');
    expect(tileCaption({ panels: [], panelsBy: 'star' })).toBe('Shown whole');
    expect(tileCaption({ failed: true })).toBe("Couldn't look for panels");
    expect(tileCaption({})).toBe('No panels yet');

    const five = [1, 2, 3, 4, 5].map((i) => P(i, i, 10, 10));
    expect(panelStatus({ panels: five, panelsBy: 'site' })).toBe('5 panels, found by the site. Check that they match your page.');
    expect(panelStatus({ panels: five, panelsBy: 'star' })).toBe('5 panels, set by you.');
    expect(panelStatus({ finding: true })).toBe('Finding panels…');
    expect(panelStatus({ panels: [], panelsBy: 'site' })).toBe('No panels found: this page shows whole. Draw panels on it if it has some.');
    expect(panelStatus({ panels: [], panelsBy: 'star' })).toBe('Shown whole: panel by panel shows this page as one.');
    expect(panelStatus({ failed: true })).toBe("Couldn't look for panels on this page. Draw them, or leave it whole.");
    expect(PICTURE_CHANGED).toBe('The picture changed. Check that your panels still match.');
  });

  it('offers to find panels on older pages, and counts', () => {
    expect(olderPagesBanner(12)).toBe('12 pages have no panels yet. Find them, then check them before you publish.');
    expect(olderPagesBanner(1)).toBe('1 page has no panels yet. Find them, then check them before you publish.');
    expect(olderPagesBanner(0)).toBeUndefined();
    expect(findingProgress(4, 12)).toBe('Finding panels: 4 of 12 done.');
  });
});

describe('comic-reader-panels#AC-5 publishing waits', () => {
  it('waits, at most 20 seconds, saying how many pages', () => {
    expect(FIND_WAIT_MS).toBe(20_000);
    expect(publishFindingLabel(3)).toBe('Finding panels on 3 pages…');
    expect(publishFindingLabel(1)).toBe('Finding panels on 1 page…');
    expect(publishFindingLabel(0)).toBeUndefined();
    expect(FOUND_AFTER_PUBLISHING).toBe('Panels found after publishing. Publish again to use them.');
  });
});

describe('comic-reader-panels#AC-8 AC-9 panel editor', () => {
  const found = [P(5, 3, 43, 30), P(53, 3, 43, 30), P(5, 37, 90, 27)];
  const start = (): EditorState => startEditing({ panels: found, panelsBy: 'site' });

  it('starts as the page is, and confirming makes the panels Star\'s', () => {
    const s = start();
    expect(s.panels).toEqual(found);
    expect(s.by).toBe('site');
    expect(canUse(s)).toEqual({ setOrder: true, showWhole: true, findAgain: true, undo: false });
    const ok = edit(s, { type: 'confirm' });
    expect(ok.by).toBe('star');
    expect(ok.panels).toEqual(found);
    expect(canUse(ok).findAgain).toBe(false);
  });

  it('moves and resizes a box, by 1% with the keyboard, inside the picture', () => {
    let s = edit(start(), { type: 'select', index: 0 });
    s = edit(s, { type: 'move', dx: -1, dy: 0 });
    expect(s.panels[0]).toEqual(P(4, 3, 43, 30));
    expect(s.by).toBe('star');
    s = edit(s, { type: 'move', dx: -10, dy: -10 });
    expect(s.panels[0]).toEqual(P(0, 0, 43, 30));
    s = edit(s, { type: 'resize', dw: 1, dh: -1 });
    expect(s.panels[0]).toEqual(P(0, 0, 44, 29));
    s = edit(s, { type: 'resize', dw: 100, dh: 0 });
    expect(s.panels[0]).toEqual(P(0, 0, 100, 29));
    s = edit(s, { type: 'move', dx: 5, dy: 0 });
    expect(s.panels[0].x).toBe(0);
    expect(s.message).toBe('Panel 1 moved.');
  });

  it('draws a box after the last, but not a tiny one; adds one in the middle', () => {
    let s = edit(start(), { type: 'draw', box: P(60, 70, 30, 25) });
    expect(s.panels).toHaveLength(4);
    expect(s.panels[3]).toEqual(P(60, 70, 30, 25));
    expect(s.selected).toBe(3);
    const tiny = edit(s, { type: 'draw', box: P(10, 90, 5, 5) });
    expect(tiny.panels).toHaveLength(4);
    expect(tiny.message).toBe(TOO_SMALL);
    s = edit(s, { type: 'add' });
    expect(s.panels[4]).toEqual(P(35, 40, 30, 20));
  });

  it('removes, reorders, and numbers the boxes from scratch', () => {
    let s = edit(edit(start(), { type: 'select', index: 2 }), { type: 'earlier' });
    expect(s.panels.map((p) => p.y)).toEqual([3, 37, 3]);
    expect(s.selected).toBe(1);
    expect(s.message).toBe('Panel 3 moved earlier. Now panel 2 of 3.');
    s = edit(s, { type: 'later' });
    expect(s.panels).toEqual(found);
    s = edit(edit(start(), { type: 'select', index: 1 }), { type: 'remove' });
    expect(s.panels).toEqual([found[0], found[2]]);
    expect(s.selected).toBeUndefined();

    let o = edit(start(), { type: 'startOrder' });
    o = edit(o, { type: 'pick', index: 2 });
    expect(o.ordering).toEqual([2]);
    o = edit(o, { type: 'finishOrder' });
    expect(o.panels).toEqual([found[2], found[0], found[1]]);
    expect(o.ordering).toBeUndefined();
    const cancelled = edit(edit(edit(start(), { type: 'startOrder' }), { type: 'pick', index: 2 }), { type: 'cancelOrder' });
    expect(cancelled.panels).toEqual(found);
  });

  it('shows a page whole, undoes back to the start, and names the boxes', () => {
    let s = edit(start(), { type: 'whole' });
    expect(s.panels).toEqual([]);
    expect(s.by).toBe('star');
    expect(canUse(s)).toEqual({ setOrder: false, showWhole: false, findAgain: false, undo: true });
    s = edit(s, { type: 'undo' });
    expect(s.panels).toEqual(found);
    expect(s.by).toBe('site');
    expect(edit(s, { type: 'undo' })).toEqual(s);
    expect(boxName(1, 5, false)).toBe('Panel 2 of 5');
    expect(boxName(1, 5, true)).toBe('Panel 2 of 5, selected');
  });
});

describe('comic-reader-panels#AC-11 offered', () => {
  it('offers panel by panel in chapters with panels on any page', () => {
    expect(offersPanels(at('1/2'))).toBe(true); // page 2 has none, its chapter has some
    const kettle = FIXTURE_SERIES[0];
    expect(offersPanels(readerPages(kettle)[0])).toBe(false);
  });
});

describe('comic-reader-panels#AC-12 panel frame', () => {
  it('scales a panel and its margin to fit the area, centred', () => {
    // An 800 × 1200 picture shown in a 400 × 600 area: a panel 50% wide and 25% tall from (10%, 20%).
    const f = panelFrame(P(10, 20, 50, 25), 400, 600);
    // Panel plus margins of 4% of the width: 58% × (25% + 2·4%·400/600 of the height).
    expect(f.scale).toBeCloseTo(400 / (0.58 * 400), 4);
    expect(f.x).toBeCloseTo(-(0.06 * 400) * f.scale, 4);
    const panelTop = 0.2 * 600 * f.scale;
    const panelHeight = 0.25 * 600 * f.scale;
    expect(f.y).toBeCloseTo(600 / 2 - (panelTop + panelHeight / 2), 4);
    // A whole page is no frame at all.
    expect(panelFrame(undefined, 400, 600)).toEqual({ scale: 1, x: 0, y: 0 });
  });
});

describe('comic-reader-panels#AC-12 AC-15 location and announcements', () => {
  it('says which panel, or whole page', () => {
    expect(panelLocation(at('1/1'), 0)).toBe('Page 1 of 4 · panel 1 of 2');
    expect(panelLocation(at('1/2'), 0)).toBe('Page 2 of 4 · whole page');
    expect(panelAnnouncement(2, 5)).toBe('Panel 3 of 5.');
    expect(panelsOn(1, 5)).toBe('Panel by panel. Panel 2 of 5.');
    expect(PANELS_OFF).toBe('Whole page');
  });
});

describe('comic-reader-panels#AC-13 panel steps', () => {
  const step = (e: ReaderPage, panel: number, dir: 'next' | 'previous') => panelStep(e, panel, dir);

  it('steps within a page, then to the next page\'s first panel or the previous page\'s last', () => {
    expect(step(at('1/1'), 0, 'next')).toEqual({ panel: 1 });
    expect(step(at('1/1'), 1, 'next')).toEqual({ path: '/comics/single-sheets/1/2', at: 'first' });
    expect(step(at('1/2'), 0, 'next')).toEqual({ path: '/comics/single-sheets/1/3', at: 'first' });
    expect(step(at('1/2'), 0, 'previous')).toEqual({ path: '/comics/single-sheets/1/1', at: 'last' });
    expect(step(at('1/1'), 1, 'previous')).toEqual({ panel: 0 });
    expect(step(at('1/1'), 0, 'previous')).toBeUndefined();
    expect(step(at('1/4'), 2, 'next')).toBeUndefined();
  });

  it('names the controls for the step they make', () => {
    expect(panelControlName(at('1/1'), 0, 'next')).toBe('Next panel');
    expect(panelControlName(at('1/1'), 1, 'next')).toBe('Next page');
    expect(panelControlName(at('1/1'), 0, 'previous')).toBe('Previous page');
    expect(panelControlName(at('1/1'), 1, 'previous')).toBe('Previous panel');
  });
});
