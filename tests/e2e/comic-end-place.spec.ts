// The newest page opens at the same place in the window as every other page: the reader opens with
// its bar at the top of the window, whether or not the end note follows the controls (the lead's
// decision of 2026-11-05 in design-comic-spread-and-flip). Criteria: docs/specs/comic-reader-spread-and-flip.md AC-7.
import { expect, test, type Page } from '@playwright/test';

const where = (page: Page) =>
  page.evaluate(() => {
    const bar = document.querySelector('.reader__bar')!.getBoundingClientRect();
    const img = document.querySelector('.reader__page.is-current img, .reader__page img')!.getBoundingClientRect();
    return { bar: Math.round(bar.top), img: Math.round(img.top), height: Math.round(img.height) };
  });

const sizes = [
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'tall laptop', width: 1000, height: 1000 },
  { name: 'phone', width: 390, height: 844 },
];

for (const size of sizes) {
  test(`comic-reader-spread-and-flip#AC-7 the newest page opens where every other page does (${size.name})`, async ({ page }) => {
    await page.setViewportSize({ width: size.width, height: size.height });
    // One page at a time: Single Sheets' first and newest pages.
    await page.goto('/comics/single-sheets/1/1');
    const first = await where(page);
    await page.goto('/comics/single-sheets/1/4');
    await expect(page.getByText("You're all caught up!")).toBeAttached();
    expect(await where(page)).toEqual(first);
    // Turning onto the newest page, too.
    await page.goto('/comics/single-sheets/1/2');
    expect((await where(page)).bar).toBe(first.bar);
  });
}
