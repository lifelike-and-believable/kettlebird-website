// Edges of the pictures' sizes line, found by mutation testing. Criteria: docs/specs/comic-reader-page-size.md AC-3.
import { describe, expect, it } from 'vitest';
import { picturesSizesLine } from '../../sanity-studio/lib/comic-pages';

const SHARP = 'On sharp (high-density) screens, a picture looks sharpest at half its width or less.';

describe('comic-reader-page-size#AC-3 pictures\' sizes, edges', () => {
  it('leaves out pages whose width isn\'t known yet, or is 0', () => {
    expect(picturesSizesLine([{ width: 800 }, { width: 0 }, { spread: false }])).toBe(`This comic's pages are 800 pixels wide. ${SHARP}`);
    expect(picturesSizesLine([{ width: 0 }])).toBeUndefined();
  });

  it('gives a range for a comic of spreads alone', () => {
    expect(picturesSizesLine([{ width: 1600, spread: true }, { width: 2400, spread: true }])).toBe(`This comic's spreads are 1600 to 2400 pixels wide. ${SHARP}`);
  });
});
