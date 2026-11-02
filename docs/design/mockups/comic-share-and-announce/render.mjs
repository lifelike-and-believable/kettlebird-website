// Renders each .screen in mockups.html to <name>.png beside this file: node render.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const names = { m1: '1-share-phone', m2: '2-link-copied', m3: '3-copy-by-hand', m4: '4-series-newest', m5: '5-page-removed', m6: '6-social-preview', m7: '7-turn-announced', m8: '8-newest-announced' };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2600, height: 1000 } });
await page.goto('file://' + path.join(dir, 'mockups.html'), { waitUntil: 'networkidle' });
await page.waitForSelector('body[data-ready=yes]');
for (const [id, name] of Object.entries(names)) {
  // Frame 3 shows the address selected, as the page leaves it.
  if (id === 'm3') await page.evaluate(() => { const box = document.querySelector('#m3 input'); box.focus(); box.select(); });
  await page.locator('#' + id).screenshot({ path: path.join(dir, name + '.png') });
}
await browser.close();
