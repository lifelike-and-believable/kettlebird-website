// The typewriter under the story's sheet: its markup and styles, the drawing, and the style guide.
// Criteria: docs/specs/story-typewriter.md.
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => (existsSync(path) ? readFileSync(path, 'utf8') : '');
const TEXT = 'src/components/stories/StoryText.astro';
const DRAWING = 'src/components/stories/Typewriter.astro';

describe('story-typewriter#AC-2 drawing only', () => {
  it('marks the typewriter decorative and lets taps through', () => {
    const src = read(TEXT);
    expect(src).toMatch(/<div class="story-typewriter" aria-hidden="true">\s*<Typewriter \/>\s*<\/div>/);
    expect(src).toMatch(/\.story-typewriter \{[^}]*pointer-events: none/);
    const drawing = read(DRAWING);
    expect(drawing).toContain('focusable="false"');
    expect(drawing).not.toMatch(/<a\b|tabindex/);
  });
});

describe('story-typewriter#AC-6 sheet', () => {
  it('sticks to the screen\'s bottom inside the sheet, which ends inside the machine', () => {
    const src = read(TEXT);
    for (const rule of [
      'position: sticky',
      'bottom: 0',
      'padding-bottom: 0',
      'margin-top: clamp(1.5rem, 3vw, 2.5rem)',
      '--typewriter-width: calc((100% + 2 * var(--sheet-pad)) / 0.8)',
    ]) {
      expect(src, rule).toContain(rule);
    }
  });
});

describe('story-typewriter#AC-10 drawing', () => {
  it('is the design\'s stand-in, with the nameplate, in one component', () => {
    const drawing = read(DRAWING);
    expect(drawing).toContain('viewBox="0 0 1000 130"');
    expect(drawing).toContain('KETTLEBIRD');
    expect(read(TEXT)).toContain("import Typewriter from './Typewriter.astro'");
  });
});

describe('story-typewriter#AC-12 style guide', () => {
  it('describes the typewriter in the story text entry', () => {
    const guide = read('docs/STYLE_GUIDE.md');
    const entry = guide.slice(guide.indexOf('### Story text'));
    expect(entry).toMatch(/typewriter/i);
    expect(entry).toMatch(/Star/);
  });
});
