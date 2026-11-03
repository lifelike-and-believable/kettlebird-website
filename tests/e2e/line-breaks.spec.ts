// tier:fix: returns Star types into a description show on the site (fixture: One Shot's
// description has a return in it).
import { expect, test } from '@playwright/test';

test('a series description keeps its line break on the series page and on Comics', async ({ page }) => {
  await page.goto('/comics/one-shot');
  const description = page.locator('.series__description');
  await expect(description.locator('br')).toHaveCount(1);
  expect(await description.innerText()).toBe('A short fan comic.\nTwo friends, one afternoon.');

  await page.goto('/comics');
  const card = page.locator('.series-card__description', { hasText: 'A short fan comic.' });
  await expect(card.locator('br')).toHaveCount(1);
});
