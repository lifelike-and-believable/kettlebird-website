// Mock-ups for design-portfolio-size: the Portfolio in Preview on the fixture build, at 1920 × 1200 (the lead's
// 27-inch display), today and with smaller tabs and rows. Run from the repository root with the fixture build
// served on 127.0.0.1:4399:  HOST=127.0.0.1 PORT=4399 node dist/server/entry.mjs &  then  node docs/design/mockups/portfolio-size/render.mjs
// The image service is answered with the site's own pictures, so the pieces are stand-ins.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const OUT = 'docs/design/mockups/portfolio-size/';
const KEY = 'sanity-preview-secret=fixture-preview-key';
const PIECE = `/preview/galleryItem/piece-wide?${KEY}`;
const BOOKS = `/preview/portfolioSubfolder/sub-books?${KEY}`;
const PICTURES = ['bkgd-artwork.jpg', 'bkgd-Comics.jpg', 'bkgd-commissions.jpeg', 'bkgd-writing.jpg'].map((f) => readFileSync(`public/assets/images/${f}`));

// Option A: about half on a computer, by using the phone's tab sizes at every width and capping every row at
// 240 px; subfolder grids at most 3 × 3 on a computer, with the count beside the name. Option B: about two thirds.
const A = `
  .folder-row { height: min(100cqw * 9 / 16, 240px); }
  @media (min-width: 640px) {
    .folder-stack { padding-top: 3.4rem; }
    .folder-body { padding: 1.5rem 0 3rem; }
    .folder-tabs { margin: -2.25rem 4rem -0.05rem; }
    .folder-tab { --tilt: 70px; font-size: 1.35rem; padding: 0.4rem 1.2rem 0.35rem; }
    .folder-tab::before { border-radius: 14px 14px 0 0; }
    .folder-tab--open { --tilt: 220px; }
    .folder-tab--index { font-size: 1.1rem; padding: 0.35rem 1rem 0.3rem; }
    .subfolder-card__name { font-size: 0.85rem; padding: 0.2rem 0.4rem; }
    .subfolder-card__count { display: inline; }
    .subfolder-grid[data-size='4'] { grid-template: repeat(3, minmax(0, 1fr)) / repeat(3, minmax(0, 1fr)); }
    .subfolder-grid__cell:nth-child(n + 10) { display: none; }
  }`;
const B = `
  @media (min-width: 640px) {
    .folder-stack { padding-top: 4rem; }
    .folder-tabs { margin-top: -2.9rem; }
    .folder-tab { font-size: 1.75rem; padding: 0.45rem 1.6rem 0.4rem; }
    .folder-tab::before { border-radius: 16px 16px 0 0; }
    .folder-tab--index { font-size: 1.4rem; }
    .folder-row { height: min(100cqw * 9 / 16, 320px); }
    .folder-body { padding: 1.5rem 0 3rem; }
    .subfolder-card__name { font-size: 1rem; }
  }`;
const OPTIONS = { a: A, b: B };

// Mock-up 9: Book covers as a 3 × 3 grid of nine pieces (the fixture has two).
const NINE = () => {
  const grid = document.querySelector('[data-sub="sub-books"] .subfolder-grid');
  if (!grid) return;
  const imgs = Array.from(grid.querySelectorAll('img')).map((i) => i.src);
  grid.dataset.size = '3';
  grid.innerHTML = Array.from({ length: 9 }, (_, i) => `<span class="subfolder-grid__cell" data-cell=""><img src="${imgs[i % imgs.length]}" alt="" style="width:100%;height:100%;object-fit:cover;display:block"></span>`).join('');
  const name = document.querySelector('[data-sub="sub-books"] .subfolder-card__name');
  if (name) name.innerHTML = 'Book covers<span class="subfolder-card__count"> · 9</span>';
};
// Mock-up 11: a long open tab.
const LONG = () => {
  const tab = document.querySelector('.folder-tab--open');
  if (tab) tab.textContent = 'Past Clients: The Amazing Digital Circus Book Covers';
};
const BIG_TEXT = () => { document.documentElement.style.fontSize = '200%'; };

const shots = [
  ['1-today-1920', 1920, 1200, PIECE, ''],
  ['2-option-a-1920', 1920, 1200, PIECE, OPTIONS.a],
  ['3-option-b-1920', 1920, 1200, PIECE, OPTIONS.b],
  ['4-today-open-1920', 1920, 1200, BOOKS, ''],
  ['5-option-a-open-1920', 1920, 1200, BOOKS, OPTIONS.a],
  ['6-option-b-open-1920', 1920, 1200, BOOKS, OPTIONS.b],
  ['7-option-a-1280', 1280, 800, PIECE, OPTIONS.a],
  ['8-today-phone', 390, 844, PIECE, ''],
  ['9-option-a-phone', 390, 844, PIECE, OPTIONS.a],
  ['10-option-a-3x3-1920', 1920, 1200, PIECE, OPTIONS.a, NINE, '#section-commission'],
  ['11-option-a-long-tab-1920', 1920, 1200, BOOKS, OPTIONS.a, LONG, '#section-commission'],
  ['12-option-a-tablet-768', 768, 1024, PIECE, OPTIONS.a],
  ['13-option-a-200-percent-1920', 1920, 1200, PIECE, OPTIONS.a, BIG_TEXT],
];

const browser = await chromium.launch();
for (const [name, width, height, url, extra, change, at] of shots) {
  const page = await browser.newPage({ viewport: { width, height } });
  let n = 0;
  await page.route('https://cdn.sanity.io/**', (r) => r.fulfill({ status: 200, contentType: 'image/jpeg', body: PICTURES[n++ % PICTURES.length] }));
  await page.goto(`http://127.0.0.1:4399${url}`);
  // Mock-ups only: the stand-in pictures don't have the pieces' shapes, so they're cropped rather than stretched.
  await page.addStyleTag({ content: '.gallery-card__img { object-fit: cover; }' + extra });
  await page.waitForTimeout(900);
  if (change) await page.evaluate(change);
  // From the page title down, as a fan arrives; or from the folder the mock-up is about.
  await page.evaluate((sel) => window.scrollTo(0, document.querySelector(sel).getBoundingClientRect().top + window.scrollY - (sel === '.portfolio-header' ? 8 : 90)), at ?? '.portfolio-header');
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}${name}.png` });
  await page.close();
}
await browser.close();
