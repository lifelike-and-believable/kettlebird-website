// Panel by panel with two pages side by side: what switching off announces, and the size a page's
// picture is asked for. Criteria: docs/specs/comic-reader-panels-two-up.md.
import { describe, expect, it } from 'vitest';
import { panelsOffAnnouncement, readerSizes, PANELS_OFF } from '../../src/lib/comics/panels';

const WIDE = '(min-width: 62.5em) and (orientation: landscape)';
const PAIR = 'Chapter 1: Facing Pages, pages 2 and 3 of 6. A hall of mirrors. The fox sees itself.';

describe('comic-reader-panels-two-up#AC-5 switching off', () => {
  it('says what arriving at a pair or a spread says, with two pages side by side', () => {
    expect(panelsOffAnnouncement('wide', 'pair', PAIR)).toBe(PAIR);
    expect(panelsOffAnnouncement('wide', 'spread', 'Page 5 of 6, two-page spread. The whole valley below.')).toBe(
      'Page 5 of 6, two-page spread. The whole valley below.',
    );
  });
  it('says "Whole page" for a page alone, or one page at a time', () => {
    expect(panelsOffAnnouncement('wide', 'right', 'Page 1 of 6. A door opens.')).toBe(PANELS_OFF);
    expect(panelsOffAnnouncement('wide', 'left', 'Page 4 of 6. A window.')).toBe(PANELS_OFF);
    expect(panelsOffAnnouncement('narrow', 'pair', PAIR)).toBe(PANELS_OFF);
    expect(panelsOffAnnouncement('narrow', 'spread', 'Page 5 of 6, two-page spread.')).toBe(PANELS_OFF);
    expect(PANELS_OFF).toBe('Whole page');
  });
});

describe('comic-reader-panels-two-up#AC-7 picture size', () => {
  const page = { width: 800, height: 1200 };
  const spread = { width: 1600, height: 1200 };

  it('asks for twice the one-page area on a wide screen, in a chapter with panels', () => {
    expect(readerSizes(page, false, true)).toBe(`${WIDE} calc((100vh - 12.5rem) * 1.3333), (max-width: 700px) 100vw, 900px`);
    expect(readerSizes(spread, true, true)).toBe(`${WIDE} calc((100vh - 12.5rem) * 2.6667), 100vw`);
  });

  it('is at least twice the page area at 1280 × 800, for any shape of page', () => {
    for (const [width, height] of [[800, 1200], [700, 1000], [1000, 1000], [1600, 1200], [600, 1400]]) {
      const sizes = readerSizes({ width, height }, width > height, true);
      const r = Number(/\* ([\d.]+)\)/.exec(sizes)![1]);
      const tall = 800 - 12.5 * 16;
      // The page area for one page: the window's height less the bar and controls, times the page's shape.
      const area = tall * (width / height);
      expect(tall * r, `${width} × ${height}`).toBeGreaterThanOrEqual(2 * area - 0.1);
    }
  });

  it('is unchanged in a chapter without panels', () => {
    expect(readerSizes(page, false, false)).toBe(`${WIDE} 50vw, (max-width: 700px) 100vw, 900px`);
    expect(readerSizes(spread, true, false)).toBe('100vw');
  });
});
