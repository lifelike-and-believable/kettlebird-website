// End-to-end tests for the home page's tiles and the site's icon, against the fixture build.
// Criteria: docs/specs/home-tiles-and-icon.md.
import { expect, test, type Page } from '@playwright/test';

const LAPTOP = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };

/** Each tile's [x, y, width, height] relative to the grid, by its class (the spec's design values). */
const BEFORE: Record<string, Record<string, number[]>> = {
  laptop: {
    portfolio: [0, 0, 395, 189], logo: [411, 0, 395, 395], merch: [821, 0, 395, 189], comics: [0, 205, 395, 280], commissions: [821, 205, 395, 189],
    writing: [0, 502, 395, 166], contact: [411, 411, 395, 257], about: [821, 411, 189, 257], news: [1027, 411, 189, 257],
  },
  phone: {
    logo: [0, 0, 326, 326], portfolio: [0, 342, 326, 76], comics: [0, 434, 326, 76], writing: [0, 527, 326, 76], commissions: [0, 619, 326, 76],
    merch: [0, 712, 326, 76], about: [0, 804, 155, 76], news: [171, 804, 155, 76], contact: [0, 896, 326, 76],
  },
};

async function home(page: Page, size: { width: number; height: number }) {
  await page.setViewportSize(size);
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.grid-tile-logo img').evaluate((img: HTMLImageElement) => img.decode().catch(() => undefined));
}

const tiles = (page: Page) =>
  page.evaluate(() => {
    const grid = document.querySelector('.grid-container')!.getBoundingClientRect();
    return Object.fromEntries([...document.querySelectorAll('.grid-tile')].map((t) => {
      const r = t.getBoundingClientRect();
      const name = [...t.classList].find((c) => c.startsWith('grid-tile-'))!.replace('grid-tile-', '');
      return [name, [r.x - grid.x, r.y - grid.y, r.width, r.height]];
    }));
  });

test('home-tiles-and-icon#AC-1 labels', async ({ page }) => {
  await home(page, LAPTOP);
  const labels = page.locator('.tile-content');
  await expect(labels).toHaveCount(8);
  for (const label of await labels.all()) {
    const look = await label.evaluate((el) => {
      const s = getComputedStyle(el); const t = getComputedStyle(el.querySelector('.tile-title')!);
      return { background: s.backgroundColor, image: s.backgroundImage, color: t.color, shadow: t.textShadow, weight: t.fontWeight, family: t.fontFamily };
    });
    expect(look.background).toBe('rgba(0, 0, 0, 0)');
    expect(look.image).toBe('none');
    expect(look.color).toBe('rgb(255, 255, 255)');
    expect(look.shadow).toBe('rgba(0, 0, 0, 0.5) 2px 2px 4px');
    expect(look.weight).toBe('700');
    expect(look.family).toContain('Nunito');
  }
});

test('home-tiles-and-icon#AC-2 logo tile', async ({ page }) => {
  for (const size of [LAPTOP, PHONE]) {
    await home(page, size);
    const tile = page.locator('.grid-tile-logo');
    expect(await tile.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(255, 187, 88)');
    const img = tile.locator('img');
    await expect(img).toHaveAttribute('src', '/assets/images/kettlebird-mark.png');
    await expect(img).toHaveAttribute('alt', 'Kettlebird Logo');
    const [t, i] = [(await tile.boundingBox())!, (await img.boundingBox())!];
    const room = 0.12 * t.width - 1;
    expect(i.x - t.x, `left at ${size.width}`).toBeGreaterThanOrEqual(room);
    expect(t.x + t.width - (i.x + i.width), `right at ${size.width}`).toBeGreaterThanOrEqual(room);
    expect(i.y - t.y, `top at ${size.width}`).toBeGreaterThanOrEqual(room);
    expect(t.y + t.height - (i.y + i.height), `bottom at ${size.width}`).toBeGreaterThanOrEqual(room);
  }
});

test('home-tiles-and-icon#AC-3 the grid doesn\'t move', async ({ page }) => {
  for (const [name, size] of [['laptop', LAPTOP], ['phone', PHONE]] as const) {
    await home(page, size);
    const now = await tiles(page);
    for (const [tile, box] of Object.entries(BEFORE[name])) {
      expect(now[tile], `${tile} on a ${name}`).toBeDefined();
      now[tile].forEach((v: number, i: number) => expect(Math.abs(v - box[i]), `${tile} on a ${name}, value ${i}`).toBeLessThanOrEqual(1));
    }
    const logo = now.logo;
    expect(Math.abs(logo[2] - logo[3])).toBeLessThanOrEqual(1);
  }
});

test('home-tiles-and-icon#AC-4 reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await home(page, LAPTOP);
  const shop = page.locator('.grid-tile-merch');
  await shop.hover();
  await page.waitForTimeout(300);
  expect(await shop.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
});

test('home-tiles-and-icon#AC-5 AC-6 the head', async ({ page, request }) => {
  for (const path of ['/', '/writing', '/comics/kettle-tales/1/2', '/portfolio']) {
    await page.goto(path);
    const links = await page.evaluate(() => [...document.querySelectorAll('head link[rel~="icon"], head link[rel="apple-touch-icon"], head link[rel="manifest"]')]
      .map((l) => `${l.getAttribute('rel')} ${l.getAttribute('href')} ${l.getAttribute('sizes') ?? ''}`.trim()));
    expect(links, path).toEqual(expect.arrayContaining([
      'icon /favicon.ico 48x48 32x32 16x16',
      'icon /favicon-16.png 16x16',
      'icon /favicon-32.png 32x32',
      'icon /favicon-48.png 48x48',
      'apple-touch-icon /apple-touch-icon.png',
      'manifest /site.webmanifest',
    ]));
    await expect(page.locator('meta[name="theme-color"]'), path).toHaveCount(0);
  }
  for (const [file, type] of [
    ['/favicon.ico', /image\/(x-icon|vnd\.microsoft\.icon)/], ['/favicon-16.png', /image\/png/], ['/favicon-32.png', /image\/png/], ['/favicon-48.png', /image\/png/],
    ['/apple-touch-icon.png', /image\/png/], ['/icon-192.png', /image\/png/], ['/icon-512.png', /image\/png/], ['/icon-maskable-512.png', /image\/png/],
    ['/site.webmanifest', /json|manifest|octet-stream|text/],
  ] as const) {
    const res = await request.get(file);
    expect(res.status(), file).toBe(200);
    expect(res.headers()['content-type'] ?? '', file).toMatch(type);
  }
});
