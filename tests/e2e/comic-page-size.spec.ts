// End-to-end tests for how a comic's pages fit on a computer, and the fan's Page size, against the fixture comics
// (tests/fixtures/comics.ts): Single Sheets (Fit the screen, 800 × 1200 pages, a 1600 × 1200 spread at page 3,
// panels), Open Book (pairs), Big Pages (Fit the width, pictures 600, 1200, a 2400 spread and 4000 wide) and Set
// Width (Fit the height, Largest page width 1200, 800 × 1200 pages). The desktop project is a computer (a mouse).
// Criteria: docs/specs/comic-reader-page-size.md.
import { expect, test, type Browser, type Locator, type Page } from '@playwright/test';

const KEY = 'kb-page-size';
const MARGINS = 48; // The page's side padding and the reader's, either side: a page fits the window less these.
type Size = 'screen' | 'width' | 'height';

const sizeButton = (page: Page) => page.getByRole('button', { name: /^Page size/ });
const menu = (page: Page) => page.getByRole('menu', { name: 'Page size on this computer' });
const item = (page: Page, name: string | RegExp) => menu(page).getByRole('menuitemradio', { name });
const current = (page: Page) => page.locator('.reader__page.is-current:visible').first();
const bar = (page: Page) => page.locator('.reader__bar');
/** The reader's top: a page opens with it at the window's top (the bar sits inside its padding). */
const readerTop = async (page: Page) => (await box(page.locator('.reader'))).y;
const nav = (page: Page) => page.getByRole('navigation', { name: 'Page navigation' });
const announced = (page: Page) => page.locator('[data-announce]');

async function box(l: Locator) {
  const b = await l.boundingBox();
  if (!b) throw new Error('not shown');
  return b;
}
const near = (a: number, b: number, by = 1) => expect(Math.abs(a - b), `${a} ≈ ${b}`).toBeLessThanOrEqual(by);
const clientWidth = (page: Page) => page.evaluate(() => document.documentElement.clientWidth);
const sideways = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

/** A fan's stored choice, set before the page loads (AC-16 to AC-19 choose it in the menu instead). */
async function choose(page: Page, size: Size) {
  await page.addInitScript(([k, v]) => localStorage.setItem(k, v), [KEY, size] as const);
}

async function open(page: Page, path: string, viewport = { width: 1440, height: 900 }) {
  await page.setViewportSize(viewport);
  await page.goto(path);
  await expect(current(page)).toBeVisible();
  // Wait for the page's picture to lay out at its size.
  await page.evaluate(() => document.fonts.ready);
}

test('comic-reader-page-size#AC-8 fit the width', async ({ page }) => {
  // Big Pages: each page up to its own picture's width, at most 3200, narrowed to the window.
  await open(page, '/comics/big-pages/1/1');
  let b = await box(current(page));
  near(b.width, 600);
  near(b.height, 900);
  await open(page, '/comics/big-pages/1/2');
  b = await box(current(page));
  near(b.width, 1200);
  near(b.height, 1800);
  await open(page, '/comics/big-pages/1/4');
  b = await box(current(page));
  near(b.width, (await clientWidth(page)) - MARGINS);
  expect(await sideways(page)).toBe(false);

  // Set Width, read at Fit the width: Largest page width 1200 enlarges its 800-pixel pictures.
  await choose(page, 'width');
  await open(page, '/comics/set-width/1/1');
  b = await box(current(page));
  near(b.width, 1200);
  near(b.height, 1800);

  // Single Sheets, read at Fit the width: 800 wide, narrowed to the window, and no wider on a big monitor.
  for (const [width, height] of [[1440, 900], [800, 700], [699, 700], [576, 360], [2560, 1440]] as const) {
    await open(page, '/comics/single-sheets/1/1', { width, height });
    b = await box(current(page));
    near(b.width, Math.min(800, (await clientWidth(page)) - MARGINS));
    near(b.height, b.width * 1.5);
    expect(await sideways(page), `${width} × ${height}`).toBe(false);
  }
});

