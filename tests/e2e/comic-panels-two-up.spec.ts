// End-to-end tests for panel by panel with two pages side by side, against the fixture comic Open Book
// (pairs on, the page-flip on): chapter 1 opens on the right, page 1 alone, pages 2 and 3 a pair, page 4
// alone, page 5 a spread, page 6 alone; pages 1 (two panels), 2 (two) and 3 (three) have panels; chapter 2
// has none. Criteria: docs/specs/comic-reader-panels-two-up.md.
import { expect, test, type Page } from '@playwright/test';

const PHONE = { width: 390, height: 844 };
const LAPTOP = { width: 1280, height: 800 };

const heading = (page: Page) => page.getByRole('heading', { level: 1 });
const nav = (page: Page) => page.getByRole('navigation', { name: 'Page navigation' });
const toggle = (page: Page) => page.getByRole('button', { name: 'Panel by panel' });
const announced = (page: Page) => page.locator('[data-announce]');
const pages = (page: Page) => page.locator('.reader__page:visible');
const picture = (page: Page, name: string) => page.getByRole('img', { name });

test.beforeEach(async ({ page }) => {
  await page.setViewportSize(LAPTOP);
});

test('comic-reader-panels-two-up#AC-1 offered with two pages', async ({ page, browser }) => {
  await page.goto('/comics/open-book/1/2');
  await expect(pages(page)).toHaveCount(2);
  await expect(toggle(page)).toBeVisible();
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');
  // On a page with no panels of its own, in a chapter with panels.
  await page.goto('/comics/open-book/1/6');
  await expect(toggle(page)).toBeVisible();
  // Not in a chapter without panels, with two pages or one.
  await page.goto('/comics/open-book/2/1');
  await expect(toggle(page)).toHaveCount(0);
  await page.goto('/comics/kettle-tales/1/1');
  await expect(toggle(page)).toHaveCount(0);
  // Not without a script.
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: LAPTOP });
  const bare = await context.newPage();
  await bare.goto('/comics/open-book/1/2');
  await expect(pages(bare)).toHaveCount(2);
  await expect(toggle(bare)).toBeHidden();
  await context.close();
});

test('comic-reader-panels-two-up#AC-2 on with two pages', async ({ page }) => {
  await page.goto('/comics/open-book/1/2');
  await toggle(page).click();
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
  await expect(toggle(page)).toBeFocused();
  // The page in the address, alone, at its first panel, as the one-page reader.
  await expect(pages(page)).toHaveCount(1);
  await expect(picture(page, 'A hall of mirrors.')).toBeVisible();
  await expect(picture(page, 'The fox sees itself.')).toBeHidden();
  await expect(heading(page)).toHaveText(/Page 2 of 6 · panel 1 of 2$/);
  await expect(page).toHaveURL(/\/open-book\/1\/2$/);
  await expect(nav(page).getByRole('link', { name: 'Next panel' })).toBeVisible();
  await expect(nav(page).getByRole('link', { name: 'Previous page', exact: true })).toBeVisible();
  await expect(nav(page).getByRole('link', { name: /pages/ })).toHaveCount(0);
  await nav(page).getByRole('link', { name: 'Next panel' }).click();
  await expect(heading(page)).toHaveText(/Page 2 of 6 · panel 2 of 2$/);
  await expect(nav(page).getByRole('link', { name: 'Next page', exact: true })).toBeVisible();

  // With the second page of a pair in the address, that page.
  await page.evaluate(() => localStorage.removeItem('kb-panels'));
  await page.goto('/comics/open-book/1/3');
  await expect(pages(page)).toHaveCount(2);
  await toggle(page).click();
  await expect(pages(page)).toHaveCount(1);
  await expect(picture(page, 'The fox sees itself.')).toBeVisible();
  await expect(heading(page)).toHaveText(/Page 3 of 6 · panel 1 of 3$/);
  await expect(page).toHaveURL(/\/open-book\/1\/3$/);
});

