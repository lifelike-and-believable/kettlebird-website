// End-to-end tests for sharing, the newest page, Page not found's series link, link previews, and
// page announcements with focus kept on a turn. Against the fixture comics.
// Criteria: docs/specs/comic-reader-share-and-announce.md.
import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// One page at a time: a window narrower than the width at which pages pair
// (docs/specs/comic-reader-spread-and-flip.md AC-3). The defaults are 1280 × 720, which pairs them.
test.use({ viewport: { width: 900, height: 800 } });

const SITE = 'https://newsite.kettlebird.com';
const share = (page: Page) => page.getByRole('button', { name: /Share this page|Link copied/ });
const status = (page: Page) => page.locator('[data-announce]');

test('comic-reader-share-and-announce#AC-1 Share this page copies the link on a computer', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/comics/kettle-tales/2/1#somewhere');
  await expect(share(page)).toHaveText('Share this page');
  await share(page).click();
  await expect(share(page)).toHaveText('Link copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`${SITE}/comics/kettle-tales/2/1`);
  await expect(page.locator('[data-share-status]')).toHaveText('Link copied');
  await expect(share(page)).toHaveText('Share this page', { timeout: 6_000 });
});

test('comic-reader-share-and-announce#AC-1 on a touch screen the share menu opens', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.addInitScript(() => {
    const w = window as unknown as { shared: unknown[] };
    w.shared = [];
    Object.defineProperty(navigator, 'share', { value: (data: unknown) => { w.shared.push(data); return Promise.resolve(); } });
  });
  await page.goto('/comics/kettle-tales/2/1');
  await share(page).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { shared: unknown[] }).shared)).toEqual([
    { title: 'Kettle Tales · Chapter 2, page 1', url: `${SITE}/comics/kettle-tales/2/1` },
  ]);
  await expect(share(page)).toHaveText('Share this page');
  await context.close();
});

test('comic-reader-share-and-announce#AC-1 closing the share menu is silent; other share errors copy', async ({ browser }) => {
  for (const [error, copies] of [['AbortError', false], ['NotAllowedError', true]] as const) {
    const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const page = await context.newPage();
    await page.addInitScript((name) => {
      Object.defineProperty(navigator, 'share', { value: () => Promise.reject(new DOMException('x', name)) });
    }, error);
    await page.goto('/comics/kettle-tales/2/1');
    await share(page).click();
    if (copies) {
      await expect(share(page)).toHaveText('Link copied');
    } else {
      await page.waitForTimeout(500);
      await expect(share(page)).toHaveText('Share this page');
      await expect(page.locator('[data-share-status]')).toHaveText('');
    }
    await context.close();
  }
});

test('comic-reader-share-and-announce#AC-2 when copying is refused, the link to copy by hand', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('denied')) } });
  });
  await page.goto('/comics/kettle-tales/2/1');
  await share(page).click();
  const box = page.getByLabel('Copy this link:');
  await expect(box).toBeVisible();
  await expect(box).toHaveValue(`${SITE}/comics/kettle-tales/2/1`);
  await expect(box).toBeFocused();
  expect(await box.evaluate((el: HTMLInputElement) => [el.selectionStart, el.selectionEnd, el.value.length])).toEqual([0, 54, 54]);
});

test('comic-reader-share-and-announce#AC-1 placement, and no button without scripts', async ({ page, browser }) => {
  await page.goto('/comics/kettle-tales/4/1');
  // Under the end note on the newest page.
  const order = await page.evaluate(() => {
    const end = document.querySelector('.reader__end')!;
    const button = [...document.querySelectorAll('button')].find((b) => b.textContent?.includes('Share this page'))!;
    return end.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING;
  });
  expect(order).toBeTruthy();
  await page.goto('/comics/paused/1/1');
  await expect(share(page)).toBeVisible();

  const context = await browser.newContext({ javaScriptEnabled: false });
  const noScript = await context.newPage();
  await noScript.goto('/comics/kettle-tales/2/1');
  await expect(share(noScript)).toBeHidden();
  await context.close();
});

test('comic-reader-share-and-announce#AC-3 read the newest page', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('/comics/kettle-tales');
  const newest = page.getByRole('link', { name: 'Read the newest page' });
  await expect(newest).toHaveAttribute('href', '/comics/kettle-tales/4/1');
  await expect(newest).toBeInViewport();
  await expect(page.getByRole('link', { name: 'Start reading' })).toBeInViewport();
  for (const slug of ['one-shot', 'paused']) {
    await page.goto(`/comics/${slug}`);
    await expect(page.getByRole('link', { name: 'Read the newest page' })).toHaveCount(0);
  }
});

