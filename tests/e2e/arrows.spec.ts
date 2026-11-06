// End-to-end tests for the site's one arrow and its button: the comic reader's controls and edge
// arrows, the contact sheet, the portfolio carousel and full screen. The comics are the fixture comics
// (tests/fixtures/comics.ts); the portfolio is the preview of the draft piece Crooked Moon, with the
// published fixture pieces (tests/fixtures/drafts.ts), and the image CDN answered from a local picture.
// Criteria: docs/specs/site-arrows.md.
import { devices, expect, test, type Locator, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { ARROWS } from '../../src/lib/arrows';

const BEIGE = 'rgb(245, 241, 232)';
const YELLOW = 'rgb(244, 206, 106)';
const INK = 'rgb(43, 43, 43)';
const NIGHT = 'rgb(22, 22, 22)';
const PURPLE = 'rgb(74, 64, 99)';
const CLEAR = 'rgba(0, 0, 0, 0)';

const READER = '/comics/kettle-tales/1/2';
const PORTFOLIO = '/preview/galleryItem/piece-moon?sanity-preview-secret=fixture-preview-key';
const PICTURE = readFileSync('public/assets/images/bkgd-artwork.jpg');

const controls = (page: Page) => page.getByRole('navigation', { name: 'Page navigation' });
const carousel = (page: Page, name: 'Scroll left' | 'Scroll right') =>
  page.getByRole('region', { name: 'Original Work' }).getByRole('button', { name });
const view = (page: Page) => page.getByRole('dialog', { name: 'Full screen' });

const look = (l: Locator) =>
  l.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      backgroundColor: s.backgroundColor, color: s.color, boxShadow: s.boxShadow,
      borderStyle: s.borderTopStyle, borderWidth: s.borderTopWidth, borderColor: s.borderTopColor,
      radius: s.borderTopLeftRadius, transform: s.transform, translate: s.translate,
      outlineStyle: s.outlineStyle, outlineWidth: s.outlineWidth, outlineColor: s.outlineColor, outlineOffset: s.outlineOffset,
      transitionDuration: s.transitionDuration, transitionProperty: s.transitionProperty,
    };
  });
const box = async (l: Locator) => {
  const b = (await l.boundingBox())!;
  return { x: Math.round(b.x), y: Math.round(b.y), width: Math.round(b.width), height: Math.round(b.height) };
};
const overlap = (a: { x: number; y: number; width: number; height: number }, b: typeof a) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

async function cdn(page: Page) {
  await page.route('https://cdn.sanity.io/**', (route) => route.fulfill({ status: 200, contentType: 'image/jpeg', body: PICTURE }));
}
async function openFullScreen(page: Page, title: string) {
  await cdn(page);
  await page.goto(PORTFOLIO);
  await page.getByRole('region', { name: 'Original Work' }).getByRole('button', { name: `View ${title}` }).click();
  await page.getByRole('dialog', { name: title }).getByRole('button', { name: 'Full screen' }).click();
  await expect(view(page)).toBeVisible();
}
/** Every drawn arrow on the page uses the shared shape. */
async function drawnFromSource(page: Page) {
  const drawn = await page.locator('svg[data-arrow]').evaluateAll((svgs) =>
    svgs.map((s) => ({ kind: s.getAttribute('data-arrow')!, d: s.querySelector('path')?.getAttribute('d'), hidden: s.getAttribute('aria-hidden') })),
  );
  expect(drawn.length).toBeGreaterThan(0);
  for (const a of drawn) {
    expect(a.d).toBe(ARROWS[a.kind as keyof typeof ARROWS].d);
    expect(a.hidden).toBe('true');
  }
  return drawn;
}

test.use({ viewport: { width: 900, height: 800 } });

test('site-arrows#AC-2 arrows are drawn', async ({ page }) => {
  await page.goto(READER);
  const kinds = (await drawnFromSource(page)).map((a) => a.kind);
  for (const kind of ['first', 'previous', 'next', 'last']) expect(kinds).toContain(kind);
  await expect(controls(page)).not.toContainText(/[‹›◀▶⏮⏭←→]/);
  for (const edge of await page.locator('.reader__edge').all()) expect(await edge.textContent()).not.toMatch(/[‹›]/);

  await page.goto('/comics/kettle-tales/2/1/pages');
  await drawnFromSource(page);
  await expect(page.locator('main')).not.toContainText(/[←→▾▴]/);
  expect(await page.locator('summary').evaluate((el) => getComputedStyle(el, '::after').content)).toMatch(/^(none|normal)$/);

  await cdn(page);
  await page.goto(PORTFOLIO);
  await drawnFromSource(page);
  await expect(carousel(page, 'Scroll right')).not.toContainText(/[‹›]/);
});