test('comic-reader-panels-two-up#AC-3 page by page', async ({ page }) => {
  await page.goto('/comics/open-book/1/2');
  await toggle(page).click();
  await page.keyboard.press('ArrowRight');
  await expect(heading(page)).toHaveText(/Page 2 of 6 · panel 2 of 2$/);
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/\/open-book\/1\/3$/);
  await expect(heading(page)).toHaveText(/Page 3 of 6 · panel 1 of 3$/);
  await expect(pages(page)).toHaveCount(1);
  // The one-page page-flip.
  expect(await page.locator('.reader__page.is-current').evaluate((el) => getComputedStyle(el).viewTransitionName)).toBe('kb-page');
  await nav(page).getByRole('link', { name: 'Previous page', exact: true }).click();
  await expect(page).toHaveURL(/\/open-book\/1\/2$/);
  await expect(heading(page)).toHaveText(/Page 2 of 6 · panel 2 of 2$/);
});

test('comic-reader-panels-two-up#AC-4 before the first frame', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('kb-panels', '1');
    // Record, as soon as the pair's other page is parsed, whether it shows.
    const seen = new MutationObserver(() => {
      const other = document.querySelector('.reader__page.is-other');
      if (!other) return;
      (window as unknown as { otherShown: boolean }).otherShown = getComputedStyle(other).display !== 'none';
      seen.disconnect();
    });
    seen.observe(document, { childList: true, subtree: true });
  });
  for (const path of ['/comics/open-book/1/2', '/comics/open-book/1/3']) {
    await page.goto(path);
    expect(await page.evaluate(() => (window as unknown as { otherShown?: boolean }).otherShown), path).toBe(false);
    await expect(pages(page), path).toHaveCount(1);
  }
});

test('comic-reader-panels-two-up#AC-5 off with two pages', async ({ page }) => {
  await page.goto('/comics/open-book/1/3');
  const entries = await page.evaluate(() => history.length);
  await toggle(page).click();
  await expect(pages(page)).toHaveCount(1);
  await toggle(page).click();
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');
  await expect(toggle(page)).toBeFocused();
  // The pair that holds page 3, at once; the address and history unchanged.
  await expect(pages(page)).toHaveCount(2);
  await expect(picture(page, 'A hall of mirrors.')).toBeVisible();
  await expect(picture(page, 'The fox sees itself.')).toBeVisible();
  await expect(page).toHaveURL(/\/open-book\/1\/3$/);
  expect(await page.evaluate(() => history.length)).toBe(entries);
  await expect(announced(page)).toHaveText('Chapter 1: Facing Pages, pages 2 and 3 of 6. A hall of mirrors. The fox sees itself.');
  await expect(heading(page)).toHaveText('Chapter 1: Facing Pages · Pages 2–3 of 6');

  // A page that shows alone in pairs.
  await page.goto('/comics/open-book/1/1');
  await toggle(page).click();
  await toggle(page).click();
  await expect(pages(page)).toHaveCount(1);
  await expect(announced(page)).toHaveText('Whole page');
});

test('comic-reader-panels-two-up#AC-6 remembered at any width', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/comics/open-book/1/2');
  await toggle(page).click();
  // Widened: still on, one page at a time.
  await page.setViewportSize(LAPTOP);
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
  await expect(pages(page)).toHaveCount(1);
  await expect(heading(page)).toHaveText(/Page 2 of 6 · panel 1 of 2$/);
  await page.reload();
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
  await expect(pages(page)).toHaveCount(1);
  // Turned off wide: off when it narrows, and pairs again when it widens.
  await toggle(page).click();
  await expect(pages(page)).toHaveCount(2);
  await page.setViewportSize(PHONE);
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');
  await page.reload();
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');
});

test('comic-reader-panels-two-up#AC-7 picture size', async ({ page }) => {
  await page.goto('/comics/open-book/1/2');
  await toggle(page).click();
  await expect(pages(page)).toHaveCount(1);
  const { asked, area } = await page.locator('.reader__page.is-current').evaluate((sheet) => {
    const img = sheet.querySelector('img')!;
    // The length the browser uses: the first entry of `sizes` whose condition matches.
    const entries = img.sizes.split(/,\s*(?![^()]*\))/);
    const used = entries.map((e) => /^(\(.*\))\s+(.+)$/.exec(e.trim())).find((m) => !m || matchMedia(m[1]).matches);
    const length = used ? used[2] : entries[entries.length - 1].trim();
    const probe = document.createElement('div');
    probe.style.width = length;
    document.body.append(probe);
    const width = probe.getBoundingClientRect().width;
    probe.remove();
    return { asked: width, area: sheet.getBoundingClientRect().width };
  });
  expect(area).toBeGreaterThan(300);
  expect(asked).toBeGreaterThanOrEqual(2 * area - 1);
});