test('comic-reader-page-size#AC-9 fit the height', async ({ page }) => {
  await open(page, '/comics/set-width/1/1');
  const b = await box(current(page));
  near(b.width, 600);
  near(b.height, 900);
  // Opened at the bar, as now: the page's bottom is a bar's height below the window.
  near(await readerTop(page), 0, 1);
  const below = b.y + b.height - 900;
  expect(below).toBeGreaterThanOrEqual(60);
  expect(below).toBeLessThanOrEqual(76);
  expect(await sideways(page)).toBe(false);

  await open(page, '/comics/set-width/1/1', { width: 576, height: 360 });
  const small = await box(current(page));
  near(small.width, 240);
  near(small.height, 360);
  expect(await sideways(page)).toBe(false);
});

test('comic-reader-page-size#AC-10 fit the screen', async ({ page }) => {
  // Today's reader: a page fitted to the window with the bar and controls.
  await open(page, '/comics/single-sheets/1/1');
  const today = await box(current(page));
  near(today.height, 900 - 200, 2);
  // Largest page width has no effect: Set Width read at Fit the screen is the same size.
  await choose(page, 'screen');
  await open(page, '/comics/set-width/1/1');
  const set = await box(current(page));
  near(set.width, today.width);
  near(set.height, today.height);
});

test('comic-reader-page-size#AC-11 pairs', async ({ page }) => {
  await choose(page, 'width');
  await open(page, '/comics/open-book/1/2');
  let pages = page.locator('.reader__book .reader__page:visible');
  await expect(pages).toHaveCount(2);
  let [left, right] = [await box(pages.nth(0)), await box(pages.nth(1))];
  const half = ((await clientWidth(page)) - MARGINS) / 2;
  near(left.width, half);
  near(right.width, half);
  near(left.x + left.width, right.x);
  // The spread across both: its picture's 1600, narrowed to the reader.
  await open(page, '/comics/open-book/1/5');
  near((await box(current(page))).width, (await clientWidth(page)) - MARGINS);
  // One page at a time in a narrow window, as now, at the size.
  await open(page, '/comics/open-book/1/2', { width: 800, height: 700 });
  near((await box(current(page))).width, (await clientWidth(page)) - MARGINS);

  const tall = await page.context().newPage();
  await choose(tall, 'height');
  await open(tall, '/comics/open-book/1/2');
  pages = tall.locator('.reader__book .reader__page:visible');
  [left, right] = [await box(pages.nth(0)), await box(pages.nth(1))];
  for (const b of [left, right]) {
    near(b.width, 600);
    near(b.height, 900);
  }
  near(left.x + left.width, right.x);
  await tall.close();
});

test('comic-reader-page-size#AC-12 a spread alone', async ({ page }) => {
  for (const size of ['width', 'height'] as const) {
    const p = await page.context().newPage();
    await choose(p, size);
    await open(p, '/comics/single-sheets/1/1');
    const barWidth = (await box(bar(p))).width;
    await open(p, '/comics/single-sheets/1/3');
    const s = await box(current(p));
    const cw = await clientWidth(p);
    // Fit the width: its 1600, within the window less 2rem. Fit the height: 900 tall, so 1200 wide.
    near(s.width, size === 'width' ? Math.min(1600, cw - 32) : 1200);
    near(s.x + s.width / 2, cw / 2);
    expect(await sideways(p)).toBe(false);
    near((await box(bar(p))).width, barWidth);
    await p.close();
  }
  // Big Pages' 2400 spread, at the comic's Fit the width (the tabs above share this browser's storage).
  await page.addInitScript(([k]) => localStorage.removeItem(k), [KEY] as const);
  await open(page, '/comics/big-pages/1/3');
  const s = await box(current(page));
  near(s.width, (await clientWidth(page)) - 32);
  expect(await sideways(page)).toBe(false);
});

test('comic-reader-page-size#AC-13 the column', async ({ page }) => {
  const places: number[][] = [];
  for (const n of [1, 2, 3, 4]) {
    await open(page, `/comics/big-pages/1/${n}`);
    const b = await box(bar(page));
    const back = await box(page.getByRole('link', { name: 'Back to series' }).first());
    const size = await box(sizeButton(page));
    places.push([Math.round(b.x), Math.round(b.width), Math.round(back.x), Math.round(size.x)]);
    if (n !== 3) {
      const p = await box(current(page));
      near(p.x + p.width / 2, b.x + b.width / 2);
    }
  }
  for (const p of places.slice(1)) for (const [i, v] of p.entries()) near(v, places[0]![i]!);
  // Never under 600: Set Width at Fit the height in a short window, its page 400 wide.
  await open(page, '/comics/set-width/1/1', { width: 1440, height: 600 });
  expect((await box(bar(page))).width).toBeGreaterThanOrEqual(600);
});

