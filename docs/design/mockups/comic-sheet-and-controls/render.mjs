// Renders each .screen in mockups.html to <name>.png beside this file: node render.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const names = { m1: '1-reader-phone', m2: '2-first-page', m3: '3-newest-page', m4: '4-reader-laptop', m5: '5-sheet-phone', m6: '6-sheet-laptop', m8: '8-complete-series', m9: '9-chapters-unfolded', m7: '7-text-200-narrow' };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2600, height: 1000 } });
await page.goto('file://' + path.join(dir, 'mockups.html'), { waitUntil: 'networkidle' });
await page.waitForSelector('body[data-ready=yes]');
for (const [id, name] of Object.entries(names)) {
  // Frame 7 shows text enlarged to 200%: every rem-based size doubles, as when a visitor enlarges text.
  if (id === 'm7') await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await page.locator('#' + id).screenshot({ path: path.join(dir, name + '.png') });
}
await browser.close();
