// End-to-end tests for two-page spreads and the page-flip, against the fixture series Open Book
// (tests/fixtures/comics.ts): chapter 1 opens on the right, with a spread at page 5 that leaves page 4
// alone; chapter 2 opens on the left and ends with a pair. Criteria: docs/specs/comic-reader-spread-and-flip.md.
import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BOOK = '/comics/open-book';
const LAPTOP = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };

const heading = (page: Page) => page.getByRole('heading', { level: 1 });
const nav = (page: Page) => page.getByRole('navigation', { name: 'Page navigation' });
const shown = (page: Page) =>
  page.locator('.reader img').evaluateAll((imgs) =>
    imgs.filter((i) => (i as HTMLElement).offsetParent !== null).map((i) => (i as HTMLImageElement).alt),
  );
const box = async (page: Page, alt: string) => (await page.getByRole('img', { name: alt, exact: true }).boundingBox())!;

// Records each page's view transition (its types, or "none") and its longest animation.
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
        // Read once the page's own pagereveal handler, which runs after this one, has added them.
        sessionStorage.setItem('kb-vt', [...(vt.types ?? [])].join(',') || 'untyped');
        const ms = Math.max(0, ...document.getAnimations().map((a) => Number(a.effect?.getTiming().duration) || 0));
        sessionStorage.setItem('kb-vt-ms', String(ms));
      } catch {
        sessionStorage.setItem('kb-vt', 'skipped');
      }
    });
  });
}
const lastFlip = (page: Page) => page.evaluate(() => sessionStorage.getItem('kb-vt'));
const lastFlipMs = (page: Page) => page.evaluate(() => Number(sessionStorage.getItem('kb-vt-ms')));

test('comic-reader-spread-and-flip#AC-3 width test', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await page.goto(`${BOOK}/1/2`);
  expect(await shown(page)).toEqual(['A hall of mirrors.', 'The fox sees itself.']);
  await expect(heading(page)).toHaveText('Chapter 1: Facing Pages · Pages 2–3 of 6');

  await page.setViewportSize({ width: 900, height: 800 });
  await page.goto(`${BOOK}/1/2`);
  expect(await shown(page)).toEqual(['A hall of mirrors.']);
  await expect(heading(page)).toHaveText('Chapter 1: Facing Pages · Page 2 of 6');

  // Wide enough, but taller than wide.
  await page.setViewportSize({ width: 1024, height: 1366 });
  await page.goto(`${BOOK}/1/2`);
  expect(await shown(page)).toEqual(['A hall of mirrors.']);
});

test('comic-reader-spread-and-flip#AC-3 switches without reloading', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await page.goto(`${BOOK}/1/3`);
  await page.evaluate(() => ((window as unknown as { kbStill: boolean }).kbStill = true));
  await page.setViewportSize({ width: 800, height: 1000 });
  await expect(heading(page)).toHaveText('Chapter 1: Facing Pages · Page 3 of 6');
  expect(await shown(page)).toEqual(['The fox sees itself.']);
  await page.setViewportSize(LAPTOP);
  await expect(heading(page)).toHaveText('Chapter 1: Facing Pages · Pages 2–3 of 6');
  expect(await page.evaluate(() => (window as unknown as { kbStill?: boolean }).kbStill)).toBe(true);
  await expect(page).toHaveURL(new RegExp(`${BOOK}/1/3$`));
});

