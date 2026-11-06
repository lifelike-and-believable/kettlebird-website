// The site's icon and the logo mark: files, sizes, the bird alone at small sizes, the maskable safe zone,
// the manifest, and the mark lifted off its square. Criteria: docs/specs/home-tiles-and-icon.md.
import { existsSync, readFileSync } from 'node:fs';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

const ORANGE = [255, 187, 88];
const PUBLIC = 'public';

async function pixels(file: string) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const at = (x: number, y: number) => {
    const i = (y * info.width + x) * 4;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  };
  return { width: info.width, height: info.height, at, data };
}
const isOrange = (p: number[], tolerance = 6) => p[3] === 255 && p.slice(0, 3).every((v, i) => Math.abs(v - ORANGE[i]) <= tolerance);
const isDark = (p: number[]) => p[3] > 128 && p[0] < 120 && p[1] < 90;

// The K and B in kettlebird-mark.png, as fractions of its width (the spec's design values).
const LETTERS = { K: [0.186, 0.638, 0.308, 0.928], B: [0.684, 0.668, 0.81, 0.934] };
/** The letter boxes inside an icon whose mark fills `fill` of it, shrunk by `inset` px so edges don't blur in. */
function letterBoxes(size: number, fill: number, inset: number) {
  const off = ((1 - fill) / 2) * size;
  return Object.values(LETTERS).map(([x0, y0, x1, y1]) => [
    Math.ceil(off + x0 * fill * size + inset), Math.ceil(off + y0 * fill * size + inset),
    Math.floor(off + x1 * fill * size - inset), Math.floor(off + y1 * fill * size - inset),
  ]);
}

const ICONS: [string, number][] = [
  ['favicon-16.png', 16], ['favicon-32.png', 32], ['favicon-48.png', 48],
  ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512], ['icon-maskable-512.png', 512],
];

describe('home-tiles-and-icon#AC-6 the icon files', () => {
  it.each(ICONS)('%s is square, %i px, orange at its corners', async (file, size) => {
    const p = await pixels(`${PUBLIC}/${file}`);
    expect([p.width, p.height]).toEqual([size, size]);
    for (const [x, y] of [[0, 0], [size - 1, 0], [0, size - 1], [size - 1, size - 1]]) expect(isOrange(p.at(x, y)), `${file} at ${x},${y}`).toBe(true);
  });
  it.each(ICONS.filter(([, s]) => s <= 48))('%s has orange along every edge', async (file, size) => {
    const p = await pixels(`${PUBLIC}/${file}`);
    for (let i = 0; i < size; i++) {
      for (const [x, y] of [[i, 0], [i, size - 1], [0, i], [size - 1, i]]) expect(isOrange(p.at(x, y), 12), `${file} at ${x},${y}`).toBe(true);
    }
  });
  it('favicon.ico holds 16, 32 and 48', () => {
    const ico = readFileSync(`${PUBLIC}/favicon.ico`);
    expect(ico.readUInt16LE(0)).toBe(0);
    expect(ico.readUInt16LE(2)).toBe(1);
    const count = ico.readUInt16LE(4);
    const sizes = Array.from({ length: count }, (_, i) => ico[6 + i * 16] || 256).sort((a, b) => a - b);
    expect(sizes).toEqual([16, 32, 48]);
  });
});

describe('home-tiles-and-icon#AC-7 the icon files', () => {
  it.each([['favicon-48.png', 48, 1], ['favicon-32.png', 32, 1]] as const)('%s is the bird alone: only orange where the letters would be', async (file, size, inset) => {
    const p = await pixels(`${PUBLIC}/${file}`);
    for (const [x0, y0, x1, y1] of letterBoxes(size, 0.88, inset)) {
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) expect(isOrange(p.at(x, y), 20), `${file} at ${x},${y}`).toBe(true);
    }
  });
  it.each([['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]] as const)('%s shows the K and B', async (file, size) => {
    const p = await pixels(`${PUBLIC}/${file}`);
    for (const [x0, y0, x1, y1] of letterBoxes(size, 0.84, 0)) {
      let dark = 0;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (isDark(p.at(x, y))) dark++;
      expect(dark, file).toBeGreaterThan((x1 - x0) * (y1 - y0) * 0.1);
    }
  });
  it('the maskable icon is only orange outside its safe circle', async () => {
    const p = await pixels(`${PUBLIC}/icon-maskable-512.png`);
    const c = 256, r = 0.4 * 512;
    for (let y = 0; y < 512; y += 2) for (let x = 0; x < 512; x += 2) {
      if (Math.hypot(x + 0.5 - c, y + 0.5 - c) > r) expect(isOrange(p.at(x, y)), `at ${x},${y}`).toBe(true);
    }
  });
});

describe('home-tiles-and-icon#AC-8 the manifest', () => {
  it('names the site, starts at home, opens in the browser, and lists the icons', () => {
    const m = JSON.parse(readFileSync(`${PUBLIC}/site.webmanifest`, 'utf8'));
    expect(m).toMatchObject({ name: 'Kettlebird Creations', short_name: 'Kettlebird', start_url: '/', display: 'browser', background_color: '#ffbb58' });
    expect(m.theme_color).toBeUndefined();
    expect(m.icons).toEqual([
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ]);
    for (const icon of m.icons) expect(existsSync(`${PUBLIC}${icon.src}`), icon.src).toBe(true);
  });
});

describe('home-tiles-and-icon#AC-9 the mark', () => {
  const count = (data: Buffer, keep: (r: number, g: number, b: number, a: number) => boolean) => {
    let n = 0;
    for (let i = 0; i < data.length; i += 4) if (keep(data[i], data[i + 1], data[i + 2], data[i + 3])) n++;
    return n;
  };
  it('is the logo lifted off its square: as many solid pixels as the logo has off its orange', async () => {
    const logo = await pixels(`${PUBLIC}/assets/images/kblogo.png`);
    const mark = await pixels(`${PUBLIC}/assets/images/kettlebird-mark.png`);
    const offOrange = count(logo.data, (r, g, b) => Math.max(Math.abs(r - 255), Math.abs(g - 187), Math.abs(b - 88)) > 60);
    const solid = count(mark.data, (_r, _g, _b, a) => a > 128);
    expect(Math.abs(solid - offOrange) / offOrange).toBeLessThan(0.02);
    // Nothing of the orange square is left: no solid pixel of the logo's orange.
    expect(count(mark.data, (r, g, b, a) => a > 128 && Math.max(Math.abs(r - 255), Math.abs(g - 187), Math.abs(b - 88)) <= 12)).toBe(0);
    expect(mark.width).toBe(mark.height);
  });
  it('the bird is the mark without its K and B', async () => {
    const mark = await pixels(`${PUBLIC}/assets/images/kettlebird-mark.png`);
    const bird = await pixels(`${PUBLIC}/assets/images/kettlebird-bird.png`);
    expect([bird.width, bird.height]).toEqual([mark.width, mark.height]);
    const W = mark.width;
    for (const [x0, y0, x1, y1] of Object.values(LETTERS)) {
      let inMark = 0, inBird = 0;
      for (let y = Math.round(y0 * W); y <= Math.round(y1 * W); y += 2) for (let x = Math.round(x0 * W); x <= Math.round(x1 * W); x += 2) {
        if (mark.at(x, y)[3] > 128) inMark++;
        if (bird.at(x, y)[3] > 0) inBird++;
      }
      expect(inMark).toBeGreaterThan(500);
      expect(inBird).toBe(0);
    }
  });
});