test('site-arrows#AC-3 on paper', async ({ page }) => {
  await page.goto(READER);
  const next = controls(page).getByRole('link', { name: 'Next page' });
  expect(await look(next)).toMatchObject({ backgroundColor: BEIGE, color: INK, borderStyle: 'solid', borderWidth: '3px', borderColor: INK, radius: '0px', boxShadow: 'none' });
  const at = await box(next);
  expect(at.height).toBeGreaterThanOrEqual(56);
  expect(at.width).toBeGreaterThanOrEqual(44);

  await next.hover();
  await expect.poll(async () => (await look(next)).backgroundColor).toBe(YELLOW);
  expect(await look(next)).toMatchObject({ color: INK, boxShadow: 'none' });
  expect(await box(next)).toEqual(at);

  await page.mouse.down();
  await expect.poll(async () => (await look(next)).backgroundColor).toBe(INK);
  expect((await look(next)).color).toBe(BEIGE);
  expect(await box(next)).toEqual(at);
  await page.mouse.up();

  await page.goto('/comics/kettle-tales/1/1');
  const previous = controls(page).getByRole('link', { name: 'Previous page' });
  expect(await look(previous)).toMatchObject({
    borderStyle: 'dashed', borderColor: 'rgba(43, 43, 43, 0.4)', color: 'rgba(43, 43, 43, 0.45)', backgroundColor: CLEAR, boxShadow: 'none',
  });

  await cdn(page);
  await page.goto(PORTFOLIO);
  const right = carousel(page, 'Scroll right');
  expect(await look(right)).toMatchObject({ backgroundColor: BEIGE, color: INK, borderStyle: 'solid', borderWidth: '3px', borderColor: INK, radius: '0px', boxShadow: 'none' });
  const was = await box(right);
  await right.hover();
  await expect.poll(async () => (await look(right)).backgroundColor).toBe(YELLOW);
  expect(await box(right)).toEqual(was);
});

test('site-arrows#AC-4 on dark', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await openFullScreen(page, 'Night Market');
  const next = view(page).getByRole('button', { name: 'Next' });
  expect(await look(next)).toMatchObject({ backgroundColor: NIGHT, color: BEIGE, borderStyle: 'solid', borderWidth: '3px', borderColor: BEIGE, boxShadow: 'none' });
  const at = await box(next);
  // Centred on the screen's height.
  expect(Math.abs(at.y + at.height / 2 - 400)).toBeLessThanOrEqual(2);

  await next.hover();
  await expect.poll(async () => (await look(next)).backgroundColor).toBe(YELLOW);
  expect((await look(next)).color).toBe(INK);
  expect(await box(next)).toEqual(at);
  await page.mouse.down();
  await expect.poll(async () => (await look(next)).backgroundColor).toBe(BEIGE);
  expect((await look(next)).color).toBe(INK);
  expect(await box(next)).toEqual(at);
  await page.mouse.move(640, 100);
  await page.mouse.up();

  // Night Market is the first piece: Previous can't be used.
  const previous = view(page).getByRole('button', { name: 'Previous' });
  const off = await look(previous);
  expect(off.borderStyle).toBe('dashed');
  expect(off.borderColor).toMatch(/^rgba\(245, 241, 232, 0\.4\d*\)$/);
  expect(off.boxShadow).toBe('none');
});

// A describe group can't change the browser type, so the phone's other settings are used.
const { defaultBrowserType: _browser, ...pixel } = devices['Pixel 7'];
test.describe('on a touch phone', () => {
  test.use(pixel);
  test('site-arrows#AC-5 phones', async ({ page }) => {
    await cdn(page);
    await page.goto(PORTFOLIO);
    expect(await page.evaluate(() => matchMedia('(hover: hover)').matches)).toBe(false);
    const right = carousel(page, 'Scroll right');
    await right.tap();
    await page.waitForTimeout(300);
    expect((await look(right)).backgroundColor).toBe(BEIGE);
  });
});

