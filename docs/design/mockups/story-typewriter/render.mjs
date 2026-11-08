// Renders the mock-ups from the fixture build (npm run build:fixtures, then
// HOST=127.0.0.1 PORT=4329 node dist/server/entry.mjs): node render.mjs
// Adds typewriter.css and typewriter.svg to the page, and, because the fixture chapters are a few lines long,
// thirty paragraphs of stand-in text so the page scrolls as a real chapter does.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE ?? 'http://127.0.0.1:4329';
const css = readFileSync(path.join(dir, 'typewriter.css'), 'utf8');
const svg = readFileSync(path.join(dir, 'typewriter.svg'), 'utf8');
const LAPTOP = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };
const shots = [
  // [file, path, viewport, option, where: 'middle' | 'end' | 'top', continue the gate, html classes]
  ['1-middle-laptop', '/writing/the-long-road/3', LAPTOP, 'a', 'middle'],
  ['2-middle-phone', '/writing/the-long-road/3', PHONE, 'a', 'middle'],
  ['3-start-laptop', '/writing/the-long-road/3', LAPTOP, 'a', 'top'],
  ['4-end-laptop', '/writing/the-long-road/3', LAPTOP, 'a', 'end'],
  ['5-end-phone', '/writing/the-long-road/3', PHONE, 'a', 'end'],
  ['6-middle-320', '/writing/the-long-road/3', { width: 320, height: 640 }, 'a', 'middle'],
  ['7-option-b-middle-laptop', '/writing/the-long-road/3', LAPTOP, 'b', 'middle'],
  ['8-one-shot-ticked-phone', '/writing/night-market', PHONE, 'a', 'top', false],
  ['9-end-laptop-plain', '/writing/the-long-road/3', LAPTOP, 'a', 'end', false, 'tw-plain'],
];
const filler = Array.from({ length: 30 }, (_, i) =>
  `<p>${['The road bent west and the rain came with it, steady and grey, filling the ruts until the cart wheels hissed.', 'Mira counted the mile-stones under her breath, the way her mother had, and lost count somewhere past the old mill.', 'Nobody spoke. The mule knew the way better than any of them, and it did not care for conversation.', 'By the time the lamps were lit in the valley below, the letter in her coat had gone soft at the corners.'][i % 4]}</p>`).join('');
const browser = await chromium.launch();
for (const [file, url, viewport, option, where, gate = false, extra = ''] of shots) {
  const page = await browser.newPage({ viewport });
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: css });
  await page.evaluate(({ filler, svg, cls }) => {
    const text = document.querySelector('.story-text');
    if (!text) return;
    text.lastElementChild.insertAdjacentHTML('beforebegin', filler);
    text.insertAdjacentHTML('beforeend', `<div class="story-typewriter" aria-hidden="true">${svg}</div>`);
    for (const c of cls) document.documentElement.classList.add(c);
  }, { filler, svg, cls: [option === 'b' ? 'tw-end' : '', extra].filter(Boolean) });
  if (gate) await page.getByRole('button', { name: 'Continue to the story' }).click();
  await page.evaluate((where) => {
    const t = document.querySelector('.story-text');
    if (where === 'middle' && t) window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY + t.offsetHeight / 2 - innerHeight / 2);
    if (where === 'end' && t) window.scrollTo(0, t.getBoundingClientRect().bottom + window.scrollY - innerHeight + 160);
  }, where);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(dir, `${file}.png`) });
  await page.close();
}
await browser.close();
