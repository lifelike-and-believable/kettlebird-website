// Edge cases mutation testing found for the arrow's markup. Criteria: docs/specs/site-arrows.md.
import { describe, expect, it } from 'vitest';
import { arrowSvg } from '../../src/lib/arrows';

describe('site-arrows#AC-1 the shape', () => {
  it('writes the markup exactly, attributes apart, with no class unless one is given', () => {
    expect(arrowSvg('next')).toBe(
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-arrow="next">' +
        '<path d="M8 5.5 L18 12 L8 18.5 Z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>',
    );
    expect(arrowSvg('up', 'arrow-inline')).toBe(
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-arrow="up" class="arrow-inline">' +
        '<path d="M5.5 16 L18.5 16 L12 6 Z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>',
    );
  });
});
