// Scans the built site for placeholder copy. Criteria: docs/specs/clear-placeholders.md.
// Needs a build in dist/ (npm run build:fixtures runs before the end-to-end tests; the test job
// and `npm test` build first).
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const DIST = 'dist';
const PHRASES = [
  'Lorem ipsum', '[Insert', 'Portrait coming soon', 'Bio coming soon', 'Artist statement coming soon',
  'terms of service coming soon', 'Adventure Time', 'Gravity Falls', 'Steven Universe', 'My Hero Academia', 'She-Ra',
];

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? htmlFiles(path) : path.endsWith('.html') ? [path] : [];
  });
}

describe('clear-placeholders#AC-5 no placeholder copy in the build', () => {
  it.skipIf(!existsSync(DIST))('finds none of the placeholder phrases in any page', () => {
    const hits: string[] = [];
    for (const file of htmlFiles(DIST)) {
      const html = readFileSync(file, 'utf8').toLowerCase();
      for (const phrase of PHRASES) if (html.includes(phrase.toLowerCase())) hits.push(`${file}: ${phrase}`);
    }
    expect(hits).toEqual([]);
  });
});

describe('clear-placeholders#AC-6 placeholder logo removed', () => {
  it('has no placeholder logo file', () => {
    expect(existsSync('public/assets/images/logo-primary_Placeholder.jpg')).toBe(false);
  });
});
