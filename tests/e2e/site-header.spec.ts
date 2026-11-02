// End-to-end tests for the shorter site header, against the fixture build.
// Criteria: docs/specs/site-header.md.
import { expect, test, type Page } from '@playwright/test';

const PAGES = ['/', '/comics', '/portfolio', '/about', '/comics/kettle-tales'];
const box = (page: Page, selector: string) =>
  page.locator(selector).first().evaluate((e) => {
    const r = e.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height };
  });

test('site-header#AC-1 phone height', async ({ page }) => {
  for (const [width, height] of [[360, 740], [390, 844], [768, 1024]]) {
    await page.setViewportSize({ width, height });
    for (const path of PAGES) {
      await page.goto(path);
      const header = await box(page, '.site-header');
      expect(header.height, `${path} at ${width} px`).toBeLessThanOrEqual(130);
    }
  }
});

test('site-header#AC-2 laptop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  for (const path of PAGES) {
    await page.goto(path);
    const header = await box(page, '.site-header');
    expect(header.height, path).toBeLessThanOrEqual(245);
    expect(header.height, path).toBeGreaterThan(150);
  }
  await page.goto('/comics');
  const size = await page.locator('.site-title').evaluate((e) => getComputedStyle(e).fontSize);
  expect(size).toBe('88px');
  const subtitle = await box(page, '.site-subtitle');
  const link = await box(page, '.nav-btn');
  expect(link.top).toBeLessThan(subtitle.bottom);
  expect(link.bottom).toBeGreaterThan(subtitle.top);
  await expect(page.locator('.menu-toggle')).toBeHidden();
});

test('site-header#AC-3 phone layout', async ({ page }) => {
  for (const width of [360, 390, 768]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/comics');
    const title = await box(page, '.site-title');
    const subtitle = await box(page, '.site-subtitle');
    const button = await box(page, '.menu-toggle');
    expect(button.top, `${width}`).toBeLessThan(title.bottom);
    expect(button.left, `${width}`).toBeGreaterThan(title.right);
    expect(subtitle.top, `${width}`).toBeGreaterThanOrEqual(title.bottom - 1);
    expect(subtitle.left, `${width}`).toBeLessThan(title.left + 2);
    expect(Math.round(button.width)).toBe(44);
    expect(Math.round(button.height)).toBe(44);
    await expect(page.getByRole('link', { name: 'Kettlebird Creations — Home' })).toHaveAttribute('href', '/');
  }
});

test('site-header#AC-4 menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/comics');
  const toggle = page.getByRole('button', { name: 'Toggle menu' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#main-nav')).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#main-nav').getByRole('link', { name: 'COMICS' })).toBeVisible();
  const header = await box(page, '.site-header');
  const nav = await box(page, '#main-nav');
  expect(Math.abs(nav.top - header.bottom)).toBeLessThanOrEqual(1);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#main-nav')).toBeHidden();
});

test('site-header#AC-5 enlarged text', async ({ page }) => {
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 800 });
    for (const path of ['/', '/comics']) {
      await page.goto(path);
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      // Nothing in the header reaches past the screen, so the header never causes sideways scrolling.
      const furthest = await page.locator('.site-header').evaluate((header) =>
        Math.max(...[header, ...header.querySelectorAll('*')].filter((e) => e.getClientRects().length).map((e) => e.getBoundingClientRect().right)));
      expect(furthest, `${path} at ${width} px`).toBeLessThanOrEqual(width);
      const button = await box(page, '.menu-toggle');
      expect(button.left, `${path} at ${width} px`).toBeGreaterThanOrEqual(0);
      expect(button.right, `${path} at ${width} px`).toBeLessThanOrEqual(width);
    }
  }
});

test('site-header#AC-6 paper layer', async ({ page }) => {
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/comics');
    const style = await page.locator('.site-header').evaluate((e) => {
      const own = getComputedStyle(e);
      const layer = getComputedStyle(e, '::before');
      return {
        own: own.backgroundImage,
        image: layer.backgroundImage,
        position: layer.backgroundPosition,
        size: layer.backgroundSize,
        top: layer.top,
        bottom: layer.bottom,
        events: layer.pointerEvents,
        z: layer.zIndex,
      };
    });
    expect(style.own, `${width}`).toBe('none');
    expect(style.image, `${width}`).toContain('Paper_1_Torn.png');
    expect(style.position, `${width}`).toBe('50% 100%');
    expect(style.size, `${width}`).toBe(`auto max(${0.3 * width}px, 100%)`);
    expect(style.top, `${width}`).toBe('0px');
    expect(parseFloat(style.bottom), `${width}`).toBeCloseTo(-0.022 * width, 0);
    expect(style.events, `${width}`).toBe('none');
    expect(style.z, `${width}`).toBe('-1');
  }
});

test('site-header#AC-7 series cover', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('/comics/kettle-tales');
  const cover = await box(page, '.series__cover img, .series__cover-placeholder');
  expect(cover.height).toBeLessThanOrEqual(640 / 3 + 1);
  expect(cover.height).toBeGreaterThan(640 / 5 + 1);
  await expect(page.getByRole('link', { name: 'Start reading' })).toBeInViewport();
});