async function touchPage(browser: Browser, width: number, height: number) {
  const context = await browser.newContext({ viewport: { width, height }, hasTouch: true, isMobile: true });
  const p = await context.newPage();
  await p.addInitScript(([k]) => localStorage.setItem(k, 'width'), [KEY] as const);
  return p;
}

test('comic-reader-page-size#AC-14 touch screens', async ({ browser }) => {
  for (const [width, height] of [[1024, 768], [1366, 1024], [393, 659]] as const) {
    const p = await touchPage(browser, width, height);
    for (const path of ['/comics/big-pages/1/2', '/comics/set-width/1/1']) {
      await p.goto(path);
      await expect(current(p)).toBeVisible();
      await expect(sizeButton(p)).toBeHidden();
      // Fitted to the screen, as now.
      expect((await box(current(p))).height, `${path} at ${width}`).toBeLessThanOrEqual(height);
    }
    await p.context().close();
  }
});

test('comic-reader-page-size#AC-15 the button', async ({ page, browser }) => {
  await open(page, '/comics/single-sheets/1/1');
  const button = sizeButton(page);
  await expect(button).toHaveAccessibleName('Page size');
  await expect(button).toHaveAttribute('aria-haspopup', 'menu');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  const b = await box(button);
  near(b.width, 44);
  near(b.height, 44);
  const panels = await box(page.getByRole('button', { name: 'Panel by panel' }));
  expect(b.x).toBeLessThan(panels.x);
  expect(await button.locator('svg').getAttribute('aria-hidden')).toBe('true');
  expect((await button.innerText()).trim()).toBe('');

  // Its name under it on hover and on keyboard focus, right-aligned, inside the window.
  const tip = button.locator('.reader__size-tip');
  await expect(tip).toBeHidden();
  await button.hover();
  await expect(tip).toBeVisible();
  await expect(tip).toHaveText('Page size');
  let t = await box(tip);
  expect(t.y).toBeGreaterThan(b.y + b.height);
  near(t.x + t.width, b.x + b.width, 3);
  expect(t.x + t.width).toBeLessThanOrEqual(await clientWidth(page));
  await page.mouse.move(0, 0);
  await expect(tip).toBeHidden();
  await button.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(tip).toBeVisible();
  t = await box(tip);
  expect(t.x + t.width).toBeLessThanOrEqual(await clientWidth(page));

  // The bar stays on one line from 700 px wide, in each size.
  for (const size of ['screen', 'width', 'height'] as const) {
    const p = await page.context().newPage();
    await choose(p, size);
    for (const width of [700, 1000, 1440]) {
      await open(p, '/comics/single-sheets/1/1', { width, height: 900 });
      expect((await box(bar(p))).height, `${size} at ${width}`).toBeLessThanOrEqual(60);
    }
    await p.close();
  }

  // Without script it isn't shown.
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const bare = await context.newPage();
  await bare.goto('/comics/single-sheets/1/1');
  await expect(sizeButton(bare)).toBeHidden();
  await context.close();
});

