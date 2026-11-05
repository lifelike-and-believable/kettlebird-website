// Edges of full screen's pure parts, found by mutation testing. Criteria: docs/specs/portfolio-full-screen.md.
import { describe, expect, it } from 'vitest';
import { fitted, keyAction, openedSection, originalSize, swipeTurn, turnOrder } from '../../src/lib/portfolio/full-screen';
import type { GalleryItem } from '../../src/lib/queries';

const bare = (over: Partial<GalleryItem>): GalleryItem => ({ _id: 'x', title: 'X', slug: { current: 'x' }, ...over }) as GalleryItem;

describe('portfolio-full-screen#AC-11 order: edges', () => {
  it('leaves out pieces with no category, or a picture without an asset', () => {
    const items = [
      bare({ _id: 'a', category: ['original'], image: { asset: { _ref: 'image-a-10x10-png' } } }),
      bare({ _id: 'b', image: { asset: { _ref: 'image-b-10x10-png' } } }),
      bare({ _id: 'c', category: ['original'], image: {} as GalleryItem['image'] }),
    ];
    expect(turnOrder(items, 'original').map((p) => p._id)).toEqual(['a']);
    expect(openedSection(bare({}), undefined)).toBeUndefined();
  });
});

describe('portfolio-full-screen#AC-4 picture sizes: edges', () => {
  it('reads the size only from the end of the asset id', () => {
    expect(originalSize('image-a-10x20-png.webp')).toBeUndefined();
    expect(originalSize('image-a-10x20-png')).toEqual({ width: 10, height: 20 });
  });

  it('fits a picture by whichever side meets the view first', () => {
    expect(fitted({ width: 3000, height: 2000 }, { width: 1280, height: 800 })).toEqual({ width: 1200, height: 800 });
    expect(fitted({ width: 1000, height: 2000 }, { width: 400, height: 1000 })).toEqual({ width: 400, height: 800 });
  });
});

describe('portfolio-full-screen#AC-10 turning: edges', () => {
  it('doesn\'t turn on an exactly diagonal swipe', () => {
    expect(swipeTurn({ dx: -60, dy: 60, startX: 200, zoomed: false })).toBeUndefined();
    expect(swipeTurn({ dx: -60, dy: 59, startX: 200, zoomed: false })).toBe('next');
  });

  it('moves a zoomed piece with every arrow but plain Left and Right', () => {
    expect(keyAction({ key: 'ArrowDown', shift: true, zoomed: true })).toEqual({ pan: { dx: 0, dy: -1 } });
    expect(keyAction({ key: 'ArrowUp', shift: false, zoomed: true })).toEqual({ pan: { dx: 0, dy: 1 } });
    expect(keyAction({ key: 'Enter', shift: true, zoomed: true })).toBeUndefined();
  });
});
