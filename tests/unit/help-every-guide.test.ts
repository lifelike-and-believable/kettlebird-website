// Every new guide for Star joins the online help (lead, 2026-11-03).
// Criteria: docs/specs/content-editing-help-links.md AC-12.
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { FAN_GUIDES, GUIDE_NAMES, outline } from '../../src/lib/help/guides';
import { HELP_MENU } from '../../sanity-studio/lib/help';

const files = readdirSync('docs/user').filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));

describe('content-editing-help-links#AC-12 every guide is in the help', () => {
  it('builds every guide in docs/user as a help page, except fans\' guides', () => {
    const missing = files.filter((name) => !(GUIDE_NAMES as readonly string[]).includes(name) && !(FAN_GUIDES as readonly string[]).includes(name));
    expect(missing, 'add these to GUIDE_NAMES and the Help menu (sanity-studio/lib/help.ts), or to FAN_GUIDES if they are for fans').toEqual([]);
    for (const name of [...GUIDE_NAMES, ...FAN_GUIDES]) expect(files, name).toContain(name);
  });

  it('gives every help page a summary and a place in the Help menu', () => {
    for (const name of GUIDE_NAMES) {
      expect(outline(readFileSync(`docs/user/${name}.md`, 'utf8')).summary, name).not.toBe('');
      expect(HELP_MENU.map((l) => l.path), name).toContain(`/help/${name}`);
    }
  });
});
