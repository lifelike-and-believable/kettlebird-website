// Renders the mock-ups for docs/design/comic-page-width.md.
// 1. Screenshots the reader from the fixture build (Single Sheets: one page at a time, pages 800 × 1200
//    pixels, a 1600 × 1200 spread at page 3), today and with proposed.css in each mode, into shots/.
// 2. Lays them out with the editor field in mockups.html and saves <name>.png.
// Needs the fixture build running: npm run build:fixtures && HOST=127.0.0.1 PORT=4399 node dist/server/entry.mjs
// Then: BASE=http://127.0.0.1:4399 node render.mjs
import { chromium } from 'playwright';
import { readFileSync, rmSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE ?? 'http://127.0.0.1:4399';
const css = readFileSync(path.join(dir, 'proposed.css'), 'utf8');
rmSync(path.join(dir, 'shots'), { recursive: true, force: true });
mkdirSync(path.join(dir, 'shots'), { recursive: true });
const browser = await chromium.launch();
const measures = {};

// What the build will set (proposed.css): the mode on the reader; each page's cap (the comic's largest width,
// twice it for a spread, or else the picture's own width, never over 3200); and on the reader the cap and shape
// of the chapter's widest single page (here, of the pages in the reader's markup).
function mark({ mode, largest, chapterCol }) {
  const r = document.querySelector('.reader');
  r.classList.add(`kb-fit-${mode}`);
  let col = 0;
  let ratio = 0;
  for (const p of document.querySelectorAll('.reader__page')) {
    const [w, h] = p.style.aspectRatio.split('/').map((n) => Number(n.trim()));
    const spread = p.classList.contains('is-spread');
    const cap = largest ? largest * (spread ? 2 : 1) : Math.min(w, 3200);
    p.style.setProperty('--kb-cap', `${cap}px`);
    if (!spread && (cap > col || (cap === col && w / h > ratio))) {
      col = cap;
      ratio = w / h;
    }
  }
  // The build knows every page in the chapter; the markup may hold only the current one (a spread here).
  if (chapterCol) col = chapterCol;
  r.style.setProperty('--kb-col', `${col}px`);
  r.style.setProperty('--kb-ratio', String(ratio || 0.6667));
}


// The fan's page-size control the build will have: a picture button in the bar's tools (a dot when the fan has
// made their own choice), and its menu when open.
const ICONS = {
  size: '<rect x="7" y="6" width="10" height="12" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 6V2h4M2 2l4 4M22 6V2h-4M22 2l-4 4M2 18v4h4M2 22l4-4M22 18v4h-4M22 22l-4-4" fill="none" stroke="currentColor" stroke-width="1.75"/>',
  screen: '<rect x="7" y="5" width="10" height="14" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 7V2h5M22 7V2h-5M2 17v5h5M22 17v5h-5" fill="none" stroke="currentColor" stroke-width="2"/>',
  width: '<rect x="5" y="2" width="14" height="20" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".45"/><path d="M2 12h20M2 12l4-4M2 12l4 4M22 12l-4-4M22 12l-4 4" fill="none" stroke="currentColor" stroke-width="2"/>',
  height: '<rect x="5" y="2" width="14" height="20" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".45"/><path d="M12 2v20M12 2l-4 4M12 2l4 4M12 22l-4-4M12 22l4-4" fill="none" stroke="currentColor" stroke-width="2"/>',
};
function addSizeControl({ open, comicMode, chosen, icons, focusItem, panels }) {
  const tools = document.querySelector('.reader__tools');
  const names = { screen: 'Fit the screen', width: 'Fit the width', height: 'Fit the height' };
  const notes = { screen: 'The whole page and the buttons at once', width: "As wide as the page's picture, or the window if narrower", height: 'As tall as the window' };
  const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[k]}</svg>`;
  const own = chosen !== 'comic';
  const label = own ? `Page size: ${names[chosen]}, your choice` : 'Page size';
  const item = (value, name, note, icon) =>
    `<button type="button" role="menuitemradio" aria-checked="${chosen === value}" data-value="${value}"><span class="tick" aria-hidden="true">${chosen === value ? '✓' : ''}</span>${icon}<span>${name}<small>${note}</small></span></button>`;
  const wrap = document.createElement('div');
  wrap.className = 'reader__size';
  wrap.innerHTML =
    `<button type="button" class="reader__size-button" aria-label="${label}" aria-haspopup="menu" aria-expanded="${open}" ${own ? 'data-own' : ''}>${svg('size')}<span class="reader__size-tip" aria-hidden="true">${own ? `Page size: ${names[chosen]}` : 'Page size'}</span></button>` +
    (open
      ? `<div class="reader__size-menu" role="menu" aria-label="Page size on this computer">` +
        item('comic', `Comic's choice: ${names[comicMode]}`, "Follows this comic's setting", svg(comicMode)) +
        '<hr>' +
        ['screen', 'width', 'height'].map((k) => item(k, names[k], `${notes[k]}. For every comic`, svg(k))).join('') +
        '<hr>' +
        (panels ? '<span class="note">Panel by panel always fits the screen. Your choice applies when it\'s off.</span>' : '<span class="note">Kept on this computer.</span>') +
        '</div>'
      : '');
  tools.prepend(wrap);
  if (focusItem) {
    const el = wrap.querySelector(`[data-value="${focusItem}"]`) ?? wrap.querySelector('.reader__size-button');
    el.focus();
  }
}

