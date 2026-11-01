// Pure logic for publishing comic pages in the editor (no `sanity` imports, so the site's Vitest
// can test it). Spec: docs/specs/comic-publish-pages.md. STUB: tests fail on their assertions.

export interface FileLike { name: string; type: string }
export type QueueState = 'waiting' | 'uploading' | 'done' | 'failed' | 'rejected';
export interface QueueItem { name: string; state: QueueState }
export interface PageLike { _key: string; altText?: string }
export interface ChapterLike { number: number; title?: string; pages: PageLike[] }
export type LinkChange =
  | { kind: 'none' }
  | { kind: 'moved' | 'removed' | 'inserted'; page: number; lastPage: number }
  | { kind: 'renumbered'; from: number; to: number };
export interface PublishDialog { title: string; lines: string[] }

export const SERIES_SLUG_MESSAGE = '';
export const NOT_AN_IMAGE = '';
export const DID_NOT_UPLOAD = '';

export function naturalCompare(_a: string, _b: string): number { return 0; }
export function sortByFileName<T extends { name: string }>(files: T[]): T[] { return files; }
export function isAcceptedImage(_file: FileLike): boolean { return true; }
export function publishLabel(_queue: QueueItem[]): string { return ''; }
export function retryable(_item: QueueItem): boolean { return false; }
export function missingAltCount(_pages: PageLike[]): number { return 0; }
export function altTextMessage(_count: number): string | null { return null; }
export function chapterLabel(_c: { number: number; title?: string }): string { return ''; }
export function linkChange(_published: ChapterLike | null, _draft: ChapterLike): LinkChange { return { kind: 'none' }; }
export function publishDialog(_change: LinkChange, _chapter: ChapterLike): PublishDialog | null { return null; }
export function duplicateChapterMessage(_number: number, _others: number[]): string | null { return null; }
export function nextChapterNumber(_numbers: number[]): number { return 0; }
export function chapterRow(_c: { number: number; title?: string; pageCount: number; published: boolean }): string { return ''; }
