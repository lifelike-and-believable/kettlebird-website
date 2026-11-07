// Mature or explicit content on the site, against the fixture stories (Night Market is ticked; The Kettle's Song is
// not, with notes; The Long Road is not, without notes) and the fixture drafts (The Kettle's Song's draft is ticked).
// Criteria: docs/specs/story-mature-content.md AC-5 to AC-9.
import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const KEY = 'fixture-preview-key';
const card = (page: Page, title: string) => page.locator('.work-card').filter({ has: page.getByRole('heading', { name: title }) });
const box = (page: Page) => page.getByRole('region', { name: 'Before you read' });
const bg = (page: Page, selector: string) => page.locator(selector).first().evaluate((e) => getComputedStyle(e).backgroundColor);

test('story-mature-content#AC-5 tag', async ({ page }) => {
  await page.goto('/writing');
  const tag = card(page, 'Night Market').locator('.tag--mature');
  await expect(tag).toHaveText('Mature or explicit');
  const beige = await bg(page, '.work-card .tag--mature');
  for (const title of ["The Kettle's Song", 'The Long Road', 'Finished Tale']) await expect(card(page, title).locator('.tag--mature')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText('Rated');

  await page.goto('/writing/night-market');
  await expect(page.locator('.tag--mature')).toHaveText('Mature or explicit');
  expect(await bg(page, '.tag--mature')).not.toBe(beige);
  await page.goto('/writing/the-kettles-song');
  await expect(page.locator('.tag--mature')).toHaveCount(0);
});

test('story-mature-content#AC-6 before you read', async ({ page }) => {
  await page.goto('/writing/night-market');
  await expect(box(page)).toContainText('This story has mature or explicit content.');
  await expect(box(page)).toContainText('Violence.');

  await page.goto('/writing/the-kettles-song');
  await expect(box(page)).toContainText('Mild peril.');
  await expect(box(page)).not.toContainText('mature or explicit');
  await expect(box(page)).not.toContainText('Rated');

  await page.goto('/writing/finished-tale/1');
  await expect(box(page)).toHaveText(/Before you read\s*Grief\./);

  await page.goto('/writing/the-long-road/1');
  await expect(box(page)).toHaveCount(0);
});

test('story-mature-content#AC-7 the gate', async ({ page }) => {
  await page.goto('/writing/the-kettles-song');
  await expect(page.locator('main article')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue to the story' })).toHaveCount(0);

  await page.goto('/writing/night-market');
  await expect(page.locator('main article')).toBeHidden();
  await box(page).getByRole('button', { name: 'Continue to the story' }).click();
  await expect(page.locator('main article')).toBeFocused();
  expect(await page.evaluate(() => localStorage.getItem('kb-continue-rated'))).not.toBeNull();
});

test('story-mature-content#AC-7 a choice made before the change still counts', async ({ page }) => {
  await page.goto('/writing');
  await page.evaluate(() => localStorage.setItem('kb-continue-rated', '1'));
  await page.goto('/writing/night-market');
  await expect(page.locator('main article')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue to the story' })).toHaveCount(0);
});

test('story-mature-content#AC-8 preview', async ({ page }) => {
  await page.goto(`/preview/writtenWork/story-song?sanity-preview-secret=${KEY}`);
  await expect(box(page)).toContainText('This story has mature or explicit content.');
  await expect(page.getByRole('button', { name: 'Continue to the story' })).toHaveCount(0);
  await expect(page.locator('main article')).toContainText('Draft text.');
  await expect(page.locator('main article')).toBeVisible();
});

test('story-mature-content#AC-9 accessibility', async ({ page }) => {
  for (const path of ['/writing', '/writing/night-market', '/writing/the-kettles-song']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id), path).toEqual([]);
  }
});
