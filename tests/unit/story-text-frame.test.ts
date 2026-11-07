// The white sheet behind the story text: its styles, the column pictures fill, and the style guide.
// Criteria: docs/specs/story-text-frame.md.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { pictureSizes, STORY_COLUMN } from '../../src/lib/stories/text';

const read = (path: string) => readFileSync(path, 'utf8');

describe('story-text-frame#AC-1 AC-4 sheet', () => {
  it('styles the story text as the design\'s sheet', () => {
    const css = read('src/components/stories/StoryText.astro');
    for (const rule of [
      'box-sizing: content-box',
      'background: #fff',
      'box-shadow: var(--shadow-paper)',
      '--sheet-pad: clamp(1rem, (100vw - 65ch) / 2 - 1rem, 3rem)',
      'padding: clamp(1.5rem, 3vw, 2.5rem) var(--sheet-pad)',
      'margin-inline: max(-1 * var(--sheet-pad), (100% - 65ch) / 2 - var(--sheet-pad))',
    ]) {
      expect(css, rule).toContain(rule);
    }
    expect(css).not.toMatch(/\.story-text \{[^}]*border:/);
  });
});

describe('story-text-frame#AC-5 pictures', () => {
  it('asks for the column as it is: 100vw - 4rem on a phone, 50rem on a computer', () => {
    expect(STORY_COLUMN).toBe('min(100vw - 4rem, 50rem)');
    expect(pictureSizes(2400)).toBe('min(2400px, 100vw - 4rem, 50rem)');
    expect(pictureSizes(300)).toBe('min(300px, 100vw - 4rem, 50rem)');
  });
});

describe('story-text-frame#AC-8 style guide', () => {
  it('records the sheet as the story text\'s style', () => {
    const guide = read('docs/STYLE_GUIDE.md');
    expect(guide).toContain('### Story text');
    expect(guide).toMatch(/white sheet/i);
  });
});
