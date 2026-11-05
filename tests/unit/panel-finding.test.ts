// Finding panels on a page (docs/specs/comic-reader-panels.md AC-2, AC-3).
import { describe, expect, it } from 'vitest';
import { findPanels, type Panel } from '../../sanity-studio/lib/panels';

/** A page: white, with black-bordered grey boxes at the given rectangles (in pixels). */
function page(width: number, height: number, boxes: [number, number, number, number][], background = 255): Uint8ClampedArray {
  const px = new Uint8ClampedArray(width * height * 4).fill(background);
  const set = (x: number, y: number, v: number) => {
    const i = (y * width + x) * 4;
    px[i] = px[i + 1] = px[i + 2] = v;
    px[i + 3] = 255;
  };
  for (let i = 3; i < px.length; i += 4) px[i] = 255;
  for (const [bx, by, bw, bh] of boxes) {
    for (let y = by; y < by + bh; y++) {
      for (let x = bx; x < bx + bw; x++) {
        const edge = x < bx + 2 || x >= bx + bw - 2 || y < by + 2 || y >= by + bh - 2;
        set(x, y, edge ? 20 : 150 + ((x * 7 + y * 3) % 60));
      }
    }
  }
  return px;
}

const round = (panels: Panel[] | 'failed') =>
  panels === 'failed' ? panels : panels.map((p) => [p.x, p.y, p.width, p.height].map((v) => Math.round(v)));

describe('comic-reader-panels#AC-2 finding panels', () => {
  it('cuts rows, then columns in each row, in reading order', () => {
    // 200 × 300: two panels on top, one wide in the middle, two at the bottom.
    const px = page(200, 300, [[10, 10, 85, 90], [105, 10, 85, 90], [10, 110, 180, 80], [10, 200, 110, 90], [130, 200, 60, 90]]);
    expect(round(findPanels(px, 200, 300))).toEqual([
      [5, 3, 43, 30],
      [53, 3, 43, 30],
      [5, 37, 90, 27],
      [5, 67, 55, 30],
      [65, 67, 30, 30],
    ]);
  });

  it('keeps cutting inside each piece, so a tall panel beside two stacked ones is three', () => {
    const px = page(200, 300, [[10, 10, 90, 280], [110, 10, 80, 135], [110, 155, 80, 135]]);
    expect(round(findPanels(px, 200, 300))).toEqual([
      [5, 3, 45, 93],
      [55, 3, 40, 45],
      [55, 52, 40, 45],
    ]);
  });

  it('works on a page whose background isn\'t white', () => {
    const px = page(200, 300, [[10, 10, 85, 280], [105, 10, 85, 280]], 230);
    expect(round(findPanels(px, 200, 300))).toEqual([
      [5, 3, 43, 93],
      [53, 3, 43, 93],
    ]);
  });
});

describe('comic-reader-panels#AC-3 finding panels', () => {
  it('finds none on a splash, a single panel, slivers, or more than 12 panels', () => {
    expect(findPanels(page(200, 300, [[10, 10, 180, 280]]), 200, 300)).toEqual([]);
    expect(findPanels(page(200, 300, []), 200, 300)).toEqual([]);
    // A panel under 3% of the page.
    expect(findPanels(page(200, 300, [[10, 10, 180, 270], [10, 285, 12, 10]]), 200, 300)).toEqual([]);
    // 4 × 4 = 16 panels.
    const many: [number, number, number, number][] = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) many.push([5 + c * 49, 5 + r * 74, 44, 69]);
    expect(findPanels(page(200, 300, many), 200, 300)).toEqual([]);
  });

  it('says so when the picture can\'t be read', () => {
    expect(findPanels(new Uint8ClampedArray(10), 200, 300)).toBe('failed');
    expect(findPanels(new Uint8ClampedArray(0), 0, 0)).toBe('failed');
  });
});
