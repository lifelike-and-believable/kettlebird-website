// Dragging a panel in the editor: the box follows the pointer while it moves, and the drag ends as the same step
// (the lead, 2026-11-06: moving and resizing only showed on release). Criteria: docs/specs/comic-reader-panels.md AC-8.
import { describe, expect, it } from 'vitest';
import { dragPreview, dragStep, edit, startEditing, type EditorState } from '../../sanity-studio/lib/panels';

const P = (x: number, y: number, width: number, height: number) => ({ x, y, width, height });

describe('comic-reader-panels#AC-8 dragging a panel', () => {
  const start = (): EditorState => edit(startEditing({ panels: [P(5, 3, 43, 30), P(53, 3, 43, 30)], panelsBy: 'site' }), { type: 'select', index: 1 });

  it('shows a moved box while dragging, as the step the drag ends with, without making it a step', () => {
    const s = start();
    const shown = dragPreview(s, 'move', -10, 20);
    expect(shown).toEqual(edit(s, { type: 'move', dx: -10, dy: 20 }).panels);
    expect(shown[1]).not.toEqual(s.panels[1]);
    expect(s.history).toEqual(start().history);
    expect(dragStep('move', -10, 20)).toEqual({ type: 'move', dx: -10, dy: 20 });
  });

  it('shows a resized box while dragging the handle', () => {
    const s = start();
    const shown = dragPreview(s, 'resize', -8, 12);
    expect(shown).toEqual(edit(s, { type: 'resize', dw: -8, dh: 12 }).panels);
    expect(shown[1]).not.toEqual(s.panels[1]);
    expect(dragStep('resize', -8, 12)).toEqual({ type: 'resize', dw: -8, dh: 12 });
  });

  it('keeps the box inside the picture while dragging, as the step does', () => {
    const s = start();
    expect(dragPreview(s, 'move', 80, 90)).toEqual(edit(s, { type: 'move', dx: 80, dy: 90 }).panels);
  });

  it('treats a click without a drag as no change', () => {
    const s = start();
    expect(dragStep('move', 0.1, 0.1)).toBeUndefined();
    expect(dragPreview(s, 'move', 0.1, 0.1)).toBe(s.panels);
  });
});
