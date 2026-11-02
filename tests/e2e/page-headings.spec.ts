// Page headings with enlarged text: no page heading makes a page scroll sideways on a phone with text
// at 200% (requirements-site, constraints: WCAG 2.1 AA, which includes reflow, 1.4.10). The about page
// and the commissions page at 320 px have other overflowing content, fixed separately.
import { expect, test } from '@playwright/test';

for (const width of [390, 320]) {
  test(`page headings fit a ${width} px phone with text at 200%`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    for (const path of ['/comics', '/portfolio', '/writing', '/shop', '/news']) {
      await page.goto(path);
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      const heading = await page.locator('h1.page-title').evaluate((e) => e.getBoundingClientRect().right);
      expect(heading, path).toBeLessThanOrEqual(width);
      const sideways = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(sideways, path).toBeLessThanOrEqual(0);
    }
  });
}

test('page headings keep their size at normal text on a 390 px phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/comics');
  expect(await page.locator('h1.page-title').evaluate((e) => getComputedStyle(e).fontSize)).toBe('56px');
});
