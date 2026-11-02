// Renders each .frame in mockups.html to <name>.png beside this file: node render.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const names = { m1: '1-comics', m2: '2-art-piece', m3: '3-missing-fields', m4: '4-writing', m5: '5-shop', m6: '6-commissions', m7: '7-empty-section', m8: '8-site-settings', m9: '9-chapter-beside-series' };
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + path.join(dir, 'mockups.html'));
const only = process.argv.slice(2);
for (const [id, name] of Object.entries(names)) if (!only.length || only.includes(id)) await page.locator('#' + id).screenshot({ path: path.join(dir, name + '.png') });
await browser.close();
