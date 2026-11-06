// End-to-end tests for the reader bar on phones, against the fixture comics: Single Sheets has panels,
// Kettle Tales has none. Criteria: docs/specs/comic-reader-phone-bar.md.
import { expect, test, type Browser, type Page } from '@playwright/test';

/** A phone: touch, no mouse, so no computer-only controls (comic-reader-page-size's Page size). */
async function phone(browser: Browser) {
  const context = await browser.newContext({ hasTouch: true, isMobile: true });
  return context.newPage();
}

const PHONES = [
  { width: 320, height: 568 },
  { width: 393, height: 659 },
  { width: 430, height: 739 },
];
const PANELLED = '/comics/single-sheets/1/1';
const PLAIN = '/comics/kettle-tales/1/2';

const toggle = (page: Page) => page.getByRole('button', { name: 'Panel by panel' });
const all = (page: Page) => page.getByRole('link', { name: 'All pages in this chapter' });
const box = async (page: Page, selector: string) => (await page.locator(selector).first().boundingBox())!;
const sideways = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

async function open(page: Page, size: { width: number; height: number }, path = PANELLED) {
  await page.setViewportSize(size);
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
}

test('comic-reader-phone-bar#AC-1 pictures only', async ({ browser }) => {
  const page = await phone(browser);
  for (const size of PHONES) {
    await open(page, size);
    const bar = await box(page, '.reader__bar');
    const back = await box(page, '.reader__back');
    const p = (await toggle(page).boundingBox())!;
    const a = (await all(page).boundingBox())!;
    for (const [name, b] of [['Panel by panel', p], ['All pages', a]] as const) {
      expect(Math.abs(b.width - 44), `${name} width at ${size.width}`).toBeLessThanOrEqual(1);
      expect(Math.abs(b.height - 44), `${name} height at ${size.width}`).toBeLessThanOrEqual(1);
      // On the first line, with Back to series.
      expect(b.y, `${name} line at ${size.width}`).toBeLessThan(back.y + back.height);
      expect(b.y + b.height, `${name} line at ${size.width}`).toBeGreaterThan(back.y);
    }
    // Together at the right: Panel by panel first, 16 px apart, All pages at the bar's right edge.
    expect(p.x).toBeLessThan(a.x);
    expect(Math.abs(a.x - (p.x + p.width) - 16)).toBeLessThanOrEqual(1);
    const padding = await page.locator('.reader__bar').evaluate((el) => parseFloat(getComputedStyle(el).paddingRight));
    expect(Math.abs(bar.x + bar.width - padding - (a.x + a.width)), `right edge at ${size.width}`).toBeLessThanOrEqual(1);
    // The words are there, but take no room.
    for (const button of [toggle(page), all(page)]) {
      const words = await button.evaluate((el) => {
        const span = [...el.querySelectorAll('span')].find((s) => /Panel by panel|All pages/.test(s.textContent ?? '') && !s.hasAttribute('aria-hidden'));
        const r = span?.getBoundingClientRect();
        return r ? { width: r.width, height: r.height } : undefined;
      });
      expect(words, `the words at ${size.width}`).toBeDefined();
      expect(words!.width).toBeLessThanOrEqual(1);
      expect(words!.height).toBeLessThanOrEqual(1);
    }
  }
});

test('comic-reader-phone-bar#AC-2 names', async ({ page }) => {
  await open(page, PHONES[1]);
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');
  await expect(toggle(page)).toContainText('Panel by panel');
  await expect(all(page)).toContainText('All pages');
  for (const button of [toggle(page), all(page)]) {
    await expect(button.locator('svg, .reader__grid').first()).toHaveAttribute('aria-hidden', 'true');
  }
  // The accessible names, as a screen reader gets them.
  const snapshot = await page.locator('.reader__bar').ariaSnapshot();
  expect(snapshot).toContain('button "Panel by panel"');
  expect(snapshot).toContain('link "All pages in this chapter"');
});

