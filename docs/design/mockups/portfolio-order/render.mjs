// Mock-ups for design-portfolio-order. Frames 1 and 2 (the editor) are drawn in mockups.html; the others are the
// fixture build's Portfolio in Preview, with a folder's row put in the order the design describes and each piece
// labelled with its date (the labels are for the mock-ups only). Run from the repository root with the fixture
// build served on 127.0.0.1:4399:  HOST=127.0.0.1 PORT=4399 node dist/server/entry.mjs &  then  node docs/design/mockups/portfolio-order/render.mjs
// The image service is answered with the site's own pictures, so the pieces are stand-ins.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const OUT = 'docs/design/mockups/portfolio-order/';
const KEY = 'sanity-preview-secret=fixture-preview-key';
const PIECE = `/preview/galleryItem/piece-wide?${KEY}`;
const BOOKS = `/preview/portfolioSubfolder/sub-books?${KEY}`;
const PICTURES = ['bkgd-artwork.jpg', 'bkgd-Comics.jpg', 'bkgd-commissions.jpeg', 'bkgd-writing.jpg'].map((f) => readFileSync(`public/assets/images/${f}`));

// The fixture's dates (tests/fixtures/drafts.ts).
const DATES = {
  'piece-lantern': 'May 2024', 'piece-alibi': 'Apr 2024', 'piece-blank': 'Mar 2024', 'piece-jungle': 'Feb 2024', 'piece-moon': 'Jan 2024',
  'piece-cover1': 'May 2025', 'piece-cover2': 'Apr 2025', 'piece-wide': 'Mar 2025', 'sub-books': 'Apr–May 2025',
};
const label = (dates) => {
  for (const el of document.querySelectorAll('.carousel__track > [data-piece], .carousel__track > [data-sub]')) {
    const d = dates[el.dataset.piece ?? el.dataset.sub];
    if (!d) continue;
    el.style.position = 'relative';
    const tag = document.createElement('span');
    tag.textContent = d;
    tag.style.cssText = 'position:absolute;left:6px;top:6px;z-index:3;background:#f4ce6a;color:#2b2b2b;font:600 12px system-ui;padding:2px 6px;border:2px solid #2b2b2b';
    el.append(tag);
  }
};
const reverse = (section) => {
  const track = document.querySelector(`#${section} .carousel__track`);
  [...track.children].reverse().forEach((c) => track.append(c));
};
// Oldest first in Book covers: its grid and its open row start from Orchard Cover (Apr 2025).
const booksOldest = () => {
  const grid = document.querySelector('[data-sub="sub-books"] .subfolder-grid');
  if (grid) { const cells = [...grid.children]; [cells[0], cells[1]] = [cells[1], cells[0]]; grid.replaceChildren(...cells); }
};
// Mock-up 10: Book covers as a 3 × 3 grid of its oldest nine of twelve.
const twelve = () => {
  const grid = document.querySelector('[data-sub="sub-books"] .subfolder-grid');
  const imgs = Array.from(grid.querySelectorAll('img')).map((i) => i.src);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  grid.dataset.size = '3';
  grid.innerHTML = months.map((m, i) => `<span class="subfolder-grid__cell" data-cell="" style="position:relative"><img src="${imgs[i % imgs.length]}" alt="" style="width:100%;height:100%;object-fit:cover;display:block"><span style="position:absolute;left:2px;bottom:2px;background:#f4ce6a;font:600 10px system-ui;padding:0 3px;border:1px solid #2b2b2b">${m}</span></span>`).join('');
  document.querySelector('[data-sub="sub-books"] .subfolder-card__name').innerHTML = 'Book covers<span class="subfolder-card__count"> · 12</span>';
};
// Mock-up 11: Original Work as a long row of 24 pieces, oldest first.
const long = () => {
  const track = document.querySelector('#section-original .carousel__track');
  const cards = [...track.children];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  track.replaceChildren(...Array.from({ length: 24 }, (_, i) => {
    const c = cards[i % cards.length].cloneNode(true);
    c.removeAttribute('data-piece');
    c.style.position = 'relative';
    const tag = document.createElement('span');
    tag.textContent = `${months[i % 12]} ${2023 + Math.floor(i / 12)}`;
    tag.style.cssText = 'position:absolute;left:6px;top:6px;z-index:3;background:#f4ce6a;color:#2b2b2b;font:600 12px system-ui;padding:2px 6px;border:2px solid #2b2b2b';
    c.append(tag);
    return c;
  }));
};
const note = (text) => {
  const n = document.createElement('p');
  n.textContent = text;
  n.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:9;max-width:420px;margin:0;background:#fff;color:#2b2b2b;font:13px/1.4 system-ui;padding:8px 10px;border:2px solid #2b2b2b';
  document.body.append(n);
};

