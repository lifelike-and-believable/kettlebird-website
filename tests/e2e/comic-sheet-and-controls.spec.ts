// End-to-end tests for the player-style controls and the contact sheets, against the fixture comics
// (tests/fixtures/comics.ts). Criteria: docs/specs/comic-reader-sheet-and-controls.md.
import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const controls = (page: Page) => page.getByRole('navigation', { name: 'Page navigation' }).getByRole('link');

test('comic-reader-sheet-and-controls#AC-1 controls', async ({ page }) => {
  await page.goto('/comics/kettle-tales/1/2');
  await expect(controls(page)).toHaveCount(4);
  const names = await controls(page).evaluateAll((els) => els.map((e) => e.getAttribute('aria-label') ?? (e as HTMLElement).innerText));
  expect(names).toEqual(['First page of the series', 'Previous page', 'Next page', 'Newest page of the series']);
  for (const caption of ['First', 'Previous', 'Next', 'Newest']) {
    await expect(page.getByRole('navigation', { name: 'Page navigation' }).getByText(caption, { exact: true })).toBeVisible();
  }
  // Icons are drawn and hidden from screen readers.
  const icons = page.locator('.reader__controls svg');
  await expect(icons).toHaveCount(4);
  for (const icon of await icons.all()) await expect(icon).toHaveAttribute('aria-hidden', 'true');
  // All four the same width and colour.
  const looks = await controls(page).evaluateAll((els) =>
    els.map((e) => ({ w: Math.round(e.getBoundingClientRect().width), bg: getComputedStyle(e).backgroundColor })),
  );
  expect(new Set(looks.map((l) => l.w)).size).toBe(1);
  expect(new Set(looks.map((l) => l.bg)).size).toBe(1);
  for (const box of await controls(page).evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) {
    expect(box).toBeGreaterThanOrEqual(56);
  }
});

test('comic-reader-sheet-and-controls#AC-1 the full name shows on hover and on focus', async ({ page }) => {
  await page.goto('/comics/kettle-tales/1/2');
  const tip = page.locator('.reader__control-tip', { hasText: 'Newest page of the series' });
  await expect(tip).toBeHidden();
  await page.getByRole('link', { name: 'Newest page of the series' }).hover();
  await expect(tip).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(tip).toBeHidden();
  await page.getByRole('link', { name: 'Newest page of the series' }).focus();
  await expect(tip).toBeVisible();
});

test('comic-reader-sheet-and-controls#AC-2 first and newest', async ({ page }) => {
  await page.goto('/comics/kettle-tales/2/1');
  await page.getByRole('link', { name: 'Newest page of the series' }).click();
  await expect(page).toHaveURL(/\/kettle-tales\/4\/1$/);
  await page.getByRole('link', { name: 'First page of the series' }).click();
  await expect(page).toHaveURL(/\/kettle-tales\/1\/1$/);

  await page.goto('/comics/one-shot/1/1');
  await expect(page.getByRole('navigation', { name: 'Page navigation' }).getByText('Last', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Last page of the series' }).click();
  await expect(page).toHaveURL(/\/one-shot\/1\/2$/);
});

test('comic-reader-sheet-and-controls#AC-3 controls that cannot be used', async ({ page }) => {
  await page.goto('/comics/kettle-tales/1/1');
  for (const name of ['First page of the series', 'Previous page']) {
    const control = page.getByRole('link', { name });
    await expect(control).toHaveAttribute('aria-disabled', 'true');
    await expect(control).not.toHaveAttribute('href');
  }
  await expect(page.getByRole('link', { name: 'Next page' })).toHaveAttribute('href', /\/1\/2$/);
  // The arrow key ignores a control that can't be used.
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(300);
  await expect(page).toHaveURL(/\/1\/1$/);

  await page.goto('/comics/kettle-tales/4/1');
  for (const name of ['Next page', 'Newest page of the series']) {
    await expect(page.getByRole('link', { name })).toHaveAttribute('aria-disabled', 'true');
  }
  await expect(page.getByText("You're all caught up!")).toBeVisible();
  // Unusable controls keep their place: the row is still four wide.
  const xs = await controls(page).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().x)));
  expect(xs).toEqual([...xs].sort((a, b) => a - b));
  expect(new Set(xs).size).toBe(4);

  await page.goto('/comics/paused/1/1');
  await expect(controls(page)).toHaveCount(0);
  await expect(page.getByText('This comic is on a break.')).toBeVisible();
});

