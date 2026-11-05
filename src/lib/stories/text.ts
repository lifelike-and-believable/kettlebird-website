// A story's text as HTML: paragraphs, italics, bold, line breaks and scene breaks, and nothing else.
// Spec: docs/specs/story-reader-pages.md AC-4. Pure. Uses the editor's own rule for symbol-only lines,
// in case a line slipped through without becoming a scene break (design-story-reader).
import { isSceneBreakLine } from '../../../sanity-studio/lib/stories';
import type { TextBlock } from './model';

const SCENE_BREAK = '<hr class="scene-break" aria-label="Scene break">';
const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

const escape = (text: string) => text.replace(/[&<>"']/g, (c) => ESCAPES[c]);
const textOf = (block: TextBlock) => (block.children ?? []).map((c) => c.text ?? '').join('');

function span(child: { text?: string; marks?: string[] }): string {
  let html = escape(child.text ?? '').replace(/\n/g, '<br>');
  if (child.marks?.includes('strong')) html = `<strong>${html}</strong>`;
  if (child.marks?.includes('em')) html = `<em>${html}</em>`;
  return html;
}

type Part = { kind: 'p'; html: string } | { kind: 'break' };

export function storyHtml(blocks: TextBlock[]): string {
  const parts: Part[] = [];
  for (const block of blocks) {
    const isBreak = block._type === 'sceneBreak' || (block._type === 'block' && isSceneBreakLine(textOf(block)));
    if (isBreak) {
      // Never at the start, and never two together.
      if (parts.length && parts[parts.length - 1].kind !== 'break') parts.push({ kind: 'break' });
    } else if (block._type === 'block' && textOf(block).trim()) {
      parts.push({ kind: 'p', html: (block.children ?? []).map(span).join('') });
    }
  }
  // Nor at the end.
  while (parts.length && parts[parts.length - 1].kind === 'break') parts.pop();
  return parts.map((part) => (part.kind === 'break' ? SCENE_BREAK : `<p>${part.html}</p>`)).join('');
}
