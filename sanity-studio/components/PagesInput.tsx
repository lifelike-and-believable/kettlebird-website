// The chapter's Pages input: Upload pages, drop anywhere on the grid, natural file-name order,
// upload progress and errors, and the alt text count. Spec: docs/specs/comic-publish-pages.md
// (AC-1 to AC-6); design: docs/design/comic-publish-pages.md (mock-ups 2 and 7).
import { UploadIcon, WarningOutlineIcon } from '@sanity/icons';
import { Box, Button, Card, Flex, Stack, Text } from '@sanity/ui';
import { createContext, useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import { insert, set, setIfMissing, useClient, useFormValue, type ArrayOfObjectsInputProps, type Path } from 'sanity';
import {
  altTextMessage, DID_NOT_UPLOAD, isAcceptedImage, MAX_PARALLEL_UPLOADS, missingAltCount, NOT_AN_IMAGE,
  retryable, sortByFileName, type PageLike, type QueueItem,
} from '../lib/comic-pages';
import { setFinding, setQueue, useFinding } from '../lib/upload-store';
import { FIND_WAIT_MS, findingProgress, FOUND_AFTER_PUBLISHING, olderPagesBanner, shouldFind } from '../lib/panels';
import { assetUrl, findOnPage, storedPanels } from './findOnPage';

interface Entry extends QueueItem { id: string; file: File; assetId?: string; flushed?: boolean }

/** Lets the page panel open its neighbours (AC-12). */
export const PagesContext = createContext<{ keys: string[]; open: (path: Path) => void; close: () => void } | null>(null);

const ACCEPT = 'image/png,image/jpeg,image/tiff,image/webp,image/gif,.tif,.tiff';
let counter = 0;
const newKey = () => `${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export function PagesInput(props: ArrayOfObjectsInputProps) {
  const { onChange, onItemClose, onItemOpen, readOnly } = props;
  const value = (props.value ?? []) as unknown as PageLike[];
  const docId = useFormValue(['_id']) as string | undefined;
  const client = useClient({ apiVersion: '2024-01-01' });
  const [entries, setEntries] = useState<Entry[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const entriesRef = useRef(entries);
  entriesRef.current = entries;

  // Finding panels (docs/specs/comic-reader-panels.md AC-4 to AC-6): on new pages as they're added,
  // and on older pages when Star asks; never on pages Star has set. A few at a time.
  const finding = useFinding(docId);
  const [batch, setBatch] = useState<{ done: number; total: number }>();
  // Panels that arrived after Publish stopped waiting for them are a change to publish next time.
  const [late, setLate] = useState(false);
  const { projectId, dataset } = client.config();
  const find = useCallback(async (pages: { _key: string; asset?: { _ref?: string } }[], counted: boolean) => {
    if (!docId || !pages.length) return;
    const keys = pages.map((p) => p._key);
    setFinding(docId, (f) => ({ ...f, keys: [...f.keys, ...keys], failed: f.failed.filter((k) => !keys.includes(k)) }));
    if (counted) setBatch({ done: 0, total: pages.length });
    const queue = [...pages];
    const started = Date.now();
    const worker = async () => {
      for (let page = queue.shift(); page; page = queue.shift()) {
        const ref = page.asset?._ref;
        const found = await findOnPage(ref && assetUrl(ref, projectId!, dataset!, 400));
        if (found === 'failed') setFinding(docId, (f) => ({ ...f, failed: [...f.failed, page!._key] }));
        else onChange([set(storedPanels(found), [{ _key: page._key }, 'panels']), set('site', [{ _key: page._key }, 'panelsBy'])]);
        setFinding(docId, (f) => ({ ...f, keys: f.keys.filter((k) => k !== page!._key) }));
        if (counted) setBatch((b) => b && { ...b, done: b.done + 1 });
        if (found !== 'failed' && Date.now() - started > FIND_WAIT_MS) setLate(true);
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    if (counted) setBatch(undefined);
  }, [docId, onChange, projectId, dataset]);

  const update = useCallback((id: string, change: Partial<Entry>) => {
    setEntries((all) => all.map((e) => (e.id === id ? { ...e, ...change } : e)));
  }, []);

  // Share progress with the Publish action, and ask before leaving while uploads run (AC-5).
  const busy = entries.some((e) => e.state === 'waiting' || e.state === 'uploading');
  useEffect(() => {
    if (docId) setQueue(docId, entries);
  }, [docId, entries]);
  useEffect(() => () => { if (docId) setQueue(docId, []); }, [docId]);
  useEffect(() => {
    if (!busy) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [busy]);

  // Start waiting uploads, at most MAX_PARALLEL_UPLOADS at a time.
  useEffect(() => {
    const running = entries.filter((e) => e.state === 'uploading').length;
    const next = entries.filter((e) => e.state === 'waiting').slice(0, Math.max(0, MAX_PARALLEL_UPLOADS - running));
    for (const entry of next) {
      update(entry.id, { state: 'uploading' });
      client.assets
        .upload('image', entry.file, { filename: entry.file.name })
        .then((asset) => update(entry.id, { state: 'done', assetId: asset._id }))
        .catch(() => update(entry.id, { state: 'failed' }));
    }
  }, [entries, client, update]);

  // Append finished uploads in file-name order: only the leading run of settled files is added, so
  // a fast later file never jumps ahead of a slow earlier one (AC-1, AC-2).
  useEffect(() => {
    const ready: Entry[] = [];
    for (const e of entries) {
      if (e.flushed || e.state === 'rejected' || e.state === 'failed') continue;
      if (e.state !== 'done') break;
      ready.push(e);
    }
    if (!ready.length) return;
    const items = ready.map((e) => ({ _type: 'image', _key: newKey(), asset: { _type: 'reference', _ref: e.assetId } }));
    onChange([setIfMissing([]), insert(items, 'after', [-1])]);
    void find(items, false);
    const ids = new Set(ready.map((e) => e.id));
    setEntries((all) => all.map((e) => (ids.has(e.id) ? { ...e, flushed: true } : e)));
  }, [entries, onChange, find]);

  // Once nothing is waiting or uploading, forget the added pages, so the next batch counts from zero.
  useEffect(() => {
    if (!busy && entries.some((e) => e.flushed)) setEntries((all) => all.filter((e) => !e.flushed));
  }, [busy, entries]);

  const addFiles = useCallback((files: File[]) => {
    const sorted = sortByFileName(files);
    setEntries((all) => [
      ...all,
      ...sorted.map((file): Entry => ({
        id: newKey(), file, name: file.name, state: isAcceptedImage(file) ? 'waiting' : 'rejected',
      })),
    ]);
  }, []);

  // Dropped files go through Sanity's own drop target, which closes its "drop files here" overlay
  // when the drop reaches it, and hands each image it accepts to onSelectFile, one call per file in
  // the same tick. Collect them and add the batch together, so it goes in file-name order (AC-1, AC-2).
  const dropped = useRef<File[]>([]);
  const onSelectFile = useCallback(({ file }: { file: File }) => {
    if (readOnly) return;
    dropped.current.push(file);
    if (dropped.current.length > 1) return;
    queueMicrotask(() => {
      const batch = dropped.current;
      dropped.current = [];
      addFiles(batch);
    });
  }, [addFiles, readOnly]);

  // Sanity's drop target only passes on image files, so files that aren't images are caught here and
  // listed as "This isn't an image file" (AC-3). A drop inside Sanity's target isn't stopped: Sanity
  // still needs it to close its overlay. A drop outside it (the "Drop page files" box) is ours.
  const onDropCapture = (event: DragEvent) => {
    setDragging(false);
    const files = Array.from(event.dataTransfer?.files ?? []);
    if (!files.length) return;
    const insideSanityTarget = (event.target as HTMLElement).closest?.('[data-test-id="file-target"]');
    if (!insideSanityTarget) {
      event.preventDefault();
      event.stopPropagation();
      if (!readOnly) addFiles(files);
      return;
    }
    const notImages = files.filter((file) => !file.type.startsWith('image/'));
    if (!readOnly && notImages.length) addFiles(notImages);
  };
  const onDragOver = (event: DragEvent) => {
    if (!Array.from(event.dataTransfer?.types ?? []).includes('Files')) return;
    event.preventDefault(); // allows a drop outside Sanity's target; Sanity's own handler does the same inside it
    setDragging(true);
  };

  const altMessage = altTextMessage(missingAltCount(value));
  const unlooked = (value as { _key: string; asset?: { _ref?: string }; panelsBy?: 'site' | 'star' }[])
    .filter((p) => p.asset?._ref && !p.panelsBy && shouldFind(p) && !finding.keys.includes(p._key));
  const banner = olderPagesBanner(unlooked.length);
  const pending = entries.filter((e) => !e.flushed);
  const context = useMemo(() => ({ keys: value.map((p) => p._key), open: onItemOpen, close: onItemClose }), [value, onItemOpen, onItemClose]);

  return (
    <PagesContext.Provider value={context}>
      <Stack space={3} onDropCapture={onDropCapture} onDragOverCapture={onDragOver} onDragLeave={() => setDragging(false)}>
        <Flex align="center" gap={3} wrap="wrap">
          <Button icon={UploadIcon} text="Upload pages" mode="ghost" disabled={readOnly} onClick={() => fileInput.current?.click()} />
          <input
            ref={fileInput} type="file" multiple accept={ACCEPT} hidden
            aria-label="Upload pages"
            onChange={(event) => { addFiles(Array.from(event.currentTarget.files ?? [])); event.currentTarget.value = ''; }}
          />
          <Text size={1} muted>{value.length === 1 ? '1 page' : `${value.length} pages`}</Text>
          {altMessage && (
            <Card tone="caution" padding={2} radius={2}>
              <Flex align="center" gap={2}>
                <Text size={1}><WarningOutlineIcon /></Text>
                <Text size={1}>{altMessage}</Text>
              </Flex>
            </Card>
          )}
        </Flex>

        {late && (
          <Card tone="caution" padding={3} radius={2} border>
            <Text size={1}>{FOUND_AFTER_PUBLISHING}</Text>
          </Card>
        )}
        {batch ? (
          <Card tone="primary" padding={3} radius={2} border>
            <Text size={1} role="status">{findingProgress(batch.done, batch.total)}</Text>
          </Card>
        ) : banner && !busy && finding.keys.length === 0 ? (
          <Card tone="primary" padding={3} radius={2} border>
            <Flex align="center" gap={3} wrap="wrap">
              <Text size={1}>{banner}</Text>
              <Button text="Find panels" tone="primary" disabled={readOnly} onClick={() => void find(unlooked, true)} />
            </Flex>
          </Card>
        ) : null}

        {pending.length > 0 && (
          <Stack space={2} as="ul" aria-label="Uploads" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {pending.map((entry) => (
              <Card as="li" key={entry.id} padding={2} radius={2} border tone={entry.state === 'failed' || entry.state === 'rejected' ? 'critical' : 'default'}>
                <Flex align="center" gap={3}>
                  <Box flex={1}><Text size={1} textOverflow="ellipsis">{entry.name}</Text></Box>
                  {entry.state === 'waiting' && <Text size={1} muted>Waiting…</Text>}
                  {entry.state === 'uploading' && <Text size={1} muted>Uploading…</Text>}
                  {entry.state === 'done' && <Text size={1} muted>Uploaded</Text>}
                  {entry.state === 'failed' && <Text size={1}><WarningOutlineIcon /> {DID_NOT_UPLOAD}</Text>}
                  {entry.state === 'rejected' && <Text size={1}><WarningOutlineIcon /> {NOT_AN_IMAGE}</Text>}
                  {retryable(entry) && (
                    <Button text="Try again" mode="ghost" fontSize={1} padding={2}
                      onClick={() => setEntries((all) => [...all.filter((e) => e.id !== entry.id), { ...entry, state: 'waiting' }])} />
                  )}
                  {(entry.state === 'failed' || entry.state === 'rejected') && (
                    <Button text="Remove" mode="bleed" fontSize={1} padding={2}
                      onClick={() => setEntries((all) => all.filter((e) => e.id !== entry.id))} />
                  )}
                </Flex>
              </Card>
            ))}
          </Stack>
        )}

        <Card radius={2} tone={dragging ? 'primary' : 'default'} data-kb-pages="">
          {/* A two-page spread's tile is twice as wide (docs/specs/comic-reader-spread-and-flip.md AC-10). */}
          <style>{'[data-kb-pages] [data-ui="Grid"] > *:has([data-kb-spread]) { grid-column: span 2; }'}</style>
          {props.renderDefault({ ...props, onSelectFile })}
          <Card marginTop={2} padding={4} radius={2} border style={{ borderStyle: 'dashed' }}>
            <Text size={1} muted align="center">Drop page files anywhere here</Text>
          </Card>
        </Card>
      </Stack>
    </PagesContext.Provider>
  );
}
