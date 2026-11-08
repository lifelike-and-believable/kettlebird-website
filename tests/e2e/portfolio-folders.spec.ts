// End-to-end tests for the portfolio as folders, with subfolders. The fixture build's portfolio is empty,
// so these use Preview with the fixture pieces (tests/fixtures/drafts.ts): Original Work (Night Market,
// Late Night Alibi, Coming Soon, Jungle Eyes, Crooked Moon), Fan Work (Late Night Alibi), and Past Clients
// (Book covers, a 2 × 2 subfolder of two portrait pieces, and Shopfront, a loose 16:9 piece). The image
// CDN is answered from a local picture. Criteria: docs/specs/portfolio-folders.md.
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

const LAPTOP = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };
const KEY = 'sanity-preview-secret=fixture-preview-key';
const PORTFOLIO = `/preview/galleryItem/piece-moon?${KEY}`;
const BOOKS = `/preview/portfolioSubfolder/sub-books?${KEY}`;
const EMPTY = `/preview/portfolioSubfolder/sub-new?${KEY}`;
const COVER = `/preview/galleryItem/piece-cover2?${KEY}`;
const PICTURE = readFileSync('public/assets/images/bkgd-artwork.jpg');

async function cdn(page: Page) {
  const asked: URL[] = [];
  await page.route('https://cdn.sanity.io/**', async (route) => {
    asked.push(new URL(route.request().url()));
    return route.fulfill({ status: 200, contentType: 'image/jpeg', body: PICTURE });
  });
  return asked;
}
const region = (page: Page, name: string) => page.getByRole('region', { name, exact: true });

test('portfolio-folders#AC-1 AC-2 the page', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await cdn(page);
  await page.goto(PORTFOLIO);
  await expect(page.getByRole('heading', { name: 'Portfolio', level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: 'All' })).toHaveCount(0);
  await expect(page.locator('.gallery-index')).toHaveCount(0);
  const names = await page.locator('section[data-cat]').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label')));
  expect(names).toEqual(['Original Work', 'Fan Work', 'Past Clients']);
  // Fixed sides: Original Work and Past Clients left, Fan Work right.
  for (const [name, side] of [['Original Work', 'left'], ['Fan Work', 'right'], ['Past Clients', 'left']] as const) {
    const tab = (await region(page, name).locator('.folder-tab').first().boundingBox())!;
    expect(tab.x + tab.width / 2 < LAPTOP.width / 2 ? 'left' : 'right', name).toBe(side);
  }
  const tab = region(page, 'Original Work').locator('.folder-tab').first();
  expect(await tab.evaluate((e) => getComputedStyle(e).fontFamily)).toMatch(/DM Mono/);
  expect(await tab.evaluate((e) => getComputedStyle(e, '::before').borderTopLeftRadius)).toBe('22px');
  expect(await tab.evaluate((e) => getComputedStyle(e, '::before').transform)).not.toBe('none');
  // The kraft and its shadow are on the folder's body, under its tabs.
  const shadow = await region(page, 'Fan Work').locator('.folder-body').evaluate((e) => getComputedStyle(e).boxShadow);
  expect(shadow).toContain('0px -1px 0px');
  expect(shadow).toContain('0px -6px 12px -4px');
});

test('portfolio-folders#AC-3 AC-5 AC-7 the row', async ({ page }) => {
  await cdn(page);
  // A computer: 480 pixels, arrows over the row's ends. (Book covers' Preview, so no row starts
  // scrolled to a piece being previewed.)
  await page.setViewportSize(LAPTOP);
  await page.goto(BOOKS);
  const row = region(page, 'Original Work').locator('.folder-row');
  expect(Math.round((await row.boundingBox())!.height)).toBe(480);
  const card = region(page, 'Original Work').getByRole('button', { name: 'View Night Market' });
  const pic = (await card.boundingBox())!;
  expect(Math.round(pic.height)).toBeGreaterThanOrEqual(470);
  expect(pic.width / pic.height).toBeCloseTo(1.5, 1);
  const left = region(page, 'Original Work').getByRole('button', { name: 'Scroll left' });
  const right = region(page, 'Original Work').getByRole('button', { name: 'Scroll right' });
  const rowBox = (await row.boundingBox())!;
  const rightBox = (await right.boundingBox())!;
  expect(rightBox.y).toBeGreaterThan(rowBox.y);
  expect(rightBox.y + rightBox.height).toBeLessThan(rowBox.y + rowBox.height);
  await expect(left).toHaveAttribute('aria-disabled', 'true');
  await expect(right).toHaveAttribute('aria-disabled', 'false');
  await right.click();
  await expect(left).toHaveAttribute('aria-disabled', 'false');
  // Choosing a piece opens its dialog, as today.
  await card.click();
  await expect(page.getByRole('dialog', { name: 'Night Market' })).toBeVisible();
  await page.keyboard.press('Escape');

  // A phone: 9/16 of the width; a 16:9 piece fills it; arrows under the row.
  await page.setViewportSize(PHONE);
  await page.goto(PORTFOLIO);
  const clients = region(page, 'Past Clients');
  const phoneRow = (await clients.locator('.folder-row').boundingBox())!;
  expect(Math.round(phoneRow.height)).toBe(219);
  const wide = (await clients.getByRole('button', { name: 'View Shopfront' }).boundingBox())!;
  expect(Math.abs(wide.width - PHONE.width)).toBeLessThanOrEqual(4);
  const phoneRight = (await clients.getByRole('button', { name: 'Scroll right' }).boundingBox())!;
  expect(phoneRight.y).toBeGreaterThanOrEqual(phoneRow.y + phoneRow.height);
});

