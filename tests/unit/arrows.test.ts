// The site's one arrow shape, typed arrows gone from the controls, arrows beside words, and full
// screen's bottom bar on a phone. Criteria: docs/specs/site-arrows.md.
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import CommissionsContent from '../../src/components/settings/CommissionsContent.astro';
import { ARROWS, arrowSvg, type ArrowKind } from '../../src/lib/arrows';
import { readerPages } from '../../src/lib/comics/model';
import { pageSheet } from '../../src/lib/comics/navigation';
import { bottomBar, oneRow } from '../../src/lib/portfolio/full-screen';
import { readSettings } from '../../src/lib/site-settings';
import { FIXTURE_SERIES } from '../fixtures/comics';

/** The corners of each triangle in a path made of `M x y L x y L x y Z` parts. */
const triangles = (d: string) =>
  d.split('Z').map((part) => part.trim()).filter(Boolean).map((part) => {
    const numbers = part.replace(/[ML]/g, ' ').trim().split(/\s+/).map(Number);
    return [0, 2, 4].map((i) => ({ x: numbers[i], y: numbers[i + 1] }));
  });
const span = (points: { x: number; y: number }[], axis: 'x' | 'y') =>
  Math.max(...points.map((p) => p[axis])) - Math.min(...points.map((p) => p[axis]));
const mirror = (d: string, width: number) =>
  triangles(d).map((t) => t.map((p) => ({ x: width - p.x, y: p.y })).sort((a, b) => a.x - b.x || a.y - b.y));
const sorted = (d: string) => triangles(d).map((t) => [...t].sort((a, b) => a.x - b.x || a.y - b.y));

describe('site-arrows#AC-1 the shape', () => {
  it('has every arrow, and no others', () => {
    expect(Object.keys(ARROWS).sort()).toEqual(['down', 'first', 'last', 'next', 'previous', 'up']);
  });
  it('next is a triangle 10 wide and 13 tall in a 24-unit square, pointing right', () => {
    expect(ARROWS.next.viewBox).toBe('0 0 24 24');
    const [t, ...rest] = triangles(ARROWS.next.d);
    expect(rest).toHaveLength(0);
    expect(span(t, 'x')).toBe(10);
    expect(span(t, 'y')).toBe(13);
    // One corner to the right, centred on the height: it points right.
    const tip = t.reduce((a, b) => (b.x > a.x ? b : a));
    expect(tip.y).toBe(12);
    expect(t.filter((p) => p.x === tip.x)).toHaveLength(1);
  });
  it('previous is the mirror of next', () => {
    expect(ARROWS.previous.viewBox).toBe('0 0 24 24');
    expect(sorted(ARROWS.previous.d)).toEqual(mirror(ARROWS.next.d, 24));
  });
  it('down and up are the same triangle turned', () => {
    for (const kind of ['down', 'up'] as const) {
      expect(ARROWS[kind].viewBox).toBe('0 0 24 24');
      const [t] = triangles(ARROWS[kind].d);
      expect(span(t, 'x')).toBe(13);
      expect(span(t, 'y')).toBe(10);
    }
    const [down] = triangles(ARROWS.down.d);
    const [up] = triangles(ARROWS.up.d);
    // Down's single corner is at the bottom, up's at the top.
    expect(down.filter((p) => p.y === Math.max(...down.map((q) => q.y)))).toHaveLength(1);
    expect(up.filter((p) => p.y === Math.min(...up.map((q) => q.y)))).toHaveLength(1);
    expect(up.map((p) => p.x).sort()).toEqual(down.map((p) => p.x).sort());
  });
  it('first and last are two triangles in a 32 by 24 box, mirrors, at least 5 units apart', () => {
    for (const kind of ['first', 'last'] as const) {
      expect(ARROWS[kind].viewBox).toBe('0 0 32 24');
      const pair = triangles(ARROWS[kind].d);
      expect(pair).toHaveLength(2);
      for (const t of pair) {
        expect(span(t, 'x')).toBe(10);
        expect(span(t, 'y')).toBe(13);
      }
      const [a, b] = [...pair].sort((p, q) => Math.min(...p.map((r) => r.x)) - Math.min(...q.map((r) => r.x)));
      expect(Math.min(...b.map((p) => p.x)) - Math.max(...a.map((p) => p.x))).toBeGreaterThanOrEqual(5);
    }
    expect(sorted(ARROWS.first.d).sort((a, b) => a[0].x - b[0].x)).toEqual(mirror(ARROWS.last.d, 32).sort((a, b) => a[0].x - b[0].x));
  });
  it('draws each one hidden from screen readers, round-joined, in the text colour', () => {
    for (const kind of Object.keys(ARROWS) as ArrowKind[]) {
      const svg = arrowSvg(kind);
      expect(svg).toMatch(/^<svg [^>]*>.*<\/svg>$/s);
      expect(svg).toContain(`viewBox="${ARROWS[kind].viewBox}"`);
      expect(svg).toContain(`d="${ARROWS[kind].d}"`);
      for (const attribute of ['aria-hidden="true"', 'focusable="false"', 'fill="currentColor"', 'stroke="currentColor"', 'stroke-width="3"', 'stroke-linejoin="round"']) {
        expect(svg, `${kind}: ${attribute}`).toContain(attribute);
      }
      expect(svg).toContain(`data-arrow="${kind}"`);
    }
  });
  it('takes a class for where it sits', () => {
    expect(arrowSvg('next', 'arrow-inline')).toContain('class="arrow-inline"');
    expect(arrowSvg('next')).not.toContain('class=');
  });
});

