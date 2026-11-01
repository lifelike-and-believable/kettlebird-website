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
