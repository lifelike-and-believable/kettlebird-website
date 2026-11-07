// Pictures from Word documents in a story's text on the site, against the fixture stories (tests/fixtures/stories.ts:
// The Long Road's chapter 3 and Night Market have pictures). Criteria: docs/specs/story-import-word.md AC-23 to AC-26.
import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const CHAPTER = '/writing/the-long-road/3';
const map = (page: Page) => page.getByRole('button', { name: 'Show full screen: A map of the valley' });
const sketch = (page: Page) => page.getByRole('button', { name: 'Show full screen: A small sketch' });

async function box(page: Page, selector: string) {
  return page.locator(selector).first().evaluate((e) => {
    const r = e.getBoundingClientRect();
    return { left: r.left, right: r.right, width: r.width, height: r.height };
  });
}

for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
  test(`story-import-word#AC-23 pictures in the column at ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(CHAPTER);
    const article = await page.locator('main article').evaluate((e) => {
      const r = e.getBoundingClientRect();
      const s = getComputedStyle(e);
      return { left: r.left + parseFloat(s.paddingLeft), right: r.right - parseFloat(s.paddingRight) };
    });
    const column = article.right - article.left;
    const centre = (article.left + article.right) / 2;

    const big = await box(page, 'main article [data-story-picture] img >> nth=0');
    expect(Math.abs(big.width - Math.min(column, 2400))).toBeLessThanOrEqual(1);
    expect(Math.abs(big.height - (big.width * 1600) / 2400)).toBeLessThanOrEqual(1);
    expect(Math.abs((big.left + big.right) / 2 - centre)).toBeLessThanOrEqual(1);

    const small = await sketch(page).locator('img').evaluate((e) => {
      const r = e.getBoundingClientRect();
      return { left: r.left, right: r.right, width: r.width, height: r.height };
    });
    expect(Math.abs(small.width - Math.min(column, 300))).toBeLessThanOrEqual(1);
    expect(Math.abs(small.height - (small.width * 200) / 300)).toBeLessThanOrEqual(1);
    expect(Math.abs((small.left + small.right) / 2 - centre)).toBeLessThanOrEqual(1);

    // Its space comes from its width and height, so it's kept while it loads.
    const ratio = await map(page).locator('img').evaluate((e) => getComputedStyle(e).aspectRatio);
    expect(ratio).toBe('auto 2400 / 1600');
    // The decorative picture is plain, with an empty alt.
    await expect(page.locator('main article img.story-picture--decorative')).toHaveAttribute('alt', '');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });
}

test('story-import-word#AC-24 full screen', async ({ page }) => {
  await page.goto(CHAPTER);
  await map(page).click();
  const view = page.getByRole('dialog', { name: 'A map of the valley' });
  await expect(view).toBeVisible();
  await expect(view.locator('img')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(view).toBeHidden();
  await expect(map(page)).toBeFocused();

  // From the keyboard, Enter and Space; the close button.
  await sketch(page).focus();
  await page.keyboard.press('Enter');
  const small = page.getByRole('dialog', { name: 'A small sketch' });
  await expect(small).toBeVisible();
  await small.getByRole('button', { name: 'Close' }).click();
  await expect(small).toBeHidden();
  await expect(sketch(page)).toBeFocused();
  await page.keyboard.press('Space');
  await expect(small).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(sketch(page)).toBeFocused();
});

test('story-import-word#AC-25 hidden until continue', async ({ page }) => {
  await page.goto('/writing/night-market');
  const lantern = page.getByRole('button', { name: 'Show full screen: A lantern' });
  await expect(lantern).toBeHidden();
  await page.getByRole('button', { name: 'Continue to the story' }).click();
  await expect(lantern).toBeVisible();
});

test('story-import-word#AC-26 accessibility', async ({ page }) => {
  for (const path of [CHAPTER, '/writing/night-market']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id), path).toEqual([]);
  }
  await page.goto(CHAPTER);
  await map(page).click();
  await expect(page.getByRole('dialog', { name: 'A map of the valley' })).toBeVisible();
  const results = await new AxeBuilder({ page }).include('dialog').analyze();
  expect(results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id)).toEqual([]);
});
