// Renders each .frame in mockups.html to <name>.png beside this file: node render.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const names = { m1: '1-art-computer', m2: '2-art-opened-phone', m3: '3-chapter-page', m4: '4-series', m5: '5-commissions', m6: '6-contact-and-links', m7: '7-after-publish', m8: '8-before-preview', m9: '9-cant-preview' };
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + path.join(dir, 'mockups.html'));
for (const [id, name] of Object.entries(names)) await page.locator('#' + id).screenshot({ path: path.join(dir, name + '.png') });
await browser.close();
