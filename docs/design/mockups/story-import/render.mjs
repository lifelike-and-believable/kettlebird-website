// Renders each .frame in mockups.html to <name>.png beside this file: node render.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const names = { m1: '1-upload-button', m2: '2-drop', m3: '3-after-docx', m4: '4-replace-or-add', m5: '5-after-pdf', m6: '6-chapter', m7: '7-errors' };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 900 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(dir, 'mockups.html'));
for (const [id, name] of Object.entries(names)) await page.locator('#' + id).screenshot({ path: path.join(dir, name + '.png') });
await browser.close();
