#!/usr/bin/env node
// After a build: no draft document and not the preview token in any built file.
// Spec: docs/specs/content-editing-preview.md (AC-9).
// Usage: node scripts/check-no-drafts.mjs [dir...]  (defaults to the built site's folders that exist)
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DRAFT_ID = /["']_id["']\s*:\s*["'](drafts\.[^"']+)["']/;

/** files: path -> contents. Returns one line per leak. */
export function findLeaks(files, token) {
  const leaks = [];
  for (const [path, contents] of Object.entries(files)) {
    const draft = DRAFT_ID.exec(contents);
    if (draft) leaks.push(`${path}: a draft document (${draft[1]})`);
    if (token && contents.includes(token)) leaks.push(`${path}: the preview token`);
  }
  return leaks;
}

function readTree(dir, root = dir, out = {}) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) readTree(path, root, out);
    else if (/\.(html|js|mjs|json|css|txt|xml)$/.test(name)) out[relative(root, path)] = readFileSync(path, 'utf8');
  }
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dirs = process.argv.slice(2);
  const targets = dirs.length ? dirs : ['dist/client', '.vercel/output/static', 'dist'].filter((d) => existsSync(d)).slice(0, 2);
  const leaks = targets.flatMap((dir) => findLeaks(readTree(dir), process.env.SANITY_PREVIEW_TOKEN).map((l) => `${dir}/${l}`));
  if (leaks.length) {
    console.error(`Unpublished content or the preview token reached the built site:\n${leaks.join('\n')}`);
    process.exit(1);
  }
  console.log(`No drafts or preview token in ${targets.join(', ')}.`);
}
