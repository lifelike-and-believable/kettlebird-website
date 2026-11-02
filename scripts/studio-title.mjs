// Sets the browser tab title of the built editor (dist/studio/index.html) to the editor's title, so
// the sign-in screen's tab says Kettlebird Creations, not "Sanity Studio" (content-editing-sign-in
// AC-3; design-sign-in, Accessibility). Run by `npm run build:studio` after `sanity build`.
import { readFileSync, writeFileSync } from 'node:fs';

const file = process.argv[2] ?? 'dist/studio/index.html';
const html = readFileSync(file, 'utf8');
const titled = html.replace(/<title>[^<]*<\/title>/, '<title>Kettlebird Creations</title>');
if (titled === html && !html.includes('<title>Kettlebird Creations</title>')) {
  throw new Error(`${file}: no <title> to replace`);
}
writeFileSync(file, titled);
