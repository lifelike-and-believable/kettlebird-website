// Pasting into a story's Text: the editor's own paste library (block-tools), then the clean-up in
// lib/stories.ts (docs/specs/story-reader-editor.md AC-4). STUB: tests first.
import type { Block } from './stories';

export function pasteHtml(_html: string, _parseHtml: (html: string) => Document): Block[] {
  throw new Error('not implemented');
}
