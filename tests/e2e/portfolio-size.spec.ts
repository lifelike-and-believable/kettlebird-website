// End-to-end tests for smaller folders on a computer, through Preview with the fixture pieces (as
// tests/e2e/portfolio-folders.spec.ts). Criteria: docs/specs/portfolio-size.md.
import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

const KEY = 'sanity-preview-secret=fixture-preview-key';
const BOOKS = `/preview/portfolioSubfolder/sub-books?${KEY}`;
const PIECE = `/preview/galleryItem/piece-wide?${KEY}`;
const PICTURE = readFileSync('public/assets/images/bkgd-artwork.jpg');

async function cdn(page: Page) {
  const asked: URL[] = [];
  await page.route('https://cdn.sanity.io/**', (route) => {
    asked.push(new URL(route.request().url()));
    return route.fulfill({ status: 200, contentType: 'image/jpeg', body: PICTURE });
  });
  return asked;
}
const region = (page: Page, name: string) => page.getByRole('region', { name, exact: true });
const css = (page: Page, selector: string, prop: string, pseudo?: string) =>
  page.locator(selector).first().evaluate((e, [p, ps]) => getComputedStyle(e, ps ?? null).getPropertyValue(p as string), [prop, pseudo]);

test('portfolio-size#AC-1 the row', async ({ page }) => {
  await cdn(page);
  for (const [width, height, expected] of [[390, 844, 219], [768, 1024, 240], [1280, 800, 240], [1920, 1200, 240]] as const) {
    await page.setViewportSize({ width, height });
    await page.goto(PIECE);
    const row = region(page, 'Original Work').locator('.folder-row');
    expect(Math.round((await row.boundingBox())!.height), `${width}`).toBe(expected);
  }
});

test('portfolio-size#AC-2 pictures', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const asked = await cdn(page);
  await page.goto(BOOKS);
  await expect(region(page, 'Original Work').getByRole('button', { name: 'View Night Market' }).locator('img')).toBeVisible();
  const lantern = asked.find((u) => u.pathname.includes('Lantern1'))!;
  expect(Number(lantern.searchParams.get('h'))).toBe(240);
});

test('portfolio-size#AC-3 AC-4 tabs', async ({ page }) => {
  await cdn(page);
  for (const [width, open] of [[1280, '21.6px'], [390, '18.4px']] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(BOOKS);
    const closed = '[data-cat="original"] .folder-tab';
    expect(await css(page, closed, 'font-size'), `${width}`).toBe('21.6px');
    expect(await css(page, closed, 'padding-left')).toBe('19.2px');
    expect(await css(page, closed, 'border-top-left-radius', '::before')).toBe('14px');
    expect(await css(page, closed, '--tilt')).toBe('70px');
    expect(await css(page, '.folder-tab--open', 'font-size')).toBe(open);
    expect(await css(page, '.folder-tab--open', '--tilt')).toBe('220px');
    expect(await css(page, '.folder-tab--index', 'font-size')).toBe('17.6px');
    if (width === 1280) {
      expect(await css(page, '[data-cat="original"] .folder-body', 'padding-top')).toBe('24px');
      expect(await css(page, '[data-cat="original"] .folder-body', 'padding-bottom')).toBe('48px');
    }
  }
});

test('portfolio-size#AC-5 subfolders', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await cdn(page);
  await page.goto(PIECE);
  const link = region(page, 'Past Clients').getByRole('link', { name: 'Book covers, 2 pieces' });
  await expect(link.locator('.subfolder-card__name')).toHaveText('Book covers · 2');
  expect(await link.locator('.subfolder-card__name').evaluate((e) => getComputedStyle(e).fontSize)).toBe('13.6px');
  expect(Math.round((await link.boundingBox())!.height)).toBe(240);
});
