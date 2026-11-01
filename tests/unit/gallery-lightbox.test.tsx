// @vitest-environment jsdom
// The portfolio lightbox is a keyboard-accessible dialog (REQ-site: WCAG 2.1 AA; every interactive
// element reachable and usable by keyboard). tier:fix: it didn't take focus, close on Escape, keep
// focus inside, or return focus to the piece that opened it.
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import GalleryGrid from '../../src/components/GalleryGrid';
import type { GalleryItem } from '../../src/lib/queries';

const item = (id: string, title: string): GalleryItem => ({
  _id: id, title, slug: { current: id }, category: ['original'],
  image: { asset: { _ref: `image-${id}-800x600-png` } },
});
const items = [item('a', 'Fox at Dawn'), item('b', 'Kettle Study')];

afterEach(cleanup);

describe('portfolio lightbox (keyboard)', () => {
  it('moves focus into the dialog when it opens', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid items={items} />);
    await user.click(screen.getByRole('button', { name: 'View Fox at Dawn' }));
    const dialog = screen.getByRole('dialog', { name: 'Fox at Dawn' });
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('closes on Escape and returns focus to the piece that opened it', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid items={items} />);
    const card = screen.getByRole('button', { name: 'View Kettle Study' });
    card.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('dialog', { name: 'Kettle Study' })).toBeTruthy();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(card);
  });

  it('returns focus to the piece after Close too', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid items={items} />);
    const card = screen.getByRole('button', { name: 'View Fox at Dawn' });
    await user.click(card);
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(card);
  });

  it('keeps Tab and Shift+Tab inside the dialog', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid items={items} />);
    await user.click(screen.getByRole('button', { name: 'View Fox at Dawn' }));
    const dialog = screen.getByRole('dialog');
    for (const keys of ['{Tab}', '{Tab}', '{Shift>}{Tab}{/Shift}']) {
      await user.keyboard(keys);
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });
});
