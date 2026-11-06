// Full screen on touch screens: taps, double taps, and which fingers are down. The lead found that on a
// phone, after letting go of a zoomed piece, dragging and pinching stopped working until a zoom button was
// used, and that a tap didn't hide the bars (2026-11-06). Criteria: docs/specs/portfolio-full-screen.md.
import { describe, expect, it } from 'vitest';
import { DOUBLE_TAP_MS, downPointers, isDoubleTap, isTap, TAP_MOVE } from '../../src/lib/portfolio/full-screen';

describe('portfolio-full-screen#AC-6 AC-7 fingers on the screen', () => {
  it('starts afresh when a new first finger touches, forgetting any whose lift was never reported', () => {
    let down = downPointers(new Map(), { id: 1, x: 10, y: 10, primary: true });
    down = downPointers(down, { id: 2, x: 50, y: 10, primary: false });
    expect([...down.keys()]).toEqual([1, 2]);
    // Finger 2's lift was lost; the next touch is a new first finger: one finger, not a pinch.
    down = downPointers(down, { id: 3, x: 30, y: 30, primary: true });
    expect([...down.entries()]).toEqual([[3, { x: 30, y: 30 }]]);
  });
});

describe('portfolio-full-screen#AC-6 AC-9 taps', () => {
  it('counts a short touch that hardly moves as a tap', () => {
    expect(isTap({ moved: 0, duration: 120 })).toBe(true);
    expect(isTap({ moved: TAP_MOVE, duration: 400 })).toBe(true);
    expect(isTap({ moved: TAP_MOVE + 1, duration: 120 })).toBe(false);
    expect(isTap({ moved: 0, duration: 600 })).toBe(false);
  });

  it('counts a second tap soon after, near the first, as a double tap', () => {
    const first = { time: 1000, x: 100, y: 100 };
    expect(isDoubleTap(first, { time: 1000 + DOUBLE_TAP_MS, x: 120, y: 110 })).toBe(true);
    expect(isDoubleTap(first, { time: 1001 + DOUBLE_TAP_MS, x: 100, y: 100 })).toBe(false);
    expect(isDoubleTap(first, { time: 1100, x: 200, y: 100 })).toBe(false);
    expect(isDoubleTap(undefined, { time: 1100, x: 100, y: 100 })).toBe(false);
  });
});