test('comic-reader-page-size#AC-16 the menu', async ({ page }) => {
  await open(page, '/comics/big-pages/1/1');
  await sizeButton(page).click();
  await expect(sizeButton(page)).toHaveAttribute('aria-expanded', 'true');
  await expect(menu(page)).toBeVisible();
  const items = menu(page).getByRole('menuitemradio');
  await expect(items).toHaveCount(4);
  await expect(items.nth(0)).toHaveAccessibleName(/^Comic's choice: Fit the width/);
  await expect(items.nth(0)).toContainText("Follows this comic's setting");
  await expect(items.nth(1)).toHaveAccessibleName(/^Fit the screen/);
  await expect(items.nth(1)).toContainText('The whole page and the buttons at once. For every comic');
  await expect(items.nth(2)).toHaveAccessibleName(/^Fit the width/);
  await expect(items.nth(2)).toContainText("As wide as the page's picture, or the window if narrower. For every comic");
  await expect(items.nth(3)).toHaveAccessibleName(/^Fit the height/);
  await expect(items.nth(3)).toContainText('As tall as the window. For every comic');
  await expect(items.nth(0)).toHaveAttribute('aria-checked', 'true');
  for (const n of [1, 2, 3]) await expect(items.nth(n)).toHaveAttribute('aria-checked', 'false');
  await expect(menu(page)).toContainText('Kept on this computer.');
  // A comic that fits the screen names it.
  await open(page, '/comics/single-sheets/1/1');
  await sizeButton(page).click();
  await expect(menu(page).getByRole('menuitemradio').nth(0)).toHaveAccessibleName(/^Comic's choice: Fit the screen/);
});

test('comic-reader-page-size#AC-17 the keyboard', async ({ page }) => {
  await open(page, '/comics/single-sheets/1/2');
  const width = (await box(current(page))).width;
  for (const key of ['Enter', ' ', 'ArrowDown']) {
    await sizeButton(page).focus();
    await page.keyboard.press(key);
    await expect(menu(page), key).toBeVisible();
    await expect(item(page, /^Comic's choice/)).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu(page)).toBeHidden();
    await expect(sizeButton(page)).toBeFocused();
  }
  // Up and Down move focus without choosing; Left and Right don't turn the page while it's open.
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await expect(item(page, /^Fit the screen/)).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(item(page, /^Fit the width/)).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(item(page, /^Fit the screen/)).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(/\/single-sheets\/1\/2$/);
  near((await box(current(page))).width, width);
  await expect(item(page, /^Comic's choice/)).toHaveAttribute('aria-checked', 'true');
  // Tab closes it too.
  await page.keyboard.press('Tab');
  await expect(menu(page)).toBeHidden();
  // Enter and Space choose.
  await sizeButton(page).focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(menu(page)).toBeHidden();
  await expect(sizeButton(page)).toBeFocused();
  near((await box(current(page))).width, 800);
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press(' ');
  await expect(menu(page)).toBeHidden();
  await expect(sizeButton(page)).toHaveAccessibleName('Page size: Fit the screen, your choice');
  // A click outside closes it.
  await sizeButton(page).click();
  await expect(menu(page)).toBeVisible();
  await page.mouse.click(5, 450);
  await expect(menu(page)).toBeHidden();
});

test('comic-reader-page-size#AC-18 choosing', async ({ page }) => {
  await open(page, '/comics/single-sheets/1/2');
  await page.evaluate(() => window.scrollTo(0, 0));
  await sizeButton(page).click();
  await item(page, /^Fit the height/).click();
  await expect(menu(page)).toBeHidden();
  await expect(sizeButton(page)).toBeFocused();
  await expect(page).toHaveURL(/\/single-sheets\/1\/2$/);
  const b = await box(current(page));
  near(b.width, 600);
  near(b.height, 900);
  near(await readerTop(page), 0, 1);
  await expect(announced(page)).toHaveText('Page size: Fit the height.');
});

test('comic-reader-page-size#AC-19 kept', async ({ page, browser }) => {
  await open(page, '/comics/single-sheets/1/1');
  await sizeButton(page).click();
  await item(page, /^Fit the width/).click();
  // Kept after a reload and for every comic, set before the page first shows.
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const p = document.querySelector('.reader__page.is-current');
      (window as unknown as { kbFirst: number }).kbFirst = p ? p.getBoundingClientRect().width : -1;
    });
  });
  await page.reload();
  near((await box(current(page))).width, 800);
  near(await page.evaluate(() => (window as unknown as { kbFirst: number }).kbFirst), 800);
  await open(page, '/comics/set-width/1/1');
  near((await box(current(page))).width, 1200);
  await expect(sizeButton(page)).toHaveAccessibleName('Page size: Fit the width, your choice');
  const dot = await sizeButton(page).evaluate((el) => getComputedStyle(el, '::after').content);
  expect(dot).not.toBe('none');
  // Comic's choice clears it.
  await sizeButton(page).click();
  await item(page, /^Comic's choice/).click();
  await expect(sizeButton(page)).toHaveAccessibleName('Page size');
  expect(await sizeButton(page).evaluate((el) => getComputedStyle(el, '::after').content)).toBe('none');
  expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBeNull();
  near((await box(current(page))).width, 600);

  // With storage blocked, a choice applies to the page in view only.
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const blocked = await context.newPage();
  await blocked.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
  });
  const errors: string[] = [];
  blocked.on('pageerror', (e) => errors.push(e.message));
  await open(blocked, '/comics/single-sheets/1/1');
  await sizeButton(blocked).click();
  await item(blocked, /^Fit the width/).click();
  near((await box(current(blocked))).width, 800);
  await nav(blocked).getByRole('link', { name: /^Next/ }).click();
  await expect(blocked).toHaveURL(/\/single-sheets\/1\/2$/);
  near((await box(current(blocked))).height, 700, 2);
  expect(errors).toEqual([]);
  await context.close();
});

test('comic-reader-page-size#AC-20 panel by panel', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('kb-panels', '1'));
  await open(page, '/comics/single-sheets/1/1');
  const frame = await box(current(page));
  await page.evaluate(() => window.scrollTo(0, 0));
  const scrolled = await page.evaluate(() => window.scrollY);
  await sizeButton(page).click();
  await expect(menu(page)).toContainText("Panel by panel always fits the screen. Your choice applies when it's off.");
  await expect(menu(page)).not.toContainText('Kept on this computer.');
  await item(page, /^Fit the height/).click();
  await expect(announced(page)).toHaveText('Page size: Fit the height. Applies when Panel by panel is off.');
  expect(await page.evaluate(() => window.scrollY)).toBe(scrolled);
  const still = await box(current(page));
  near(still.width, frame.width);
  near(still.height, frame.height);
  await page.getByRole('button', { name: 'Panel by panel' }).click();
  const b = await box(current(page));
  near(b.width, 600);
  near(b.height, 900);
});

