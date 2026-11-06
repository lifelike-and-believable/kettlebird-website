// Renders each screen in mockups.html to <name>.png beside this file: node render.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const names = { m1: '1-two-up-button', m2: '2-panel-view-one-page', m3: '3-reading-order', m4: '4-next-page', m5: '5-back-to-two-up' };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
await page.goto('file://' + path.join(dir, 'mockups.html'), { waitUntil: 'networkidle' });
await page.waitForSelector('body[data-ready=yes]');
for (const [id, name] of Object.entries(names)) await page.locator('#' + id).screenshot({ path: path.join(dir, name + '.png') });
await browser.close();
