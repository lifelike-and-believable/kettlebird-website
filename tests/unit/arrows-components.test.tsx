// @vitest-environment jsdom
// The carousel's and full screen's arrows, drawn from the shared source. Criteria: docs/specs/site-arrows.md.
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import GalleryGrid from '../../src/components/GalleryGrid';
import { ARROWS } from '../../src/lib/arrows';
import type { GalleryItem } from '../../src/lib/queries';

const item = (id: string, title: string): GalleryItem => ({
  _id: id,
  title,
  slug: { current: id },
  category: ['original'],
  image: { asset: { _ref: `image-${id}aaaa-3000x2000-jpg` } },
} as GalleryItem);
const items = [item('a', 'Night Market'), item('b', 'Late Night Alibi'), item('d', 'Jungle Eyes')];

afterEach(cleanup);

/** The one drawn arrow inside a control, checked against the shared shape. */
function drawnArrow(control: HTMLElement, kind: keyof typeof ARROWS) {
  const svgs = control.querySelectorAll('svg');
  expect(svgs).toHaveLength(1);
  const svg = svgs[0];
  expect(svg.getAttribute('aria-hidden')).toBe('true');
  expect(svg.getAttribute('data-arrow')).toBe(kind);
  expect(svg.querySelector('path')!.getAttribute('d')).toBe(ARROWS[kind].d);
  expect(control.textContent).not.toMatch(/[‹›◀▶←→]/);
}

describe('site-arrows#AC-2 no typed arrows', () => {
  it('the carousel draws its arrows, keeps its names, and is an arrow button', () => {
    render(<GalleryGrid items={items} />);
    const left = screen.getAllByRole('button', { name: 'Scroll left' })[0];
    const right = screen.getAllByRole('button', { name: 'Scroll right' })[0];
    drawnArrow(left, 'previous');
    drawnArrow(right, 'next');
    for (const b of [left, right]) {
      expect(b.classList.contains('arrow-btn')).toBe(true);
      expect(b.getAttribute('aria-disabled')).toBeNull();
    }
  });

  it('full screen draws Previous and Next, with their captions, as dark arrow buttons', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid items={items} />);
    await user.click(screen.getAllByRole('button', { name: 'View Late Night Alibi' })[0]);
    await user.click(within(screen.getByRole('dialog', { name: 'Late Night Alibi' })).getByRole('button', { name: 'Full screen' }));
    const view = screen.getByRole('dialog', { name: 'Full screen' });
    const previous = within(view).getByRole('button', { name: 'Previous' });
    const next = within(view).getByRole('button', { name: 'Next' });
    drawnArrow(previous, 'previous');
    drawnArrow(next, 'next');
    expect(previous.textContent).toBe('Previous');
    expect(next.textContent).toBe('Next');
    for (const b of [previous, next]) {
      expect(b.classList.contains('arrow-btn')).toBe(true);
      expect(b.classList.contains('arrow-btn--dark')).toBe(true);
    }
  });
});
