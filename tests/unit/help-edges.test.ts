// Edge cases of rendering the guides, found by mutation testing.
// Criteria: docs/specs/content-editing-help-links.md (AC-2, AC-3, AC-4, AC-5, AC-10).
import { describe, expect, it } from 'vitest';
import { addressProblem, outline, renderGuide, type Guide } from '../../src/lib/help/guides';

describe('content-editing-help-links#AC-3 summaries', () => {
  it('is empty without front matter, without a summary line, or for a key that only ends in summary', () => {
    expect(outline('# A\n\nText.').summary).toBe('');
    expect(outline('---\nid: x\n---\n# A').summary).toBe('');
    expect(outline('---\nshortsummary: "No."\n---\n# A').summary).toBe('');
    expect(outline('---\nsummary: "Yes." # a note\n---\n# A').summary).toBe('');
    expect(outline('---\nid: x\nsummary: "Yes."\n---\n# A').summary).toBe('Yes.');
  });

  it('reads front matter only at the very start', () => {
    const md = '# A\n\nText.\n\n---\nsummary: "No."\n---\n\nMore.';
    expect(outline(md).summary).toBe('');
    expect(renderGuide('a', md, { a: ['a'] }).html).toContain('More.');
  });
});

describe('content-editing-help-links#AC-2 titles', () => {
  it('has an empty title without a # heading, and keeps the rest', () => {
    const o = outline('## Only a part\n\nText.');
    expect(o.title).toBe('');
    expect(o.sections).toEqual([{ id: 'only-a-part', title: 'Only a part' }]);
    expect(renderGuide('a', '## Only a part', { a: o.ids }).html).toContain('<h2 id="only-a-part">');
  });

  it('removes only the title, not another heading or paragraph', () => {
    const html = renderGuide('a', '# Title\n\nFirst.\n\n## Part', { a: ['title', 'part'] }).html;
    expect(html).toBe('<p>First.</p>\n<h2 id="part">Part</h2>');
  });
});

describe('content-editing-help-links#AC-4 links that aren\'t to guides', () => {
  const known = { a: ['top'], b: ['b'] };
  it('leaves addresses that only contain a guide\'s file name alone', () => {
    const html = renderGuide('a', '# Top\n\n[x](https://example.com/b.md) [y](b.md.txt) [z](../b.md)', known).html;
    expect(html).toContain('href="https://example.com/b.md"');
    expect(html).toContain('href="b.md.txt"');
    expect(html).toContain('href="../b.md"');
  });
});

describe('content-editing-help-links#AC-5 table names', () => {
  it('names a table by its header cells only, with one wrapper per table', () => {
    const md = '# T\n\n| Who | Does what |\n|---|---|\n| **Star** | Draws |\n\n| One |\n|---|\n| two |';
    const html = renderGuide('a', md, { a: ['t'] }).html;
    expect(html.match(/class="help-table"/g)).toHaveLength(2);
    expect(html).toContain('aria-label="Who, does what"');
    expect(html).toContain('aria-label="One"');
    expect(html).not.toMatch(/<p>\s*<div/);
  });

  it('skips an empty header cell, as in a table whose first column has no heading', () => {
    const html = renderGuide('a', '# T\n\n| | Open | Closed |\n|---|---|---|\n| Banner | Green | Orange |', { a: ['t'] }).html;
    expect(html).toContain('aria-label="Open, closed"');
  });
});

describe('content-editing-help-links#AC-10 addresses', () => {
  const guides = [{ name: 'site-settings', ids: ['open'] } as Guide];
  it('accepts only /help and /help/<guide>[#section] exactly', () => {
    expect(addressProblem('/help', guides)).toBeUndefined();
    expect(addressProblem('/help/site-settings', guides)).toBeUndefined();
    expect(addressProblem('/help/site-settings#open', guides)).toBeUndefined();
    expect(addressProblem('/x/help/site-settings', guides)).toMatch(/isn't a help address/);
    expect(addressProblem('/help/site-settings/more', guides)).toMatch(/isn't a help address/);
  });
});