test('comic-reader-sheet-and-controls#AC-4 Home and End scroll; Tab skips unusable controls', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('/comics/kettle-tales/1/2');
  await page.keyboard.press('End');
  await page.waitForTimeout(300);
  await expect(page).toHaveURL(/\/1\/2$/);
  await page.keyboard.press('Home');
  await page.waitForTimeout(300);
  await expect(page).toHaveURL(/\/1\/2$/);

  await page.goto('/comics/kettle-tales/1/1');
  const reached: string[] = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    reached.push(await page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? ''));
  }
  expect(reached).toContain('Next page');
  expect(reached).not.toContain('Previous page');
  expect(reached).not.toContain('First page of the series');
});

test('comic-reader-sheet-and-controls#AC-5 phone layout', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('/comics/kettle-tales/1/2');
  await expect(page.getByRole('link', { name: 'All pages in this chapter' })).toBeInViewport();
  for (const name of ['First page of the series', 'Previous page', 'Next page', 'Newest page of the series']) {
    await expect(page.getByRole('link', { name })).toBeInViewport({ ratio: 1 });
  }
});

test('comic-reader-sheet-and-controls#AC-5 enlarged text on a narrow phone wraps two by two', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const path of ['/comics/kettle-tales/1/2', '/comics/kettle-tales/1/2/pages']) {
    await page.goto(path);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
  await page.goto('/comics/kettle-tales/1/2');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const box = async (name: string) => (await page.getByRole('link', { name }).boundingBox())!;
  const [first, previous, next, newest] = [
    await box('First page of the series'), await box('Previous page'), await box('Next page'), await box('Newest page of the series'),
  ];
  // Previous and Next on top, First and Newest under them.
  expect(Math.round(previous.y)).toBe(Math.round(next.y));
  expect(Math.round(first.y)).toBe(Math.round(newest.y));
  expect(first.y).toBeGreaterThan(previous.y);
  expect(previous.x).toBeLessThan(next.x);
  expect(first.x).toBeLessThan(newest.x);
});

test('comic-reader-sheet-and-controls#AC-6 All pages', async ({ page }) => {
  await page.goto('/comics/kettle-tales/1/3');
  const all = page.getByRole('link', { name: 'All pages in this chapter' });
  await expect(all).toHaveAttribute('href', '/comics/kettle-tales/1/3/pages#page-3');
  await expect(all).toContainText('All pages');
  await all.click();
  await expect(page).toHaveURL(/\/kettle-tales\/1\/3\/pages#page-3$/);

  await page.goto('/comics/kettle-tales/4/1');
  await expect(page.getByRole('link', { name: 'All pages in this chapter' })).toHaveCount(0);
  const missing = await page.goto('/comics/kettle-tales/4/1/pages');
  expect(missing?.status()).toBe(404);
});

test('comic-reader-sheet-and-controls#AC-7 page sheet', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/comics/kettle-tales/1/3/pages#page-3');
  await expect(page).toHaveTitle('Chapter 1, all pages · Kettle Tales · Kettlebird Creations');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kettle Tales · Chapter 1: The Kettle');
  await expect(page.getByText('3 pages', { exact: true })).toBeVisible();

  const pictures = page.getByRole('list', { name: 'Pages' }).getByRole('link');
  await expect(pictures).toHaveCount(3);
  await expect(pictures.nth(0)).toHaveAccessibleName('Page 1: A fox looks up at a kettle on a high shelf.');
  await expect(pictures.nth(2)).toHaveAccessibleName('Page 3: It falls. You were here');
  await expect(pictures.nth(2)).not.toHaveAttribute('aria-current');
  await expect(page.getByText('3 · You were here')).toBeVisible();
  await expect(pictures.nth(2)).toBeInViewport();

  // Three a row on a phone.
  const tops = await pictures.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
  expect(new Set(tops).size).toBe(1);

  // Small images, loaded as they come into view, in boxes sized ahead.
  const img = page.locator('#page-1 img');
  await expect(img).toHaveAttribute('loading', 'lazy');
  await expect(img).toHaveAttribute('width', /\d+/);
  await expect(img).toHaveAttribute('height', /\d+/);

  // Back links above and under the pictures.
  await expect(page.getByRole('link', { name: '← Back to page 3' })).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'Back to series' })).toHaveCount(2);
  await page.getByRole('link', { name: '← Back to page 3' }).first().click();
  await expect(page).toHaveURL(/\/kettle-tales\/1\/3$/);

  await page.goto('/comics/kettle-tales/1/3/pages');
  await pictures.nth(1).click();
  await expect(page).toHaveURL(/\/kettle-tales\/1\/2$/);
});

