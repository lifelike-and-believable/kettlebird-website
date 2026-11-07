// The white sheet behind the story text, against the fixture stories (The Long Road, chapter 3, with
// pictures; Night Market, a ticked one-shot). Criteria: docs/specs/story-text-frame.md.
import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const CHAPTER = '/writing/the-long-road/3';
const TICKED = '/writing/night-market';

/** The sheet's and the text's sizes, and today's column for comparison: the narrower of the page's
 * column and 65 characters at the text's size. */
const measure = (page: Page) =>
  page.evaluate(() => {
    const sheet = document.querySelector<HTMLElement>('.story-text')!;
    const cs = getComputedStyle(sheet);
    const box = sheet.getBoundingClientRect();
    const probe = document.createElement('div');
    probe.style.cssText = `width: 65ch; font-size: ${cs.fontSize}; font-family: ${cs.fontFamily}; position: absolute; visibility: hidden;`;
    sheet.parentElement!.append(probe);
    const measureWidth = probe.getBoundingClientRect().width;
    probe.remove();
    const parent = sheet.parentElement!;
    const pcs = getComputedStyle(parent);
    const column = parent.clientWidth - parseFloat(pcs.paddingLeft) - parseFloat(pcs.paddingRight);
    return {
      text: box.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight),
      expected: Math.min(column, measureWidth),
      left: box.left,
      right: innerWidth - box.right,
      scrolls: document.documentElement.scrollWidth > innerWidth,
      padding: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map(parseFloat),
      background: cs.backgroundColor,
      shadow: cs.boxShadow,
      border: cs.borderTopStyle,
      sizing: cs.boxSizing,
      firstMargin: getComputedStyle(sheet.firstElementChild!).marginTop,
      lastMargin: getComputedStyle(sheet.lastElementChild!).marginBottom,
    };
  });

test('story-text-frame#AC-1 the sheet', async ({ page }) => {
  for (const path of [CHAPTER, '/writing/the-kettles-song']) {
    await page.goto(path);
    const m = await measure(page);
    expect(m.background, path).toBe('rgb(255, 255, 255)');
    expect(m.shadow, path).not.toBe('none');
    expect(m.border, path).toBe('none');
    expect(m.sizing, path).toBe('content-box');
  }
  // Nothing else on the writing pages is on white.
  await page.goto(CHAPTER);
  for (const selector of ['.chapter__top', 'nav']) {
    const bg = await page.locator(selector).first().evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(bg, selector).not.toBe('rgb(255, 255, 255)');
  }
  await page.goto('/writing/the-long-road');
  await expect(page.locator('.story-text')).toHaveCount(0);
});

test('story-text-frame#AC-2 AC-3 the text keeps its width, and the sheet stays on the screen', async ({ page }) => {
  for (const width of [320, 390, 700, 864, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(CHAPTER);
    const m = await measure(page);
    expect(Math.abs(m.text - m.expected), `${width}: text ${m.text}, expected ${m.expected}`).toBeLessThanOrEqual(1);
    expect(m.left, `${width} left`).toBeGreaterThanOrEqual(16);
    expect(m.right, `${width} right`).toBeGreaterThanOrEqual(16);
    expect(m.scrolls, `${width} scrolls`).toBe(false);
  }
});

test('story-text-frame#AC-4 padding, and no extra space at the ends', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto(CHAPTER);
  let m = await measure(page);
  expect(m.padding).toEqual([24, 16, 24, 16]);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(CHAPTER);
  m = await measure(page);
  expect(m.padding).toEqual([38.4, 48, 38.4, 48]);
  expect(m.firstMargin).toBe('0px');
  expect(m.lastMargin).toBe('0px');
});

test('story-text-frame#AC-5 pictures on the sheet ask for the column', async ({ page }) => {
  await page.goto(CHAPTER);
  const sizes = await page.locator('.story-text img').first().getAttribute('sizes');
  expect(sizes).toMatch(/100vw - 4rem, 50rem\)$/);
});

test('story-text-frame#AC-6 a ticked story', async ({ page, browser }) => {
  await page.goto(TICKED);
  await expect(page.locator('.story-text')).toBeHidden();
  await page.getByRole('button', { name: 'Continue to the story' }).click();
  await expect(page.locator('.story-text')).toBeVisible();
  expect((await measure(page)).background).toBe('rgb(255, 255, 255)');

  const context = await browser.newContext({ javaScriptEnabled: false });
  const noScript = await context.newPage();
  await noScript.goto(TICKED);
  await expect(noScript.locator('.story-text')).toBeVisible();
  await context.close();
});

test('story-text-frame#AC-7 accessibility', async ({ page }) => {
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    for (const path of [CHAPTER, '/writing/the-kettles-song']) {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id), `${path} ${width}`).toEqual([]);
    }
  }
});
