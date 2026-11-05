// Renders each mock-up in mockups.html to <name>.png beside this file: node render.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const names = {
  m1: '1-laptop-dialog', m2: '2-phone-dialog', m3: '3-laptop-full-screen', m4: '4-laptop-zoomed', m5: '5-phone-full-screen',
  m6: '6-phone-pinched', m7: '7-controls-hidden', m8: '8-first-piece', m9: '9-sideways', m10: '10-back-to-dialog',
};
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('file://' + path.join(dir, 'mockups.html'));
await page.waitForLoadState('networkidle');
for (const [id, name] of Object.entries(names)) await page.locator('#' + id).screenshot({ path: path.join(dir, name + '.png') });
await browser.close();
