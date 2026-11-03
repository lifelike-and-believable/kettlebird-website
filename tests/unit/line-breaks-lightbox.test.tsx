// @vitest-environment jsdom
// tier:fix: an art piece's description keeps Star's line breaks when the piece is opened.
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import GalleryGrid from '../../src/components/GalleryGrid';
import type { GalleryItem } from '../../src/lib/queries';

afterEach(cleanup);

describe('line breaks in an opened piece', () => {
  it('shows each line of the description, with a gap for a blank line', async () => {
    const item: GalleryItem = {
      _id: 'a', title: 'Fox at Dawn', slug: { current: 'a' }, category: ['original'],
      image: { asset: { _ref: 'image-a-800x600-png' } }, description: 'Ink and watercolour.\nA4.\n\nFor a friend.',
    };
    const user = userEvent.setup();
    const { container } = render(<GalleryGrid items={[item]} />);
    await user.click(screen.getByRole('button', { name: 'View Fox at Dawn' }));
    const description = container.ownerDocument.querySelector('.lightbox__description')!;
    expect(description.innerHTML).toBe('Ink and watercolour.<br>A4.<br><br>For a friend.');
  });
});
