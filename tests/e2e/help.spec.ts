// End-to-end tests for the help pages, against the fixture build (they're built from docs/user, not
// from Sanity). Criteria: docs/specs/content-editing-help-links.md.
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const TITLES = [
  "Getting started with your site's editor",
  'Editing your art, writing, shop and commissions',
  'Publishing comic pages and chapters',
  'Putting stories on the site',
  'Commissions, your about page, the home page and your links',
  'See it before you publish',
  'When your change is live',
];

test('content-editing-help-links#AC-1 AC-3 /help lists the guides with their summaries', async ({ page }) => {
  const response = await page.goto('/help');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1, name: 'Help' })).toBeVisible();
  const list = page.getByRole('main').getByRole('listitem');
  await expect(list.getByRole('link')).toHaveText(TITLES);
  await expect(list.nth(2)).toContainText('Starting a comic, adding chapters and pages, and publishing them.');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page).toHaveTitle('Help · Kettlebird Creations');
  expect((await page.goto('/help/reading-comics'))?.status()).toBe(404);
});

test('content-editing-help-links#AC-2 AC-4 a help page, its sections and its links', async ({ page }) => {
  await page.goto('/help/editing-your-site');
  const main = page.getByRole('main');
  await expect(main.getByText("Help for your site's editor")).toBeVisible();
  await expect(main.getByRole('link', { name: 'All help' })).toHaveCount(2);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(['Editing your art, writing, shop and commissions']);
  const toc = page.getByRole('navigation', { name: 'On this page' });
  await expect(toc.getByRole('link').first()).toHaveText('Comics');
  await toc.getByRole('link', { name: 'Commissions', exact: true }).click();
  await expect(page).toHaveURL(/\/help\/editing-your-site#commissions$/);
  // The guide's own comment (notes for whoever maintains it) isn't in the page or its source.
  expect(await page.content()).not.toContain('docs/user/editing-your-site.md');

  await main.getByRole('link', { name: 'Open or close commissions' }).click();
  await expect(page).toHaveURL(/\/help\/site-settings#open-or-close-commissions$/);
  await expect(page.locator('#open-or-close-commissions')).toBeInViewport();
});

test('content-editing-help-links#AC-5 help pages on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/help/publishing-comics');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  const box = page.getByRole('region', { name: 'What you see, what it means, what to do' }).first();
  await expect(box).toBeVisible();
  await box.focus();
  await expect(box).toBeFocused();
  const scrolls = await box.evaluate((el) => el.scrollWidth > el.clientWidth);
  expect(scrolls).toBe(true);
});

test('content-editing-help-links#AC-7 accessibility', async ({ page }) => {
  for (const path of ['/help', '/help/publishing-comics', '/help/site-settings']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${v.id}: ${v.help}`), path).toEqual([]);
  }
});
