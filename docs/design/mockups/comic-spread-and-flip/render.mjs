// Renders each mock-up in mockups.html to <name>.png beside this file: node render.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const names = {
  m1: '1-spread-laptop', m2: '2-opens-on-right', m3: '3-wide-page', m4: '4-wide-page-phone', m5: '5-mid-turn',
  m6: '6-last-page-left', m7: '7-all-pages', m8: '8-editor-open-on', m9: '9-editor-spread-page',
};
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('file://' + path.join(dir, 'mockups.html'));
await page.waitForLoadState('networkidle');
for (const [id, name] of Object.entries(names)) await page.locator('#' + id).screenshot({ path: path.join(dir, name + '.png') });
await browser.close();
