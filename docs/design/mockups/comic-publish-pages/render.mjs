// Renders each .frame in mockups.html to <name>.png beside this file: node render.mjs [id ...]
// With ids, renders only those frames.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const names = {
  m1: '1-series-chapters', m2: '2-chapter-pages', m3: '3-page-alt-text', m4: '4-moved-page-warning',
  m5: '5-publish-status', m6: '6-new-series-chapter', m7: '7-upload-problems', m8: '8-cant-publish',
  m9: '9-link-warnings', m10: '10-alt-text-reminder', m11: '11-delete-comic',
};
const only = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
await page.goto('file://' + path.join(dir, 'mockups.html'));
for (const [id, name] of Object.entries(names)) {
  if (only.length && !only.includes(id)) continue;
  await page.locator('#' + id).screenshot({ path: path.join(dir, name + '.png') });
}
await browser.close();
