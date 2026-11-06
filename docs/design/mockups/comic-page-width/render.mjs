// Renders the mock-ups for docs/design/comic-page-width.md.
// 1. Screenshots the reader from the fixture build (Single Sheets: one page at a time, a spread at page 3),
//    today and with proposed.css and a page width, into shots/.
// 2. Lays them out with the editor field in mockups.html and saves <name>.png.
// Needs the fixture build running: npm run build:fixtures && HOST=127.0.0.1 PORT=4399 node dist/server/entry.mjs
// Then: BASE=http://127.0.0.1:4399 node render.mjs
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE ?? 'http://127.0.0.1:4399';
const css = readFileSync(path.join(dir, 'proposed.css'), 'utf8');
mkdirSync(path.join(dir, 'shots'), { recursive: true });
const browser = await chromium.launch();
const measures = {};

async function shot(name, { width, height, pageWidth, url = '/comics/single-sheets/1/1', full = false, hoverEdge = false }) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(BASE + url);
  if (pageWidth) {
    await page.evaluate((w) => {
      const r = document.querySelector('.reader');
      r.classList.add('kb-has-width');
      r.style.setProperty('--kb-page-width', `${w}px`);
    }, pageWidth);
    await page.addStyleTag({ content: css });
  }
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => document.querySelector('.reader')?.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(400);
  if (hoverEdge) {
    const b = await page.locator('.reader__edge--next').first().boundingBox();
    await page.mouse.move(b.x + b.width / 2, 400);
    await page.waitForTimeout(300);
  }
  measures[name] = await page.evaluate(() => {
    const p = document.querySelector('.reader__page.is-current').getBoundingClientRect();
    const nav = [...document.querySelectorAll('nav.reader__controls')].map((n) => n.getBoundingClientRect()).find((r) => r.height > 0);
    return { page: [Math.round(p.width), Math.round(p.height)], controlsBottom: Math.round(nav.bottom), window: innerHeight };
  });
  await page.screenshot({ path: path.join(dir, 'shots', `${name}.png`), fullPage: full });
  await page.close();
}

// A laptop's 1440 × 900 window, as the reader opens (scrolled past the header).
await shot('today-1440', { width: 1440, height: 900 });
await shot('after-1440', { width: 1440, height: 900, pageWidth: 900 });
// The whole page, scrolled: the controls under the page.
await shot('after-1440-full', { width: 1440, height: 900, pageWidth: 900, full: true });
// A window narrower than the page width (a narrow desktop window): the page shrinks to fit.
await shot('after-800', { width: 800, height: 700, pageWidth: 900 });
// A spread alone: twice as wide, within the window.
await shot('after-1440-spread', { width: 1440, height: 900, pageWidth: 900, url: '/comics/single-sheets/1/3' });
// Browser zoom at 200% on a 1280 laptop (640 CSS px wide): still the page width rule, so the page fills the window's width.
await shot('after-zoom-640', { width: 640, height: 400, pageWidth: 900 });
// The edge arrow on a tall page, pointed at: it stays in the window.
await shot('after-1280-edge', { width: 1280, height: 720, pageWidth: 1200, hoverEdge: true });
console.log(JSON.stringify(measures));

const names = { m1: '1-today-laptop', m2: '2-after-laptop', m3: '3-after-scrolled', m4: '4-narrower-window', m5: '5-spread', m6: '6-editor', m7: '7-editor-notes', m8: '8-zoom-and-edge' };
const page = await browser.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(dir, 'mockups.html'));
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
for (const [id, name] of Object.entries(names)) await page.locator('#' + id).screenshot({ path: path.join(dir, name + '.png') });
await browser.close();
