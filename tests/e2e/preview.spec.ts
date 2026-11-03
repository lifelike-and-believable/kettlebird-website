// End-to-end tests for the preview route, against the fixture build and the fixture drafts
// (tests/fixtures/drafts.ts). Criteria: docs/specs/content-editing-preview.md.
import { expect, test, type Page } from '@playwright/test';

const KEY = 'fixture-preview-key';
const preview = (kind: string, id: string, extra = '') => `/preview/${kind}/${id}?sanity-preview-secret=${KEY}${extra}`;
const info = (page: Page) =>
  page.locator('#kb-preview').evaluate((el) => JSON.parse(el.textContent ?? '{}') as { name: string; notes: string[] });

test('content-editing-preview#AC-8 access and headers', async ({ page }) => {
  for (const path of [
    '/preview/commissionSettings/commissionSettings',
    '/preview/commissionSettings/commissionSettings?sanity-preview-secret=wrong',
    `/preview/siteStatus/siteStatus?sanity-preview-secret=${KEY}`,
  ]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
  }
  const response = await page.goto(preview('commissionSettings', 'commissionSettings'));
  expect(response?.status()).toBe(200);
  const headers = response!.headers();
  expect(headers['cache-control']).toBe('private, no-store');
  expect(headers['x-robots-tag']).toBe('noindex, nofollow');
  expect(headers['referrer-policy']).toBe('no-referrer');
});

test('content-editing-preview#AC-3 AC-5 preview pages: closing commissions', async ({ page }) => {
  await page.goto(preview('commissionSettings', 'commissionSettings'));
  const banner = page.getByText('Commissions are closed.');
  await expect(banner).toBeVisible();
  await expect(page.locator('[data-preview-changed="status"]')).toBeVisible();
  await expect(page.getByText('Back in March.')).toBeVisible();
  expect(await info(page)).toEqual({
    name: 'the Commissions page',
    notes: ['Removed from the page: How it works, Ready to order? and the commission email buttons'],
  });
  // The public page still shows what's published.
  await page.goto('/commissions');
  await expect(page.getByText('Commissions are open.')).toBeVisible();
});

test('content-editing-preview#AC-4 AC-5 preview pages: contact and social links', async ({ page }) => {
  await page.goto(preview('contactSettings', 'contactSettings'));
  expect(await info(page)).toEqual({ name: 'the home page, scrolled to the social links and footer', notes: ['Removed: Instagram link'] });
  await expect(page.locator('[data-preview-changed="links"]').first()).toBeVisible();
  await expect(page.locator('#social-links')).toBeInViewport();
  await expect(page.getByRole('link', { name: /Instagram/ })).toHaveCount(0);
});

test('content-editing-preview#AC-3 AC-4 AC-5 preview pages: a series', async ({ page }) => {
  await page.goto(preview('comicSeries', 'series-kettle'));
  await expect(page.getByRole('heading', { level: 1, name: 'Kettle Tales' })).toBeVisible();
  const description = page.locator('[data-preview-changed="description"]');
  await expect(description).toHaveText('A fox and a kettle set out across the hills, and keep going.');
  expect((await info(page)).name).toBe('the Kettle Tales series page');
});

test('content-editing-preview#AC-3 AC-4 preview pages: a chapter of an unpublished series', async ({ page }) => {
  await page.goto(preview('comicChapter', 'chapter-new', '&page=2'));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Chapter 1: Beginnings · Page 2 of 2');
  expect(await info(page)).toEqual({
    name: 'Chapter 1, page 2 in the reader',
    notes: ["The series isn't published yet; it's shown as it will be."],
  });
});

test('content-editing-preview#AC-7 preview pages: links do not navigate', async ({ page }) => {
  await page.goto(preview('comicSeries', 'series-kettle'));
  const link = page.getByRole('link', { name: 'Start reading' });
  await expect(link).toHaveAttribute('title', "Links don't work in the preview");
  await link.click();
  await page.waitForTimeout(300);
  expect(new URL(page.url()).pathname).toBe('/preview/comicSeries/series-kettle');
});

test('content-editing-preview#AC-10 preview pages: what cannot be shown', async ({ page }) => {
  const response = await page.goto(preview('comicSeries', 'series-missing'));
  expect(response?.status()).toBe(404);
});
