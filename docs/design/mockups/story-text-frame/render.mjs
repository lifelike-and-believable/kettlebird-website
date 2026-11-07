// Renders the mock-ups from the fixture build (npm run build:fixtures, then
// HOST=127.0.0.1 PORT=4329 node dist/server/entry.mjs), with frame-b.css (option B, chosen) or frame.css (option A, not chosen)
// added to the page: node render.mjs
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE ?? 'http://127.0.0.1:4329';
const css = { a: readFileSync(path.join(dir, 'frame.css'), 'utf8'), b: readFileSync(path.join(dir, 'frame-b.css'), 'utf8') };
const LAPTOP = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };
const shots = [
  // [file, path, viewport, option, scroll to, continue the gate]
  ['1-chapter-laptop-today', '/writing/the-long-road/3', LAPTOP, null, 'main'],
  ['2-chapter-laptop', '/writing/the-long-road/3', LAPTOP, 'b', 'main'],
  ['3-chapter-phone', '/writing/the-long-road/3', PHONE, 'b', '.story-text'],
  ['4-end-laptop', '/writing/the-long-road/3', LAPTOP, 'b', '.story-picture--decorative'],
  ['5-one-shot-ticked-phone', '/writing/night-market', PHONE, 'b', '.before-you-read, [aria-labelledby]', true],
  ['6-chapter-laptop-option-a', '/writing/the-long-road/3', LAPTOP, 'a', 'main'],
  ['7-one-shot-ticked-laptop', '/writing/night-market', LAPTOP, 'b', 'main', true],
  ['8-chapter-320', '/writing/the-long-road/3', { width: 320, height: 700 }, 'b', '.story-text'],
  ['9-chapter-phone-today', '/writing/the-long-road/3', PHONE, null, '.story-text'],
];
const browser = await chromium.launch();
for (const [file, url, viewport, option, target, gate] of shots) {
  const page = await browser.newPage({ viewport });
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  if (option) await page.addStyleTag({ content: css[option] });
  if (gate) await page.getByRole('button', { name: 'Continue to the story' }).click();
  await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'start' }), target);
  await page.evaluate(() => window.scrollBy(0, -24));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(dir, `${file}.png`) });
  await page.close();
}
await browser.close();
