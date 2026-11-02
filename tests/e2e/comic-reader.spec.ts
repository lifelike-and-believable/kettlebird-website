// End-to-end tests for the comic reader, against fixture comics (tests/fixtures/comics.ts).
// Criteria: docs/specs/comic-reader-start-and-turn.md.
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('comic-reader-start-and-turn#AC-1 series cards open series pages', async ({ page }) => {
  await page.goto('/comics');
  await expect(page.getByRole('link', { name: /No Address/ })).toHaveCount(0);
  await expect(page.getByText('No Address')).toBeVisible();
  await page.getByRole('link', { name: /Kettle Tales/ }).click();
  await expect(page).toHaveURL(/\/comics\/kettle-tales$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Kettle Tales' })).toBeVisible();
});

test('comic-reader-start-and-turn#AC-2 series page shows details', async ({ page }) => {
  await page.goto('/comics/kettle-tales');
  await expect(page.getByRole('heading', { level: 1, name: 'Kettle Tales' })).toBeVisible();
  await expect(page.getByText('Status: Ongoing')).toBeAttached();
  await expect(page.getByText('Type: Original')).toBeAttached();
  await expect(page.getByText('A fox and a kettle set out across the hills.')).toBeVisible();
});

test('comic-reader-start-and-turn#AC-3 chapter list', async ({ page }) => {
  await page.goto('/comics/kettle-tales');
  await expect(page.getByRole('heading', { level: 2, name: 'Chapters' })).toBeVisible();
  const items = page.getByRole('list', { name: 'Chapters' }).getByRole('listitem');
  await expect(items).toHaveCount(3);
  await expect(items.nth(0)).toContainText('Chapter 1: The Kettle');
  await expect(items.nth(0)).toContainText('3 pages');
  await expect(items.nth(1)).toContainText('Chapter 2: The Long Road');
  await expect(items.nth(2)).toContainText('Chapter 4: Homeward');
  await expect(items.nth(2)).toContainText('1 page');
  await expect(page.getByText('Not Ready Yet')).toHaveCount(0);
  await page.getByRole('link', { name: /Chapter 2: The Long Road/ }).click();
  await expect(page).toHaveURL(/\/comics\/kettle-tales\/2\/1$/);
});

test('comic-reader-start-and-turn#AC-4 start reading', async ({ page }) => {
  await page.goto('/comics/kettle-tales');
  await page.getByRole('link', { name: 'Start reading' }).click();
  await expect(page).toHaveURL(/\/comics\/kettle-tales\/1\/1$/);
});

test('comic-reader-start-and-turn#AC-5 one-shot series', async ({ page }) => {
  await page.goto('/comics/one-shot');
  await expect(page.getByRole('link', { name: 'Start reading' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Chapters' })).toHaveCount(0);
});

test('comic-reader-start-and-turn#AC-6 series without pages', async ({ page }) => {
  await page.goto('/comics/coming-soon');
  await expect(page.getByText('Pages coming soon.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start reading' })).toHaveCount(0);
});

test('comic-reader-start-and-turn#AC-7 AC-8 AC-13 reader page', async ({ page }) => {
  await page.goto('/comics/kettle-tales/2/1');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Chapter 2: The Long Road · Page 1 of 2');
  await expect(page).toHaveTitle('Chapter 2, page 1 · Kettle Tales · Kettlebird Creations');
  await expect(page.getByRole('img', { name: 'The fox sets out at dawn.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to series' })).toHaveAttribute('href', '/comics/kettle-tales');
  await expect(page.getByText("Loading page… If it doesn't appear, try refreshing.")).toBeAttached();

  await page.goto('/comics/one-shot/1/2');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page 2 of 2');
  await expect(page).toHaveTitle('Page 2 · One Shot · Kettlebird Creations');
  await expect(page.getByRole('img', { name: 'Page 2' })).toBeVisible();
});

test('comic-reader-start-and-turn#AC-9 turn pages with links', async ({ page }) => {
  await page.goto('/comics/kettle-tales/1/1');
  await expect(page.getByRole('link', { name: 'Previous page' })).toHaveCount(0);
  await page.getByRole('link', { name: 'Next page' }).click();
  await expect(page).toHaveURL(/\/1\/2$/);
  await page.getByRole('link', { name: 'Next page' }).click();
  await page.getByRole('link', { name: 'Next page' }).click();
  await expect(page).toHaveURL(/\/2\/1$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Chapter 2: The Long Road · Page 1 of 2');
  await page.getByRole('link', { name: 'Previous page' }).click();
  await expect(page).toHaveURL(/\/1\/3$/);
});

test('comic-reader-start-and-turn#AC-9 a turned page is first drawn past the site header', async ({ page }) => {
  // design-comic-turn-pages: the page opens with the reader bar at the top of the window. If that
  // scroll waits until after the first frame, the site header flashes on screen at each turn.
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(() => {
    requestAnimationFrame(() => { (window as unknown as { firstFrameY: number }).firstFrameY = window.scrollY; });
  });
  for (const path of ['/comics/kettle-tales/1/1', '/comics/kettle-tales/1/2', '/comics/kettle-tales/2/1']) {
    await page.goto(path);
    await page.waitForFunction(() => 'firstFrameY' in window);
    const firstFrameY = await page.evaluate(() => (window as unknown as { firstFrameY: number }).firstFrameY);
    expect(firstFrameY, path).toBeGreaterThan(0);
  }
});

test('comic-reader-start-and-turn#AC-10 last page', async ({ page }) => {
  await page.goto('/comics/kettle-tales/4/1');
  await expect(page.getByRole('link', { name: 'Next page' })).toHaveCount(0);
  await expect(page.getByText("You're all caught up!")).toBeVisible();
  await expect(page.getByText('New pages are on the way.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Previous page' })).toBeVisible();

  await page.goto('/comics/paused/1/1');
  await expect(page.getByText('This comic is on a break.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Previous page' })).toHaveCount(0);

  await page.goto('/comics/one-shot/1/2');
  await expect(page.getByText("That's the end of the story.")).toBeVisible();
});

test('comic-reader-start-and-turn#AC-11 arrow keys', async ({ page }) => {
  await page.goto('/comics/kettle-tales/1/2');
  await page.keyboard.press('Alt+ArrowRight');
  await page.waitForTimeout(300);
  await expect(page).toHaveURL(/\/1\/2$/);
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/\/1\/3$/);
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(/\/1\/2$/);
});

test('comic-reader-start-and-turn#AC-12 swipe', async ({ page }) => {
  await page.goto('/comics/kettle-tales/1/2');
  const swipe = (dx: number, dy: number) =>
    page.evaluate(([dx, dy]) => {
      const target = document.querySelector('[data-reader-page]')!;
      const opts = { pointerType: 'touch', isPrimary: true, bubbles: true } as PointerEventInit;
      target.dispatchEvent(new PointerEvent('pointerdown', { ...opts, clientX: 200, clientY: 300 }));
      target.dispatchEvent(new PointerEvent('pointerup', { ...opts, clientX: 200 + dx, clientY: 300 + dy }));
    }, [dx, dy]);
  await swipe(10, 200); // mostly vertical: scrolling, not a turn
  await page.waitForTimeout(300);
  await expect(page).toHaveURL(/\/1\/2$/);
  await swipe(-150, 10); // left: next page
  await expect(page).toHaveURL(/\/1\/3$/);
  await swipe(150, 10); // right: previous page
  await expect(page).toHaveURL(/\/1\/2$/);
});

test('comic-reader-start-and-turn#AC-14 not found', async ({ page }) => {
  for (const path of ['/comics/nope', '/comics/kettle-tales/9/1', '/comics/kettle-tales/1/99']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
    await expect(page.getByRole('main').getByRole('link', { name: 'Comics' })).toHaveAttribute('href', '/comics');
  }
});

test('comic-reader-start-and-turn#AC-15 phone layout', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('/comics/kettle-tales');
  await expect(page.getByRole('link', { name: 'Start reading' })).toBeInViewport();
});

test('comic-reader-start-and-turn#AC-16 accessibility', async ({ page }) => {
  for (const path of ['/comics/kettle-tales', '/comics/kettle-tales/2/1', '/comics/kettle-tales/4/1']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${v.id}: ${v.help}`), path).toEqual([]);
  }
  await page.goto('/comics/kettle-tales/1/2');
  const reached = new Set<string>();
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    const name = await page.evaluate(() => (document.activeElement as HTMLElement | null)?.innerText?.trim() ?? '');
    reached.add(name);
  }
  for (const name of ['Back to series', 'Previous page', 'Next page']) expect([...reached]).toContain(name);
});
