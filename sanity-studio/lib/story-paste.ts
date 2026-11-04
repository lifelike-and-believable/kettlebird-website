// Pasting into a story's Text: the editor's own paste library (block-tools), with a horizontal line
// kept as a scene break, then the clean-up in lib/stories.ts (docs/specs/story-reader-editor.md AC-4).
import { htmlToBlocks } from '@portabletext/block-tools';
import { Schema } from '@sanity/schema';
import type { ArraySchemaType } from 'sanity';
import storyText, { sceneBreak } from '../schemas/objects/storyText';
import { cleanPastedBlocks, type Block } from './stories';

let compiled: ArraySchemaType | undefined;
/** The compiled Text type, as the editor sees it. */
export function storyTextType(): ArraySchemaType {
  compiled ??= Schema.compile({ name: 'paste', types: [sceneBreak, storyText] }).get('storyText') as ArraySchemaType;
  return compiled;
}

/** Clipboard HTML as story blocks, cleaned. */
export function pasteHtml(html: string, parseHtml: (html: string) => Document): Block[] {
  const blocks = htmlToBlocks(html, storyTextType(), {
    parseHtml,
    rules: [
      {
        deserialize(el) {
          return (el as Element).tagName?.toLowerCase() === 'hr' ? { _type: 'sceneBreak' } : undefined;
        },
      },
    ],
  }) as unknown as Block[];
  return cleanPastedBlocks(blocks);
}