test('comic-reader-page-size#AC-21 turning and waiting', async ({ page }) => {
  for (const size of ['width', 'height'] as const) {
    const p = await page.context().newPage();
    await choose(p, size);
    await open(p, '/comics/single-sheets/1/1');
    // Each page opens at the bar, by Next, by Previous and by the arrow keys.
    await nav(p).getByRole('link', { name: /^Next/ }).click();
    await expect(p).toHaveURL(/\/1\/2$/);
    near(await readerTop(p), 0, 1);
    await nav(p).getByRole('link', { name: /^Previous/ }).click();
    await expect(p).toHaveURL(/\/1\/1$/);
    near(await readerTop(p), 0, 1);
    await p.keyboard.press('ArrowRight');
    await expect(p).toHaveURL(/\/1\/2$/);
    near(await readerTop(p), 0, 1);
    // After a keyboard turn, focus is on the same control on the new page.
    await nav(p).getByRole('link', { name: /^Next/ }).focus();
    await p.keyboard.press('Enter');
    await expect(p).toHaveURL(/\/1\/3$/);
    await expect(nav(p).getByRole('link', { name: /^Next/ })).toBeFocused();
    near(await readerTop(p), 0, 1);
    await p.close();
  }

  // The edge arrow stays in the window on a tall page: Set Width at Fit the width, 1200 × 1800 in 1280 × 720.
  await choose(page, 'width');
  await open(page, '/comics/set-width/1/1', { width: 1280, height: 720 });
  const strip = await box(page.locator('.reader__edge--next:visible'));
  await page.mouse.move(strip.x + strip.width / 2, 360);
  const arrow = await box(page.locator('.reader__edge--next:visible .arrow-btn'));
  expect(arrow.y).toBeGreaterThanOrEqual(0);
  expect(arrow.y + arrow.height).toBeLessThanOrEqual(720);
  // "Loading page…" at the top of the page's space.
  const loading = await box(page.locator('.reader__page.is-current:visible .reader__loading'));
  const pageBox = await box(current(page));
  expect(loading.y - pageBox.y).toBeLessThan(100);
  // The phone's turn hint isn't shown, even in a tall window.
  await open(page, '/comics/set-width/1/1', { width: 800, height: 1000 });
  await expect(page.locator('.reader__turn-hint')).toBeHidden();
});
