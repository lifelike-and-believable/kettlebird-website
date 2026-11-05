// Edge cases found while building panel by panel (docs/specs/comic-reader-panels.md AC-13).
import { expect, test } from '@playwright/test';

test('comic-reader-panels#AC-13 the last page still steps through its panels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/comics/single-sheets/1/4');
  await page.getByRole('button', { name: 'Panel by panel' }).click();
  const nav = page.getByRole('navigation', { name: 'Page navigation' });
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page 4 of 4 · panel 1 of 3');
  await nav.getByRole('link', { name: 'Next panel' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page 4 of 4 · panel 2 of 3');
  await nav.getByRole('link', { name: 'Next panel' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page 4 of 4 · panel 3 of 3');
  // At the last panel of the newest page, Next can't be used.
  await expect(nav.getByRole('link', { name: 'Next page' })).toHaveAttribute('aria-disabled', 'true');
});