describe('site-arrows#AC-2 no typed arrows', () => {
  const FILES = [
    'src/components/pages/ReaderPage.astro',
    'src/components/comics/ContactSheet.astro',
    'src/lib/comics/navigation.ts',
    'src/components/GalleryGrid.tsx',
    'src/components/FullScreenView.tsx',
    'src/components/pages/PortfolioPage.astro',
    'src/components/pages/WritingPage.astro',
    'src/components/settings/CommissionsContent.astro',
  ];
  it.each(FILES)('%s has none', (file) => {
    const typed = readFileSync(file, 'utf8').match(/[‹›◀▶←→▾▴⏮⏭]/g);
    expect(typed, file).toBeNull();
  });
  it.each([
    ['src/components/pages/ReaderPage.astro', 'Arrow'],
    ['src/components/comics/ContactSheet.astro', 'Arrow'],
    ['src/components/pages/WritingPage.astro', 'Arrow'],
    ['src/components/settings/CommissionsContent.astro', 'Arrow'],
    ['src/components/GalleryGrid.tsx', 'Arrow'],
    ['src/components/FullScreenView.tsx', 'Arrow'],
  ])('%s draws its arrows from the shared source', (file, component) => {
    expect(readFileSync(file, 'utf8')).toMatch(new RegExp(`import ${component} from ['"][./]+(components/)?${component}`));
  });
  it('the reader keeps no shapes of its own', () => {
    expect(readFileSync('src/components/pages/ReaderPage.astro', 'utf8')).not.toMatch(/const ICONS/);
  });
});

describe('site-arrows#AC-11 words', () => {
  it('the chapter links and Back to page carry no typed arrows', () => {
    const entry = readerPages(FIXTURE_SERIES[0]).find((e) => e.path === '/comics/kettle-tales/2/1')!;
    const sheet = pageSheet(entry);
    expect(sheet.previousChapter).toEqual({ label: 'Chapter 1', name: 'Previous chapter: Chapter 1', path: '/comics/kettle-tales/1/pages' });
    expect(sheet.nextChapter).toEqual({ label: 'Chapter 4', name: 'Next chapter: Chapter 4', path: '/comics/kettle-tales/4/pages' });
    expect(sheet.backToPage).toEqual({ label: 'Back to page 1', path: '/comics/kettle-tales/2/1' });
  });
  it('Email me to get started ends in a drawn arrow, and is named by its words', async () => {
    const container = await AstroContainer.create();
    const settings = readSettings({ contactSettings: { email: 'star@example.com', links: [] } }, () => ({ src: '', width: 1, height: 1 }));
    const html = await container.renderToString(CommissionsContent, { props: { settings, types: [] } });
    const cta = html.match(/<a href="mailto:star@example\.com" class="highlighter-btn[^"]*"[^>]*>([\s\S]*?)<\/a>/)![1];
    expect(cta).toMatch(/^\s*Email me to get started\s*<svg[^>]*data-arrow="next"/);
    expect(cta).toMatch(/aria-hidden="true"/);
  });
});

describe('site-arrows#AC-10 the bottom bar', () => {
  it('one row fits when the zoom controls and both side buttons, with room either side, fit the screen', () => {
    // Zoom 217 px wide, side buttons 56 px: 217 + 2 × (56 + 12) = 353.
    expect(oneRow({ width: 390, zoom: 217, side: 56 })).toBe(true);
    expect(oneRow({ width: 353, zoom: 217, side: 56 })).toBe(true);
    expect(oneRow({ width: 352, zoom: 217, side: 56 })).toBe(false);
    expect(oneRow({ width: 390, zoom: 217, side: 100 })).toBe(false);
  });
  it('is 76 px on one row; otherwise the zoom controls sit above the buttons', () => {
    expect(bottomBar({ oneRow: true, zoomHeight: 52 })).toEqual({ height: 76, zoomBottom: undefined });
    expect(bottomBar({ oneRow: false, zoomHeight: 52 })).toEqual({ height: 140, zoomBottom: 80 });
    expect(bottomBar({ oneRow: false, zoomHeight: 60 })).toEqual({ height: 148, zoomBottom: 80 });
  });
});
