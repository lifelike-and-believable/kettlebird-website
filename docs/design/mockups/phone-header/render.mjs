// Renders each .screen in mockups.html to <name>.png beside this file: node render.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const names = { m1: '1-today', m2: '2-option-a', m3: '3-option-a-menu-open', m4: '4-option-a-360', m5: '5-option-b', m6: '6-option-a-text-200' };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2200, height: 1000 } });
await page.goto('file://' + path.join(dir, 'mockups.html'), { waitUntil: 'networkidle' });
await page.waitForSelector('body[data-ready=yes]');
for (const [id, name] of Object.entries(names)) {
  // Frame 6 shows text enlarged to 200%: every rem-based size doubles, as when a visitor enlarges text.
  if (id === 'm6') await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; window.markFolds(); });
  await page.locator('#' + id).screenshot({ path: path.join(dir, name + '.png') });
}
await browser.close();
