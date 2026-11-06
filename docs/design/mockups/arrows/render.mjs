// Renders each .frame in mockups.html to <name>.png beside this file: node render.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const names = {
  f1: '1-shape',
  f2: '2-comic-controls',
  f3: '3-comic-edge',
  f4: '4-carousel',
  f5: '5-full-screen-laptop',
  f6: '6-full-screen-phone',
  f7: '7-states',
  f8: '8-arrows-in-words',
  f9: '9-text-200-narrow',
};
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 1000 } });
await page.goto('file://' + path.join(dir, 'mockups.html'), { waitUntil: 'networkidle' });
await page.waitForSelector('body[data-ready=yes]');
for (const [id, name] of Object.entries(names)) {
  await page.locator('#' + id).screenshot({ path: path.join(dir, name + '.png') });
}
await browser.close();