test('comic-reader-phone-bar#AC-3 names on focus and hover', async ({ page }) => {
  for (const size of PHONES) {
    await open(page, size);
    for (const [button, name] of [[toggle(page), 'Panel by panel'], [all(page), 'All pages in this chapter']] as const) {
      const tip = button.locator('.reader__tool-tip');
      await expect(tip).toHaveAttribute('aria-hidden', 'true');
      await expect(tip).toBeHidden();
      for (const how of ['focus', 'hover'] as const) {
        await page.mouse.move(0, size.height - 1);
        await page.locator('body').focus();
        if (how === 'focus') {
          await button.focus();
          await page.keyboard.press('Shift+Tab');
          await page.keyboard.press('Tab');
        } else {
          await button.hover();
        }
        await expect(tip, `${name}, ${how}, ${size.width}`).toBeVisible();
        await expect(tip).toHaveText(name);
        const t = (await tip.boundingBox())!;
        const b = (await button.boundingBox())!;
        expect(t.y, `under the button: ${name}, ${how}, ${size.width}`).toBeGreaterThanOrEqual(b.y + b.height);
        expect(Math.abs(t.x + t.width - (b.x + b.width)), `right-aligned: ${name}, ${size.width}`).toBeLessThanOrEqual(1);
        expect(t.x, `inside the screen: ${name}, ${size.width}`).toBeGreaterThanOrEqual(0);
        expect(t.x + t.width).toBeLessThanOrEqual(size.width);
        expect(await sideways(page)).toBeLessThanOrEqual(0);
      }
    }
  }
});

test('comic-reader-phone-bar#AC-4 the 700 px line', async ({ page }) => {
  await open(page, { width: 699, height: 900 });
  expect(Math.round((await toggle(page).boundingBox())!.width)).toBe(44);
  expect(Math.round((await all(page).boundingBox())!.width)).toBe(44);
  await open(page, { width: 700, height: 900 });
  expect((await toggle(page).boundingBox())!.width).toBeGreaterThan(100);
  expect((await all(page).boundingBox())!.width).toBeGreaterThan(80);
  // The words themselves (the name label under each holds them too, hidden at this width).
  await expect(toggle(page).locator('.reader__tool-word')).toHaveText('Panel by panel');
  await expect(toggle(page).locator('.reader__tool-word')).toBeVisible();
  await expect(all(page).locator('.reader__tool-word')).toHaveText('All pages');
  await expect(all(page).locator('.reader__tool-word')).toBeVisible();
  await expect(toggle(page).locator('.reader__tool-tip')).toBeHidden();
});

test('comic-reader-phone-bar#AC-5 enlarged text', async ({ page }) => {
  await open(page, PHONES[1]);
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const p = (await toggle(page).boundingBox())!;
  const a = (await all(page).boundingBox())!;
  expect(Math.round(p.y)).toBe(Math.round(a.y));
  expect(p.x).toBeLessThan(a.x);
  const bar = await box(page, '.reader__bar');
  const padding = await page.locator('.reader__bar').evaluate((el) => parseFloat(getComputedStyle(el).paddingRight));
  expect(Math.abs(bar.x + bar.width - padding - (a.x + a.width))).toBeLessThanOrEqual(1);
  expect(await sideways(page)).toBeLessThanOrEqual(0);
});

test('comic-reader-phone-bar#AC-6 one button', async ({ page, browser }) => {
  const check = async (p: Page) => {
    const bar = await box(p, '.reader__bar');
    const back = await box(p, '.reader__back');
    const a = (await all(p).boundingBox())!;
    const padding = await p.locator('.reader__bar').evaluate((el) => parseFloat(getComputedStyle(el).paddingRight));
    expect(Math.abs(a.width - 44)).toBeLessThanOrEqual(1);
    expect(Math.abs(bar.x + bar.width - padding - (a.x + a.width))).toBeLessThanOrEqual(1);
    expect(a.y).toBeLessThan(back.y + back.height);
  };
  await open(page, PHONES[1], PLAIN);
  await expect(toggle(page)).toHaveCount(0);
  await check(page);
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: PHONES[1] });
  const bare = await context.newPage();
  await bare.goto(PANELLED);
  await expect(toggle(bare)).toBeHidden();
  await check(bare);
  await context.close();
});