async function shot(name, { width, height, mode, largest, chapterCol, url = '/comics/single-sheets/1/1', full = false, hoverEdge = false, at = 'bar', control, clip, hoverSize = false, panelsOn = false }) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  if (panelsOn) await page.addInitScript(() => localStorage.setItem('kb-panels', '1'));
  await page.goto(BASE + url);
  if (mode) await page.evaluate(mark, { mode, largest, chapterCol });
  // The stylesheet always: its page-size rules need the reader marked, and the button is on every computer.
  await page.addStyleTag({ content: css });
  const c = control ?? { open: false, comicMode: mode ?? 'screen', chosen: 'comic' };
  await page.evaluate(addSizeControl, { ...c, icons: ICONS });
  if (c.focusItem === 'button') {
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
  }
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'start' }), at === 'page' ? '.reader__page.is-current' : '.reader');
  await page.waitForTimeout(400);
  if (hoverSize) {
    const b = await page.locator('.reader__size-button').boundingBox();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await page.waitForTimeout(200);
  }
  if (hoverEdge) {
    const b = await page.locator('.reader__edge--next').first().boundingBox();
    await page.mouse.move(b.x + b.width / 2, 400);
    await page.waitForTimeout(300);
  }
  measures[name] = await page.evaluate(() => {
    const p = document.querySelector('.reader__page.is-current').getBoundingClientRect();
    const nav = [...document.querySelectorAll('nav.reader__controls')].map((n) => n.getBoundingClientRect()).find((r) => r.height > 0);
    const bar = document.querySelector('.reader__bar').getBoundingClientRect();
    return { bar: Math.round(bar.height), readerTop: Math.round(document.querySelector('.reader').getBoundingClientRect().top + scrollY), page: [Math.round(p.width), Math.round(p.height)], top: Math.round(p.top), controlsBottom: Math.round(nav.bottom), window: innerHeight, sideways: document.documentElement.scrollWidth > innerWidth };
  });
  if (clip) await page.screenshot({ path: path.join(dir, 'shots', `${name}.png`), clip });
  else await page.screenshot({ path: path.join(dir, 'shots', `${name}.png`), fullPage: full });
  await page.close();
}