const shots = [
  ['3-original-newest-1280', 1280, 800, PIECE, '#section-original', '', 'Original Work, Newest first (today): May 2024 first.'],
  ['4-original-oldest-1280', 1280, 800, PIECE, '#section-original', "reverse('section-original')", 'Original Work, Oldest first: Feb 2024 first. The row starts at its oldest piece; the arrows and full screen follow the same order.'],
  ['5-clients-newest-1280', 1280, 800, PIECE, '#section-commission', '', 'Past Clients, Newest first: Book covers sits where its newest piece (May 2025) would be, before Shopfront (Mar 2025).'],
  ['6-clients-oldest-1280', 1280, 800, PIECE, '#section-commission', "reverse('section-commission')", 'Past Clients, Oldest first: Shopfront (Mar 2025) first; Book covers sits where its oldest piece (Apr 2025) would be.'],
  ['7-books-oldest-1280', 1280, 800, PIECE, '#section-commission', "reverse('section-commission'); booksOldest()", 'Past Clients Oldest first, and Book covers Same as its section: its thumbnail starts from its oldest piece, Orchard Cover (Apr 2025).'],
  ['8-books-oldest-open-1280', 1280, 800, BOOKS, '#section-commission', "reverse('section-commission')", 'Book covers open, Same as Past Clients (Oldest first): Orchard Cover (Apr 2025), then Harbour Cover (May 2025). Full screen turns through them in this order: "1 of 2 · Book covers" is Orchard Cover.'],
  ['9-original-oldest-phone', 390, 844, PIECE, '#section-original', "reverse('section-original')", 'On a phone, the same: Original Work Oldest first.'],
  ['10-books-oldest-3x3-1280', 1280, 800, PIECE, '#section-commission', "reverse('section-commission'); twelve()", 'A 3 × 3 subfolder of 12 pieces, Oldest first: its thumbnail shows its oldest 9 (Jan to Sep 2025); the count says 12.', {}],
  ['11-long-row-oldest-1280', 1280, 800, PIECE, '#section-original', "long()", 'A long row Oldest first: it starts at Jan 2023; the newest piece (Dec 2024) is at the far end, reached with the arrows.', {}],
  ['12-subfolder-differs-1280', 1280, 800, PIECE, '#section-commission', "booksOldest()", 'Past Clients Newest first, Book covers set to Oldest first: it sits where its newest piece (May 2025) would be, and its thumbnail starts from its oldest.'],
];

const browser = await chromium.launch();
const page0 = await browser.newPage({ viewport: { width: 1240, height: 900 } });
await page0.goto('file://' + path.resolve(OUT, 'mockups.html'));
for (const [id, name] of [['m1', '1-editor-portfolio-order'], ['m2', '2-editor-subfolder-order']]) await page0.locator('#' + id).screenshot({ path: `${OUT}${name}.png` });
await page0.close();
for (const [name, width, height, url, at, change, text, dates = DATES] of shots) {
  const page = await browser.newPage({ viewport: { width, height } });
  let n = 0;
  await page.route('https://cdn.sanity.io/**', (r) => r.fulfill({ status: 200, contentType: 'image/jpeg', body: PICTURES[n++ % PICTURES.length] }));
  await page.goto(`http://127.0.0.1:4399${url}`);
  await page.addStyleTag({ content: '.gallery-card__img { object-fit: cover; }' });
  await page.waitForTimeout(900);
  // The changes run in the page, with the helpers' source.
  await page.evaluate(`const reverse = ${reverse}; const booksOldest = ${booksOldest}; const twelve = ${twelve}; const long = ${long}; ${change}`);
  await page.evaluate(label, { ...dates, ...(name.startsWith('12') ? { 'sub-books': 'Apr–May 2025' } : {}) });
  await page.evaluate((s) => { for (const t of document.querySelectorAll('.carousel__track')) t.scrollLeft = 0; window.scrollTo(0, document.querySelector(s).getBoundingClientRect().top + window.scrollY - 70); }, at);
  await page.evaluate(note, text);
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}${name}.png` });
  await page.close();
}
await browser.close();
