// The typewriter under the story's sheet, against the fixture stories (The Long Road, chapter 3; The Kettle's
// Song, a one-shot; Night Market, a ticked one-shot). Criteria: docs/specs/story-typewriter.md.
import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const CHAPTER = '/writing/the-long-road/3';
const ONE_SHOT = '/writing/the-kettles-song';
const TICKED = '/writing/night-market';
const LAPTOP = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };

/** The fixture chapters are a few lines long: add forty paragraphs before the typewriter, so the page scrolls
 * as a real chapter does. */
const lengthen = (page: Page) =>
  page.evaluate(() => {
    const text = document.querySelector('.story-text')!;
    const typewriter = text.querySelector('.story-typewriter')!;
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('p');
      p.textContent = 'The road bent west and the rain came with it, steady and grey, filling the ruts until the cart wheels hissed.';
      text.insertBefore(p, typewriter);
    }
  });

const boxes = (page: Page) =>
  page.evaluate(() => {
    const sheet = document.querySelector<HTMLElement>('.story-text')!;
    const typewriter = document.querySelector<HTMLElement>('.story-typewriter')!;
    const s = sheet.getBoundingClientRect();
    const t = typewriter.getBoundingClientRect();
    const nav = document.querySelector('.chapter-nav--end')?.getBoundingClientRect();
    return {
      sheet: { left: s.left, width: s.width, bottom: s.bottom },
      typewriter: { left: t.left, width: t.width, height: t.height, top: t.top, bottom: t.bottom },
      navTop: nav?.top ?? null,
      lastBlockBottom: (typewriter.previousElementSibling as HTMLElement).getBoundingClientRect().bottom,
      sheetPadding: { top: getComputedStyle(sheet).paddingTop, bottom: getComputedStyle(sheet).paddingBottom },
      typewriterMarginTop: getComputedStyle(typewriter).marginTop,
      screen: innerHeight,
      scrolls: document.documentElement.scrollWidth > innerWidth,
      scrollPadding: getComputedStyle(document.documentElement).scrollPaddingBottom,
    };
  });

test('story-typewriter#AC-1 where it is', async ({ page }) => {
  for (const path of [CHAPTER, ONE_SHOT]) {
    await page.goto(path);
    await expect(page.locator('.story-text > .story-typewriter:last-child'), path).toHaveCount(1);
  }
  for (const path of ['/', '/writing', '/writing/the-long-road', '/comics']) {
    await page.goto(path);
    await expect(page.locator('.story-typewriter'), path).toHaveCount(0);
  }
});

test('story-typewriter#AC-2 drawing only', async ({ page }) => {
  await page.goto(CHAPTER);
  const typewriter = page.locator('.story-typewriter');
  await expect(typewriter).toHaveAttribute('aria-hidden', 'true');
  expect(await typewriter.evaluate((e) => getComputedStyle(e).pointerEvents)).toBe('none');
  expect(await typewriter.locator('a, button, input, [tabindex]').count()).toBe(0);
  const tree = await page.locator('.story-text').ariaSnapshot();
  expect(tree).not.toMatch(/KETTLEBIRD/i);
});

test('story-typewriter#AC-3 AC-4 size', async ({ page }) => {
  const heights: Record<number, number> = { 320: 47, 390: 58, 700: 109, 1280: 146 };
  for (const width of [320, 390, 640, 700, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(CHAPTER);
    const b = await boxes(page);
    expect(Math.abs(b.typewriter.width - b.sheet.width / 0.8), `${width} width`).toBeLessThanOrEqual(1);
    const centre = (box: { left: number; width: number }) => box.left + box.width / 2;
    expect(Math.abs(centre(b.typewriter) - centre(b.sheet)), `${width} centred`).toBeLessThanOrEqual(1);
    expect(Math.abs(b.typewriter.height - b.typewriter.width * 0.13), `${width} proportions`).toBeLessThanOrEqual(1);
    if (heights[width]) expect(Math.abs(b.typewriter.height - heights[width]), `${width} height`).toBeLessThanOrEqual(2);
    expect(b.scrolls, `${width} scrolls`).toBe(false);
  }
});

test('story-typewriter#AC-5 follows the reader', async ({ page }) => {
  for (const viewport of [PHONE, LAPTOP]) {
    await page.setViewportSize(viewport);
    await page.goto(CHAPTER);
    await lengthen(page);
    await page.evaluate(() => {
      const t = document.querySelector<HTMLElement>('.story-text')!;
      window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY + t.offsetHeight / 2 - innerHeight / 2);
    });
    const b = await boxes(page);
    expect(Math.abs(b.typewriter.bottom - b.screen), `${viewport.width}`).toBeLessThanOrEqual(1);
    expect(b.sheet.bottom, `${viewport.width}: the sheet runs on under the screen`).toBeGreaterThan(b.screen);
  }
});

test('story-typewriter#AC-6 at the end', async ({ page }) => {
  for (const viewport of [PHONE, LAPTOP]) {
    await page.setViewportSize(viewport);
    await page.goto(CHAPTER);
    await lengthen(page);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const b = await boxes(page);
    expect(Math.abs(b.typewriter.bottom - b.sheet.bottom), `${viewport.width}: rests at the sheet's end`).toBeLessThanOrEqual(1);
    expect(b.typewriter.bottom, `${viewport.width}: no longer at the screen's bottom`).toBeLessThan(b.screen - 1);
    expect(b.sheetPadding.bottom).toBe('0px');
    expect(b.typewriterMarginTop).toBe(b.sheetPadding.top);
    expect(b.typewriter.top, `${viewport.width}: under the last line`).toBeGreaterThanOrEqual(b.lastBlockBottom);
    expect(b.navTop, `${viewport.width}: the chapter buttons below`).not.toBeNull();
    expect(b.navTop!, `${viewport.width}: the chapter buttons below`).toBeGreaterThanOrEqual(b.typewriter.bottom);
  }
});

test('story-typewriter#AC-7 keyboard paging', async ({ page }) => {
  for (const viewport of [PHONE, LAPTOP]) {
    await page.setViewportSize(viewport);
    await page.goto(CHAPTER);
    await expect.poll(async () => {
      const b = await boxes(page);
      return Math.abs(parseFloat(b.scrollPadding) - b.typewriter.height);
    }, `${viewport.width}`).toBeLessThanOrEqual(1);
  }
});

test('story-typewriter#AC-8 a ticked story', async ({ page, browser }) => {
  await page.goto(TICKED);
  await expect(page.locator('.story-typewriter')).toBeHidden();
  await page.getByRole('button', { name: 'Continue to the story' }).click();
  await expect(page.locator('.story-typewriter')).toBeVisible();

  const context = await browser.newContext({ javaScriptEnabled: false });
  const noScript = await context.newPage();
  await noScript.goto(TICKED);
  await expect(noScript.locator('.story-typewriter')).toBeVisible();
  await context.close();
});

test('story-typewriter#AC-9 printing', async ({ page }) => {
  await page.goto(CHAPTER);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.story-typewriter')).toBeHidden();
});

test('story-typewriter#AC-11 accessibility', async ({ page }) => {
  for (const viewport of [PHONE, LAPTOP]) {
    await page.setViewportSize(viewport);
    for (const path of [CHAPTER, ONE_SHOT]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id), `${path} ${viewport.width}`).toEqual([]);
    }
  }
});
