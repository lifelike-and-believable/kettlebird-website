// A story's text as HTML: paragraphs, italics, bold, line breaks, scene breaks and pictures, and nothing else.
// Specs: docs/specs/story-reader-pages.md AC-4; docs/specs/story-import-word.md AC-22. Pure. Uses the editor's own
// rule for symbol-only lines, in case a line slipped through without becoming a scene break (design-story-reader).
import { isSceneBreakLine } from '../../../sanity-studio/lib/stories';
import { pictureAlt, type StoryPicture, type TextBlock } from './model';

/** Widths the text's pictures are made at, never wider than the picture (AC-22). */
export const PICTURE_WIDTHS = [480, 800, 1200, 1600] as const;
const WIDEST = PICTURE_WIDTHS[PICTURE_WIDTHS.length - 1];
/** The reading column's width, for `sizes`: StoryText.astro's column is no wider. */
export const STORY_COLUMN = 'min(100vw - 2rem, 45rem)';

export function pictureWidths(width: number): number[] {
  const under = PICTURE_WIDTHS.filter((w) => w < width);
  return width <= WIDEST ? [...under, width] : [...PICTURE_WIDTHS];
}

/** The column's width or the picture's, whichever is smaller. */
export function pictureSizes(width: number): string {
  return `min(${width}px, 100vw - 2rem, 45rem)`;
}

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

function pictureHtml(picture: StoryPicture): string {
  const alt = escape(pictureAlt(picture));
  const attrs = (cls: string) =>
    `${cls}src="${escape(picture.src)}"${picture.srcset ? ` srcset="${escape(picture.srcset)}"` : ''} sizes="${pictureSizes(picture.width)}" ` +
    `width="${picture.width}" height="${picture.height}" loading="lazy" decoding="async" alt="${alt}"`;
  // A decorative picture is skipped by screen readers, so it isn't a button.
  if (picture.decorative) return `<img ${attrs('class="story-picture story-picture--decorative" ')}>`;
  return `<button type="button" class="story-picture" data-story-picture aria-label="Show full screen: ${alt}"><img ${attrs('')}></button>`;
}

type Part = { kind: 'p' | 'picture'; html: string } | { kind: 'break' };

export function storyHtml(blocks: TextBlock[]): string {
  const parts: Part[] = [];
  for (const block of blocks) {
    const isBreak = block._type === 'sceneBreak' || (block._type === 'block' && isSceneBreakLine(textOf(block)));
    if (isBreak) {
      // Never at the start, and never two together.
      if (parts.length && parts[parts.length - 1].kind !== 'break') parts.push({ kind: 'break' });
    } else if (block._type === 'storyPicture') {
      parts.push({ kind: 'picture', html: pictureHtml(block as StoryPicture) });
    } else if (block._type === 'block' && textOf(block).trim()) {
      parts.push({ kind: 'p', html: (block.children ?? []).map(span).join('') });
    }
  }
  // Nor at the end.
  while (parts.length && parts[parts.length - 1].kind === 'break') parts.pop();
  return parts.map((part) => (part.kind === 'break' ? SCENE_BREAK : part.kind === 'picture' ? part.html : `<p>${part.html}</p>`)).join('');
}
