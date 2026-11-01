// End-to-end tests for clearing the placeholders. Criteria: docs/specs/clear-placeholders.md.
import { expect, test } from '@playwright/test';

test('clear-placeholders#AC-1 home', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('ABOUT THE ARTIST')).toHaveCount(0);
  await expect(page.getByText(/Lorem ipsum/)).toHaveCount(0);
  await expect(page.getByText(/Insert/)).toHaveCount(0);
  await expect(page.getByRole('main').getByRole('link', { name: 'BLUESKY' })).toBeVisible();
});

test('clear-placeholders#AC-2 about', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByText(/coming soon/i)).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Hello!' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'The Work' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'At a glance' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Get in touch' })).toBeVisible();
  const main = page.getByRole('main');
  for (const name of ['Bluesky', 'Tumblr', 'Instagram', /Ko-fi/]) await expect(main.getByRole('link', { name })).toBeVisible();
});

test('clear-placeholders#AC-3 portfolio empty', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page.getByText('No artwork yet — check back soon!')).toBeVisible();
  const main = page.getByRole('main');
  for (const name of ['Bluesky', 'Tumblr', 'Instagram']) await expect(main.getByRole('link', { name })).toBeVisible();
  await expect(page.getByText('Index')).toHaveCount(0);
  await expect(page.getByText('Adventure Time')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /^View / })).toHaveCount(0);
});

test('clear-placeholders#AC-4 commissions', async ({ page }) => {
  await page.goto('/commissions');
  await expect(page.getByText(/terms of service coming soon/i)).toHaveCount(0);
});