// A laptop's 1440 × 900 window, as the reader opens (scrolled past the header).
await shot('today-1440', { width: 1440, height: 900 });
// Fit the width, no largest width: each page up to its own pixels (800).
await shot('width-1440', { width: 1440, height: 900, mode: 'width' });
await shot('width-1440-full', { width: 1440, height: 900, mode: 'width', full: true });
// Fit the width, Largest page width 1200: wider than the picture's pixels, so enlarged.
await shot('width-1440-1200', { width: 1440, height: 900, mode: 'width', largest: 1200 });
// Fit the height: the page as tall as the window, opening at the bar as now.
await shot('height-1440', { width: 1440, height: 900, mode: 'height' });
await shot('height-1440-full', { width: 1440, height: 900, mode: 'height', full: true });
// A window narrower than the page (a narrow desktop window): the page shrinks to fit.
await shot('width-800', { width: 800, height: 700, mode: 'width' });
// A spread alone, its own pixels 1600: capped by the window.
await shot('width-1440-spread', { width: 1440, height: 900, mode: 'width', chapterCol: 800, url: '/comics/single-sheets/1/3' });
// Browser zoom at 200% on a 1280 laptop (640 CSS px wide): the page fills the window's width.
await shot('width-zoom-640', { width: 640, height: 400, mode: 'width' });
// The edge arrow on a tall page, pointed at: it stays in the window.
await shot('width-1280-edge', { width: 1280, height: 720, mode: 'width', largest: 1200, hoverEdge: true });
// Two pages side by side (Open Book, pages 2 and 3), today and in the two new modes.
await shot('pairs-today-1440', { width: 1440, height: 900, url: '/comics/open-book/1/2' });
await shot('pairs-width-1440', { width: 1440, height: 900, mode: 'width', url: '/comics/open-book/1/2' });
await shot('pairs-height-1440', { width: 1440, height: 900, mode: 'height', url: '/comics/open-book/1/2' });
// The fan's control, in a 1440 window with Fit the width the comic's choice: closed; with the pointer on it; open
// from the keyboard, focus on the ticked item; a fan's own choice (Fit the screen, the dot); open with Panel by
// panel on; and the bar at 700 px wide.
const top = (h) => ({ x: 260, y: 0, width: 920, height: h });
await shot('control-closed', { width: 1440, height: 900, mode: 'width', clip: top(80) });
await shot('control-hover', { width: 1440, height: 900, mode: 'width', clip: top(110), hoverSize: true });
await shot('control-open', { width: 1440, height: 900, mode: 'width', control: { open: true, comicMode: 'width', chosen: 'comic', focusItem: 'comic' }, clip: top(470) });
await shot('control-own', { width: 1440, height: 900, control: { open: false, comicMode: 'width', chosen: 'screen' }, clip: { x: 230, y: 0, width: 980, height: 110 }, hoverSize: true });
await shot('control-panels', { width: 1440, height: 900, mode: 'width', panelsOn: true, control: { open: true, comicMode: 'width', chosen: 'height', panels: true, focusItem: 'height' }, clip: { x: 230, y: 0, width: 980, height: 470 } });
await shot('control-700', { width: 700, height: 800, mode: 'width', clip: { x: 0, y: 0, width: 700, height: 80 } });
console.log(JSON.stringify(measures));

const names = { m1: '1-fit-screen', m2: '2-fit-width', m3: '3-fit-width-scrolled', m4: '4-largest-width', m5: '5-fit-height', m6: '6-narrower-window', m7: '7-spread', m8: '8-editor', m9: '9-editor-notes', m10: '10-zoom-and-edge', m11: '11-pairs', m12: '12-fan-control' };
const page = await browser.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(dir, 'mockups.html'));
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
// The bottom of the window as the reader opens at its bar, on the whole-page shots: the window's chrome (34),
// the reader's place on the page, and the window's height.
await page.evaluate((m) => {
  for (const [id, shot] of [['m3', 'width-1440-full'], ['m5', 'height-1440-full']]) {
    document.querySelector(`#${id} .fold`).style.setProperty('--fold', `${34 + m[shot].readerTop + m[shot].window}px`);
  }
}, measures);
for (const [id, name] of Object.entries(names)) await page.locator('#' + id).screenshot({ path: path.join(dir, name + '.png') });
await browser.close();
