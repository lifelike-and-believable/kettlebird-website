// Reflow with enlarged text: no page scrolls sideways on a phone with text at 200% (requirements-site,
// constraints: WCAG 2.1 AA, which includes reflow, 1.4.10). Page headings: tests/e2e/page-headings.spec.ts.
import { expect, test } from '@playwright/test';

const PAGES = ['/', '/comics', '/comics/kettle-tales', '/comics/kettle-tales/1/1', '/portfolio', '/writing', '/shop', '/commissions', '/about', '/news'];

for (const width of [390, 320]) {
  test(`no page scrolls sideways on a ${width} px phone with text at 200%`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    for (const path of PAGES) {
      await page.goto(path);
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      const sideways = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(sideways, path).toBeLessThanOrEqual(0);
    }
  });
}
