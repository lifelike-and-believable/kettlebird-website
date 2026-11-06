// End-to-end tests for reading panel by panel, against the fixture comics (tests/fixtures/comics.ts):
// Single Sheets (pairs off) has two panels on page 1, none on page 2, two on its spread at page 3 and
// three on page 4; Open Book (pairs on) has two on its first page. Criteria: docs/specs/comic-reader-panels.md.
import { expect, test, type Page } from '@playwright/test';

const PHONE = { width: 390, height: 844 };
const LAPTOP = { width: 1280, height: 800 };
const KEY = 'fixture-preview-key';

const heading = (page: Page) => page.getByRole('heading', { level: 1 });
const nav = (page: Page) => page.getByRole('navigation', { name: 'Page navigation' });
const toggle = (page: Page) => page.getByRole('button', { name: 'Panel by panel' });
const announced = (page: Page) => page.locator('[data-announce]');

test('comic-reader-panels#AC-11 the button', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/comics/single-sheets/1/2');
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');
  // On a laptop, too, in a comic that shows one page at a time.
  await page.setViewportSize(LAPTOP);
  await page.goto('/comics/single-sheets/1/1');
  await expect(toggle(page)).toBeVisible();
  // With two pages side by side, too (amended by comic-reader-panels-two-up), and on a phone.
  await page.goto('/comics/open-book/1/1');
  await expect(toggle(page)).toBeVisible();
  await page.setViewportSize(PHONE);
  await page.goto('/comics/open-book/1/1');
  await expect(toggle(page)).toBeVisible();
  // Not in a chapter without panels.
  await page.goto('/comics/kettle-tales/1/1');
  await expect(toggle(page)).toHaveCount(0);
});

test('comic-reader-panels#AC-11 no script', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: PHONE });
  const page = await context.newPage();
  await page.goto('/comics/single-sheets/1/1');
  await expect(toggle(page)).toBeHidden();
  await context.close();
});

test('comic-reader-panels#AC-12 the panel view', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/comics/single-sheets/1/1');
  const area = page.locator('.reader__page.is-current');
  const before = (await area.boundingBox())!;
  const controlsBefore = (await nav(page).boundingBox())!;
  await toggle(page).click();
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
  await expect(heading(page)).toHaveText('Page 1 of 4 · panel 1 of 2');
  // The same page area, with the picture enlarged inside it.
  const after = (await area.boundingBox())!;
  expect(Math.abs(after.height - before.height)).toBeLessThanOrEqual(1);
  expect((await nav(page).boundingBox())!.y).toBeCloseTo(controlsBefore.y + 0, -1);
  // The view zooms in over about 0.3 s (AC-14), so wait for it rather than measure the first frame.
  const img = page.getByRole('img', { name: 'A lamp.' });
  await expect.poll(async () => (await img.boundingBox())!.width).toBeGreaterThan(after.width);
  await page.goto('/comics/single-sheets/1/2');
  await expect(heading(page)).toHaveText('Page 2 of 4 · whole page');
});

test('comic-reader-panels#AC-13 stepping', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/comics/single-sheets/1/1');
  await toggle(page).click();
  await expect(nav(page).getByRole('link', { name: 'Next panel' })).toBeVisible();
  await nav(page).getByRole('link', { name: 'Next panel' }).click();
  await expect(heading(page)).toHaveText('Page 1 of 4 · panel 2 of 2');
  await expect(page).toHaveURL(/\/single-sheets\/1\/1$/);
  // A refresh keeps the panel.
  await page.reload();
  await expect(heading(page)).toHaveText('Page 1 of 4 · panel 2 of 2');
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/\/single-sheets\/1\/2$/);
  await expect(heading(page)).toHaveText('Page 2 of 4 · whole page');
});

test('comic-reader-panels#AC-13 across pages', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/comics/single-sheets/1/2');
  await toggle(page).click();
  await nav(page).getByRole('link', { name: 'Previous page', exact: true }).click();
  await expect(page).toHaveURL(/\/single-sheets\/1\/1$/);
  await expect(heading(page)).toHaveText('Page 1 of 4 · panel 2 of 2');
  // First and links open at a page's first panel.
  await page.goto('/comics/single-sheets/1/4');
  await expect(heading(page)).toHaveText('Page 4 of 4 · panel 1 of 3');
});

test('comic-reader-panels#AC-11 remembered', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/comics/single-sheets/1/1');
  await toggle(page).click();
  await page.goto('/comics/single-sheets/1/4');
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
  await toggle(page).click();
  await expect(heading(page)).toHaveText('Page 4 of 4');
  await page.goto('/comics/single-sheets/1/1');
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');
});

test('comic-reader-panels#AC-14 motion', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/comics/single-sheets/1/1');
  await toggle(page).click();
  const duration = () =>
    page.getByRole('img', { name: 'A lamp.' }).evaluate((img) => parseFloat(getComputedStyle(img).transitionDuration) * 1000);
  const ms = await duration();
  expect(ms).toBeGreaterThanOrEqual(200);
  expect(ms).toBeLessThanOrEqual(400);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await duration()).toBe(0);
});

test('comic-reader-panels#AC-15 announcements', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/comics/single-sheets/1/1');
  await toggle(page).click();
  await expect(announced(page)).toHaveText('Panel by panel. Panel 1 of 2.');
  await nav(page).getByRole('link', { name: 'Next panel' }).click();
  await expect(announced(page)).toHaveText('Panel 2 of 2.');
  await toggle(page).click();
  await expect(announced(page)).toHaveText('Whole page');
});

test('comic-reader-panels#AC-16 in the preview', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto(`/preview/comicChapter/sheets-1?sanity-preview-secret=${KEY}`);
  await toggle(page).click();
  await expect(heading(page)).toHaveText('Page 1 of 3 · panel 1 of 2');
  await nav(page).getByRole('link', { name: 'Next panel' }).click();
  await nav(page).getByRole('link', { name: 'Next page', exact: true }).click();
  await expect(page).toHaveURL(/page=2$/);
  await expect(heading(page)).toHaveText('Page 2 of 3 · panel 1 of 2');
});
