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


// The fan's page-size control the build will have: a button in the bar's tools, and its list when open.
const ICONS = {
  size: '<rect x="6" y="4" width="12" height="16" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 8V2h6M22 8V2h-6M2 16v6h6M22 16v6h-6" fill="none" stroke="currentColor" stroke-width="2"/>',
  screen: '<rect x="7" y="5" width="10" height="14" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 7V2h5M22 7V2h-5M2 17v5h5M22 17v5h-5" fill="none" stroke="currentColor" stroke-width="2"/>',
  width: '<rect x="5" y="2" width="14" height="20" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".45"/><path d="M2 12h20M2 12l4-4M2 12l4 4M22 12l-4-4M22 12l-4 4" fill="none" stroke="currentColor" stroke-width="2"/>',
  height: '<rect x="5" y="2" width="14" height="20" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".45"/><path d="M12 2v20M12 2l-4 4M12 2l4 4M12 22l-4-4M12 22l4-4" fill="none" stroke="currentColor" stroke-width="2"/>',
};
function addSizeControl({ open, comicMode, chosen, icons }) {
  const tools = document.querySelector('.reader__tools');
  const names = { screen: 'Fit the screen', width: 'Fit the width', height: 'Fit the height' };
  const notes = { screen: 'The whole page and the buttons at once', width: 'As wide as the window allows', height: 'As tall as the window' };
  const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[k]}</svg>`;
  const wrap = document.createElement('div');
  wrap.className = 'reader__size';
  const radio = (value, label, note, icon) =>
    `<label><input type="radio" name="kb-size" value="${value}" ${chosen === value ? 'checked' : ''}>${icon}<span>${label}<small>${note}</small></span></label>`;
  wrap.innerHTML =
    `<button type="button" class="reader__size-button" aria-expanded="${open}" aria-controls="kb-size-menu">${svg('size')}<span class="reader__tool-word">Page size</span></button>` +
    (open
      ? `<fieldset class="reader__size-menu" id="kb-size-menu" style="border-width:2px"><legend class="visually-hidden">Page size on this computer</legend>` +
        radio('comic', `Comic's choice: ${names[comicMode]}`, 'As the artist set it for this comic', svg(comicMode)) +
        '<hr>' +
        ['screen', 'width', 'height'].map((k) => radio(k, names[k], notes[k], svg(k))).join('') +
        '<hr><small style="padding:0.2rem 0.9rem 0.3rem">Kept on this computer for every comic.</small></fieldset>'
      : '');
  tools.prepend(wrap);
}

async function shot(name, { width, height, mode, largest, chapterCol, url = '/comics/single-sheets/1/1', full = false, hoverEdge = false, at = 'bar', control, clip }) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(BASE + url);
  if (mode) {
    await page.evaluate(mark, { mode, largest, chapterCol });
    await page.addStyleTag({ content: css });
  }
  if (control) await page.evaluate(addSizeControl, { ...control, icons: ICONS });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'start' }), at === 'page' ? '.reader__page.is-current' : '.reader');
  await page.waitForTimeout(400);
  if (hoverEdge) {
    const b = await page.locator('.reader__edge--next').first().boundingBox();
    await page.mouse.move(b.x + b.width / 2, 400);
    await page.waitForTimeout(300);
  }
  measures[name] = await page.evaluate(() => {
    const p = document.querySelector('.reader__page.is-current').getBoundingClientRect();
    const nav = [...document.querySelectorAll('nav.reader__controls')].map((n) => n.getBoundingClientRect()).find((r) => r.height > 0);
    return { readerTop: Math.round(document.querySelector('.reader').getBoundingClientRect().top + scrollY), page: [Math.round(p.width), Math.round(p.height)], top: Math.round(p.top), controlsBottom: Math.round(nav.bottom), window: innerHeight, sideways: document.documentElement.scrollWidth > innerWidth };
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
// The fan's control: closed in the bar, and open, with the comic's choice (Fit the width) in use.
await shot('control-closed', { width: 1440, height: 900, mode: 'width', control: { open: false, comicMode: 'width', chosen: 'comic' }, clip: { x: 260, y: 0, width: 920, height: 80 } });
await shot('control-open', { width: 1440, height: 900, mode: 'width', control: { open: true, comicMode: 'width', chosen: 'comic' }, clip: { x: 260, y: 0, width: 920, height: 460 } });
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
