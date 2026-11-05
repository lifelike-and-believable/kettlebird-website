// @vitest-environment jsdom
// Full screen from the portfolio's dialog: opening, focus, keys, turning, announcements and leaving.
// jsdom has no Fullscreen API, so these run the window-covering view. Criteria: docs/specs/portfolio-full-screen.md.
import { act, cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import GalleryGrid from '../../src/components/GalleryGrid';
import type { GalleryItem } from '../../src/lib/queries';

const item = (id: string, title: string, category: string[], picture = true, altText?: string): GalleryItem => ({
  _id: id,
  title,
  slug: { current: id },
  category,
  altText,
  image: picture ? { asset: { _ref: `image-${id}aaaa-3000x2000-jpg` } } : (undefined as unknown as GalleryItem['image']),
});
const items = [
  item('a', 'Night Market', ['original'], true, 'Lanterns over the river.'),
  item('b', 'Late Night Alibi', ['original', 'fanart']),
  item('c', 'Blank', ['original'], false),
  item('d', 'Jungle Eyes', ['original']),
];

afterEach(cleanup);

const view = () => screen.getByRole('dialog', { name: 'Full screen' });
const said = () => document.querySelector('[data-fs-announce]')?.textContent;

async function openFullScreen(title: string, section?: string) {
  const user = userEvent.setup();
  render(<GalleryGrid items={items} />);
  const where = section ? within(screen.getByRole('region', { name: section })) : screen;
  await user.click(where.getAllByRole('button', { name: `View ${title}` })[0]);
  await user.click(within(screen.getByRole('dialog', { name: title })).getByRole('button', { name: 'Full screen' }));
  return user;
}

describe('portfolio-full-screen#AC-1 AC-2 opening', () => {
  it('offers Full screen in a dialog whose piece has a picture, and not otherwise', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid items={items} />);
    await user.click(screen.getByRole('button', { name: 'View Blank' }));
    expect(within(screen.getByRole('dialog', { name: 'Blank' })).queryByRole('button', { name: 'Full screen' })).toBeNull();
  });

  it('opens the view on the piece, with Close focused, covering the window with a history entry', async () => {
    const before = history.length;
    await openFullScreen('Night Market');
    expect(view()).toBeTruthy();
    expect(view().getAttribute('aria-modal')).toBe('true');
    expect(document.activeElement).toBe(within(view()).getByRole('button', { name: 'Close' }));
    expect(history.length).toBe(before + 1);
    expect(within(view()).getByText('Night Market')).toBeTruthy();
  });

  it('opens from a click on the dialog\'s picture too', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid items={items} />);
    await user.click(screen.getAllByRole('button', { name: 'View Jungle Eyes' })[0]);
    await user.click(within(screen.getByRole('dialog', { name: 'Jungle Eyes' })).getByRole('img'));
    expect(view()).toBeTruthy();
  });
});

describe('portfolio-full-screen#AC-13 accessibility', () => {
  it('says the title, where it is and what it shows', async () => {
    await openFullScreen('Night Market');
    expect(said()).toBe('Night Market, 1 of 3. Lanterns over the river.');
    expect(within(view()).getByText('1 of 3 · Original Work')).toBeTruthy();
  });

  it('marks controls that can\'t be used and skips them with Tab', async () => {
    const user = await openFullScreen('Night Market');
    const previous = within(view()).getByRole('button', { name: 'Previous' });
    expect(previous.getAttribute('aria-disabled')).toBe('true');
    expect(previous.tabIndex).toBe(-1);
    expect(within(view()).getByRole('button', { name: 'Fit' }).getAttribute('aria-disabled')).toBe('true');
    expect(within(view()).getByRole('button', { name: 'Zoom out' }).getAttribute('aria-disabled')).toBe('true');
    // Focus stays inside the view.
    for (let i = 0; i < 8; i++) {
      await user.tab();
      expect(view().contains(document.activeElement)).toBe(true);
    }
  });

  it('says the new zoom when a button or key changes it', async () => {
    const user = await openFullScreen('Night Market');
    await user.click(within(view()).getByRole('button', { name: 'Zoom in' }));
    expect(said()).toBe('150%');
    await user.keyboard('0');
    expect(said()).toBe('100%');
  });
});

describe('portfolio-full-screen#AC-10 AC-11 turning', () => {
  it('turns with Next and the arrow keys through the section, skipping pieces without a picture', async () => {
    const user = await openFullScreen('Late Night Alibi', 'Original Work');
    await user.click(within(view()).getByRole('button', { name: 'Next' }));
    expect(said()).toBe('Jungle Eyes, 3 of 3.');
    expect(within(view()).getByRole('button', { name: 'Next' }).getAttribute('aria-disabled')).toBe('true');
    await user.keyboard('{ArrowLeft}');
    expect(said()).toBe('Late Night Alibi, 2 of 3.');
  });

  it('turns through the section it was opened from', async () => {
    await openFullScreen('Late Night Alibi', 'Fan Work');
    expect(said()).toBe('Late Night Alibi, 1 of 1.');
    expect(within(view()).getByText('1 of 1 · Fan Work')).toBeTruthy();
  });
});

describe('portfolio-full-screen#AC-3 leaving', () => {
  it('closes only the view on Escape, back on the dialog of the piece last shown, focus on Full screen', async () => {
    const user = await openFullScreen('Night Market');
    await user.keyboard('{ArrowRight}');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Full screen' })).toBeNull();
    const dialog = screen.getByRole('dialog', { name: 'Late Night Alibi' });
    expect(document.activeElement).toBe(within(dialog).getByRole('button', { name: 'Full screen' }));
    // The dialog's Close then returns focus to that piece in the gallery.
    await user.click(within(dialog).getByRole('button', { name: 'Close' }));
    expect(document.activeElement?.getAttribute('aria-label')).toBe('View Late Night Alibi');
    expect(document.activeElement?.closest('[aria-label="Original Work"]')).toBeTruthy();
  });

  it('closes with Close, and with Back where it covers the window', async () => {
    const user = await openFullScreen('Night Market');
    await user.click(within(view()).getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog', { name: 'Full screen' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Night Market' })).toBeTruthy();
    await user.click(within(screen.getByRole('dialog', { name: 'Night Market' })).getByRole('button', { name: 'Full screen' }));
    await act(async () => {
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    });
    expect(screen.queryByRole('dialog', { name: 'Full screen' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Night Market' })).toBeTruthy();
  });
});

describe('portfolio-full-screen#AC-9 hiding the controls', () => {
  it('keeps hidden controls in the accessibility tree, and brings them back on a key press', async () => {
    const user = await openFullScreen('Night Market');
    const bars = view().querySelector('[data-fs-controls]')!;
    await user.click(view().querySelector('[data-fs-stage]')!);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 350));
    });
    expect(bars.getAttribute('data-hidden')).toBe('true');
    expect(within(view()).getByRole('button', { name: 'Close' })).toBeTruthy();
    await user.keyboard('{Shift}');
    expect(bars.getAttribute('data-hidden')).toBe('false');
  });
});
