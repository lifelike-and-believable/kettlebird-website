// Renders each .frame in mockups.html to <name>.png beside this file: node render.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const names = { m1: '1-commissions', m2: '2-about-page', m3: '3-home-page', m4: '4-contact-and-links', m5: '5-commissions-page', m6: '6-about-site', m7: '7-home-and-footer', m8: '8-phone' };
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + path.join(dir, 'mockups.html'));
for (const [id, name] of Object.entries(names)) await page.locator('#' + id).screenshot({ path: path.join(dir, name + '.png') });
await browser.close();
