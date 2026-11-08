// @vitest-environment jsdom
// The portfolio as folders, with subfolders: the page in the browser (folders, subfolder thumbnails,
// opening and closing, history, the arrows' state). Criteria: docs/specs/portfolio-folders.md.
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import GalleryGrid from '../../src/components/GalleryGrid';
import type { Subfolder } from '../../src/lib/portfolio/folders';
import type { GalleryItem } from '../../src/lib/queries';

const piece = (id: string, title: string, category: string[], date: string, subs?: string[]): GalleryItem => ({
  _id: id, title, slug: { current: id }, category, date, subfolders: subs,
  image: { asset: { _ref: `image-${id}aaaa-1600x900-jpg` } },
});
const items = [
  piece('f1', 'Station', ['featured', 'fanart'], '2025-06-01', ['mb']),
  piece('m1', 'Night Shift', ['fanart'], '2025-05-01', ['mb']),
  piece('m2', 'Feed', ['fanart'], '2025-04-01', ['mb']),
  piece('m3', 'Tea', ['fanart'], '2025-03-01', ['mb']),
  piece('l1', 'Officer', ['fanart'], '2025-02-01'),
  piece('b1', 'Cover', ['commission'], '2025-01-01', ['bk']),
];
const subfolders: Subfolder[] = [
  { _id: 'mb', name: 'Murderbot', slug: { current: 'murderbot' }, section: 'fanart', gridSize: 2 },
  { _id: 'bk', name: 'Book covers', slug: { current: 'book-covers' }, section: 'commission', gridSize: 3 },
];

const region = (name: string) => screen.getByRole('region', { name });

beforeEach(() => window.history.replaceState(null, '', '/portfolio'));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('portfolio-folders#AC-1 AC-5 AC-8 the page', () => {
  it('has no filter bar, a region per folder named by its tab, and a subfolder link', () => {
    render(<GalleryGrid items={items} subfolders={subfolders} />);
    expect(screen.queryByRole('navigation', { name: /filter/i })).toBeNull();
    expect(screen.getAllByRole('region').map((r) => r.getAttribute('aria-label'))).toEqual(['Featured', 'Fan Work', 'Past Clients']);
    const link = within(region('Fan Work')).getByRole('link', { name: 'Murderbot, 4 pieces' });
    expect(link.getAttribute('href')).toBe('/portfolio/fan-work/murderbot');
    expect(link.querySelectorAll('img')).toHaveLength(4);
    for (const img of link.querySelectorAll('img')) expect(img.getAttribute('alt')).toBe('');
    // Featured holds the piece loose.
    expect(within(region('Featured')).getByRole('button', { name: 'View Station' })).toBeTruthy();
    expect(within(region('Fan Work')).queryByRole('button', { name: 'View Station' })).toBeNull();
    // No INDEX at the top level.
    expect(screen.queryByRole('link', { name: /^Index/ })).toBeNull();
  });
  it("shows a row that fits with both arrows that can't be used", () => {
    render(<GalleryGrid items={items} subfolders={subfolders} />);
    const arrows = within(region('Fan Work')).getAllByRole('button', { name: /^Scroll/ });
    expect(arrows.map((a) => a.getAttribute('aria-disabled'))).toEqual(['true', 'true']);
    expect(arrows.map((a) => a.tabIndex)).toEqual([-1, -1]);
  });
  it('fills a 3 × 3 grid with empty cells', () => {
    render(<GalleryGrid items={items} subfolders={subfolders} />);
    const link = within(region('Past Clients')).getByRole('link', { name: 'Book covers, 1 piece' });
    expect(link.querySelectorAll('img')).toHaveLength(1);
    expect(link.querySelectorAll('[data-cell]')).toHaveLength(9);
  });
});

