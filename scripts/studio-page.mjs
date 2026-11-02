// Finishes the built editor page, dist/studio/index.html (content-editing-sign-in AC-3). Run by
// `npm run build:studio` after `sanity build`:
// - sets the browser tab title to the editor's title, so the sign-in screen's tab says Kettlebird
//   Creations, not "Sanity Studio" (design-sign-in, Accessibility);
// - points the icon and manifest links at /studio/static/, where the build puts them; Sanity writes
//   them as /static/ whatever the base path, so the editor's tab would have no icon.
import { readFileSync, writeFileSync } from 'node:fs';

const file = process.argv[2] ?? 'dist/studio/index.html';
const html = readFileSync(file, 'utf8');
if (!/<title>[^<]*<\/title>/.test(html)) throw new Error(`${file}: no <title> to replace`);
const finished = html
  .replace(/<title>[^<]*<\/title>/, '<title>Kettlebird Creations</title>')
  .replace(/href="\/static\//g, 'href="/studio/static/');
writeFileSync(file, finished);
