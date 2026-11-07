// @vitest-environment jsdom
// The portfolio's sections: Featured is always the top-most carousel (and first in the Index),
// whatever other sections there are. tier:fix: it came fourth, after Past Clients.
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import GalleryGrid from '../../src/components/GalleryGrid';
import type { GalleryItem } from '../../src/lib/queries';

const item = (id: string, category: string[]): GalleryItem => ({
  _id: id, title: id, slug: { current: id }, category,
  image: { asset: { _ref: `image-${id}-800x600-png` } },
});

const sections = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('section[data-cat]')).map((s) => s.getAttribute('data-cat'));

const index = () =>
  Array.from(screen.getByRole('navigation', { name: 'Filter gallery by category' }).querySelectorAll('button')).map(
    (b) => b.textContent,
  );

afterEach(cleanup);

describe('portfolio section order', () => {
  it('puts Featured above every other section', () => {
    const { container } = render(
      <GalleryGrid
        items={[
          item('a', ['original']),
          item('b', ['fanart']),
          item('c', ['commission']),
          item('d', ['wip']),
          item('e', ['featured']),
          item('f', ['somethingNew']),
        ]}
      />,
    );
    expect(sections(container)).toEqual(['featured', 'original', 'fanart', 'commission', 'wip', 'somethingNew']);
    expect(index()).toEqual(['All', 'Featured', 'Original Work', 'Fan Work', 'Past Clients', 'Work in Progress', 'somethingNew']);
  });

  it('puts Featured first when its pieces are also in other sections', () => {
    const { container } = render(<GalleryGrid items={[item('a', ['original', 'featured']), item('b', ['commission'])]} />);
    expect(sections(container)).toEqual(['featured', 'original', 'commission']);
  });

  it('leaves the other sections in their order when nothing is featured', () => {
    const { container } = render(<GalleryGrid items={[item('a', ['wip']), item('b', ['original']), item('c', ['fanart'])]} />);
    expect(sections(container)).toEqual(['original', 'fanart', 'wip']);
  });
});
