// Stories in the editor: mature content, scene breaks, the paste clean-up, chapters, and the messages
// (docs/specs/story-reader-editor.md; design-story-reader). Pure.
import { chapterLabel, nextChapterNumber } from './comic-pages';

export const STATUSES = [
  { title: 'In progress', value: 'inProgress' },
  { title: 'Complete', value: 'complete' },
];
export const WEB_ADDRESS_MESSAGE = 'Add a web address so readers can find this story.';
export const CHAPTER_TEXT_MESSAGE = "Add the chapter's text.";
export const HAS_CHAPTERS_NOTE = 'This story has chapters, so its text is in them. To make it a one-shot again, remove its chapters and upload the whole story here.';
export const MOVED_NOTE = "Your story's text is now in Chapter 1.";
export { nextChapterNumber };

/** A block of Portable Text, as the editor stores it. */
export interface Block {
  _type: string;
  _key?: string;
  style?: string;
  children?: { _type: string; text: string; marks?: string[] }[];
  markDefs?: unknown[];
}

const SYMBOLS = /^[*~\-#=•·\s]+$/;
const SINGLES = new Set(['~', '#', '⁂']);

/** AC-4: a line with only symbols on it, which shows as a scene break. */
export function isSceneBreakLine(text: string): boolean {
  const line = text.trim();
  if (SINGLES.has(line)) return true;
  return SYMBOLS.test(line) && line.replace(/\s/g, '').length >= 3;
}

const textOf = (block: Block) => (block.children ?? []).map((c) => c.text).join('');
const isEmpty = (block: Block) => block._type === 'block' && textOf(block).trim() === '';

/** AC-4: pasted blocks, cleaned: scene breaks made, single empty lines dropped, only paragraphs kept. */
export function cleanPastedBlocks(blocks: Block[], key: () => string = randomKey): Block[] {
  // Pictures are kept: only the Word reader makes them (story-import-word AC-8).
  const out: Block[] = [];
  let empties = 0;
  const sceneBreak = () => {
    if (out.length && out[out.length - 1]._type !== 'sceneBreak') out.push({ _type: 'sceneBreak', _key: key() });
  };
  for (const block of blocks) {
    if (isEmpty(block)) {
      empties += 1;
      continue;
    }
    if (empties >= 2) sceneBreak();
    empties = 0;
    if (block._type === 'sceneBreak' || (block._type === 'block' && isSceneBreakLine(textOf(block)))) {
      sceneBreak();
      continue;
    }
    if (block._type === 'storyPicture') {
      out.push({ ...block, _key: block._key ?? key() });
      continue;
    }
    if (block._type !== 'block') continue;
    out.push({
      ...block,
      _key: block._key ?? key(),
      style: 'normal',
      markDefs: [],
      children: (block.children ?? []).map((c) => ({ ...c, marks: (c.marks ?? []).filter((m) => m === 'em' || m === 'strong') })),
    });
  }
  return out;
}

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** AC-2: what a story still needs before it can be published, in Star's words. */
export function storyNeeds(story: { slug?: string; hasText: boolean; hasChapters: boolean }): string[] {
  if (!story.hasText && !story.hasChapters) return [];
  return story.slug?.trim() ? [] : [WEB_ADDRESS_MESSAGE];
}

/**
 * story-mature-content AC-3: the one-off change for a story saved with a rating: tick Mature or explicit content
 * where the rating was Mature or Explicit (and it isn't ticked yet), and remove the rating. Nothing to do twice.
 */
export function matureFromRating(doc: { mature?: unknown; rating?: unknown }): { setMature: boolean; unsetRating: boolean } {
  const hasRating = doc.rating !== undefined;
  const wasMature = doc.rating === 'mature' || doc.rating === 'explicit';
  return { setMature: wasMature && doc.mature !== true, unsetRating: hasRating };
}

/** AC-6: a chapter's row in its story's list. */
export function storyChapterRow(c: { number: number; title?: string; published: boolean }): string {
  return `${chapterLabel(c)} · ${c.published ? 'On the site' : 'Not published yet'}`;
}

/** AC-6 */
export function duplicateStoryChapterMessage(number: number, others: number[]): string | null {
  return others.includes(number) ? `Chapter ${number} already exists in this story. Choose another number.` : null;
}

/** AC-6: the chapter pane's title, "The Long Road · Chapter 2: Over the Ridge". */
export function storyChapterPaneTitle(story: string | undefined, chapter: { number: number; title?: string } | null): string {
  const label = chapter ? chapterLabel(chapter) : 'New chapter';
  return story ? `${story} · ${label}` : label;
}

/**
 * AC-7: Add chapter on a one-shot: Chapter 1 takes the story's text, and the story's is emptied; with its upload line
 * (story-import-word AC-19).
 */
export function firstChapterFrom<U>(
  storyText: Block[] | undefined,
  upload?: U,
): { number: number; content?: Block[]; moved: boolean; textUpload?: U } {
  if (!storyText?.length) return { number: 1, moved: false };
  return upload ? { number: 1, content: storyText, moved: true, textUpload: upload } : { number: 1, content: storyText, moved: true };
}

/** AC-9: the shared-link warning before publishing, or null. */
export function storyLinkDialog(
  change: { kind: 'chapter'; from: number; to: number; title?: string } | { kind: 'story'; from: string; to: string; title?: string },
): { title: string; lines: string[] } | null {
  if (change.from === change.to) return null;
  const title = change.title?.trim();
  let line: string;
  if (change.kind === 'chapter') {
    const what = title ? `${title} from chapter ${change.from}` : `chapter ${change.from}`;
    line = `You changed ${what} to chapter ${change.to}. Links people have shared to it use chapter ${change.from}'s address, so they'll stop working, or open a different chapter if you later add a new chapter ${change.from}.`;
  } else {
    line = `You changed ${title || 'the story'}'s web address from ${change.from} to ${change.to}. Links people have shared to the story and its chapters will stop working.`;
  }
  return { title: 'Some links will change', lines: [line] };
}

/** AC-10: the confirmation before a story is deleted with its chapters. */
export function deleteStoryDialog(title: string | undefined, chapterCount: number): { title: string; lines: string[]; confirm: string } {
  const name = title?.trim() || 'this story';
  if (chapterCount === 0) return { title: `Delete ${name}?`, lines: ["It comes off the site with the next update. This can't be undone."], confirm: 'Delete' };
  const chapters = chapterCount === 1 ? 'its chapter' : `its ${chapterCount} chapters`;
  return {
    title: `Delete ${name} and ${chapters}?`,
    lines: ["They come off the site, and links people have shared to them stop working. This can't be undone."],
    confirm: 'Delete',
  };
}