test('comic-reader-spread-and-flip#AC-3 enlarged text is narrow', async ({ page }) => {
  // A 1280 × 800 laptop zoomed to 200% is 640 × 400 CSS pixels; at 400%, 320 × 200.
  for (const size of [{ width: 640, height: 400 }, { width: 320, height: 200 }]) {
    await page.setViewportSize(size);
    await page.goto(`${BOOK}/1/5`);
    expect(await shown(page)).toEqual(['The whole valley below.']);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test('comic-reader-spread-and-flip#AC-4 AC-5 a link opens its pair', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await page.goto(`${BOOK}/1/3`);
  await expect(page).toHaveURL(new RegExp(`${BOOK}/1/3$`));
  expect(await shown(page)).toEqual(['A hall of mirrors.', 'The fox sees itself.']);
  expect((await box(page, 'A hall of mirrors.')).x).toBeLessThan((await box(page, 'The fox sees itself.')).x);
  await expect(page.locator('[data-announce]')).toHaveText(
    'Chapter 1: Facing Pages, pages 2 and 3 of 6. A hall of mirrors. The fox sees itself.',
    { timeout: 5000 },
  );
});

test('comic-reader-spread-and-flip#AC-4 AC-6 turning by pairs', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await page.goto(`${BOOK}/1/1`);
  expect(await shown(page)).toEqual(['A door opens.']);
  const steps: [string, string][] = [
    ['Next pages', '1/2'],
    ['Next page', '1/4'],
    ['Next page', '1/5'],
    ['Next page', '1/6'],
    ['Next pages', '2/1'],
  ];
  for (const [name, to] of steps) {
    await nav(page).getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${BOOK}/${to}$`));
  }
  await expect(heading(page)).toHaveText('Chapter 2: Left First · Pages 1–2 of 4');
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(new RegExp(`${BOOK}/1/6$`));
  await page.goto(`${BOOK}/1/5`);
  await expect(heading(page)).toHaveText('Chapter 1: Facing Pages · Page 5 of 6 · two-page spread');
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(new RegExp(`${BOOK}/1/4$`));
  await expect(nav(page).getByRole('link', { name: 'Previous pages', exact: true })).toHaveAttribute('href', `${BOOK}/1/2`);
  // The edge arrows follow the wide links too.
  await expect(page.locator('.reader__edge--next').filter({ visible: true })).toHaveAttribute('href', `${BOOK}/1/5`);
});

test('comic-reader-spread-and-flip#AC-4 AC-7 the newest page in a pair', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await page.goto(`${BOOK}/2/3`);
  expect(await shown(page)).toEqual(['The road.', 'A bridge.']);
  await expect(nav(page).getByRole('link', { name: 'Next page', exact: true })).toHaveAttribute('aria-disabled', 'true');
  await expect(nav(page).getByRole('link', { name: 'Newest page of the series' })).toHaveAttribute('aria-disabled', 'true');
  await expect(page.getByText("You're all caught up!")).toBeVisible();
  const back = page.locator('.reader__end a', { hasText: 'Back to series' });
  await expect(back).toBeVisible();
  expect(await back.evaluate((a) => a.getBoundingClientRect().bottom <= window.innerHeight)).toBe(true);

  await page.setViewportSize(PHONE);
  await page.goto(`${BOOK}/2/3`);
  await expect(nav(page).getByRole('link', { name: 'Next page', exact: true })).toHaveAttribute('href', `${BOOK}/2/4`);
  await expect(page.getByText("You're all caught up!")).toBeHidden();
});

test('comic-reader-spread-and-flip#AC-4 no script', async ({ browser }) => {
  for (const [viewport, next] of [[LAPTOP, '1/4'], [PHONE, '1/3']] as const) {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport });
    const page = await context.newPage();
    await page.goto(`${BOOK}/1/2`);
    await expect(nav(page).getByRole('link', { name: /^Next page/ })).toHaveAttribute('href', `${BOOK}/${next}`);
    await nav(page).getByRole('link', { name: /^Next page/ }).click();
    await expect(page).toHaveURL(new RegExp(`${BOOK}/${next}$`));
    await context.close();
  }
});

test('comic-reader-spread-and-flip#AC-7 pair layout', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await page.goto(`${BOOK}/1/2`);
  const left = await box(page, 'A hall of mirrors.');
  const right = await box(page, 'The fox sees itself.');
  expect(Math.abs(left.height - right.height)).toBeLessThanOrEqual(1);
  expect(Math.abs(left.y - right.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(left.x + left.width - right.x)).toBeLessThanOrEqual(1);
  expect(await page.locator('.reader__book').getAttribute('data-kind')).toBe('pair');
  const serious = (await new AxeBuilder({ page }).analyze()).violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);

  // A page alone sits on its own side of the spine.
  await page.goto(`${BOOK}/1/1`);
  const book = (await page.locator('.reader__book').boundingBox())!;
  expect((await box(page, 'A door opens.')).x).toBeGreaterThanOrEqual(book.x + book.width / 2 - 1);
  await page.goto(`${BOOK}/1/4`);
  const alone = await box(page, 'A window.');
  expect(alone.x + alone.width).toBeLessThanOrEqual(book.x + book.width / 2 + 1);

  // A spread covers both sides.
  await page.goto(`${BOOK}/1/5`);
  const spread = await box(page, 'The whole valley below.');
  expect(spread.width).toBeGreaterThan(spread.height);
  expect(spread.x).toBeLessThan(book.x + book.width / 2);
  expect(spread.x + spread.width).toBeGreaterThan(book.x + book.width / 2);
});

test('comic-reader-spread-and-flip#AC-8 a spread on a phone', async ({ browser }) => {
  const upright = await browser.newContext({ viewport: PHONE, isMobile: true, hasTouch: true });
  let page = await upright.newPage();
  await page.goto(`${BOOK}/1/5`);
  const spread = await box(page, 'The whole valley below.');
  expect(spread.width).toBeLessThanOrEqual(PHONE.width);
  const hint = page.getByText('Turn your phone sideways to see it bigger.');
  await expect(hint).toBeVisible();
  expect(await hint.evaluate((el) => el.closest('[aria-hidden="true"]') !== null)).toBe(true);
  await page.goto(`${BOOK}/1/4`);
  await expect(page.getByText('Turn your phone sideways to see it bigger.')).toBeHidden();
  await upright.close();

  const sideways = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
  page = await sideways.newPage();
  await page.goto(`${BOOK}/1/5`);
  await expect(page.getByText('Turn your phone sideways to see it bigger.')).toBeHidden();
  // As wide as the reader's content, inside the site's side margins.
  const content = await page.locator('.reader__book').evaluate((el) => el.clientWidth);
  expect((await box(page, 'The whole valley below.')).width).toBeGreaterThanOrEqual(content - 1);
  expect(await shown(page)).toEqual(['The whole valley below.']);
  await sideways.close();
});

test('comic-reader-spread-and-flip#AC-9 a spread on the sheet', async ({ page }) => {
  for (const viewport of [LAPTOP, PHONE]) {
    await page.setViewportSize(viewport);
    await page.goto(`${BOOK}/1/pages`);
    const spread = page.getByRole('link', { name: 'Page 5, two-page spread: The whole valley below.' });
    await expect(spread).toBeVisible();
    const wide = (await spread.boundingBox())!;
    const other = (await page.getByRole('link', { name: 'Page 4: A window.' }).boundingBox())!;
    expect(wide.width).toBeGreaterThan(other.width * 1.8);
    await expect(page.getByText('5 · spread', { exact: true })).toBeVisible();
  }
});

test('comic-reader-spread-and-flip#AC-11 the page-flip', async ({ page }) => {
  await recordFlips(page);
  await page.setViewportSize(LAPTOP);
  await page.goto(`${BOOK}/1/1`);
  expect(await lastFlip(page)).toBe('none');

  await nav(page).getByRole('link', { name: 'Next pages' }).click();
  await expect(page).toHaveURL(new RegExp(`${BOOK}/1/2$`));
  await expect.poll(() => lastFlip(page)).toBe('forward');
  const ms = await lastFlipMs(page);
  expect(ms).toBeGreaterThanOrEqual(300);
  expect(ms).toBeLessThanOrEqual(500);

  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(new RegExp(`${BOOK}/1/4$`));
  await expect.poll(() => lastFlip(page)).toBe('forward');

  await nav(page).getByRole('link', { name: 'Previous pages' }).click();
  await expect(page).toHaveURL(new RegExp(`${BOOK}/1/2$`));
  await expect.poll(() => lastFlip(page)).toBe('back');
  // Focus and announcements are as without it.
  await expect(nav(page).getByRole('link', { name: 'Previous page', exact: true })).toBeFocused();

  // First, Newest and other links don't flip.
  await nav(page).getByRole('link', { name: 'Newest page of the series' }).click();
  await expect(page).toHaveURL(new RegExp(`${BOOK}/2/4$`));
  await expect.poll(() => lastFlip(page)).toBe('none');

  // A narrow screen turns a single page.
  await page.setViewportSize(PHONE);
  await page.goto(`${BOOK}/1/1`);
  await nav(page).getByRole('link', { name: 'Next page', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${BOOK}/1/2$`));
  await expect.poll(() => lastFlip(page)).toBe('forward');
});

test('comic-reader-spread-and-flip#AC-11 no flip under reduced motion', async ({ page }) => {
  await recordFlips(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize(LAPTOP);
  await page.goto(`${BOOK}/1/1`);
  await nav(page).getByRole('link', { name: 'Next pages' }).click();
  await expect(page).toHaveURL(new RegExp(`${BOOK}/1/2$`));
  await expect.poll(() => lastFlip(page)).toBe('none');
});
