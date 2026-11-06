// Full screen on a touch screen, with touches sent the way a phone sends them (Chrome's touch events,
// as on Android; iPhone Safari can't be emulated here). The lead found that after letting go of a
// zoomed piece, dragging stopped working until a zoom button was used, and that a tap didn't hide
// the bars (2026-11-06). Criteria: docs/specs/portfolio-full-screen.md.
import { devices, expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

const PORTFOLIO = '/preview/galleryItem/piece-moon?sanity-preview-secret=fixture-preview-key';
const PICTURE = readFileSync('public/assets/images/bkgd-artwork.jpg');
test.use({ ...devices['Pixel 7'] });

async function open(page: Page) {
  await page.route('https://cdn.sanity.io/**', (r) => r.fulfill({ status: 200, contentType: 'image/jpeg', body: PICTURE }));
  await page.goto(PORTFOLIO);
  await page.getByRole('region', { name: 'Original Work' }).getByRole('button', { name: 'View Night Market' }).tap();
  await page.getByRole('dialog', { name: 'Night Market' }).getByRole('button', { name: 'Full screen' }).tap();
  const view = page.getByRole('dialog', { name: 'Full screen' });
  await expect(view).toBeVisible();
  const cdp = await page.context().newCDPSession(page);
  const touch = (type: 'touchStart' | 'touchMove' | 'touchEnd', points: { x: number; y: number }[]) =>
    cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points.map((p, id) => ({ ...p, id })) });
  const box = (await view.locator('[data-fs-stage]').boundingBox())!;
  return { view, touch, cx: box.x + box.width / 2, cy: box.y + box.height / 2 };
}

test('portfolio-full-screen#AC-9 a tap hides the bars on a touch screen', async ({ page }) => {
  const { view, touch, cx, cy } = await open(page);
  // The picture itself never takes the touch, so the phone's own image long-press can't start.
  expect(await view.locator('[data-fs-stage] img').first().evaluate((img) => getComputedStyle(img).pointerEvents)).toBe('none');
  await touch('touchStart', [{ x: cx, y: cy }]);
  await touch('touchEnd', []);
  await expect(view.locator('[data-fs-controls]')).toHaveAttribute('data-hidden', 'true');
  await touch('touchStart', [{ x: cx, y: cy }]);
  await touch('touchEnd', []);
  await expect(view.locator('[data-fs-controls]')).toHaveAttribute('data-hidden', 'false');
});

test('portfolio-full-screen#AC-6 a double tap zooms on a touch screen, and doesn\'t hide the bars', async ({ page }) => {
  const { view, touch, cx, cy } = await open(page);
  for (let i = 0; i < 2; i++) {
    await touch('touchStart', [{ x: cx, y: cy }]);
    await touch('touchEnd', []);
  }
  await expect(view.locator('[data-fs-level]')).toHaveText('250%');
  await page.waitForTimeout(500);
  await expect(view.locator('[data-fs-controls]')).toHaveAttribute('data-hidden', 'false');
});

test('portfolio-full-screen#AC-7 dragging still works after letting go for a while', async ({ page }) => {
  const { view, touch, cx, cy } = await open(page);
  const img = view.locator('[data-fs-stage] img').first();
  // Pinch in.
  await touch('touchStart', [{ x: cx - 30, y: cy }, { x: cx + 30, y: cy }]);
  for (let i = 1; i <= 5; i++) await touch('touchMove', [{ x: cx - 30 - i * 8, y: cy }, { x: cx + 30 + i * 8, y: cy }]);
  await touch('touchEnd', []);
  await expect.poll(async () => parseInt((await view.locator('[data-fs-level]').textContent()) ?? '0')).toBeGreaterThan(150);
  const drag = async (dx: number) => {
    const before = (await img.boundingBox())!.x;
    await touch('touchStart', [{ x: cx, y: cy }]);
    for (let i = 1; i <= 5; i++) await touch('touchMove', [{ x: cx + (dx * i) / 5, y: cy }]);
    await touch('touchEnd', []);
    await page.waitForTimeout(300);
    return (await img.boundingBox())!.x - before;
  };
  expect(await drag(-60)).toBeLessThan(-30);
  await page.waitForTimeout(2500);
  expect(await drag(60)).toBeGreaterThan(30);
  await page.waitForTimeout(2500);
  // And a pinch after the pause.
  const level = parseInt((await view.locator('[data-fs-level]').textContent()) ?? '0');
  await touch('touchStart', [{ x: cx - 40, y: cy }, { x: cx + 40, y: cy }]);
  for (let i = 1; i <= 5; i++) await touch('touchMove', [{ x: cx - 40 + i * 6, y: cy }, { x: cx + 40 - i * 6, y: cy }]);
  await touch('touchEnd', []);
  await expect.poll(async () => parseInt((await view.locator('[data-fs-level]').textContent()) ?? '0')).toBeLessThan(level);
});

test('portfolio-full-screen#AC-9 a touch brings the bars back at once, however the phone ends it', async ({ page }) => {
  // The lead found on a phone that a tap hid the bars but another tap didn't bring them back (2026-11-06).
  // A phone may end a touch with a cancel rather than a lift (iPhones do so readily), and the view only
  // counted lifts as taps; and bringing the bars back waited for a possible double tap.
  const { view, touch, cx, cy } = await open(page);
  const controls = view.locator('[data-fs-controls]');
  await touch('touchStart', [{ x: cx, y: cy }]);
  await touch('touchEnd', []);
  await expect(controls).toHaveAttribute('data-hidden', 'true');
  await page.waitForTimeout(500);
  // A tap shows them straight away, without waiting out the double-tap time.
  await touch('touchStart', [{ x: cx, y: cy }]);
  await touch('touchEnd', []);
  expect(await controls.getAttribute('data-hidden')).toBe('false');
  // Hide them again, then a touch the phone cancels still shows them.
  await page.waitForTimeout(500);
  await touch('touchStart', [{ x: cx, y: cy }]);
  await touch('touchEnd', []);
  await expect(controls).toHaveAttribute('data-hidden', 'true');
  await page.waitForTimeout(500);
  await touch('touchStart', [{ x: cx, y: cy }]);
  await cdpCancel(page);
  await expect(controls).toHaveAttribute('data-hidden', 'false');
});

async function cdpCancel(page: import('@playwright/test').Page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
}
