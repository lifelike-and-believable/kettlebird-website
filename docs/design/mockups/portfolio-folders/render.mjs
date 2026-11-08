// Renders each mock-up in mockups.html to <name>.png beside this file: node render.mjs
// (today-laptop.png is a screenshot of https://newsite.kettlebird.com/portfolio, 2026-11-08.)
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const names = { m1: '1-folders-laptop', m2: '2-subfolders-laptop', m3: '3-subfolder-open-laptop', m4: '4-folders-phone', m5: '5-subfolder-open-phone', m6: '6-today-laptop', m7: '7-editor', m8: '8-piece-subfolders', m9: '9-delete-subfolder', m10: '10-preview-empty-subfolder', m11: '11-page-not-found-phone', m12: '12-long-name-320', m13: '13-wide-piece-phone' };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2000, height: 1200 } });
await page.goto('file://' + path.join(dir, 'mockups.html'), { waitUntil: 'networkidle' });
await page.waitForSelector('body[data-ready=yes]');
for (const [id, name] of Object.entries(names)) await page.locator('#' + id).screenshot({ path: path.join(dir, name + '.png') });
await browser.close();
