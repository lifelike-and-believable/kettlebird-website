// Renders each mock-up in mockups.html to <name>.png beside this file, and frame 1 to site-card.jpg
// (the proposed site card, 1200 x 630): node render.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const names = { m1: '1-site-card', m2: '2-home-link-preview', m3: '3-portfolio-link-preview', m4: '4-search-home', m5: '5-search-chapter', m6: '6-what-search-engines-read' };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2600, height: 1000 } });
await page.goto('file://' + path.join(dir, 'mockups.html'), { waitUntil: 'networkidle' });
await page.waitForSelector('body[data-ready=yes]');
const box = await page.locator('#m1').boundingBox();
const card = await page.screenshot({ path: path.join(dir, 'site-card.jpg'), type: 'jpeg', quality: 88, clip: { x: Math.round(box.x), y: Math.round(box.y), width: 1200, height: 630 } });
await page.evaluate((b64) => window.cardReady('data:image/jpeg;base64,' + b64), card.toString('base64'));
await page.waitForFunction(() => [...document.querySelectorAll('img[data-card]')].every((i) => i.complete && i.naturalWidth));
for (const [id, name] of Object.entries(names)) await page.locator('#' + id).screenshot({ path: path.join(dir, name + '.png') });
await browser.close();
