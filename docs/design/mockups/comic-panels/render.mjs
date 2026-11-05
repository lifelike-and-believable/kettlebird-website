// Renders each mock-up in mockups.html to <name>.png beside this file: node render.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const names = {
  m1: '1-phone-button', m2: '2-panel-view', m3: '3-panel-move', m4: '4-whole-page', m5: '5-sideways', m6: '6-editor-grid',
  m7: '7-editor-found', m8: '8-editor-selected', m9: '9-editor-draw', m10: '10-editor-order', m11: '11-editor-whole', m12: '12-preview',
  m13: '13-editor-older-pages',
};
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('file://' + path.join(dir, 'mockups.html'));
await page.waitForLoadState('networkidle');
for (const [id, name] of Object.entries(names)) await page.locator('#' + id).screenshot({ path: path.join(dir, name + '.png') });
await browser.close();
