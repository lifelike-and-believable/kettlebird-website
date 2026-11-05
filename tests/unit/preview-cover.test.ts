// Link previews show the whole cover on paper, not a strip cut from it (tier:fix; the comics' design,
// design-comic-share-and-announce, and story-reader-pages AC-9). The image service crops to the
// requested size (`rect=`) unless told to ignore the image's own crop and hotspot.
import { describe, expect, it } from 'vitest';
import { fromSanity as comicFromSanity } from '../../src/lib/comics/source';
import { fromSanity as storyFromSanity } from '../../src/lib/stories/source';

const tall = { asset: { _ref: 'image-Abc123-800x1200-png' }, dimensions: { width: 800, height: 1200 }, hotspot: { x: 0.5, y: 0.2 } };

describe('link-preview covers', () => {
  it('pads a tall series cover to 1200 × 630 without cropping it', () => {
    const social = comicFromSanity({ title: 'A', slug: { current: 'a' }, coverImage: tall }).cover!.social!;
    for (const part of ['w=1200', 'h=630', 'fit=fill', 'bg=f5f1e8']) expect(social).toContain(part);
    expect(social).not.toContain('rect=');
  });

  it('pads a tall story cover the same way', () => {
    const social = storyFromSanity({ _id: 'a', title: 'A', coverImage: tall }).cover!.social!;
    for (const part of ['w=1200', 'h=630', 'fit=fill', 'bg=f5f1e8']) expect(social).toContain(part);
    expect(social).not.toContain('rect=');
  });
});
