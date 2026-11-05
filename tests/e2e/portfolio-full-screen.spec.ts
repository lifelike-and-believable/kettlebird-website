// End-to-end tests for full screen in the portfolio. The fixture build's portfolio is empty, so these
// use the preview of the draft piece (Crooked Moon), which shows the portfolio with the published fixture
// pieces (tests/fixtures/drafts.ts): Original Work is Night Market (3000 × 2000), Late Night Alibi,
// Coming Soon (no picture), Jungle Eyes and Crooked Moon; Fan Work is Late Night Alibi. The image CDN is
// answered from a local picture. Criteria: docs/specs/portfolio-full-screen.md.
import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

const LAPTOP = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };
const PORTFOLIO = '/preview/galleryItem/piece-moon?sanity-preview-secret=fixture-preview-key';
const PICTURE = readFileSync('public/assets/images/bkgd-artwork.jpg');

/** Answers the image CDN, recording each request's asset and width; `fail` names assets that 404. */
async function cdn(page: Page, fail: string[] = []) {
  const asked: { asset: string; width: number }[] = [];
  await page.route('https://cdn.sanity.io/**', async (route) => {
    const url = new URL(route.request().url());
    const asset = url.pathname.split('/').pop() ?? '';
    asked.push({ asset, width: Number(url.searchParams.get('w') ?? 0) });
    if (fail.some((f) => asset.includes(f))) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ status: 200, contentType: 'image/jpeg', body: PICTURE });
  });
  return asked;
}

const view = (page: Page) => page.getByRole('dialog', { name: 'Full screen' });
const bar = (page: Page) => view(page).locator('[data-fs-count]');
const level = (page: Page) => view(page).locator('[data-fs-level]');

async function open(page: Page, title: string, section = 'Original Work') {
  await page.goto(PORTFOLIO);
  await page.getByRole('region', { name: section }).getByRole('button', { name: `View ${title}` }).click();
  await page.getByRole('dialog', { name: title }).getByRole('button', { name: 'Full screen' }).click();
  await expect(view(page)).toBeVisible();
}

test('portfolio-full-screen#AC-1 AC-2 opening', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await cdn(page);
  await page.goto(PORTFOLIO);
  // A piece without a picture has no Full screen.
  await page.getByRole('button', { name: 'View Coming Soon' }).click();
  await expect(page.getByRole('dialog', { name: 'Coming Soon' }).getByRole('button', { name: 'Full screen' })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await open(page, 'Night Market');
  await expect.poll(() => page.evaluate(() => document.fullscreenElement?.getAttribute('aria-label'))).toBe('Full screen');
  await expect(bar(page)).toHaveText('1 of 4 · Original Work');
  await expect(view(page).getByText('Night Market', { exact: true })).toBeVisible();
  expect(await view(page).evaluate((v) => getComputedStyle(v).touchAction)).toBe('none');
});

test('portfolio-full-screen#AC-2 the window-covering view', async ({ page }) => {
  await page.addInitScript(() => {
    // As on an iPhone: no Fullscreen API for elements.
    // @ts-expect-error removing it on purpose
    delete Element.prototype.requestFullscreen;
  });
  await page.setViewportSize(PHONE);
  await cdn(page);
  const address = PORTFOLIO;
  await open(page, 'Jungle Eyes');
  const box = (await view(page).boundingBox())!;
  expect(box).toMatchObject({ x: 0, y: 0, width: PHONE.width, height: PHONE.height });
  expect(await page.evaluate(() => document.fullscreenElement)).toBeNull();
  expect(page.url()).toContain(address);
  // Back closes the view, back on the dialog, on the same page.
  await page.goBack();
  await expect(view(page)).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: 'Jungle Eyes' })).toBeVisible();
  expect(page.url()).toContain(address);
});

test('portfolio-full-screen#AC-4 picture sizes', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  const asked = await cdn(page);
  await open(page, 'Night Market');
  // 3000 × 2000 fitted on 1280 × 800 is 1200 wide; the bars take some height, so it's a little less.
  const lantern = () => asked.filter((a) => a.asset.includes('Lantern1')).map((a) => a.width);
  await expect.poll(() => Math.max(...lantern())).toBeGreaterThan(1000);
  expect(Math.max(...lantern())).toBeLessThanOrEqual(1200);
  await view(page).getByRole('button', { name: 'Zoom in' }).click(); // 150%
  await view(page).getByRole('button', { name: 'Zoom in' }).click(); // 225%
  await expect.poll(() => Math.max(...lantern())).toBeGreaterThan(2000);
  for (let i = 0; i < 3; i++) await view(page).getByRole('button', { name: 'Zoom in' }).click();
  await expect.poll(() => Math.max(...lantern())).toBe(3000);
});

test('portfolio-full-screen#AC-5 AC-6 zoom', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await cdn(page);
  await open(page, 'Night Market');
  await expect(level(page)).toHaveText('100%');
  const stage = view(page).locator('[data-fs-stage]');
  const centre = (await stage.boundingBox())!;
  await page.mouse.move(centre.x + centre.width / 2, centre.y + centre.height / 2);
  await page.mouse.wheel(0, -300);
  await expect.poll(async () => parseInt((await level(page).textContent()) ?? '0')).toBeGreaterThan(100);
  await view(page).getByRole('button', { name: 'Fit' }).click();
  await expect(level(page)).toHaveText('100%');
  await stage.dblclick();
  await expect(level(page)).toHaveText('250%');
  await expect(view(page).locator('[data-fs-map]')).toBeVisible();
  await stage.dblclick();
  await expect(level(page)).toHaveText('100%');
  await page.keyboard.press('=');
  await expect(level(page)).toHaveText('150%');
  await page.keyboard.press('0');
  await expect(level(page)).toHaveText('100%');
});

