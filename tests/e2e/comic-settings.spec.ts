// End-to-end tests for settings per comic, against the fixture comics (tests/fixtures/comics.ts):
// One Shot has both settings off; Single Sheets has pairs off and the page-flip on, with a spread at
// page 3; Kettle Tales and Open Book have both on. Criteria: docs/specs/comic-reader-comic-settings.md.
import { expect, test, type Page } from '@playwright/test';

const LAPTOP = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };
const KEY = 'fixture-preview-key';

const heading = (page: Page) => page.getByRole('heading', { level: 1 });
const nav = (page: Page) => page.getByRole('navigation', { name: 'Page navigation' });
const shown = (page: Page) =>
  page.locator('.reader img').evaluateAll((imgs) =>
    imgs.filter((i) => (i as HTMLElement).offsetParent !== null).map((i) => (i as HTMLImageElement).alt),
  );

// Records each page's view transition: its types (or "none"), and the names of the parts it animates.
async function recordFlips(page: Page) {
  await page.addInitScript(() => {
    addEventListener('pagereveal', async (e: Event) => {
      const vt = (e as Event & { viewTransition?: ViewTransition & { types?: Set<string> } }).viewTransition;
      if (!vt) {
        sessionStorage.setItem('kb-vt', 'none');
        return;
      }
      try {
        await vt.ready;
        sessionStorage.setItem('kb-vt', [...(vt.types ?? [])].join(',') || 'untyped');
        const parts = document.getAnimations().map((a) => (a.effect as KeyframeEffect | null)?.pseudoElement ?? '');
        sessionStorage.setItem('kb-vt-parts', [...new Set(parts)].filter(Boolean).sort().join(' '));
      } catch {
        sessionStorage.setItem('kb-vt', 'skipped');
      }
    });
  });
}
const lastFlip = (page: Page) => page.evaluate(() => sessionStorage.getItem('kb-vt'));
const lastParts = (page: Page) => page.evaluate(() => sessionStorage.getItem('kb-vt-parts') ?? '');

test('comic-reader-comic-settings#AC-2 pairs off on a laptop', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await page.goto('/comics/one-shot/1/1');
  expect(await shown(page)).toEqual(['Two friends meet.']);
  await expect(heading(page)).toHaveText('Page 1 of 2');
  // One set of links and states: the narrow one.
  await expect(page.locator('nav[aria-label="Page navigation"]')).toHaveCount(1);
  await expect(page.locator('.reader__location')).toHaveCount(1);
  await nav(page).getByRole('link', { name: 'Next page', exact: true }).click();
  await expect(page).toHaveURL(/\/one-shot\/1\/2$/);
  await expect(page.getByText("You're all caught up!")).toBeVisible();
});

test('comic-reader-comic-settings#AC-2 no script', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: LAPTOP });
  const page = await context.newPage();
  await page.goto('/comics/single-sheets/1/1');
  await expect(page.locator('a[data-turn="next"]')).toHaveCount(1);
  await expect(nav(page).getByRole('link', { name: 'Next page', exact: true })).toHaveAttribute('href', '/comics/single-sheets/1/2');
  await context.close();
});

test('comic-reader-comic-settings#AC-3 a spread alone', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await page.goto('/comics/single-sheets/1/3');
  await expect(heading(page)).toHaveText('Page 3 of 4 · two-page spread');
  expect(await shown(page)).toEqual(['The whole town.']);
  const spread = (await page.getByRole('img', { name: 'The whole town.' }).boundingBox())!;
  const before = await page.evaluate(async () => {
    const r = document.querySelector('.reader')!.getBoundingClientRect();
    return r.width;
  });
  // Wider than a single page would be, and within the reader.
  expect(spread.width).toBeGreaterThan(spread.height);
  expect(spread.width).toBeLessThanOrEqual(before);
  await page.goto('/comics/single-sheets/1/2');
  const single = (await page.getByRole('img', { name: 'A window.' }).boundingBox())!;
  expect(spread.width).toBeGreaterThan(single.width * 1.8);

  await page.setViewportSize(PHONE);
  await page.goto('/comics/single-sheets/1/3');
  await expect(page.getByText('Turn your phone sideways to see it bigger.')).toBeVisible();
  expect((await page.getByRole('img', { name: 'The whole town.' }).boundingBox())!.width).toBeLessThanOrEqual(PHONE.width);
});

test('comic-reader-comic-settings#AC-4 pairs on', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await page.goto('/comics/kettle-tales/1/2');
  await expect(heading(page)).toHaveText('Chapter 1: The Kettle · Pages 2–3 of 3');
});

test('comic-reader-comic-settings#AC-5 flip off', async ({ page }) => {
  await recordFlips(page);
  await page.setViewportSize(LAPTOP);
  await page.goto('/comics/one-shot/1/1');
  await nav(page).getByRole('link', { name: 'Next page', exact: true }).click();
  await expect(page).toHaveURL(/\/one-shot\/1\/2$/);
  await expect.poll(() => lastFlip(page)).toBe('none');
});

test('comic-reader-comic-settings#AC-5 flip on, pairs off', async ({ page }) => {
  await recordFlips(page);
  await page.setViewportSize(LAPTOP);
  await page.goto('/comics/single-sheets/1/1');
  await nav(page).getByRole('link', { name: 'Next page', exact: true }).click();
  await expect(page).toHaveURL(/\/single-sheets\/1\/2$/);
  await expect.poll(() => lastFlip(page)).toBe('forward');
  expect(await lastParts(page)).toContain('::view-transition-old(kb-page)');
  expect(await lastParts(page)).not.toContain('kb-right');

  // Reduced motion still wins.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/comics/single-sheets/1/1');
  await nav(page).getByRole('link', { name: 'Next page', exact: true }).click();
  await expect(page).toHaveURL(/\/single-sheets\/1\/2$/);
  await expect.poll(() => lastFlip(page)).toBe('none');
});

test('comic-reader-comic-settings#AC-9 turning in the preview', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await page.goto(`/preview/comicChapter/sheets-1?sanity-preview-secret=${KEY}`);
  // The comic's draft turns pairs on (AC-8).
  await expect(heading(page)).toHaveText('Page 1 of 3');
  await nav(page).getByRole('link', { name: 'Next pages', exact: true }).click();
  await expect(page).toHaveURL(/\/preview\/comicChapter\/sheets-1\?sanity-preview-secret=fixture-preview-key&page=2$/);
  await expect(heading(page)).toHaveText('Pages 2–3 of 3');
  // Every other link stays inactive.
  await page.getByRole('link', { name: 'Back to series' }).first().click();
  await expect(page).toHaveURL(/page=2$/);
});
