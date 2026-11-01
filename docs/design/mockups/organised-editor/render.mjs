// Renders each .frame in mockups.html to <name>.png beside this file: node render.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const names = { m1: '1-comics', m2: '2-art-piece', m3: '3-missing-fields', m4: '4-writing-shop-commissions', m5: '5-site-settings' };
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + path.join(dir, 'mockups.html'));
for (const [id, name] of Object.entries(names)) await page.locator('#' + id).screenshot({ path: path.join(dir, name + '.png') });
await browser.close();
