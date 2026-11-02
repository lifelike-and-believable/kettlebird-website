// End-to-end checks of Site settings on the fixture build, which uses the starting values.
// Criteria: docs/specs/content-editing-site-settings.md (AC-6, AC-7, AC-10, AC-11).
import { expect, test } from '@playwright/test';

const EMAIL = 'mailto:kettlebirdillustration@gmail.com';
const NAMES = ['Bluesky', 'Tumblr', 'Instagram', 'Ko-fi ☕'];

test('content-editing-site-settings#AC-7 commissions open by default', async ({ page }) => {
  await page.goto('/commissions');
  await expect(page.getByText('Commissions are open.')).toBeVisible();
  await expect(page.getByText('Email me to get started.', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Contact me' })).toHaveAttribute('href', EMAIL);
});

test('content-editing-site-settings#AC-10 links follow the one list everywhere', async ({ page }) => {
  for (const path of ['/', '/about', '/comics']) {
    await page.goto(path);
    const footer = page.getByRole('contentinfo');
    const names = await footer.locator('.footer-social a').allInnerTexts();
    expect(names.map((n) => n.trim()), path).toEqual(NAMES);
  }
  await page.goto('/about');
  await expect(page.getByRole('main').getByRole('link', { name: 'Ko-fi ☕', exact: true })).toBeVisible();
  await expect(page.getByText('Support on Ko-fi')).toHaveCount(0);
});

test('content-editing-site-settings#AC-11 every email link uses the contact email', async ({ page }) => {
  for (const path of ['/', '/about', '/commissions', '/comics']) {
    await page.goto(path);
    const hrefs = await page.locator('a[href^="mailto:"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(hrefs.length, path).toBeGreaterThan(0);
    for (const href of hrefs) expect(href, path).toBe(EMAIL);
  }
});
