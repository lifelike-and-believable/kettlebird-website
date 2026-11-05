// A story's text as HTML (docs/specs/story-reader-pages.md AC-4).
import { describe, expect, it } from 'vitest';
import { storyHtml } from '../../src/lib/stories/text';
import { FIXTURE_STORIES } from '../fixtures/stories';

const HR = '<hr class="scene-break" aria-label="Scene break">';
const span = (text: string, marks: string[] = []) => ({ _type: 'span', text, marks });
const block = (...children: ReturnType<typeof span>[]) => ({ _type: 'block', style: 'normal', children });

describe('story-reader-pages#AC-4 text', () => {
  it('keeps paragraphs, italics, bold, line breaks and scene breaks, and escapes everything else', () => {
    expect(storyHtml(FIXTURE_STORIES[0].text)).toBe(
      '<p>The kettle began to sing at <em>midnight</em>, as it always did.</p>' +
        '<p>Nobody in the house <strong>ever</strong> slept through it.</p>' +
        HR +
        '<p>In the morning, the fox came back.<br>She brought bread.</p>' +
        HR +
        '<p>And that &lt;was&gt; the end &amp; the beginning.</p>',
    );
  });

  it('nests both marks, and drops unknown marks, objects and empty paragraphs', () => {
    expect(storyHtml([block(span('both', ['strong', 'em', 'underline']))])).toBe('<p><em><strong>both</strong></em></p>');
    expect(storyHtml([{ _type: 'image' }, block(span('   ')), block(span('"q" \'a\''))])).toBe('<p>&quot;q&quot; &#39;a&#39;</p>');
    expect(storyHtml([])).toBe('');
  });

  it('never puts two scene breaks together, or one at the start or end', () => {
    expect(storyHtml([{ _type: 'sceneBreak' }, block(span('A')), { _type: 'sceneBreak' }, block(span('~')), block(span('B')), { _type: 'sceneBreak' }])).toBe(
      `<p>A</p>${HR}<p>B</p>`,
    );
  });
});