describe('portfolio-folders#AC-9 AC-10 AC-11 open and close', () => {
  it('opens a subfolder in its folder, names the tab, announces it and moves focus', async () => {
    const user = userEvent.setup();
    const push = vi.spyOn(window.history, 'pushState');
    render(<GalleryGrid items={items} subfolders={subfolders} />);
    await user.click(screen.getByRole('link', { name: 'Murderbot, 4 pieces' }));
    const open = region('Fan Work: Murderbot');
    expect(within(open).getAllByRole('button', { name: /^View / }).map((b) => b.getAttribute('aria-label'))).toEqual([
      'View Station', 'View Night Shift', 'View Feed', 'View Tea',
    ]);
    expect(within(open).getByRole('link', { name: 'Index: back to Fan Work' }).getAttribute('href')).toBe('/portfolio');
    expect(screen.getByRole('status').textContent).toBe('Fan Work: Murderbot, 4 pieces.');
    expect(document.activeElement?.getAttribute('aria-label')).toBe('View Station');
    expect(push).toHaveBeenCalledTimes(1);
    expect(window.location.pathname).toBe('/portfolio/fan-work/murderbot');
    // The other folders are unchanged.
    expect(region('Featured')).toBeTruthy();
  });
  it('INDEX goes back to the top level, with focus on the thumbnail', async () => {
    const user = userEvent.setup();
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {
      window.history.replaceState(null, '', '/portfolio');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    render(<GalleryGrid items={items} subfolders={subfolders} />);
    await user.click(screen.getByRole('link', { name: 'Murderbot, 4 pieces' }));
    await user.click(screen.getByRole('link', { name: 'Index: back to Fan Work' }));
    expect(back).toHaveBeenCalledTimes(1);
    expect(region('Fan Work')).toBeTruthy();
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Murderbot, 4 pieces');
  });
  it('one subfolder is open at a time', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid items={items} subfolders={subfolders} />);
    await user.click(screen.getByRole('link', { name: 'Murderbot, 4 pieces' }));
    await user.click(screen.getByRole('link', { name: 'Book covers, 1 piece' }));
    expect(region('Fan Work')).toBeTruthy();
    expect(region('Past Clients: Book covers')).toBeTruthy();
  });
});

describe('portfolio-folders#AC-12 AC-13 history', () => {
  it('opened at its address, INDEX replaces the entry with the Portfolio', async () => {
    window.history.replaceState(null, '', '/portfolio/fan-work/murderbot');
    const user = userEvent.setup();
    const back = vi.spyOn(window.history, 'back');
    const replace = vi.spyOn(window.history, 'replaceState');
    render(<GalleryGrid items={items} subfolders={subfolders} openSubfolder="mb" />);
    expect(region('Fan Work: Murderbot')).toBeTruthy();
    await user.click(screen.getByRole('link', { name: 'Index: back to Fan Work' }));
    expect(back).not.toHaveBeenCalled();
    expect(replace).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/portfolio');
    expect(region('Fan Work')).toBeTruthy();
  });
  it('Back and Forward show what the address says, and close an open piece', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid items={items} subfolders={subfolders} />);
    await user.click(screen.getByRole('link', { name: 'Murderbot, 4 pieces' }));
    await user.click(screen.getByRole('button', { name: 'View Feed' }));
    expect(screen.getByRole('dialog', { name: 'Feed' })).toBeTruthy();
    act(() => {
      window.history.replaceState(null, '', '/portfolio');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(region('Fan Work')).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe('Fan Work, 5 pieces.');
    act(() => {
      window.history.replaceState(null, '', '/portfolio/past-clients/book-covers');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(region('Past Clients: Book covers')).toBeTruthy();
  });
  it('never changes the address in Preview', async () => {
    window.history.replaceState(null, '', '/preview/portfolioSubfolder/mb');
    const user = userEvent.setup();
    const push = vi.spyOn(window.history, 'pushState');
    render(<GalleryGrid items={items} subfolders={subfolders} preview />);
    await user.click(screen.getByRole('link', { name: 'Murderbot, 4 pieces' }));
    expect(region('Fan Work: Murderbot')).toBeTruthy();
    expect(push).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe('/preview/portfolioSubfolder/mb');
  });
  it('a modified click follows the link', () => {
    render(<GalleryGrid items={items} subfolders={subfolders} />);
    const link = screen.getByRole('link', { name: 'Murderbot, 4 pieces' });
    fireEvent.click(link, { ctrlKey: true });
    expect(region('Fan Work')).toBeTruthy();
  });
});

describe('portfolio-folders#AC-23 empty subfolder in Preview', () => {
  it('says how to fill it', () => {
    const empty: Subfolder = { _id: 'new', name: 'Murderbot', slug: { current: 'murderbot' }, section: 'fanart', gridSize: 2 };
    render(<GalleryGrid items={[piece('l1', 'Officer', ['fanart'], '2025-02-01')]} subfolders={[empty]} openSubfolder="new" preview />);
    expect(within(region('Fan Work: Murderbot')).getByText("No pieces in Murderbot yet. Put pieces in it from each piece's Subfolders.")).toBeTruthy();
  });
});