test('comic-reader-share-and-announce#AC-4 page not found links to the series', async ({ page, browser }) => {
  for (const path of ['/comics/kettle-tales/9/1', '/comics/kettle-tales/2/99', '/comics/kettle-tales/3/pages']) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    const back = page.getByRole('link', { name: 'Back to Kettle Tales' });
    await expect(back, path).toHaveAttribute('href', '/comics/kettle-tales');
    const links = page.getByRole('main').getByRole('link');
    await expect(links.first()).toHaveText('Back to Kettle Tales');
    await expect(page.getByRole('main').getByRole('link', { name: 'Comics' })).toBeVisible();
  }
  await page.goto('/comics/gone/1/1');
  await expect(page.getByRole('link', { name: /^Back to/ })).toHaveCount(0);
  await expect(page.getByRole('main').getByRole('link', { name: 'Comics' })).toBeVisible();

  const context = await browser.newContext({ javaScriptEnabled: false });
  const noScript = await context.newPage();
  await noScript.goto('/comics/kettle-tales/9/1');
  await expect(noScript.getByRole('link', { name: /^Back to/ })).toHaveCount(0);
  await context.close();
});

test('comic-reader-share-and-announce#AC-5 link previews and canonical addresses', async ({ page }) => {
  const meta = (key: string) => page.locator(`meta[property="${key}"], meta[name="${key}"]`).first();
  await page.goto('/comics/kettle-tales/2/1');
  await expect(meta('og:title')).toHaveAttribute('content', 'Kettle Tales · Chapter 2, page 1');
  await expect(meta('og:description')).toHaveAttribute('content', 'Chapter 2: The Long Road, page 1 of 2. A fox and a kettle set out across the hills.');
  await expect(meta('og:image')).toHaveAttribute('content', `${SITE}/assets/images/site-card.jpg`);
  await expect(meta('og:url')).toHaveAttribute('content', `${SITE}/comics/kettle-tales/2/1`);
  await expect(meta('og:type')).toHaveAttribute('content', 'article');
  await expect(meta('twitter:card')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE}/comics/kettle-tales/2/1`);

  await page.goto('/comics/kettle-tales');
  await expect(meta('og:title')).toHaveAttribute('content', 'Kettle Tales');
  await expect(meta('og:description')).toHaveAttribute('content', 'A fox and a kettle set out across the hills.');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE}/comics/kettle-tales`);
  // The site card the previews fall back on exists (site-search AC-6).
  const logo = await page.request.get('/assets/images/site-card.jpg');
  expect(logo.status()).toBe(200);
});

test('comic-reader-share-and-announce#AC-6 each page is announced, on arrival and after a turn, not on reload', async ({ page }) => {
  await page.goto('/comics/kettle-tales/2/2');
  await expect(status(page)).toHaveAttribute('role', 'status');
  await expect(status(page)).toHaveText('Chapter 2: The Long Road, page 2 of 2. Rain on the road.');
  await page.reload();
  await page.waitForTimeout(1_200);
  await expect(status(page)).toHaveText('');
  // A turn by arrow key: announced, focus not moved to a control.
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/\/kettle-tales\/4\/1$/);
  await expect(status(page)).toHaveText("Chapter 4: Homeward, page 1 of 1. Home at last. You're all caught up! New pages are on the way.");
  expect(await page.evaluate(() => document.activeElement?.closest('[aria-label="Page navigation"]') === null)).toBe(true);
});

test('comic-reader-share-and-announce#AC-7 focus stays on the control used', async ({ page }) => {
  await page.goto('/comics/kettle-tales/1/1');
  await page.getByRole('link', { name: 'Next page' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/1\/2$/);
  await expect(page.getByRole('link', { name: 'Next page' })).toBeFocused();
  await expect(status(page)).toHaveText('Chapter 1: The Kettle, page 2 of 3. The kettle wobbles.');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/1\/3$/);
  await expect(page.getByRole('link', { name: 'Next page' })).toBeFocused();

  await page.getByRole('link', { name: 'Previous page' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/1\/2$/);
  await expect(page.getByRole('link', { name: 'Previous page' })).toBeFocused();

  // Onto the newest page: focus on the now-unavailable Newest, and Tab moves on to the end note.
  await page.getByRole('link', { name: 'Newest page of the series' }).click();
  await expect(page).toHaveURL(/\/4\/1$/);
  const newest = page.getByRole('link', { name: 'Newest page of the series' });
  await expect(newest).toHaveAttribute('aria-disabled', 'true');
  await expect(newest).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('.reader__end').getByRole('link', { name: 'Back to series' })).toBeFocused();
});

test('comic-reader-share-and-announce#AC-7 unavailable controls take focus only from the script', async ({ page }) => {
  await page.goto('/comics/kettle-tales/1/1');
  for (const name of ['First page of the series', 'Previous page']) {
    await expect(page.getByRole('link', { name })).toHaveAttribute('tabindex', '-1');
  }
  // Focus without scrolling: the reader stays where it opened.
  await page.goto('/comics/kettle-tales/1/2');
  const before = await page.evaluate(() => window.scrollY);
  await page.getByRole('link', { name: 'Next page' }).click();
  await expect(page).toHaveURL(/\/1\/3$/);
  await expect(page.getByRole('link', { name: 'Next page' })).toBeFocused();
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThan(2);
});

test('comic-reader-share-and-announce#AC-8 accessibility', async ({ page }) => {
  for (const path of ['/comics/kettle-tales/2/1', '/comics/kettle-tales/4/1', '/comics/kettle-tales', '/comics/kettle-tales/9/1']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${v.id}: ${v.help}`), path).toEqual([]);
  }
});
