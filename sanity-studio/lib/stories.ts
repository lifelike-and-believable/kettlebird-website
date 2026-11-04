// Stories in the editor: ratings, scene breaks, the paste clean-up, chapters, and the messages
// (docs/specs/story-reader-editor.md; design-story-reader). Pure. STUB: tests first.

export const RATINGS: { title: string; value: string }[] = [];
export const STATUSES: { title: string; value: string }[] = [];
export const WEB_ADDRESS_MESSAGE = '';
export const RATING_MESSAGE = '';
export const CHAPTER_TEXT_MESSAGE = '';
export const HAS_CHAPTERS_NOTE = '';
export const MOVED_NOTE = '';

/** A block of Portable Text, as the editor stores it. */
export interface Block {
  _type: string;
  _key?: string;
  style?: string;
  children?: { _type: string; text: string; marks?: string[] }[];
  markDefs?: unknown[];
}

/** AC-4: a line with only symbols on it, which shows as a scene break. */
export function isSceneBreakLine(_text: string): boolean {
  throw new Error('not implemented');
}

/** AC-4: pasted blocks, cleaned: scene breaks made, single empty lines dropped, only paragraphs kept. */
export function cleanPastedBlocks(_blocks: Block[], _key?: () => string): Block[] {
  throw new Error('not implemented');
}

/** AC-2, AC-8: what a story still needs before it can be published, in Star's words. */
export function storyNeeds(_story: { slug?: string; rating?: string; hasText: boolean; hasChapters: boolean }): string[] {
  throw new Error('not implemented');
}

/** AC-6: a chapter's row in its story's list. */
export function storyChapterRow(_c: { number: number; title?: string; published: boolean }): string {
  throw new Error('not implemented');
}

/** AC-6 */
export function duplicateStoryChapterMessage(_number: number, _others: number[]): string | null {
  throw new Error('not implemented');
}

/** AC-6: the chapter pane's title, "The Long Road · Chapter 2: Over the Ridge". */
export function storyChapterPaneTitle(_story: string | undefined, _chapter: { number: number; title?: string } | null): string {
  throw new Error('not implemented');
}

/** AC-7: Add chapter on a one-shot: Chapter 1 takes the story's text, and the story's is emptied. */
export function firstChapterFrom(_storyText: Block[] | undefined): { number: number; content?: Block[]; moved: boolean } {
  throw new Error('not implemented');
}

/** AC-9: the shared-link warning before publishing, or null. */
export function storyLinkDialog(
  _change: { kind: 'chapter'; from: number; to: number; title?: string } | { kind: 'story'; from: string; to: string; title?: string },
): { title: string; lines: string[] } | null {
  throw new Error('not implemented');
}

/** AC-10: the confirmation before a story is deleted with its chapters. */
export function deleteStoryDialog(_title: string | undefined, _chapterCount: number): { title: string; lines: string[]; confirm: string } {
  throw new Error('not implemented');
}