test('site-arrows#AC-6 focus', async ({ page }) => {
  await page.goto(READER);
  let reached = '';
  for (let i = 0; i < 60 && reached !== 'Next page'; i++) {
    await page.keyboard.press('Tab');
    reached = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? '');
  }
  expect(reached).toBe('Next page');
  expect(await look(controls(page).getByRole('link', { name: 'Next page' }))).toMatchObject({
    outlineStyle: 'solid', outlineWidth: '2px', outlineColor: PURPLE, outlineOffset: '2px',
  });

  await cdn(page);
  await page.goto(PORTFOLIO);
  const right = carousel(page, 'Scroll right');
  await page.keyboard.press('Shift');
  await right.focus();
  expect(await look(right)).toMatchObject({ outlineStyle: 'solid', outlineWidth: '2px', outlineColor: PURPLE, outlineOffset: '2px' });
  const left = carousel(page, 'Scroll left');
  await left.click();
  await expect(left).toBeFocused();
  expect((await look(left)).outlineStyle).toBe('none');

  await page.setViewportSize({ width: 1280, height: 800 });
  await openFullScreen(page, 'Late Night Alibi');
  const next = view(page).getByRole('button', { name: 'Next' });
  await page.keyboard.press('Shift');
  await next.focus();
  expect(await look(next)).toMatchObject({ outlineStyle: 'solid', outlineWidth: '3px', outlineColor: YELLOW });
});

test('site-arrows#AC-7 motion', async ({ page }) => {
  await page.goto(READER);
  const next = controls(page).getByRole('link', { name: 'Next page' });
  const moving = await look(next);
  expect(moving.transitionProperty).toContain('background-color');
  expect(moving.transitionDuration.split(', ')).toContain('0.12s');
  await next.hover();
  await expect.poll(async () => (await look(next)).backgroundColor).toBe(YELLOW);
  expect(await look(next)).toMatchObject({ transform: 'none', translate: 'none' });
  await page.mouse.down();
  await expect.poll(async () => (await look(next)).backgroundColor).toBe(INK);
  expect(await look(next)).toMatchObject({ transform: 'none', translate: 'none' });
  await page.mouse.move(10, 10);
  await page.mouse.up();

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(READER);
  const still = await look(controls(page).getByRole('link', { name: 'Next page' }));
  for (const d of still.transitionDuration.split(', ')) expect(d).toBe('0s');
});

