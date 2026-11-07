// Pasting into a story's Text: the editor's own paste library (block-tools), with a horizontal line
// kept as a scene break, then the clean-up in lib/stories.ts (docs/specs/story-reader-editor.md AC-4).
// The text's schema is described here as block-tools reads it, matching schemas/objects/storyText.ts,
// so this file needs no Sanity package and the site's unit tests can run it.
import { htmlToBlocks } from '@portabletext/block-tools';
import { cleanPastedBlocks, type Block } from './stories';

/** schemas/objects/storyText.ts, as block-tools sees it. */
export const STORY_TEXT_SCHEMA = {
  block: { name: 'block' },
  span: { name: 'span' },
  styles: [{ name: 'normal', value: 'normal', title: 'Normal' }],
  lists: [],
  decorators: [{ name: 'em', value: 'em', title: 'Italic' }, { name: 'strong', value: 'strong', title: 'Bold' }],
  annotations: [],
  blockObjects: [
    { name: 'sceneBreak', title: 'Scene break', fields: [] },
    { name: 'storyPicture', title: 'Picture', fields: [] },
  ],
  inlineObjects: [],
};

/**
 * Clipboard HTML, or the Word reader's (lib/word/read-docx.ts), as story blocks, cleaned. A picture the Word reader
 * placed (`img data-picture="n"`) becomes a picture block pointing at its n; other pictures are dropped.
 */
export function pasteHtml(html: string, parseHtml: (html: string) => Document, key?: () => string): Block[] {
  const blocks = htmlToBlocks(html, STORY_TEXT_SCHEMA, {
    parseHtml,
    rules: [
      {
        deserialize(el) {
          const tag = (el as Element).tagName?.toLowerCase();
          if (tag === 'hr') return { _type: 'sceneBreak' };
          const picture = tag === 'img' ? (el as Element).getAttribute('data-picture') : null;
          return picture !== null ? { _type: 'storyPicture', picture: Number(picture) } : undefined;
        },
      },
    ],
  }) as unknown as Block[];
  return cleanPastedBlocks(blocks, key);
}