test('comic-reader-phone-bar#AC-7 controls on the screen', async ({ browser }) => {
  const page = await phone(browser);
  for (const size of PHONES) {
    for (const path of [PANELLED, PLAIN]) {
      for (const on of [false, true]) {
        await open(page, size, path);
        await page.evaluate((v) => (v ? localStorage.setItem('kb-panels', '1') : localStorage.removeItem('kb-panels')), on);
        await page.reload();
        await page.evaluate(() => document.fonts.ready);
        if (on && path === PANELLED) await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
        const bottom = await page.evaluate(() =>
          Math.max(...[...document.querySelectorAll('nav.reader__controls')].map((n) => n.getBoundingClientRect()).filter((r) => r.height > 0).map((r) => r.bottom)),
        );
        expect(bottom, `${path} at ${size.width} × ${size.height}, panels ${on ? 'on' : 'off'}`).toBeLessThanOrEqual(size.height);
      }
    }
  }
});

test('comic-reader-phone-bar#AC-8 small viewport', async ({ page }) => {
  await open(page, PHONES[1]);
  const rules = await page.evaluate(() => {
    const out: string[] = [];
    const walk = (list: CSSRuleList) => {
      for (const r of [...list]) {
        if (r instanceof CSSStyleRule) out.push(r.cssText);
        else if ('cssRules' in r) walk((r as CSSGroupingRule).cssRules);
      }
    };
    for (const sheet of [...document.styleSheets]) {
      try { walk(sheet.cssRules); } catch { /* another origin */ }
    }
    return out;
  });
  // The browser keeps the last valid declaration, and may write calc() terms in its own order.
  const declares = (selector: RegExp, property: string, value: string) =>
    rules.some((r) => selector.test(r.split('{')[0]) && new RegExp(`(^|[;{ ])${property}: [^;]*${value}`).test(r));
  const small = 'calc\\([^;]*(100svh[^;]*12\\.5rem|12\\.5rem[^;]*100svh)';
  expect(declares(/\.reader__page(?!\.)/, 'max-height', small), 'the page area').toBe(true);
  expect(declares(/\.reader--pairs.*\.reader__book/, 'height', small), 'the pair').toBe(true);
  // Scoped styles put an attribute between the class names: .reader__page[data-astro-cid-…].is-spread.
  expect(declares(/\.reader__page(\[[^\]]*\])?\.is-spread/, 'max-height', small), 'a spread alone').toBe(true);
  expect(declares(/^\.reader(\[|\s*$)/, 'min-height', '100vh'), "the reader's minimum height").toBe(true);
  expect(rules.some((r) => r.includes('max-height: calc(100vh - 12.5rem)') && !r.includes('svh')), 'no page area left on 100vh alone').toBe(false);
  // Each svh declaration follows a 100vh one, for browsers without svh (the stylesheets' own text).
  const hrefs = await page.evaluate(() => [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map((l) => l.href));
  const inline = await page.evaluate(() => [...document.querySelectorAll('style')].map((s) => s.textContent ?? '').join('\n'));
  const css = (await Promise.all(hrefs.map(async (h) => (await page.request.get(h)).text()))).join('\n') + inline;
  for (const property of ['max-height', 'height']) {
    expect(css, `${property} falls back to 100vh`).toMatch(new RegExp(`${property}:\\s*calc\\(100vh - 12\\.5rem\\);\\s*${property}:\\s*calc\\(100svh - 12\\.5rem\\)`));
  }
});

test('comic-reader-phone-bar#AC-9 the picture', async ({ page }) => {
  for (const size of [PHONES[1], { width: 1280, height: 800 }]) {
    await open(page, size);
    const shapes = await toggle(page).locator('svg').evaluate((svg) =>
      [...svg.children].map((c) => ({ tag: c.tagName, fill: c.getAttribute('fill'), stroke: Number(c.getAttribute('stroke-width')) })),
    );
    expect(shapes.map((s) => s.tag), `at ${size.width}`).toEqual(['rect', 'rect', 'rect', 'rect']);
    expect(shapes.every((s) => s.fill === 'none'), `nothing filled at ${size.width}`).toBe(true);
    // The top panel is drawn heavier than the two below it.
    expect(shapes[1].stroke).toBeGreaterThan(shapes[2].stroke);
    expect(shapes[1].stroke).toBeGreaterThan(shapes[3].stroke);
  }
});
