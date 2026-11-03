// Reads Star's guides from docs/user at build time (docs/specs/content-editing-help-links.md AC-1).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadGuides, type Guide } from './guides';

let cached: Guide[] | undefined;

export function helpGuides(): Guide[] {
  cached ??= loadGuides((name) => readFileSync(join(process.cwd(), 'docs', 'user', `${name}.md`), 'utf8'));
  return cached;
}