test('comic-reader-sheet-and-controls#AC-7 a series without chapter names', async ({ page }) => {
  await page.goto('/comics/one-shot/1/2/pages');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('One Shot');
  await expect(page).toHaveTitle('All pages · One Shot · Kettlebird Creations');
  await expect(page.locator('details')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /chapter:/ })).toHaveCount(0);
});

test('comic-reader-sheet-and-controls#AC-8 chapter sheet', async ({ page }) => {
  await page.goto('/comics/kettle-tales/4/pages');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kettle Tales · Chapter 4: Homeward');
  await expect(page.getByText('1 page', { exact: true })).toBeVisible();
  await expect(page.getByText(/You were here/)).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Back to page/ })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Back to series' }).first()).toHaveAttribute('href', '/comics/kettle-tales');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  const empty = await page.goto('/comics/kettle-tales/3/pages');
  expect(empty?.status()).toBe(404);
});

test('comic-reader-sheet-and-controls#AC-9 chapter list', async ({ page }) => {
  await page.goto('/comics/kettle-tales/2/1/pages');
  const fold = page.locator('details');
  await expect(fold).not.toHaveAttribute('open');
  const summary = page.locator('summary');
  await expect(summary).toContainText('Chapter 2 of 4 · All chapters');
  await summary.click();
  const nav = page.getByRole('navigation', { name: 'Chapters' });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('listitem')).toHaveCount(3);
  await expect(nav.getByRole('listitem').nth(1)).toContainText("you're here");
  await expect(nav.getByRole('link', { name: /Chapter 2/ })).toHaveCount(0);
  await expect(nav.getByRole('listitem').nth(0)).toContainText('3 pages');
  await nav.getByRole('link', { name: /Chapter 4: Homeward/ }).click();
  await expect(page).toHaveURL(/\/kettle-tales\/4\/pages$/);
});

test('comic-reader-sheet-and-controls#AC-10 chapters either side', async ({ page }) => {
  await page.goto('/comics/kettle-tales/2/1/pages');
  await expect(page.getByRole('link', { name: 'Previous chapter: Chapter 1' })).toHaveText('← Chapter 1');
  await page.getByRole('link', { name: 'Next chapter: Chapter 4' }).click();
  await expect(page).toHaveURL(/\/kettle-tales\/4\/pages$/);
  await expect(page.getByRole('link', { name: /Next chapter/ })).toHaveCount(0);
  await page.getByRole('link', { name: 'Previous chapter: Chapter 2' }).click();
  await expect(page).toHaveURL(/\/kettle-tales\/2\/pages$/);
});

test('comic-reader-sheet-and-controls#AC-11 accessibility', async ({ page }) => {
  for (const path of ['/comics/kettle-tales/1/2', '/comics/kettle-tales/1/1', '/comics/kettle-tales/2/1/pages', '/comics/kettle-tales/4/pages']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${v.id}: ${v.help}`), path).toEqual([]);
  }
});
