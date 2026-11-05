// Upload progress per chapter, shared by the Pages input and the chapter's Publish action (AC-5).
import { useSyncExternalStore } from 'react';
import type { QueueItem } from './comic-pages';

const queues = new Map<string, QueueItem[]>();
const listeners = new Set<() => void>();
const EMPTY: QueueItem[] = [];

export const publishedId = (id: string) => id.replace(/^drafts\./, '');

export function setQueue(docId: string, queue: QueueItem[]) {
  queues.set(publishedId(docId), queue);
  listeners.forEach((l) => l());
}

export function useQueue(docId: string | undefined): QueueItem[] {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => (docId ? queues.get(publishedId(docId)) ?? EMPTY : EMPTY),
  );
}

// Finding panels per chapter: the pages being looked at, when the first started, and pages that
// failed, shared by the Pages input, the page panel and Publish (docs/specs/comic-reader-panels.md AC-4, AC-5).
export interface FindingState {
  keys: string[];
  failed: string[];
  since?: number;
}
const finding = new Map<string, FindingState>();
const NONE: FindingState = { keys: [], failed: [] };

export function setFinding(docId: string, change: (s: FindingState) => FindingState) {
  const id = publishedId(docId);
  const next = change(finding.get(id) ?? NONE);
  finding.set(id, { ...next, since: next.keys.length ? next.since ?? Date.now() : undefined });
  listeners.forEach((l) => l());
}

export function useFinding(docId: string | undefined): FindingState {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => (docId ? finding.get(publishedId(docId)) ?? NONE : NONE),
  );
}