test('site-arrows#AC-8 edge arrows', async ({ page }) => {
  await page.goto(READER);
  const edge = page.locator('.reader__edge--next:visible');
  await expect(edge).toHaveCount(1);
  await expect(edge).toHaveAttribute('aria-hidden', 'true');
  await expect(edge).toHaveAttribute('tabindex', '-1');
  const strip = await box(edge);
  const pageBox = await box(page.locator('.reader__page.is-current:visible').first());
  expect(Math.abs(strip.width - pageBox.width * 0.15)).toBeLessThanOrEqual(2);
  expect(Math.abs(strip.height - pageBox.height)).toBeLessThanOrEqual(2);

  const button = edge.locator('.arrow-btn');
  await expect(button.locator('svg[data-arrow="next"]')).toHaveCount(1);
  expect(await edge.evaluate((el) => getComputedStyle(el).opacity)).toBe('0');
  // Centred in the strip.
  const b = await box(button);
  expect(Math.abs(b.x + b.width / 2 - (strip.x + strip.width / 2))).toBeLessThanOrEqual(2);
  expect(Math.abs(b.y + b.height / 2 - (strip.y + strip.height / 2))).toBeLessThanOrEqual(2);

  await page.mouse.move(strip.x + strip.width / 2, strip.y + 20);
  await expect.poll(() => edge.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  await expect.poll(async () => (await look(button)).backgroundColor).toBe(YELLOW);

  const href = await edge.getAttribute('href');
  await page.mouse.click(strip.x + strip.width / 2, strip.y + 20);
  await expect(page).toHaveURL(new RegExp(`${href!.replace(/[?#].*$/, '')}$`));
});

test('site-arrows#AC-9 carousel', async ({ page }) => {
  for (const [width, height, size] of [[1280, 800, '100%'], [320, 640, '200%']] as const) {
    await page.setViewportSize({ width, height });
    await cdn(page);
    await page.goto(PORTFOLIO);
    await page.evaluate((s) => { document.documentElement.style.fontSize = s; }, size);
    for (const name of ['Scroll left', 'Scroll right'] as const) {
      const b = carousel(page, name);
      const at = await box(b);
      expect(at.width, `${name} at ${width}`).toBe(44);
      expect(at.height, `${name} at ${width}`).toBe(44);
      expect(await b.getAttribute('aria-disabled')).toBeNull();
      expect(await b.evaluate((el) => el.classList.contains('is-off'))).toBe(false);
    }
  }
});

test('site-arrows#AC-10 full screen, enlarged text', async ({ page }) => {
  // One row on an ordinary phone.
  await page.setViewportSize({ width: 390, height: 844 });
  await openFullScreen(page, 'Late Night Alibi');
  const previous = view(page).getByRole('button', { name: 'Previous' });
  const next = view(page).getByRole('button', { name: 'Next' });
  const zoom = view(page).locator('.fs__zoom');
  let [p, z, n] = [await box(previous), await box(zoom), await box(next)];
  expect(z.y + z.height).toBeGreaterThan(p.y);
  expect(Math.round((await box(view(page).locator('.fs__bottom'))).height)).toBe(76);

  // Two rows with text at 200% on a 320 px phone.
  await page.setViewportSize({ width: 320, height: 640 });
  await cdn(page);
  await page.goto(PORTFOLIO);
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await page.getByRole('region', { name: 'Original Work' }).getByRole('button', { name: 'View Late Night Alibi' }).click();
  await page.getByRole('dialog', { name: 'Late Night Alibi' }).getByRole('button', { name: 'Full screen' }).click();
  await expect(view(page)).toBeVisible();
  [p, z, n] = [await box(previous), await box(zoom), await box(next)];
  for (const [name, b] of [['Previous', previous], ['Next', next]] as const) {
    const fits = await b.evaluate((el) => {
      const cap = el.querySelector('.fs__cap')!.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return el.scrollWidth <= el.clientWidth && cap.left >= r.left && cap.right <= r.right;
    });
    expect(fits, name).toBe(true);
    expect((await box(b)).width, name).toBeGreaterThanOrEqual(56);
  }
  expect(overlap(p, z)).toBe(false);
  expect(overlap(n, z)).toBe(false);
  expect(overlap(p, n)).toBe(false);
  expect(z.y + z.height).toBeLessThanOrEqual(Math.min(p.y, n.y));
  for (const b of [p, z, n]) {
    expect(b.x).toBeGreaterThanOrEqual(0);
    expect(b.x + b.width).toBeLessThanOrEqual(320);
  }
  // The bar holds both rows, and the piece fits above it.
  const bar = await box(view(page).locator('.fs__bottom'));
  expect(bar.y).toBeLessThanOrEqual(z.y);
  const stage = await box(view(page).locator('[data-fs-stage]'));
  expect(stage.y + stage.height).toBeLessThanOrEqual(bar.y + 1);
});

test('site-arrows#AC-11 words', async ({ page }) => {
  await page.goto('/comics/kettle-tales/2/1/pages');
  const previous = page.getByRole('link', { name: 'Previous chapter: Chapter 1' });
  await expect(previous).toHaveText('Chapter 1');
  await expect(previous.locator('svg[data-arrow="previous"]')).toHaveCount(1);
  const next = page.getByRole('link', { name: 'Next chapter: Chapter 4' });
  await expect(next).toHaveText('Chapter 4');
  await expect(next.locator('svg[data-arrow="next"]')).toHaveCount(1);

  const summary = page.locator('summary');
  await expect(summary.locator('svg[data-arrow="down"]')).toBeVisible();
  await expect(summary.locator('svg[data-arrow="up"]')).toBeHidden();
  await summary.click();
  await expect(summary.locator('svg[data-arrow="up"]')).toBeVisible();
  await expect(summary.locator('svg[data-arrow="down"]')).toBeHidden();

  await page.goto('/comics/kettle-tales/1/3/pages');
  const back = page.getByRole('link', { name: 'Back to page 3', exact: true }).first();
  await expect(back).toHaveText('Back to page 3');
  await expect(back.locator('svg[data-arrow="previous"]')).toHaveCount(1);

  await page.goto('/writing');
  const readIt = page.getByRole('link', { name: 'Read it', exact: true });
  await expect(readIt).toHaveCount(1);
  await expect(readIt.locator('svg[data-arrow="next"]')).toHaveCount(1);
});