test('portfolio-full-screen#AC-7 moving around', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await cdn(page);
  await open(page, 'Night Market');
  const img = view(page).locator('[data-fs-stage] img').first();
  const stage = (await view(page).locator('[data-fs-stage]').boundingBox())!;
  await view(page).locator('[data-fs-stage]').dblclick();
  await expect(level(page)).toHaveText('250%');
  const before = (await img.boundingBox())!;
  await page.mouse.move(stage.x + 400, stage.y + 300);
  await page.mouse.down();
  await page.mouse.move(stage.x + 300, stage.y + 300, { steps: 5 });
  await page.mouse.up();
  await expect.poll(async () => (await img.boundingBox())!.x).toBeLessThan(before.x - 50);
  // A drag while zoomed doesn't turn; the keys do.
  await expect(bar(page)).toHaveText('1 of 4 · Original Work');
  await page.keyboard.press('Shift+ArrowLeft');
  await page.keyboard.press('ArrowRight');
  await expect(bar(page)).toHaveText('2 of 4 · Original Work');
  await expect(level(page)).toHaveText('100%');
});

test('portfolio-full-screen#AC-8 the bars', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await cdn(page);
  await open(page, 'Late Night Alibi');
  await expect(bar(page)).toHaveText('2 of 4');
  for (const name of ['Close', 'Previous', 'Next', 'Zoom in', 'Zoom out', 'Fit']) {
    const box = (await view(page).getByRole('button', { name }).boundingBox())!;
    expect(box.width, name).toBeGreaterThanOrEqual(44);
    expect(box.height, name).toBeGreaterThanOrEqual(44);
  }
  // On a phone held upright, Previous and Next are in the bottom bar.
  const next = (await view(page).getByRole('button', { name: 'Next' }).boundingBox())!;
  expect(next.y + next.height).toBeGreaterThan(PHONE.height - 100);
});

test('portfolio-full-screen#AC-9 hiding the controls', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await cdn(page);
  await open(page, 'Night Market');
  const controls = view(page).locator('[data-fs-controls]');
  const img = view(page).locator('[data-fs-stage] img').first();
  const shown = (await img.boundingBox())!;
  await view(page).locator('[data-fs-stage]').click();
  await expect(controls).toHaveAttribute('data-hidden', 'true');
  // The piece refits to the whole view.
  await expect.poll(async () => (await img.boundingBox())!.height).toBeGreaterThan(shown.height);
  await page.mouse.move(10, 10);
  await expect(controls).toHaveAttribute('data-hidden', 'false');
});

test('portfolio-full-screen#AC-10 AC-11 turning', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await cdn(page);
  await open(page, 'Crooked Moon Party Portrait');
  // The last of Original Work: Coming Soon has no picture and isn't counted.
  await expect(bar(page)).toHaveText('4 of 4 · Original Work');
  await expect(view(page).getByRole('button', { name: 'Next' })).toHaveAttribute('aria-disabled', 'true');
  await view(page).getByRole('button', { name: 'Previous' }).click();
  await expect(bar(page)).toHaveText('3 of 4 · Original Work');
  await expect(view(page).getByText('Jungle Eyes', { exact: true })).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(bar(page)).toHaveText('2 of 4 · Original Work');
  // Opened from Fan Work, it turns through Fan Work.
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await page.getByRole('region', { name: 'Fan Work' }).getByRole('button', { name: 'View Late Night Alibi' }).click();
  await page.getByRole('dialog', { name: 'Late Night Alibi' }).getByRole('button', { name: 'Full screen' }).click();
  await expect(bar(page)).toHaveText('1 of 1 · Fan Work');
});

test('portfolio-full-screen#AC-12 loading', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  const asked = await cdn(page, ['Jungle1']);
  await open(page, 'Late Night Alibi');
  // Once it has loaded, its neighbours are fetched.
  await expect.poll(() => asked.some((a) => a.asset.includes('Lantern1') && a.width > 1000)).toBe(true);
  await expect.poll(() => asked.some((a) => a.asset.includes('Jungle1') && a.width > 500)).toBe(true);
  await view(page).getByRole('button', { name: 'Next' }).click();
  await expect(bar(page)).toHaveText('3 of 4 · Original Work');
  await expect(view(page).getByText("This piece couldn't load.")).toBeVisible();
});

test('portfolio-full-screen#AC-3 leaving', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await cdn(page);
  await open(page, 'Night Market');
  await page.keyboard.press('ArrowRight');
  await expect(bar(page)).toHaveText('2 of 4 · Original Work');
  await page.keyboard.press('Escape');
  await expect(view(page)).toHaveCount(0);
  expect(await page.evaluate(() => document.fullscreenElement)).toBeNull();
  // One Escape leaves only full screen: the dialog of the piece last shown is open.
  await expect(page.getByRole('dialog', { name: 'Late Night Alibi' })).toBeVisible();
  // The browser's own exit does the same.
  await page.getByRole('dialog', { name: 'Late Night Alibi' }).getByRole('button', { name: 'Full screen' }).click();
  await expect(view(page)).toBeVisible();
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(true);
  await page.evaluate(() => document.exitFullscreen());
  await expect(view(page)).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: 'Late Night Alibi' })).toBeVisible();
});
