// The portfolio with art in it fits a phone with text at 200% (requirements-site, constraints:
// WCAG 2.1 AA reflow, 1.4.10). The fixture build's portfolio is empty, so this uses the preview
// route with the fixture draft piece (tests/fixtures/drafts.ts), which shows the portfolio with it.
import { expect, test } from '@playwright/test';

const PIECE = '/preview/galleryItem/piece-moon?sanity-preview-secret=fixture-preview-key';

for (const width of [390, 320]) {
  test(`the portfolio with art fits a ${width} px phone with text at 200%`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(PIECE);
    await expect(page.locator('.gallery-card')).toHaveCount(1);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    for (const selector of ['.folder-label', '.gallery-card', '.carousel']) {
      const right = await page.locator(selector).first().evaluate((e) => e.getBoundingClientRect().right);
      expect(right, selector).toBeLessThanOrEqual(width);
    }
    const sideways = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(sideways).toBeLessThanOrEqual(0);
  });
}