test('portfolio-folders#AC-6 pictures', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  const asked = await cdn(page);
  await page.goto(PORTFOLIO);
  await expect(region(page, 'Original Work').getByRole('button', { name: 'View Night Market' }).locator('img')).toBeVisible();
  const lantern = asked.find((u) => u.pathname.includes('Lantern1'))!;
  expect(Number(lantern.searchParams.get('h'))).toBe(480);
  expect(lantern.searchParams.get('fit')).not.toBe('crop');
  const lazy = await page.locator('.folder-row img').evaluateAll((imgs) => imgs.slice(1).every((i) => i.getAttribute('loading') === 'lazy'));
  expect(lazy).toBe(true);
});

test('portfolio-folders#AC-8 AC-9 AC-10 subfolders', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await cdn(page);
  await page.goto(PORTFOLIO);
  const clients = region(page, 'Past Clients');
  const link = clients.getByRole('link', { name: 'Book covers, 2 pieces' });
  await expect(link).toBeVisible();
  // The thumbnail is a square at the row's height, its name inside it under the grid (mock-up 2).
  const thumb = (await link.boundingBox())!;
  expect(Math.round(thumb.width)).toBe(Math.round(thumb.height));
  expect(Math.round(thumb.height)).toBe(480);
  await expect(link.locator('img')).toHaveCount(2);
  await expect(link.locator('[data-cell]')).toHaveCount(4);
  await link.click();
  const open = region(page, 'Past Clients: Book covers');
  // Preview never moves focus (content-editing-preview); the component tests check focus on the page.
  await expect(open.getByRole('button', { name: 'View Harbour Cover' })).toBeVisible();
  await expect(open.getByRole('link', { name: 'Index: back to Past Clients' })).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: 'Past Clients: Book covers, 2 pieces.' })).toHaveCount(1);
  await expect(region(page, 'Original Work')).toBeVisible();
  await open.getByRole('link', { name: 'Index: back to Past Clients' }).click();
  await expect(region(page, 'Past Clients').getByRole('link', { name: 'Book covers, 2 pieces' })).toBeVisible();
  await expect(page.getByRole('link', { name: /^Index/ })).toHaveCount(0);
});

test('portfolio-folders#AC-12 addresses', async ({ page }) => {
  const res = await page.goto('/portfolio/past-clients/nothing-here');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('portfolio-folders#AC-23 preview', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await cdn(page);
  await page.goto(BOOKS);
  await expect(region(page, 'Past Clients: Book covers')).toBeVisible();
  await page.goto(EMPTY);
  await expect(region(page, 'Fan Work: Murderbot').getByText("No pieces in Murderbot yet. Put pieces in it from each piece's Subfolders.")).toBeVisible();
  await page.goto(COVER);
  const open = region(page, 'Past Clients: Book covers');
  await expect(open.getByRole('button', { name: 'View Orchard Cover' })).toBeInViewport();
});

for (const width of [320, 390, 1280]) {
  test(`portfolio-folders#AC-16 reflow and axe at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await cdn(page);
    await page.goto(BOOKS);
    await expect(region(page, 'Past Clients: Book covers')).toBeVisible();
    if (width < 640) {
      const size = await region(page, 'Past Clients: Book covers').locator('.folder-tab').first().evaluate((e) => getComputedStyle(e).fontSize);
      expect(size).toBe(`${1.15 * 16}px`);
    }
    for (const at of ['open', 'top']) {
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(serious.map((v) => `${v.id}: ${v.help}`), at).toEqual([]);
      if (at === 'open') await page.getByRole('link', { name: 'Index: back to Past Clients' }).click();
    }
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    const sideways = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(sideways).toBeLessThanOrEqual(0);
  });
}
