// @vitest-environment jsdom
// Oldest first in a subfolder: the page in the browser (the thumbnail, its place, the open row).
// Criteria: docs/specs/portfolio-order.md.
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import GalleryGrid from '../../src/components/GalleryGrid';
import type { Subfolder } from '../../src/lib/portfolio/folders';
import type { GalleryItem } from '../../src/lib/queries';

const piece = (id: string, title: string, date: string, subs?: string[]): GalleryItem => ({
  _id: id, title, slug: { current: id }, category: ['fanart'], date, subfolders: subs,
  image: { asset: { _ref: `image-${id}xxxx-1600x900-jpg` } },
});
const items = [
  piece('m5', 'Station', '2025-06-01', ['mb']),
  piece('m4', 'Night Shift', '2025-05-01', ['mb']),
  piece('m3', 'Feed', '2025-04-01', ['mb']),
  piece('m2', 'Tea', '2025-03-01', ['mb']),
  piece('m1', 'Arrival', '2025-02-01', ['mb']),
  piece('l1', 'Officer', '2025-05-15'),
];
const murderbot = (order?: 'newest' | 'oldest'): Subfolder[] => [
  { _id: 'mb', name: 'Murderbot', slug: { current: 'murderbot' }, section: 'fanart', gridSize: 2, ...(order ? { order } : {}) },
];
const region = (name: string) => screen.getByRole('region', { name });
const gridIds = (link: HTMLElement) => Array.from(link.querySelectorAll('img')).map((img) => /images\/[^/]+\/[^/]+\/(m\d)xxxx/.exec(img.getAttribute('src') ?? '')?.[1]);

beforeEach(() => window.history.replaceState(null, '', '/portfolio'));
afterEach(() => cleanup());

describe('portfolio-order#AC-2 AC-3 the thumbnail', () => {
  it("shows an oldest-first subfolder's oldest pieces, where its newest piece would be", () => {
    render(<GalleryGrid items={items} subfolders={murderbot('oldest')} />);
    const folder = region('Fan Work');
    const link = within(folder).getByRole('link', { name: 'Murderbot, 5 pieces' });
    expect(gridIds(link)).toEqual(['m1', 'm2', 'm3', 'm4']);
    // Its newest piece (June) is newer than Officer (May 15), so it comes first.
    const order = Array.from(folder.querySelectorAll('.carousel__track > *')).map((el) => el.getAttribute('aria-label'));
    expect(order).toEqual(['Murderbot, 5 pieces', 'View Officer']);
  });
  it('shows the newest pieces when newest first or unset', () => {
    for (const order of ['newest', undefined] as const) {
      render(<GalleryGrid items={items} subfolders={murderbot(order)} />);
      expect(gridIds(screen.getByRole('link', { name: 'Murderbot, 5 pieces' })), String(order)).toEqual(['m5', 'm4', 'm3', 'm2']);
      cleanup();
    }
  });
});

describe('portfolio-order#AC-4 the open row', () => {
  it('shows an oldest-first subfolder from its oldest piece', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid items={items} subfolders={murderbot('oldest')} />);
    await user.click(screen.getByRole('link', { name: 'Murderbot, 5 pieces' }));
    const open = region('Fan Work: Murderbot');
    expect(within(open).getAllByRole('button', { name: /^View / }).map((b) => b.getAttribute('aria-label'))).toEqual([
      'View Arrival', 'View Tea', 'View Feed', 'View Night Shift', 'View Station',
    ]);
    expect(document.activeElement?.getAttribute('aria-label')).toBe('View Arrival');
  });
});
